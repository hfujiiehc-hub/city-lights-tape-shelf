# City Lights Tape Shelf

自作曲MP3を共有するための静的Webサイトです。

## 再開するとき

会話履歴が途切れた場合は、まず `HANDOFF.md` を読んでください。

新しいCodexには以下を伝えます。

```text
C:\Users\fujii\Documents\Codex\2026-06-13\web-url-web-mp3-html-css\outputs
にある自作曲公開Webサイトの続きをしてください。
まず HANDOFF.md、README.md、data/tracks.csv、tools/update-catalog.mjs を読んで、現状を把握してください。
```

## 使うファイル

- `index.html`: ページ本体
- `styles.css`: 見た目とスマホ対応
- `app.js`: 表示と再生処理
- `data/tracks.csv`: 曲データの編集用リスト。Excelで開けます
- `data/catalog.js`: Webページが読み込む公開用データ。CSVから作ります
- `tools/update-catalog.ps1`: CSVを `catalog.js` に反映する更新スクリプト
- `audio/`: MP3ファイル置き場
- `images/`: サムネイル画像置き場
- `HANDOFF.md`: 引き継ぎメモ

## 曲を追加する手順

1. `audio/` にMP3を置く
2. `images/` にサムネイル画像を置く
3. `data/tracks.csv` に1行追加する
4. `tools/update-catalog.ps1` を実行して `data/catalog.js` を更新する

`data/tracks.csv` の主な列:

- `id`: 元の順番に戻すための番号
- `publish`: Webに表示する曲は `1`、非表示にする曲は空欄
- `title`: 曲名
- `description`: カードに表示する説明
- `project`: Projectタブの分類
- `genre`: カードに表示する細かいジャンル
- `genreGroup`: Genreタブの分類
- `style`: 洋楽風 / 邦楽風
- `vocal`: 男性 / 女性 / 男女
- `mood`: 雰囲気
- `audio`: MP3へのパス
- `image`: サムネイル画像へのパス

## フォルダー分類を変える場所

`data/tracks.csv` の各曲にある以下の値を変えると、表示されるフォルダーが変わります。

- `project`: Projectタブの分類
- `genreGroup`: Genreタブの分類
- `vocal`: Vocalタブの分類

フォルダーは `project`, `genreGroup`, `vocal` の値から自動生成されます。

## サムネイル

サムネイル画像ファイルそのものは `images/` に置きます。`data/tracks.csv` の `image` 列には、その画像へのパスだけを書きます。

例:

例: `./images/new-song.jpg`

曲ごとのサムネイルが未指定の場合は `images/thumb-default.svg` が表示されます。

フォルダー用サムネイルは `images/folder-*.svg` を仮画像として入れています。後から同じファイル名で画像を差し替えると反映されます。

## データ管理について

曲リストは `data/tracks.csv` 一枚で編集し、公開用の `data/catalog.js` に変換します。

CSVはExcelで開けるので、曲が増えたときも表として管理できます。

`publish` 列を使うと、CSVに曲情報を残したまま、Webに出す曲だけを選べます。

- `1`: Webに表示する
- 空欄: Webに表示しない

元データとして残したい曲は削除せず、`publish` を空欄にしてください。

GitHub Pagesで公開する場合も、このままで動きます。

## CSVをWeb用データに反映する

PowerShellで以下を実行します。

```powershell
powershell -ExecutionPolicy Bypass -File outputs\tools\update-catalog.ps1
```

実行後、ブラウザを更新すると変更が反映されます。

## GitHub Pages公開の考え方

GitHubで公開するときは、この `outputs` フォルダの中身をリポジトリに置きます。

おすすめ:

- リポジトリ直下に `index.html`, `styles.css`, `app.js`, `audio/`, `images/` を置く
- GitHub Pagesの公開元を `main` ブランチの root にする
- MP3ファイル名は英数字、ハイフン、アンダースコア中心にすると安全
- GitHubへ置く `audio/` には、公開対象のMP3だけを入れるのが安全

MP3は容量が大きくなりやすいので、1ファイル100MB未満、リポジトリ全体も大きくしすぎないようにします。
