#!/usr/bin/env node
/**
 * ローカルで静的サーバを立て、Playwright で index.html?series=&episode=&ogCapture=1 の
 * .slide-area（タイトル＋本文＋画像列の全景）を PNG 化し share/previews/<seriesId>-<episodeId>.png に保存する。
 *
 * 前提: npm install / npx playwright install chromium
 *
 *   node src/capture_share_screens.mjs
 *   node src/capture_share_screens.mjs --skip-existing
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadProjectsData() {
    const p = path.join(repoRoot, "episodes_list.js");
    const code = fs.readFileSync(p, "utf8");
    const fn = new Function(`${code}\nreturn projectsData;`);
    return fn();
}

function parseArgs(argv) {
    return { skipExisting: argv.includes("--skip-existing") };
}

async function waitForServer(baseUrl, ms = 25000) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
        try {
            const r = await fetch(baseUrl);
            if (r.ok) return;
        } catch {
            /* retry */
        }
        await new Promise((r) => setTimeout(r, 120));
    }
    throw new Error(`Timeout waiting for ${baseUrl}`);
}

async function main() {
    const { skipExisting } = parseArgs(process.argv.slice(2));

    let chromium;
    try {
        ({ chromium } = await import("playwright"));
    } catch {
        console.error("Error: playwright is not installed. Run: npm install && npx playwright install chromium");
        process.exitCode = 1;
        return;
    }

    let projectsData;
    try {
        projectsData = loadProjectsData();
    } catch (e) {
        console.error("Failed to load episodes_list.js:", e.message || e);
        process.exitCode = 1;
        return;
    }

    const port = 9700 + Math.floor(Math.random() * 200);
    const base = `http://127.0.0.1:${port}`;

    const server = spawn(process.execPath, [path.join(repoRoot, "src/serve.mjs")], {
        cwd: repoRoot,
        env: { ...process.env, PORT: String(port) },
        stdio: ["ignore", "pipe", "pipe"],
    });

    let serverExited = false;
    server.on("exit", () => {
        serverExited = true;
    });

    const outDir = path.join(repoRoot, "share", "previews");
    fs.mkdirSync(outDir, { recursive: true });

    try {
        const browser = await chromium.launch({ headless: true });
        try {
            await waitForServer(`${base}/`);

            for (const series of projectsData || []) {
                const seriesId = series.seriesId;
                for (const ep of series.episodes || []) {
                    const episodeId = ep.id;
                    const slug = `${seriesId}-${episodeId}`;
                    const outPath = path.join(outDir, `${slug}.png`);

                    if (skipExisting && fs.existsSync(outPath)) {
                        console.log(`Skip existing ${path.relative(repoRoot, outPath)}`);
                        continue;
                    }

                    const q = new URLSearchParams({
                        series: seriesId,
                        episode: episodeId,
                        ogCapture: "1",
                    });
                    const url = `${base}/?${q.toString()}`;

                    const context = await browser.newContext({
                        viewport: { width: 1280, height: 900 },
                        deviceScaleFactor: 2,
                    });
                    const page = await context.newPage();

                    try {
                        await page.goto(url, { waitUntil: "load", timeout: 60000 });
                        await page.waitForFunction(
                            () => typeof slidesData !== "undefined" && slidesData.length > 0,
                            { timeout: 30000 }
                        );
                        await page.waitForFunction(
                            () => {
                                const t = document.getElementById("slide-title");
                                return t && t.textContent.trim() && t.textContent.trim() !== "タイトル";
                            },
                            { timeout: 30000 }
                        );
                        await page.waitForFunction(
                            () => {
                                const img = document.getElementById("slide-img");
                                if (!img || img.classList.contains("hidden")) return true;
                                return img.complete && img.naturalHeight > 0;
                            },
                            { timeout: 20000 }
                        );
                        await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));

                        const slideArea = page.locator(".slide-area").first();
                        await slideArea.screenshot({ path: outPath, type: "png" });
                        console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
                    } catch (e) {
                        console.error(`${slug}: FAILED`, e.message || e);
                        process.exitCode = 1;
                    } finally {
                        await context.close();
                    }
                }
            }
        } finally {
            await browser.close();
        }
    } finally {
        if (!serverExited) {
            server.kill("SIGTERM");
            await new Promise((r) => setTimeout(r, 400));
            if (!serverExited) server.kill("SIGKILL");
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
