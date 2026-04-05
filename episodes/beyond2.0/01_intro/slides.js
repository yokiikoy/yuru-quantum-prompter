/**
 * HYBRID BUILD: AI Design + Algorithmic Verbatim Transfer
 * Source: 草稿1.md
 */
var slidesData = [
    {
        "title": "Beyond 12000",
        "content": "<div class='text-center space-y-3'><p class='text-6xl font-extrabold' style='color: var(--accent-color);'>Beyond 12000</p><p class='text-2xl text-gray-600'>12,000語を<strong>再現可能</strong>に組み立て、<strong>オープン</strong>に保つ</p><p class='text-base text-gray-500'>参照実装 <strong>Beyond 1.0</strong> ／ 手順とデータを正本に寄せる実験</p><div style='display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-top:8px;'><span class='text-sm' style='background:#fff; padding:4px 12px; border-radius:999px; border:2px solid var(--accent-color);'>🎧 後からスライドだけでも概要が掴める構成</span><span class='text-sm' style='background:#fff; padding:4px 12px; border-radius:999px; border:2px solid #e5e7eb;'>📎 台本エリアに原稿全文</span></div></div>",
        "imgDesc": "Minimal open book made of connected nodes, white background, blue accents, flat vector",
        "script": "# Beyond 12000：英単語 12,000 語を「再現可能に」組み立て、オープンに保つ\n\n～手順とデータを中心にした語彙リストの実験（参照実装 Beyond 1.0）～\n\n## 第1章：導入 ― 単語帳の「中身」を外から追えるとどうなるか",
        "imageSrc": "images/slide-01.png"
    },
    {
        "title": "導入：追検証と Beyond 12000",
        "content": "<p class='text-base mb-2'>🛠️ <strong>再現性・ビルド文化</strong>にいると、語彙リストの<strong>作り方</strong>も追いたくなる —— この回はその延長のメモです。</p><div class='bubble bubble-accent mt-2'><p class='text-base' style='margin:0;'>根拠や手順が公開されていないと<strong>検証のしようがなく</strong>、もどかしい。本は意図がそれぞれある一方で、<strong>自分で追いたい人</strong>には別のニーズがあります。</p></div><p class='text-sm mt-2 text-center text-gray-600'><strong>Beyond 12000</strong>：オープンコーパス＋スクリプトで骨格を再現可能に。既存帳の置き換えより<strong>整理用メモ・実験記録</strong>に近い位置づけ。</p>",
        "imgDesc": "Engineer looking at a transparent flowchart inside a book, minimalist flat vector, blue gray",
        "script": "皆さん、初めまして。\n再現性やビルド手順に触れる文化にいると、英語の語彙リストも「どう作られているか」を追いたくなることがあります。この話は、その延長のメモに近いものです。\n\n本屋の英語コーナーは壮観ですし、どの本もそれぞれ編集の意図があると思います。一方で、一覧の根拠を自分で追いかけたい人にとっては、手順やデータが公開されていないと、検証のしようがなくてもどかしい、という側面もあります。\n\n今日お話しするのは、**「人手の目利きを正本の中心に置かない」**という方針のもと、オープンコーパスとスクリプトで 12,000 語の骨格を再現可能に保つ取り組み、**Beyond 12000** の、いまの形です。既存の単語帳を置き換える、というより、整理用のメモと実験の記録に近いものです。",
        "imageSrc": "images/slide-02.png"
    },
    {
        "title": "「Beyond」の三つの意味",
        "content": "<p class='text-base mb-2'>📌 名前の <strong>Beyond</strong> に込めた、だいたい三つの意味：</p><div class='space-y-2'><div class='bubble p-3'><p class='text-base' style='margin:0;'><span style='font-size:1.25em;'>1️⃣</span> <strong>NGSL（約3,000語）の続き</strong>として学べるリスト。足場に同じ手順で伸ばす。</p></div><div class='bubble p-3'><p class='text-base' style='margin:0;'><span style='font-size:1.25em;'>2️⃣</span> 「写し・人手中心」を<strong>コスト面からも追い越したい</strong>実験。オープンコーパス＋再現手順へ。</p></div><div class='bubble bubble-accent p-3'><p class='text-base' style='margin:0;'><span style='font-size:1.25em;'>3️⃣</span> <strong>パイプラインが通れば語数は省力で伸ばせる</strong>自負。届ける単位は運用・<strong>ARF</strong> などで <strong>12,000 前後</strong>が妥当、という見立て。</p></div></div>",
        "imgDesc": "Three labeled pillars NGSL pipeline scale, simple icons, editorial flat style",
        "script": "### 「Beyond」と 12,000 語という数字について\n\n名前の **Beyond** には、だいたい三つの意味を込めています。\n\n一つ目は、学習コアとしてよく参照される **NGSL のおおよそ 3,000 語の続きとして学べる**語彙リストにしたい、という位置づけです。NGSL を足場に置きつつ、その先を同じ手順で伸ばす、という意味でも **Beyond** と名付けています。\n\n二つ目は、**従来よくある「ブランドのリストを写す」「人手中心で調整する」やり方を、コストの面からも追い越したい**、という実験的な動機です。オープンコーパスと再現可能な手順に寄せる、という方向性の宣言でもあります。\n\n三つ目は、**パイプラインが通れば 12,000 語超も省力で伸ばせやすい**、という自負です。とはいえ、届ける単位は見せ方・運用・**ARF** から **12,000 語前後**が妥当だと見ていますが。",
        "imageSrc": "images/slide-03.png"
    },
    {
        "title": "抜粋・ライセンス・正本の置き場所",
        "content": "<p class='text-base'>📚 表紙の語数と<strong>中身の編集</strong>の関係は、外から見えにくい。抜粋で何が落ちたか追えないと「<strong>なぜこの語？</strong>」に答えづらい。</p><div class='bubble mt-2'><p class='text-base' style='margin:0;'>市販リストは<strong>ライセンスの壁</strong>。暗記アプリの自作カードは多いが、成果物を<strong>オープン資産</strong>として綺麗に共有しづらい。</p></div><div class='bubble bubble-accent mt-2'><p class='text-base text-center' style='margin:0;'>🎯 <strong>同じ手順なら同じリストへ</strong> — 正本を個人の目利きではなく<strong>手順とデータ</strong>へ寄せる試み。</p></div>",
        "imgDesc": "Book cover with large number and faded question marks behind pages, flat vector",
        "script": "## 第2章：なぜ「抜粋」とライセンスの話から始めるか\n\n表紙に大きな語数が書いてあっても、見出しとして並んでいる語と、編集方針で間引かれた語の関係は、外からは見えにくいことがあります。抜粋は当たり前の編集作業ですが、何が入り何が落ちたかが追えないと、「この語はなぜここ？」という問いに自分で答えにくい、という感覚です。\n\nまた、教材会社のリストや、よく名前の出る学習者向け語彙表は、著作権や利用条件で囲われていることが多いです。暗記アプリでカードを自作する人は多いですが、その成果物をオープンな資産としてきれいに共有するには、ライセンスの都合でハードルが出やすい、というのも事実です。\n\nそこで試しているのは、最初から「誰が実行しても同じ手順なら同じリストに近づく」パイプラインをコードとして公開し、リストの正本を個人の目利きや秘伝の表ではなく、手順とデータに寄せてみる、という形です。",
        "imageSrc": "images/slide-04.png"
    },
    {
        "title": "パイプライン概要（1/2）",
        "content": "<p class='text-xl font-bold text-blue-600 mb-2'>⚙️ Step 1 — OANC から抽出</p><div class='bubble p-3'><p class='text-base' style='margin:0;'>アメリカ国立コーパス <strong>OANC</strong> からレマと頻度を取得。「生の出現回数」だけだと<strong>文脈のバースト</strong>に引っ張られやすいので、指標 <strong>ARF（平均減少頻度）</strong> でコーパス全体に対してどれだけ<strong>広く</strong>出るかを見る発想。</p></div><p class='text-sm text-gray-500 mt-2'>💡 詳細数値・パラメータは次回、実装寄りに。</p>",
        "imgDesc": "Corpus cloud with frequency waves smoothing to even bars, flat diagram",
        "script": "## 第3章：Beyond 12000 がやっていること ― 4 段のパイプライン\n\nいまの参照実装では、ざっくり 4 つのステップに分けて処理しています。\n\n### Step 1：オープンコーパスからの抽出\n\nアメリカ国立コーパス OANC から、レマと頻度の情報を取り出します。  \nただし「生の出現回数」だけだと、文脈のバーストに引っ張られやすいので、指標として **ARF（平均減少頻度）** を使い、コーパス全体に対して相対的にどれだけ「広く」現れるかを見る、という発想です。",
        "imageSrc": "images/slide-05.png"
    },
    {
        "title": "パイプライン概要（2/2）",
        "content": "<p class='text-xl font-bold text-blue-600'>🔗 Step 2 — NGSL 固定＋マージ</p><p class='text-base mt-2'><strong>NGSL</strong> を先頭に固定し、Beyond 側とマージして 12,000 語。並び・末尾の持ち上げは説明可能なルール（形態素親和・Smooth lift まわり）。</p><div class='bubble bubble-accent mt-2'><p class='text-base' style='margin:0;'><strong>SVL / JACET 本文はリポジトリに同梱しない。</strong>クリーンルーム近似＋手元の<strong>許諾済みファイル</strong>との重なりで調整。</p></div><p class='text-sm text-gray-500 mt-2'><strong>WordNet</strong>：生活語を一気に足すエンジンには使わない。<strong>弱い補助タグ</strong>程度。自動除外トリガには<strong>しない</strong>（Step 3 の補助・監査の目印）。</p>",
        "imgDesc": "Two pipelines merging without touching a locked third box labeled copyright",
        "script": "### Step 2：NGSL を足場にした 12,000 語の確定\n\n学習コアとして公開されている NGSL を先頭側に固定しつつ、Beyond 側の語とマージして 12,000 語にします。  \n並び順や「末尾の持ち上げ」には、説明可能なルール（例：形態素親和、いわゆる Smooth lift まわり）を入れています。\n\nここで重要なのが、市販の SVL や JACET のデータそのものはリポジトリに入れないという方針です。代わりに、クリーンルームのヒューリスティックで「学習者向けリストに近い振る舞い」を近似し、手元の許諾済みファイルとは重なりを測って調整する、という二段構えにしています。\n\n**WordNet** は、生活語を一気に足すエンジンとしては使っていません。マージの段階で、見出し語に **弱い補助タグ**（専門度の目安）を付ける程度に留め、**自動で除外するトリガにはしていません**。Step 3 で LLM が読むときの補助情報と、人が監査するときの目印、という位置づけです。",
        "imageSrc": "images/slide-06.png"
    },
    {
        "title": "Step 3 と 4",
        "content": "<div class='grid grid-cols-1 gap-3 text-base'><div class='bubble p-3'><p style='margin:0 0 6px; font-weight:bold; color:#2563eb;'>🤖 Step 3</p><p style='margin:0;'>LLM にバッチで読ませ、指摘を集める → <strong>トリアージ</strong>。<span class='text-blue-600 font-semibold'>方針 A</span>：除外ファイルへ載せるのは<strong>「除外推奨」だけ</strong>。保留・維持だけでは機械的には除外に書かない。</p></div><div class='bubble p-3'><p style='margin:0 0 6px; font-weight:bold; color:#2563eb;'>🔧 Step 4</p><p style='margin:0;'><strong>NGSL 救済</strong>：誤って除外に載った NGSL を取り除き、マージ実効と整合。</p></div></div>",
        "imgDesc": "LLM chip feeding triage inbox into filter funnel, flat schematic",
        "script": "### Step 3：LLM によるバッチレビューとトリアージ\n\nクラウド上の大規模言語モデルに、バッチ単位でリストを読ませ、指摘を集めます。  \nそのあとトリアージで整理し、除外リストへ載せるのは「除外推奨」に限る、という運用ルール、いわゆる**方針 A** にしています。レビュー保留や維持だけでは、機械的には除外ファイルに書かない、という割り切りです。\n\n### Step 4：NGSL 救済\n\n除外リストの表記と、マージの実効を揃えるため、NGSL 語が誤って除外ファイルに載っていたら取り除く、という整合用のステップです。",
        "imageSrc": "images/slide-07.png"
    },
    {
        "title": "完全自動ではない、と言い切る",
        "content": "<p class='text-2xl font-semibold'>👤 人を一切使わないわけではない</p><p class='text-base mt-2'>プロンプト・方針・どこまで機械に任せるかは<strong>設計判断</strong>が入る。完全無人で品質保証とも言わない。</p><div class='bubble bubble-accent mt-2'><p class='text-base' style='margin:0;'>代わりに <strong>監査用 HTML</strong>・<strong>TSV 断面</strong>・手元 SVL/JACET との<strong>任意照合列</strong>で、「どこを人が見ればよいか」を絞る。</p></div><p class='text-sm text-gray-600 mt-2'>再現性・オープンさを優先し、品質は<strong>コード・ログ・スポットチェック</strong>の組み合わせ、というスタンス。</p>",
        "imgDesc": "Human magnifying glass over a narrow column of a large spreadsheet",
        "script": "## 第4章：品質と運用 ― 完全自動ではないことの正直さ\n\nこのプロジェクトは、「人を一切使わない」わけではありません。  \nプロンプトや方針、最終的にどこまで機械に任せるかは、設計者の判断が入ります。\n\nまた、完全無人で品質を保証するとも言いません。  \nその代わり、監査用の単一 HTML や TSV 断面、手元の SVL・JACET テキストとの任意の突き合わせ列などで、「どこを人が見ればいいか」を絞れるようにしています。\n\n再現性とオープンさを優先しつつ、品質はコード・ログ・人のスポットチェックの組み合わせで見ている、というスタンスです。",
        "imageSrc": "images/slide-08.png"
    },
    {
        "title": "何がオープンで、何がそうでないか",
        "content": "<div class='bubble'><p class='text-base' style='margin:0;'>🔓 <strong>オープン</strong>：手順・スクリプト・利用条件の許す範囲のデータ（OANC / NGSL 等）に基づく生成物。</p></div><div style='display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px;'><div class='bubble p-2'><p class='text-sm font-bold' style='margin:0; color:#6b7280;'>同梱しない</p><p class='text-base' style='margin:6px 0 0;'>他人の教材<strong>全文</strong></p></div><div class='bubble bubble-accent p-2'><p class='text-sm font-bold' style='margin:0;'>照合の形</p><p class='text-base' style='margin:6px 0 0;'>手元ライセンスの範囲で教材を置き、<strong>パスを渡して各自照合</strong></p></div></div><p class='text-sm text-center text-gray-600 mt-2'>データの主権を学習者・開発者の手に近づける —— 「なぜこの語がここか」を <strong>git とドキュメント</strong>で追えるようにする。</p>",
        "imgDesc": "Open padlock on code repo, closed padlock on third-party textbook stack",
        "script": "## 第5章：結び ― 何が「オープン」で、何がそうでないか\n\nオープンにしているのは、手順とスクリプト、OANC や NGSL など利用条件の許す範囲のデータに基づく生成物です。  \n他人の教材語彙表の全文を同梱することはしません。必要な人は、手元のライセンスの範囲で教材を置き、パスを渡して照合する、という形です。\n\nデータの主権を、学習者と開発者の手の中に少し近づける。  \n「なぜこの語がここにあるのか」を、git とドキュメントで追えるようにする。  \nそれが、いまの **Beyond 12000** の到達点、参照実装としての **Beyond 1.0** の意味だと考えています。",
        "imageSrc": "images/slide-09.png"
    },
    {
        "title": "次回へ",
        "content": "<div class='text-center space-y-4'><p class='text-2xl'>🙏 本日はありがとうございました。</p><div class='bubble bubble-accent inline-block'><p class='text-base font-bold' style='margin:0;'>次回：Step 1・2 の<strong>パラメータ</strong>と<strong>監査 GUI</strong> 寄り</p></div><p class='text-sm text-gray-500'>実装・画面の見方を中心に深掘りする予定です。</p></div>",
        "imgDesc": "Simple next arrow on timeline, soft blue, minimalist",
        "script": "本日はお付き合いありがとうございました。次回は、Step 1 や Step 2 のパラメータ、監査 GUI の見方など、もう少し実装寄りにお話しできると思います。  \nそれでは、また。",
        "imageSrc": "images/slide-10.png"
    }
];