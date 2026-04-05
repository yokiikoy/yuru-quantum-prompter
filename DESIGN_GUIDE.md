# ゆる量子力学ラジオ — スライドデザインガイド

> このドキュメントは、第1回で確立した「ゆるふわ」トンマナを次回以降も再現するためのリファレンスです。
> **閲覧者**は収録中の話者だけでなく**リスナー（公開後にページだけ見る人も含む）**を想定する。AIに渡す際は冒頭に「このガイドに従って manifest.json を作って」と伝えてください。

---

## 1. デザインの基本思想

| 項目 | 内容 |
|---|---|
| **対象** | **話者・リスナー双方**が見るスライド。ラジオを聞いていない人が**あとからページだけ見ても筋が通る**ことを優先する |
| **役割** | 番組の「視覚的アンカー」かつ**スタンドアロンで読めるミニ資料**。台本（script）は正本・詳細、スライド（content）は**図表・見出し・短い説明で魅力と構造を出す** |
| **トーン** | ゆるふわ / 知的だが気取らない / 親しみやすい |
| **フォント** | Zen Maru Gothic（丸ゴシック） |
| **背景** | ミントグリーン + ドットパターン（CSS自動適用） |
| **タイトル** | 黄色マーカー下線（CSS自動適用） |

---

## 2. CSSクラス一覧（`index.html`に定義済み）

### バブル（カード型要素）

```html
<!-- 基本バブル（水色シャドウ） -->
<div class='bubble'>...</div>

<!-- ピンクシャドウ：感情的・重要な引用 -->
<div class='bubble bubble-pink'>...</div>

<!-- 黄色シャドウ：まとめ・ポジティブな結論 -->
<div class='bubble bubble-yellow'>...</div>
```

### 引用ブロック（左ライン）

```html
<div class='bubble' style='border-left:6px solid #4a4a4a; border-radius:0 20px 20px 0;'>
  <p class='text-lg' style='margin:0; font-style:italic;'>引用文</p>
</div>
```

### コードターミナル風

```html
<div class='bubble' style='background:#2d2d2d; border-color:#555;'>
  <p style='margin:0; font-size:13px; font-family:monospace; line-height:1.9; color:#4ade80;'>
    &gt; コード内容
  </p>
</div>
```

### 締めの大一言

```html
<div style='text-align:center;'>
  <span style='background:#2d2d2d; color:white; padding:12px 36px; border-radius:50px; font-size:30px; font-weight:bold;'>
    「ヨシ！」
  </span>
</div>
```

---

## 3. レイアウトパターン集

### パターンA：テキスト＋バブル（基本）

```html
<p class='text-lg'>リード文。状況説明や問いかけ。</p>
<div class='bubble bubble-yellow' style='margin-top:12px;'>
  <p class='text-xl text-center font-bold' style='margin:0;'>
    重要なフレーズ
  </p>
</div>
<p class='text-sm' style='color:#7a7a7a; margin-top:8px;'>補足・注釈</p>
```

### パターンB：2カラム対比グリッド

```html
<div style='display:grid; grid-template-columns:1fr 1fr; gap:8px;'>
  <div class='bubble' style='padding:10px;'>
    <p style='margin:0; font-size:13px; font-weight:bold; color:#7a7a7a;'>左ラベル</p>
    <p style='margin:4px 0 0; font-size:15px;'>左内容</p>
  </div>
  <div class='bubble bubble-pink' style='padding:10px;'>
    <p style='margin:0; font-size:13px; font-weight:bold; color:#7a7a7a;'>右ラベル</p>
    <p style='margin:4px 0 0; font-size:15px;'>右内容</p>
  </div>
</div>
```

> **圧縮版**（スクロールが出る場合）：
> `gap:6px` / `padding:7px 10px` / ラベル `font-size:12px` / 内容 `font-size:13px`

### パターンC：縦フロー（矢印なし圧縮版）

```html
<div style='display:grid; grid-template-columns:1fr 1fr; gap:10px;'>
  <div class='bubble bubble-pink' style='padding:12px;'>
    <p style='margin:0; font-size:13px; font-weight:bold; color:#7a7a7a;'>かつて</p>
    <p style='margin:4px 0 0; font-size:15px;'>旧来の説明</p>
  </div>
  <div class='bubble' style='padding:12px;'>
    <p style='margin:0; font-size:13px; font-weight:bold; color:#7a7a7a;'>現代の科学</p>
    <p style='margin:4px 0 0; font-size:15px;'>新しい説明</p>
  </div>
  <!-- 横幅フルのまとめ行 -->
  <div class='bubble bubble-yellow' style='padding:12px; grid-column:1/-1;'>
    <p style='margin:0; font-size:15px; text-align:center;'>📝 結論・発見</p>
  </div>
</div>
```

### パターンD：箇条書きバブル

```html
<div class='bubble bubble-pink'>
  <p style='margin:0; font-size:15px; line-height:2.0;'>
    ❓ 問い1<br>
    ❓ 問い2<br>
    ❓ 問い3
  </p>
</div>
```

### パターンE：絵文字グリッド（3列）

```html
<div style='display:flex; justify-content:space-around; margin-top:16px;'>
  <div class='bubble' style='text-align:center; padding:12px 20px;'>
    <p style='margin:0; font-size:28px;'>🔫</p>
    <p style='margin:4px 0 0; font-weight:bold; font-size:15px;'>ラベル</p>
  </div>
  <!-- 繰り返し -->
</div>
```

### パターンF：タイトルスライド

```html
<div class='text-center space-y-4'>
  <p class='text-5xl font-bold' style='text-shadow: 3px 3px 0px #8fd3f4;'>番組名</p>
  <div class='inline-block px-6 py-2 rounded-full text-xl text-white font-bold'
       style='background:#ff9fb2; transform:rotate(2deg);'>
    第N回：タイトル
  </div>
  <p class='text-lg' style='color:#7a7a7a; margin-top:24px;'>パーソナリティ：名前</p>
</div>
```

### パターンG：章タイトルスライド

```html
<div class='text-center space-y-4'>
  <p class='text-4xl font-bold' style='color:#8fd3f4;'>CHAPTER N</p>
  <p class='text-xl'>章のサブタイトル</p>
</div>
```

---

## 4. カラーパレット

| 用途 | 色 |
|---|---|
| バブル影（基本・水色） | `#8fd3f4` |
| バブル影（ピンク） | `#ff9fb2` |
| バブル影（黄色） | `#ffe066` |
| 本文テキスト | `#4a4a4a` |
| 補足テキスト | `#7a7a7a` |
| ターミナル緑 | `#4ade80` |
| 背景ミントグリーン | `#f0f7f4` |
| ドット色 | `#d1e8df` |

---

## 5. スライド構成の指針

| 指針 | 詳細 |
|---|---|
| **枚数** | 20〜25枚が目安（草稿200行前後）。図表・箇条書き・対比が多い回は **枚数を増やして** 1枚あたりの負荷を下げてよい |
| **1枚のrange幅** | 5〜20行。台本が多い箇所は広めに取ってよい |
| **contentの文量** | **短すぎないことを推奨**。見出し・箇条書き・表・絵文字ラベルと組み合わせて、**非同期閲覧でも論点が伝わる**量にする（詳細は §8） |
| **スクロールが出たら** | 収録UIでは縦スクロール可。可能なら枚数分割・グリッド圧縮も併用 |
| **台本との関係** | content は「**後から読める要約＋ビジュアル構造**」。定義・長引用・数式の正本は script |

---

## 5b. ビジュアル要素の方針（ボックス・アイコン・図表）

**目的**: スライドを**プレゼン資料として魅力的に**し、「読めば構造が掴める」ようにする。右ペイン画像（`imgDesc`）と役割分担する。

### ボックス（`bubble`）の役割

| クラス | 使いどころ |
|--------|------------|
| `bubble` | 定義・中立の説明・対比の片側 |
| `bubble-pink` | 違和感・転換・ツッコミ・実験結果の衝撃 |
| `bubble-yellow` | 章まとめ・道しるべ・前向きな結論 |
| 左ライン付き `bubble` | 引用・長文の要約（本文はプロンプターに全文） |

1枚あたり **バブルは2〜4個**が目安。情報量が増える場合は **スライド分割**か、表・グリッドで整理してからバブル数を抑える。

### アイコン（絵文字・記号）

- **HTML内の装飾**として使う（画像生成に依存しない）。パターンE（絵文字グリッド）と併用しやすい。
- **意味の対応**を揃えると読みやすい（例: 🔭 天文学、🎲 確率、⚛️ ミクロ、📦 箱・猫、💬 問い、⚙️ 仕様/How、📖 物語/Why）。
- 1スライド **絵文字ラベルは3〜6個程度**まで。羅列だけになったら表や2列グリッドに切り替える。

### 図表（HTMLで表現する範囲）

| 手段 | 向いている内容 |
|------|------------------|
| **2列・3列グリッド** | 対比（マクロ/ミクロ、BB弾/電子、ユーザー/運営、How/Why） |
| **`<table>`（簡易）** | 項目×状態の一覧、ステップの整理（縦幅に注意） |
| **縦フロー（グリッド `grid-column:1/-1`）** | 流れのまとめ行＋結論バブル（パターンC） |
| **ターミナル風 `bubble`** | エンジニアパロディ・「バグ報告」系のトーン統一 |

複雑な図解・イラストは **無理にHTMLで描かず**、`imgDesc` に英語プロンプトで渡す。テキスト側は「何を見せたいか」のラベルだけ残す。

### `content` と `imgDesc` の分担

- **content**: 論点・対比・用語の当てはめ。**図表的レイアウト（グリッド・表）・アイコン（絵文字）・短いキャッチ**を積極的に使い、リスナー・後追い閲覧向けに読みやすくする。
- **imgDesc**: **被写体・比喩の内容だけ**（英語）。画風は `src/generate_images.mjs` の `IMAGEN_BASE_PROMPT` に任せ、ここに `line art` / `editorial` など画風語を積まない（ブレの原因になる）。**Imagen 用画像では、こちらが明示しない限り文字を入れない**（ベースプロンプトで禁止。不自然な英語が混ざりやすい）。**「？」など記号だけ**は可。ポスター文言やラベルが必要なときだけ `imgDesc` に *short exact text to show: \"...\"* のように**英語で指示**する。
- **原稿（script）**: 定義・数式・長い引用の正本。スライドは**要約にとどめず**、非同期でも文脈が途切れない程度の文量を許容する（§8）。

### 閲覧用（長文・スクロール）について

収録UIの `#slide-content` は**縦スクロール可**を前提にしてよい。文字数は §8 の**推奨レンジ**に合わせ、読みづらさは **枚数分割・グリッド・表**で抑える。

---

## 6. manifest.json の基本構造

```json
{
    "source": "草稿N.md",
    "slides": [
        {
            "range": [開始行, 終了行],
            "title": "タイトル（絵文字OK）",
            "content": "HTMLコンテンツ（上記パターン参照）",
            "imgDesc": "英語で「何を描くか」だけ（例: 比喩のモチーフ）。画風は IMAGEN_BASE_PROMPT 側"
        }
    ]
}
```

---

## 7. 新エピソード作成の手順

```bash
# 1. エピソードフォルダを作成
mkdir -p episodes/02_不確定性原理

# 2. 草稿を書く
# → episodes/02_不確定性原理/草稿2.md

# 3. manifest.json を作成（このガイドのパターンを使用）
# → episodes/02_不確定性原理/manifest.json

# 4. ビルド
node src/build_slides.mjs episodes/02_不確定性原理

# 5. episodes_list.js に追記
# → { "path": "episodes/02_不確定性原理/", "title": "第2回：不確定性原理" }
```

---

## 8. 文字量・レイアウト（リスナー・非同期閲覧優先）

**方針**: 本プロジェクトは**ポッドキャスト収録用**であると同時に、**リスナーや後からページだけ開く人**向けの**読み物・ミニ資料**でもある。文字は**少なすぎない**方がよい。図表・グリッド・アイコンで**プレゼンとして魅力的**にする。

| 項目 | 推奨 | 備考 |
|---|---|---|
| **1枚あたりのテキスト量** | **おおむね 150〜400 文字相当**を目安（HTML タグ除きの目安。図表中心ならバブル＋短い段落で超えてもよい） | 音声なしで見たとき**論点が立つ**ことを優先。詰め込みすぎなら **枚数を増やす** |
| **画像あり** | 右ペイン画像＋左の **見出し・箇条書き・対比グリッド**を組み合わせる | 画像に依存せず、HTML 側だけでも筋がわかるようにする |
| **バブル数** | **1画面 3〜5 個程度**まで可。多い場合は表・2列グリッドに逃がす | §5b のバランスと併用 |
| **引用（長文）** | スライドは**短く要約＋出典風**、全文は script | 例外として「この1フレーズが看板」のときだけスライドに短い引用を載せる |
| **コード/数式** | スライドでは**1行〜数行の抜粋**に留め、続きは script | ターミナル風バブルなどでトーンを統一 |

### 読みづらくなったときの対処法
1. **スライドを分割する**: range を細かく分け、1枚のメッセージを1つにする。
2. **図表化する**: 箇条書き・2列対比・簡易 `<table>` で視線の流れを作る。
3. **script に長文を残す**: スライドは入口、詳説は台本エリア。
4. **圧縮が必要なとき**: モバイル一行量が厳しい場合のみ、パターンB（圧縮版）やフォント縮小を manifest 内で指定する。

---

## 9. AIへの依頼テンプレート

次回セッション開始時に以下を貼り付けてください：

```
「ゆる量子力学ラジオ」の新しいエピソードのmanifest.jsonを作成してください。

■ デザインガイド
/home/yokii/dev/knowledge/knowledge_base/00_Inbox/ゆる量子力学ラジオ/DESIGN_GUIDE.md
を参照し、特に「1. 基本思想」「5b. ビジュアル要素」「8. 文字量・レイアウト」に沿って、**リスナー・非同期閲覧でも伝わる** manifest を作ってください（図表・アイコン活用、文字は過度に削らない）。

■ 草稿ファイル
episodes/0N_XXX/草稿N.md

■ 参考（第1回の完成形）
episodes/01_量子力学の仕様書/manifest.json

■ 枚数
約20〜25枚

■ 特記事項
（あれば追記）
```

