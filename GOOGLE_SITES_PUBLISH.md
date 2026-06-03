# Google Sites で公開する場合

このフォルダの `index.html` は、通常の静的HTMLサイトとして作っています。
Google Sites は「HTMLファイル一式をアップロードして公開する」タイプのホスティングではないため、
公開方法は次のどちらかが現実的です。

## 方法A: Google Sites 上で内容を移植する

1. Google Sites で新しいサイトを作成する。
2. この `index.html` の構成に沿って、以下のページブロックを作る。
   - Hero: 氏名、所属、研究概要
   - Profile: Research Statement、所属、学位
   - Research: 研究テーマ
   - Projects: 研究プロジェクト
   - Publications: 主要論文
   - Career: 経歴・学歴
   - Links: 公式リンク
3. `assets/research-hero.png` をヘッダー画像としてアップロードする。
4. 右上の「公開」から公開URLを設定する。

Google Sites の操作で公開したい場合は、この方法が一番安定します。

## 方法B: HTMLサイトを別サービスに公開して、Google Sites に埋め込む

1. GitHub Pages、Netlify、Vercel などにこのフォルダを公開する。
2. 公開URLを Google Sites の「埋め込む」から配置する。
3. Google Sites 側には、プロフィール概要と外部サイトへの導線を置く。

この方法はデザイン再現度が高いです。

## Google検索に出す場合

公開後すぐに検索結果へ出るとは限りません。
Google Search Console で所有権を確認し、URL検査からインデックス登録をリクエストすると発見されやすくなります。
ただし「検索トップ表示」は保証できません。
