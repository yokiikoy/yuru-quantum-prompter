# ゆる量子力学ラジオ — スライドデザインガイド

> このドキュメントは、第1回で確立した「ゆるふわ」トンマナを次回以降も再現するためのリファレンスです。
> AIに渡す際は冒頭に「このガイドに従ってmanifest.jsonを作って」と伝えてください。

---

## 1. デザインの基本思想

| 項目 | 内容 |
|---|---|
| **対象** | 聴衆が見るスライド（話者向けカンペではない） |
| **役割** | 番組の「視覚的アンカー」。詳細は下の台本エリアに任せる |
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
| **枚数** | 20〜25枚が目安（草稿200行前後の場合） |
| **1枚のrange幅** | 5〜20行。台本が多い箇所は広めに取ってよい |
| **contentの文量** | 試作品程度の文章量（2〜3段落＋バブル）が適切 |
| **スクロールが出たら** | padding縮小・font-size縮小・グリッド圧縮で対応 |
| **台本との関係** | contentは「聴衆向けビジュアルサマリー」。原文はscript（草稿から自動抽出）に任せる |

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
            "imgDesc": "英語の画像生成プロンプト。kawaii / pastel / cute styleを末尾に付ける"
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
python3 src/build_slides.py episodes/02_不確定性原理

# 5. episodes_list.js に追記
# → { "path": "episodes/02_不確定性原理/", "title": "第2回：不確定性原理" }
```

---

## 8. AIへの依頼テンプレート

次回セッション開始時に以下を貼り付けてください：

```
「ゆる量子力学ラジオ」の新しいエピソードのmanifest.jsonを作成してください。

■ デザインガイド
/home/yokii/dev/knowledge/ナレッジベース/00_Inbox/ゆる量子力学ラジオ/DESIGN_GUIDE.md
を参照してください。

■ 草稿ファイル
episodes/0N_XXX/草稿N.md

■ 参考（第1回の完成形）
episodes/01_量子力学の仕様書/manifest.json

■ 枚数
約20〜25枚

■ 特記事項
（あれば追記）
```
