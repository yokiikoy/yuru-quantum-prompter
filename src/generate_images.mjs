#!/usr/bin/env node
/**
 * manifest.json の imgDesc から Imagen 4 Fast で画像を生成し、episodes/.../images/ に保存する。
 * 依存: Node 18+ のみ（fetch）。API キーは環境変数 GEMINI_API_KEY（未設定時のみリポジトリ直下の .env から読込）。
 *
 * REST: https://ai.google.dev/gemini-api/docs/imagen （:predict）
 *
 * 使い方:
 *   GEMINI_API_KEY=... node src/generate_images.mjs episodes/01_量子力学の仕様書
 *   node src/generate_images.mjs episodes/01_量子力学の仕様書 --dry-run
 *   node src/generate_images.mjs episodes/01_量子力学の仕様書 --write-manifest
 *   node src/generate_images.mjs episodes/01_量子力学の仕様書 --skip-existing
 *   node src/generate_images.mjs episodes/01_量子力学の仕様書 --max-api-calls=5
 *
 * 課金・ループ: while 再試行は無い。1 実行あたりの API 上限は imgDesc 非空スライド数（--skip-existing で既存 PNG は 0 回）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

/** 画風の正本（README_SOP §5）。画像内の文字は原則禁止（imgDesc で明示した場合のみ可）。「？」など記号のみ可。 */
const IMAGEN_BASE_PROMPT =
    "doodle illustration with soft rounded squat blob shapes tucked into corners of the frame, shy cozy introvert mood, simple chunky silhouettes like cute Japanese stationery mascot stickers but original generic characters, calm intellectual adult podcast tone, not childish; slightly wobbly hand-drawn ink lines; pure white background; color only as sparse accents, at most four pale hues: dusty pastel blue, soft blush pink, sage mint, warm light gray; light gray line art base, minimal fill and shading; simple layout; nerdy friendly; no photorealistic faces; absolutely no letters, words, captions, labels, signs, logos, UI text, or readable writing anywhere in the image unless the scene description above explicitly requests that exact text; isolated punctuation for mood only (e.g. a single question mark) is allowed; never invent random, garbled, or misspelled English text";

const IMAGEN_MODEL = "imagen-4.0-fast-generate-001";
const PREDICT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict`;

/** ルートの .env を読む（KEY=value）。既に環境にある変数は上書きしない。.gitignore 対象。 */
function loadDotEnvIfPresent() {
    const envPath = path.join(repoRoot, ".env");
    if (!fs.existsSync(envPath)) return;
    const text = fs.readFileSync(envPath, "utf8");
    for (const line of text.split(/\n/)) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const eq = t.indexOf("=");
        if (eq <= 0) continue;
        const key = t.slice(0, eq).trim();
        let val = t.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        if (key && process.env[key] === undefined) process.env[key] = val;
    }
}

function parseArgs(argv) {
    const positional = [];
    const flags = new Set();
    let maxApiCalls = Infinity;
    for (const a of argv) {
        if (a.startsWith("--max-api-calls=")) {
            const n = parseInt(a.slice("--max-api-calls=".length), 10);
            if (Number.isFinite(n) && n >= 0) maxApiCalls = n;
        } else if (a.startsWith("--")) flags.add(a);
        else positional.push(a);
    }
    return {
        episodeDir: positional[0] || "",
        dryRun: flags.has("--dry-run"),
        writeManifest: flags.has("--write-manifest"),
        skipExisting: flags.has("--skip-existing"),
        maxApiCalls,
    };
}

function buildPrompt(imgDesc) {
    const part = (imgDesc || "").trim();
    if (!part) return IMAGEN_BASE_PROMPT;
    return `${part}. ${IMAGEN_BASE_PROMPT}`;
}

/** predict の 1 要素から base64 文字列を取り出す（API 表現差を吸収） */
function predictionToBase64(pred) {
    if (pred == null) return null;
    if (typeof pred === "string") return null;
    if (typeof pred.bytesBase64Encoded === "string") return pred.bytesBase64Encoded;
    if (pred.image && typeof pred.image.bytesBase64Encoded === "string") return pred.image.bytesBase64Encoded;
    if (typeof pred.imageBytes === "string") return pred.imageBytes;
    if (pred.image && typeof pred.image.imageBytes === "string") return pred.image.imageBytes;
    return null;
}

async function callImagenFast(apiKey, prompt) {
    const body = {
        instances: [{ prompt }],
        parameters: { sampleCount: 1 },
    };
    const res = await fetch(PREDICT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(`Imagen API: non-JSON response (${res.status}): ${text.slice(0, 500)}`);
    }
    if (!res.ok) {
        const msg =
            data?.error?.message ||
            data?.error?.status ||
            (typeof data?.error === "string" ? data.error : JSON.stringify(data.error || data).slice(0, 400));
        throw new Error(`Imagen API ${res.status}: ${msg}`);
    }
    const preds = data.predictions;
    if (!Array.isArray(preds) || preds.length === 0) {
        throw new Error(`Imagen API: no predictions in response: ${JSON.stringify(data).slice(0, 600)}`);
    }
    const b64 = predictionToBase64(preds[0]);
    if (!b64) {
        throw new Error(
            `Imagen API: could not parse image from prediction: ${JSON.stringify(preds[0]).slice(0, 400)}`
        );
    }
    return Buffer.from(b64, "base64");
}

function padIndex(i) {
    return String(i + 1).padStart(2, "0");
}

async function main() {
    loadDotEnvIfPresent();

    const { episodeDir, dryRun, writeManifest, skipExisting, maxApiCalls } = parseArgs(process.argv.slice(2));

    if (!episodeDir) {
        console.error(
            "Usage: GEMINI_API_KEY=... node src/generate_images.mjs <episodeDir> [--dry-run] [--write-manifest] [--skip-existing] [--max-api-calls=N]"
        );
        process.exitCode = 1;
        return;
    }

    const absDir = path.isAbsolute(episodeDir) ? episodeDir : path.resolve(process.cwd(), episodeDir);
    const manifestPath = path.join(absDir, "manifest.json");

    if (!fs.existsSync(manifestPath)) {
        console.error(`Error: ${manifestPath} not found`);
        process.exitCode = 1;
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!dryRun && !apiKey) {
        console.error("Error: set GEMINI_API_KEY (or use --dry-run)");
        process.exitCode = 1;
        return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const slides = manifest.slides || [];
    const imagesDir = path.join(absDir, "images");

    if (!dryRun) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    const relativeSrc = (idx) => `images/slide-${padIndex(idx)}.png`;

    let apiCallsThisRun = 0;

    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const imgDesc = slide.imgDesc || "";
        const prompt = buildPrompt(imgDesc);
        const outPath = path.join(imagesDir, `slide-${padIndex(i)}.png`);

        if (!imgDesc.trim()) {
            console.warn(`Slide ${i + 1}: skip (empty imgDesc)`);
            continue;
        }

        if (dryRun) {
            console.log(`--- slide ${i + 1} ---\n${prompt}\n`);
            continue;
        }

        if (skipExisting && fs.existsSync(outPath)) {
            console.log(`Slide ${i + 1}: skip existing ${outPath}`);
            if (writeManifest) slide.imageSrc = relativeSrc(i);
            continue;
        }

        if (apiCallsThisRun >= maxApiCalls) {
            console.warn(
                `Slide ${i + 1}: skipped (--max-api-calls=${maxApiCalls} reached; no API call). Remaining slides not generated.`
            );
            continue;
        }

        console.log(`Slide ${i + 1}: generating...`);
        try {
            apiCallsThisRun++;
            const buf = await callImagenFast(apiKey, prompt);
            fs.writeFileSync(outPath, buf);
            console.log(`Slide ${i + 1}: wrote ${outPath}`);
            if (writeManifest) slide.imageSrc = relativeSrc(i);
        } catch (e) {
            console.error(`Slide ${i + 1}: FAILED`, e.message || e);
            process.exitCode = 1;
        }
    }

    if (writeManifest && !dryRun) {
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4) + "\n", "utf8");
        console.log(`Updated ${manifestPath} (imageSrc fields). Run: node src/build_slides.mjs ${path.relative(process.cwd(), absDir)}`);
    } else if (!dryRun) {
        console.log("\nDone. To embed paths in manifest: add --write-manifest and re-run build_slides.");
    }
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
