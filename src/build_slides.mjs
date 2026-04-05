#!/usr/bin/env node
/**
 * manifest.json + Markdown 原稿 → slides.js（ビルド専用・依存パッケージなし）
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

/** 原稿を行配列に分ける（改行を行末に保持。manifest の 1 始まり range と整合） */
function readlinesUtf8(filePath) {
    const normalized = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
    if (normalized.length === 0) return [];
    const lines = [];
    let pos = 0;
    while (pos < normalized.length) {
        const nl = normalized.indexOf("\n", pos);
        if (nl === -1) {
            lines.push(normalized.slice(pos));
            break;
        }
        lines.push(normalized.slice(pos, nl + 1));
        pos = nl + 1;
    }
    return lines;
}

function findEpisodeDirs(episodesRoot) {
    const results = [];
    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        if (fs.existsSync(path.join(dir, "manifest.json"))) {
            results.push(dir);
            return;
        }
        for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
            if (name.isDirectory()) walk(path.join(dir, name.name));
        }
    }
    walk(episodesRoot);
    return results.sort();
}

function buildSlides(episodeDir) {
    const absDir = path.isAbsolute(episodeDir)
        ? episodeDir
        : path.resolve(process.cwd(), episodeDir);

    let sourcePath = path.join(absDir, "草稿1.md");
    if (!fs.existsSync(sourcePath)) {
        const mdFiles = fs
            .readdirSync(absDir)
            .filter((f) => f.endsWith(".md"))
            .map((f) => path.join(absDir, f));
        if (mdFiles.length === 0) {
            console.error(`Error: No .md manuscript found in ${absDir}`);
            process.exitCode = 1;
            return;
        }
        sourcePath = mdFiles[0];
    }

    const manifestPath = path.join(absDir, "manifest.json");
    const outputPath = path.join(absDir, "slides.js");

    if (!fs.existsSync(manifestPath)) {
        console.error(`Error: ${manifestPath} not found.`);
        process.exitCode = 1;
        return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const sourceLines = readlinesUtf8(sourcePath);

    const finalSlides = [];
    for (const entry of manifest.slides || []) {
        const lineRange = entry.range;
        if (!lineRange || lineRange.length !== 2) continue;

        const startLine = lineRange[0];
        const endLine = lineRange[1];
        const selectedLines = sourceLines.slice(startLine - 1, endLine);
        const verbatimScript = selectedLines.join("").trim();

        const slide = {
            title: entry.title ?? "",
            content: entry.content ?? "",
            imgDesc: entry.imgDesc ?? "",
            script: verbatimScript,
        };
        if (entry.imageSrc) slide.imageSrc = entry.imageSrc;
        finalSlides.push(slide);
    }

    const header =
        "/**\n" +
        " * HYBRID BUILD: AI Design + Algorithmic Verbatim Transfer\n" +
        ` * Source: ${path.basename(sourcePath)}\n` +
        " */\n" +
        "var slidesData = ";
    const body = JSON.stringify(finalSlides, null, 4) + ";";
    fs.writeFileSync(outputPath, header + body, "utf8");

    console.log(`Success: Built ${finalSlides.length} slides in ${outputPath}`);
}

const argv = process.argv.slice(2);

if (argv[0]) {
    buildSlides(argv[0]);
} else {
    const episodesDir = fs.existsSync(path.join(process.cwd(), "episodes"))
        ? path.join(process.cwd(), "episodes")
        : path.join(repoRoot, "episodes");

    const available = findEpisodeDirs(episodesDir);
    if (available.length === 0) {
        console.error("No episodes with manifest.json found under", episodesDir);
        process.exit(1);
    }

    console.log("Available episodes (manifest.json):");
    available.forEach((dir, i) => {
        console.log(`[${i}] ${path.relative(repoRoot, dir) || "."}`);
    });

    const rl = readline.createInterface({ input, output });
    const idxStr = await rl.question("Select episode index to build: ");
    rl.close();

    const idx = parseInt(idxStr, 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= available.length) {
        console.error("Invalid selection.");
        process.exit(1);
    }

    buildSlides(available[idx]);
}
