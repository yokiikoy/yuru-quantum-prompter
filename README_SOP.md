# ゆる量子力学ラジオ 制作ガイド (Standard Operating Procedure)

このプロジェクトを再現性を持って継続し、高品質なスライドを「原文一文字も変えずに」生成するための手順書です。スライドは**収録中の話者**だけでなく**リスナー・後からページだけ見る人**も想定し、`DESIGN_GUIDE.md` に沿って図表・アイコン・十分な文量で読みやすくします。

## 1. 準備：新エピソードのフォルダ作成
1.  `episodes/` フォルダの中に、新しい回用のフォルダを作成します（例：`02_不確定性原理`）。
2.  その中に Markdown 形式で原稿を作成し、保存します（例：`草稿1.md`）。

## 2. AIによるスライドデザイン (2ステップ方式)
高品質なプレゼンテーションを作るため、AIへの依頼を「構成案」と「デザイン」の2段階に分けます。

### ステップ2-1: 構成案の提案を依頼する
1. 作成した原稿の内容を AI（私）に読み込ませます。
2. 以下の指示を出します：
   > 「この原稿（草稿X.md）の、ハイブリッド方式の **manifest.json のための『スライド分割案（行番号）』と『各スライドの演出意図』だけ** を提案して。まだ manifest.json は書かずに、構成の意図を見せて。」
3. 出力された構成案を確認し、ページを区切るタイミングや内容の量に違和感があれば AI に調整を指示します（例：「3枚目と4枚目は1枚にまとめて」）。

### ステップ2-2: デザイン（manifest.json）の出力を依頼する
1. 構成案にOKが出たら、以下の指示を出します：
   > 「その構成案で OK です。では、それを元に **manifest.json** を書き出して。単なる要約の抜き出しではなく、プロのプレゼン資料のように、視聴者の記憶に残るタイトルや、図解的なHTMLの箇条書き表現など、プレゼンとしての工夫を存分に盛り込んで。**ラジオを聞いていない人がページだけ見ても筋が通る**よう、文字は過度に削がず、`DESIGN_GUIDE.md` の §5b・§8 に沿って。」
2. AI が出力した `manifest.json` を、作成したエピソードフォルダ内に保存します。

## 3. ビルドツールの実行
1.  ターミナルを開き、ルートディレクトリで以下のコマンドを実行します。
    ```bash
    node src/build_slides.mjs
    ```
2.  メニューが表示されるので、作成したエピソードの番号（インデックス）を選択します。
3.  そのフォルダ内に `slides.js` が自動生成されます。

## 4. ツールでの確認
1.  `episodes_list.js` の `projectsData` を開き、該当シリーズの `episodes` 配列に新しいエピソードを追記します（`id`・`title`・`path` は既存エントリと同じ形）。
2.  ルートで静的サーバを立てて `index.html` を開き、左上のメニューから新しいエピソードを選択して確認します（`file://` 直開きでは読み込みに失敗することがあります）。

## 5. 画像の生成・反映 (トンマナ完全固定)
画像生成時に毎回画風がブレるのを防ぐため、**`imgDesc` の後にベースプロンプトを結合**して送ります（手動依頼でも API でも同じ文面）。

### 自動生成（推奨）：Imagen 4 Fast（Gemini API）
ルートで API キーを渡し、エピソードディレクトリを引数に取ります（**追加 npm パッケージ不要**・Node 18+）。REST は [Imagen（Gemini API）](https://ai.google.dev/gemini-api/docs/imagen) の `:predict` と同一形式です。

1. **API キーの用意**  
   - [Google AI Studio](https://aistudio.google.com/apikey) で **Create API key**。Imagen は **課金アカウントが紐づいたプロジェクト**が必要なことがあります（[Billing](https://ai.google.dev/gemini-api/docs/billing)）。  
   - **セット方法（どちらか）**  
     - **A. ルートに `.env`**：`cp .env.example .env` し、`GEMINI_API_KEY=（貼り付け）` を保存。`generate_images.mjs` が **環境変数未設定時だけ** `.env` を読みます。  
     - **B. シェルで一時指定**：`export GEMINI_API_KEY="..."` のあと同じターミナルで `node src/generate_images.mjs ...`  
   - `.env` とキー文字列は **Git に含めない**（漏れたら AI Studio 側でキーを削除・再発行）。
2. プロンプトの確認だけなら：
   ```bash
   node src/generate_images.mjs episodes/01_量子力学の仕様書 --dry-run
   ```
3. 生成＋`images/slide-01.png` 形式で保存し、`manifest.json` に `imageSrc` を書き込み、`slides.js` まで一気に反映する例（`.env` を使う場合は `export` は不要）：
   ```bash
   node src/generate_images.mjs episodes/01_量子力学の仕様書 --write-manifest
   node src/build_slides.mjs episodes/01_量子力学の仕様書
   ```
   - 既存 PNG を温存したい場合は `--skip-existing` を併用。
   - **1 実行あたりの API 回数に上限**を付けたいときは `--max-api-calls=5` のように指定。
   - モデルは **`imagen-4.0-fast-generate-001`**（料金は [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) の Imagen を参照）。

ベースプロンプトの正本は **`src/generate_images.mjs` 内定数 `IMAGEN_BASE_PROMPT`**。変更する場合はそのファイルを編集する。**画像内の文字**は原則禁止（モデルが不自然な英語を生成しやすいため）。**「？」など記号のみ**可。特定の短文を載せたいときだけ `imgDesc` に英語で明示する（`DESIGN_GUIDE.md` の「content と imgDesc の分担」）。

### 手動・別ツールで生成する場合
1. AI（私）に以下の指示テンプレートを使って画像生成を依頼します：
   > 「manifest.json のスライドX枚目の画像（imgDesc）を生成して。ただし、トンマナを固定するため、指定されたimgDescの後ろに以下の【ベースプロンプト】を必ず結合して生成すること。
   >
   > 【ベースプロンプト】
   > （`src/generate_images.mjs` の `IMAGEN_BASE_PROMPT` と同一文を貼る）」
2. 生成が完了し、OKであれば画像を `episodes/XX/images/` に保存します。
3. `manifest.json` の該当スライドに `"imageSrc": "images/slide-01.png"` のように追記し、再度 `node src/build_slides.mjs` を実行して反映させます。


## 6. GitHub へのデプロイ（公開）
エピソードの追加や原稿の修正が完了したら、変更履歴を保存して本番環境（GitHub Pages）を更新します。

**SNS・Discord 用プレビュー（任意）**: トップ URL に `?series=` / `episode=` を付けても、配信側は同じ `index.html` しか取れないため **OG 画像はエピソードごとに切り替わりません**。**先頭スライドの全景**（タイトル・HTML 本文・挿絵列）をサムネにする手順: 初回のみ `npm install` と `npx playwright install chromium`。ルートで `npm run capture:share`（`share/previews/*.png` を生成）のあと `npm run build:share` で `share/<seriesId>-<episodeId>.html` を更新し、**share URL** を貼る（プレビュー PNG が無いときは従来どおり先頭 `imageSrc` のみ）。公開ホストを変えたときは `KUCHI_DRAFT_SITE_ORIGIN` をセットしてから `build:share`（既定は `README` / `AGENTS` と同じ）。

1.  ターミナルを開き、ルートディレクトリで以下のコマンドを実行します：
    ```bash
    git add .
    git commit -m "Update episode content"
    git push origin main
    ```
2.  数分以内に、公開されている GitHub Pages (例: `https://<YOUR-USERNAME>.github.io/kuchi-draft/`) の内容が自動的に最新版へと更新されます。

---

この手順を守ることで、常に「台本通りのプロンプター」と「ハイクオリティな演出」が両立した状態で収録に臨むことができます。また、Gitにより過去のすべての修正履歴が安全に保管されます。
