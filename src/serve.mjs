#!/usr/bin/env node
/**
 * リポジトリルートを静的配信（file:// 回避用）。外部パッケージ不要。
 * 使い方: ルートで node src/serve.mjs  または  PORT=3000 node src/serve.mjs
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT) || 8765;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".txt": "text/plain; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
};

function safeFileForUrl(pathname) {
    const decoded = decodeURIComponent(pathname.split("?")[0] || "/");
    if (decoded.includes("\0")) return null;
    const clean = decoded.replace(/^\/+/, "") || ".";
    const joined = path.resolve(root, clean);
    const rel = path.relative(root, joined);
    if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
    return joined;
}

const server = http.createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405).end();
        return;
    }

    let pathname;
    try {
        pathname = new URL(req.url || "/", "http://127.0.0.1").pathname;
    } catch {
        res.writeHead(400).end();
        return;
    }

    if (pathname === "/") pathname = "/index.html";

    let filePath = safeFileForUrl(pathname);
    if (!filePath) {
        res.writeHead(403).end("Forbidden");
        return;
    }

    try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, "index.html");
        }
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            res.writeHead(404).end("Not Found");
            return;
        }
    } catch {
        res.writeHead(500).end();
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });

    if (req.method === "HEAD") {
        res.end();
        return;
    }

    fs.createReadStream(filePath).on("error", () => {
        if (!res.writableEnded) res.destroy();
    }).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
    console.log(`Kuchi-Draft → http://127.0.0.1:${port}/`);
});
