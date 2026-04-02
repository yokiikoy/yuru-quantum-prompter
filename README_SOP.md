# ゆる量子力学ラジオ 制作ガイド (Standard Operating Procedure)

このプロジェクトを再現性を持って継続し、高品質なスライドを「原文一文字も変えずに」生成するための手順書です。

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
   > 「その構成案で OK です。では、それを元に **manifest.json** を書き出して。単なる要約の抜き出しではなく、プロのプレゼン資料のように、視聴者の記憶に残るタイトルや、図解的なHTMLの箇条書き表現など、プレゼンとしての工夫を存分に盛り込んで。」
2. AI が出力した `manifest.json` を、作成したエピソードフォルダ内に保存します。

## 3. ビルドツールの実行
1.  ターミナルを開き、ルートディレクトリで以下のコマンドを実行します。
    ```bash
    python3 src/build_slides.py
    ```
2.  メニューが表示されるので、作成したエピソードの番号（インデックス）を選択します。
3.  そのフォルダ内に `slides.js` が自動生成されます。

## 4. ツールでの確認
1.  `episodes.json`（ルートディレクトリ）を開き、新しく作ったエピソードの情報を追記します。
    ```json
    {
        "id": "02",
        "title": "第2回：不確定性原理",
        "path": "episodes/02_不確定性原理/"
    }
    ```
2.  `index.html` をブラウザで開き、左上のメニューから新しいエピソードを選択して確認します。

## 5. 画像の生成・反映 (トンマナ完全固定)
画像生成時に毎回画風がブレるのを防ぐため、必ず以下の**「ベースプロンプト」**を付与してAIに生成を依頼します。

1. AI（私）に以下の指示テンプレートを使って画像生成を依頼します：
   > 「manifest.json のスライドX枚目の画像（imgDesc）を生成して。ただし、トンマナを固定するため、指定されたimgDescの後ろに以下の【ベースプロンプト】を必ず結合して生成すること。
   >
   > 【ベースプロンプト】
   > "style of minimalist flat vector illustration, pure white background, soft pastel color palette with subtle blue and gray focus, minimal shading, clean continuous lines, sophisticated and nerdy, geometric minimalism, simple corporate editorial style"」
2. 生成が完了し、OKであれば画像を `episodes/XX/images/` に保存させます。
3. AIに指示して `manifest.json` の該当スライドに `"imageSrc": "images/filename.png"` を追記させ、再度ビルドツールを実行して反映させます。


## 6. GitHub へのデプロイ（公開）
エピソードの追加や原稿の修正が完了したら、変更履歴を保存して本番環境（GitHub Pages）を更新します。

1.  ターミナルを開き、ルートディレクトリで以下のコマンドを実行します：
    ```bash
    git add .
    git commit -m "Update episode content"
    git push origin main
    ```
2.  数分以内に、公開されている GitHub Pages (例: `https://<YOUR-USERNAME>.github.io/yuru-quantum-prompter/`) の内容が自動的に最新版へと更新されます。

---

この手順を守ることで、常に「台本通りのプロンプター」と「ハイクオリティな演出」が両立した状態で収録に臨むことができます。また、Gitにより過去のすべての修正履歴が安全に保管されます。
