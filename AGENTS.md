# エージェント向け正本（Kuchi-Draft）

**正式なプロジェクト表示名: Kuchi-Draft**（リポジトリ／ツール全体の呼び名）。収録コンテンツの番組名（例: ゆる量子力学ラジオ）は `episodes_list.js` と各エピソードで別に管理する。

チャットにだけ残さない設計・手順はここを更新する。人間向けの制作手順の詳細は [README_SOP.md](README_SOP.md)、ビジュアル規約は [DESIGN_GUIDE.md](DESIGN_GUIDE.md)。

---

## 要確認（ユーザーへ — 推測で固定しない項目）

次はリポジトリオーナーが確定させてほしい。未記入のままエージェントは仮定で進めない。

1. **リモート／公開名**（`REPO_OR_FOLDER_NAME`）: **確定** — GitHub リポジトリ名は **`kuchi-draft`**（`https://github.com/yokiikoy/kuchi-draft`）。GitHub Pages のパスはリポジトリ設定次第で、プロジェクトサイトなら多くの場合 `https://yokiikoy.github.io/kuchi-draft/`。
2. **いまの目的**（1〜3文）: 収録用のみか、公開アーカイブか、複数番組の共用基盤かの優先順位。
3. **正本メモのファイル名**: 本ファイルを `AGENTS.md` のままにするか、`RESUME_CONTEXT.md` 等へ移すか。
4. **ユーザー向け長文ドキュメントの置き場**: `docs/` を作る合意があるか（現状はルートと `README_SOP.md` のみ）。

---

## 仮定（上記が埋まるまでのエージェント作業用）

- **ローカルルート**: 本ファイルがあるディレクトリ（`ゆる量子力学ラジオ`）がリポジトリルート。
- **エントリポイント**: 収録用 UI はルートの `index.html`（`episodes_list.js` でシリーズ・エピソードを列挙）。
- **ビルド**: Node.js。`src/build_slides.mjs` が `manifest.json` + Markdown 原稿から各エピソードの `slides.js` を生成。**スタイル**: `npm run build:css` で Tailwind を `assets/app.css` に出力（Pages 用に CSS はリポジトリへコミット。`index.html` や `episodes/**` のユーティリティクラスを変えたら再実行）。

---

## 何を作る／しないか

### スコープ

- ブラウザ上で **スライド（HTML 演出）** と **台本（原稿から行範囲で抜いた verbatim）** を同期表示する **プロンプター兼スライドビューア**。
- エピソード単位のフォルダに **原稿 Markdown**、**manifest.json**（スライド定義・行番号 `range`）、ビルド生成の **slides.js**、任意で画像。
- 複数シリーズを `episodes_list.js` の `projectsData` で束ねる。

### 非ゴール（明示しない限りやらない）

- バックエンド・認証・DB。
- 原稿の自動翻訳や TTS 統合。
- 重いフロントフレームワークや複雑な npm パイプライン（**例外**: Tailwind のみ `devDependencies` で CSS ビルド。MathJax / Tailwind JIT CDN は廃止）。

---

## 現状

### 完了・運用できていること

- `index.html` + `episodes_list.js` + 各 `episodes/.../slides.js` の読み込みフロー。
- `src/build_slides.mjs` によるハイブリッド生成（manifest の `content` + 原稿からの `script`）。
- `DESIGN_GUIDE.md` によるスライド HTML のトンマナ参照。
- `README_SOP.md` による人手制作フロー（構成案 → manifest → ビルド）。

### 未着手・揺れていること

- シリーズ名・フォルダ名の整理（例: Beyond の表記・パスは移行議論中の可能性）。
- `README_SOP.md` の「`episodes.json` を編集」と実装の **`episodes_list.js`** の不一致の解消。

### 既知の負債

- 一部 `manifest.json` の文字エンコーディングが環境によっては崩れて見えることがある（編集時は UTF-8 で保存すること）。
- `file://` 直開きでは動的読み込みが失敗しうる → 必要ならルートで HTTP サーバを立てる。

---

## ディレクトリと役割

| パス | 役割 |
|------|------|
| `index.html` | メイン UI（スライド領域・プロンプター・エピソード選択）。 |
| `episodes_list.js` | シリーズ・エピソード一覧と `slides.js` への相対パス。 |
| `episodes/<シリーズまたは回>/` | エピソード単位。原稿 `草稿1.md`（またはフォルダ内の .md）、`manifest.json`、生成 `slides.js`、画像など。 |
| `src/build_slides.mjs` | manifest + 原稿 → `slides.js` 生成（`node` で実行）。 |
| `src/serve.mjs` | ローカルプレビュー用の静的サーバ（`node` のみ・既定ポート 8765）。 |
| `DESIGN_GUIDE.md` | スライド HTML・CSS クラスのリファレンス。 |
| `README_SOP.md` | 制作者向け SOP（エージェント向けの「正本」ではないが手順の詳細）。 |
| `prototype_yurufuwa.html`, `radio_slide1.html` | 試作 HTML。本番フローからは切り離して扱う。 |

---

## 再現手順

1. **前提**: **Node.js**（ビルド用・v18+ 推奨）、モダンブラウザ。スライド生成だけなら npm 不要。**UI 用 CSS** は初回・スタイル変更時に `npm install` と `npm run build:css`（出力 `assets/app.css` をコミット）。
2. **スライドビルド**（ルートで）:
   ```bash
   node src/build_slides.mjs
   ```
   対話でエピソードを選ぶか、引数にエピソードディレクトリを渡す:
   ```bash
   node src/build_slides.mjs episodes/01_量子力学の仕様書
   ```
3. **CSS ビルド**（`index.html` や `episodes/**` の Tailwind クラスを変えたとき）:
   ```bash
   npm run build:css
   ```
4. **確認**: ルートで Node の静的サーバを起動して `index.html` を開く:
   ```bash
   node src/serve.mjs
   ```
   既定は `http://127.0.0.1:8765/`。初期シリーズ・エピソードは URL クエリで指定可能: `?series=<seriesId>`、任意で `&episode=<ep.id>`（値は `episodes_list.js` の `seriesId` / 各エピソードの `id` と一致）。クエリなしのときは URL は書き換えない。ドロップダウン変更時は `history.replaceState` でクエリを同期する。
5. **成果物**: 各エピソードフォルダの `slides.js`（生成物。原稿・manifest と整合を保つ）。併せて `assets/app.css`（スタイル変更時）。

---

## 命名・バージョン

- **プロジェクト（ツール）の正式表示名**: **Kuchi-Draft**（README・ブラウザタイトル・対外説明でこれを使う）。
- 番組・シリーズの**表示名**と**ディレクトリ名**は一致させなくてよいが、`episodes_list.js` の `path` と実フォルダは一致必須。
- アプリにバージョン文字列の固定フィールドはない。リリース単位で Git タグを切る運用は任意。
- 製品名の表記ルール（例: 「Beyond 12000」表記）はオーナーが決め、manifest・一覧・フォルダ名を揃える。

---

## 運用ルール（エージェント）

- 重要な設計変更・手順変更は **本ファイル（またはユーザーが指定した正本）を更新**する。
- 変更は依頼範囲に限定。無関係なリファクタや、依頼のない新規 Markdown を増やさない。
- ユーザー向けの説明・発表原稿が必要になったら、**合意した場所**（例: 将来の `docs/`）に置き、本ファイルからリンクする。

---

## 最近の記録

- **2026-04-05**: エージェント向け正本 `AGENTS.md` 初版追加。ルート `README.md` 最小追加。`README_SOP.md` §4 を `episodes_list.js` 記載へ修正。**正式プロジェクト表示名を Kuchi-Draft に確定**（`README.md`・`index.html` の `<title>`・本ファイル）。
- **2026-04-05**: `index.html` で URL クエリ `series` / `episode` による初期選択と、ドロップダウン変更時の URL 同期（`replaceState`）を追加。
- **2026-04-05**: ビルドを `src/build_slides.mjs` に統一。引数なし時は `episodes/` 以下の `manifest.json` があるディレクトリを列挙して対話選択。
- **2026-04-05**: プレビュー用 `src/serve.mjs` を追加。ビルド〜ローカル確認は **Node + ブラウザのみ**。
- **GitHub リポジトリ名を `kuchi-draft` に統一**: ローカル `origin` を `https://github.com/yokiikoy/kuchi-draft.git` に更新。`README_SOP.md` の Pages 例 URL、`AGENTS.md` のリモート名を同期。
- **表示パフォーマンス**: Tailwind の **JIT CDN**・**polyfill.io**・**MathJax** をやめ、`npm run build:css` で **`assets/app.css`（約14KB minify）** を配信。スライド HTML に LaTeX が無い限り数式レンダリングは行わない（台本の `$$` はプレーン表示）。
