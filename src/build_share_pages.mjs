#!/usr/bin/env node
/**
 * episodes_list.js + 各 manifest から、SNS 用プレビューページ share/<seriesId>-<episodeId>.html を生成する。
 * Discord 等は ?series= の付いたトップ URL では HTML が共通のため og:image を切り替えられない。
 * 共有用には share/*.html を貼る（本文は本番ビューへリダイレクト）。
 *
 * og:image は次の優先順位:
 *   1. share/previews/<seriesId>-<episodeId>.png（npm run capture:share で生成したスライド全景）
 *   2. 先頭スライドの imageSrc（従来の挿絵のみ）
 *
 * サイトの公開オリジン:
 *   KUCHI_DRAFT_SITE_ORIGIN=https://yokiikoy.github.io/kuchi-draft
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const DEFAULT_ORIGIN = "https://yokiikoy.github.io/kuchi-draft";

function loadProjectsData() {
    const p = path.join(repoRoot, "episodes_list.js");
    const code = fs.readFileSync(p, "utf8");
    const fn = new Function(`${code}\nreturn projectsData;`);
    return fn();
}

function escapeHtmlAttr(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/** パスをセグメントごとにエンコードして絶対 URL にする */
function absoluteAssetUrl(origin, relPath) {
    const o = origin.replace(/\/$/, "");
    const norm = relPath.replace(/^\/+/, "").replace(/\/+/g, "/");
    const parts = norm.split("/").filter(Boolean).map((seg) => encodeURIComponent(seg));
    return `${o}/${parts.join("/")}`;
}

function viewerUrl(origin, seriesId, episodeId) {
    const o = origin.replace(/\/$/, "");
    const q = new URLSearchParams({ series: seriesId, episode: episodeId });
    return `${o}/?${q.toString()}`;
}

function firstSlideImageRel(episodeDirRel, manifest) {
    const slides = manifest.slides || [];
    for (const s of slides) {
        const src = (s.imageSrc || "").trim();
        if (src) {
            const base = episodeDirRel.replace(/\/+$/, "");
            return `${base}/${src}`.replace(/\/+/g, "/");
        }
    }
    return null;
}

function buildShareHtml({
    seriesTitle,
    episodeTitle,
    description,
    ogImageAbs,
    viewerAbs,
    redirectHref,
}) {
    const title = `Kuchi-Draft — ${seriesTitle} · ${episodeTitle}`;
    const desc = description || episodeTitle;
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtmlAttr(title)}</title>
    <meta name="description" content="${escapeHtmlAttr(desc)}">
    <meta property="og:site_name" content="Kuchi-Draft">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtmlAttr(title)}">
    <meta property="og:description" content="${escapeHtmlAttr(desc)}">
    <meta property="og:url" content="${escapeHtmlAttr(viewerAbs)}">
    <meta property="og:image" content="${escapeHtmlAttr(ogImageAbs)}">
    <meta property="og:locale" content="ja_JP">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtmlAttr(title)}">
    <meta name="twitter:description" content="${escapeHtmlAttr(desc)}">
    <meta name="twitter:image" content="${escapeHtmlAttr(ogImageAbs)}">
    <meta http-equiv="refresh" content="0; url=${escapeHtmlAttr(redirectHref)}">
</head>
<body>
    <p><a href="${escapeHtmlAttr(redirectHref)}">Kuchi-Draft を開く</a></p>
</body>
</html>
`;
}

function main() {
    const origin = (process.env.KUCHI_DRAFT_SITE_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, "");
    const shareDir = path.join(repoRoot, "share");
    fs.mkdirSync(shareDir, { recursive: true });

    let projectsData;
    try {
        projectsData = loadProjectsData();
    } catch (e) {
        console.error("Failed to load episodes_list.js:", e.message || e);
        process.exitCode = 1;
        return;
    }

    const indexLinks = [];

    for (const series of projectsData || []) {
        const seriesId = series.seriesId;
        const seriesTitle = series.seriesTitle || seriesId;
        for (const ep of series.episodes || []) {
            const episodeId = ep.id;
            const episodeTitle = ep.title || episodeId;
            const epPath = (ep.path || "").replace(/\/+$/, "") + "/";
            const absEp = path.join(repoRoot, epPath);
            const manifestPath = path.join(absEp, "manifest.json");
            if (!fs.existsSync(manifestPath)) {
                console.warn(`Skip ${seriesId}/${episodeId}: no manifest at ${manifestPath}`);
                continue;
            }
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
            const slug = `${seriesId}-${episodeId}`;
            const previewRel = `share/previews/${slug}.png`;
            const previewAbsPath = path.join(repoRoot, previewRel);
            const imageRel = firstSlideImageRel(epPath, manifest);

            let ogImageRel = null;
            if (fs.existsSync(previewAbsPath)) ogImageRel = previewRel;
            else if (imageRel) ogImageRel = imageRel;

            if (!ogImageRel) {
                console.warn(
                    `Skip ${seriesId}/${episodeId}: no share/previews/${slug}.png (run npm run capture:share) and no imageSrc on first slides`
                );
                continue;
            }

            const ogImageAbs = absoluteAssetUrl(origin, ogImageRel);
            const viewerAbs = viewerUrl(origin, seriesId, episodeId);
            const description = manifest.description || "";
            const redirectHref = `../?series=${encodeURIComponent(seriesId)}&episode=${encodeURIComponent(episodeId)}`;

            const html = buildShareHtml({
                seriesTitle,
                episodeTitle,
                description,
                ogImageAbs,
                viewerAbs,
                redirectHref,
            });

            const outPath = path.join(shareDir, `${slug}.html`);
            fs.writeFileSync(outPath, html, "utf8");
            console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
            indexLinks.push({ slug, seriesTitle, episodeTitle, href: `./${slug}.html` });
        }
    }

    const indexBody = indexLinks
        .map(
            (l) =>
                `    <li><a href="${escapeHtmlAttr(l.href)}">${escapeHtmlAttr(l.seriesTitle)} — ${escapeHtmlAttr(
                    l.episodeTitle
                )}</a> <span class="muted">(${escapeHtmlAttr(l.slug)})</span></li>`
        )
        .join("\n");

    const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kuchi-Draft — 共有用リンク一覧</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; }
      .muted { color: #64748b; font-size: 0.9rem; }
      p.note { color: #475569; font-size: 0.95rem; }
    </style>
</head>
<body>
    <h1>共有用プレビュー（OG 付き）</h1>
    <p class="note">Discord 等ではトップ URL のクエリではサムネが切り替わらないため、ここから該当ページの URL をコピーして貼ってください。サムネは <code>npm run capture:share</code> で生成したスライド全景 PNG（<code>share/previews/</code>）を参照します。</p>
    <ul>
${indexBody}
    </ul>
    <p><a href="../">アプリ本体へ</a></p>
</body>
</html>
`;
    fs.writeFileSync(path.join(shareDir, "index.html"), indexHtml, "utf8");
    console.log(`Wrote share/index.html (${indexLinks.length} episodes)`);
}

main();
