# Kuchi-Draft

ポッドキャスト収録用に、**スライド（見た目）**と**原稿ベースの台本**を同期表示する静的サイトです。複数シリーズ（例: ゆる量子力学ラジオ）のエピソードを `episodes_list.js` で切り替えます。

## すぐ使う

1. 必要なら原稿と `manifest.json` を整えたうえで、リポジトリ**ルート**でスライドをビルドします。

   ```bash
   node src/build_slides.mjs
   ```

2. **初回のみ**（または `index.html` / エピソードの Tailwind クラスを変えたとき）CSS をビルドします。GitHub Pages 向けには **`assets/app.css` をコミット**する運用です。

   ```bash
   npm install
   npm run build:css
   ```

3. ルートで `index.html` を配信して開きます（`file://` では動かない場合があります）。

   ```bash
   node src/serve.mjs
   ```

   表示された URL（既定 `http://127.0.0.1:8765/`）をブラウザで開いてください。別ポートは `PORT=3000 node src/serve.mjs`。

   初期表示のシリーズはクエリで指定できます（`episodes_list.js` の `seriesId` と各エピソードの `id`）。例: `http://127.0.0.1:8765/?series=beyond&episode=01`

   **表示が崩れたら** `npm run build:css` を再実行し、`assets/app.css` を更新してからデプロイしてください。

## ドキュメント

| 文書 | 内容 |
|------|------|
| [AGENTS.md](AGENTS.md) | **エージェント向け正本**（スコープ・構成・再現手順・負債） |
| [README_SOP.md](README_SOP.md) | 制作者向け制作手順（manifest・AI ワークフロー） |
| [DESIGN_GUIDE.md](DESIGN_GUIDE.md) | スライドのデザイン・HTML パターン |

## エピソードの追加

概要は [README_SOP.md](README_SOP.md)。エピソードの登録は実装上 **`episodes_list.js`** の `projectsData` を編集します（SOP 内の `episodes.json` 表記は現コードと不一致のため、更新時は SOP 側も直すこと）。
