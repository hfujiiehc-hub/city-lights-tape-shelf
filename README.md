# City Lights Tape Shelf

自作曲・AIセッション曲を整理して聴いてもらうための静的Webサイトです。

## 再開するとき

新しいCodexチャットでは、以下を伝えてください。

```text
C:\Users\fujii\Documents\Codex\2026-06-13\web-url-web-mp3-html-css\outputs
にある自作曲公開Webサイトの続きをしてください。
まず HANDOFF.md、README.md、data/tracks.csv、tools/update-catalog.mjs を読んで、現状を把握してください。
```

## 主なファイル

- `index.html`: Webページ本体
- `styles.css`: 見た目とスマホ対応
- `app.js`: 表示、フォルダー切り替え、再生処理
- `data/tracks.csv`: 曲台帳。Excelで編集する主ファイル
- `data/catalog.js`: Webページが読むデータ。`tracks.csv` から生成
- `tools/update-catalog.ps1`: CSVをWeb用データに反映する入口
- `tools/update-catalog.mjs`: 変換処理の本体
- `audio/`: MP3置き場。Project別のサブフォルダーに分ける
- `images/`: サムネイル画像置き場。用途別のサブフォルダーに分ける
- `HANDOFF.md`: 引き継ぎメモ

## 曲を追加する手順

1. MP3を `audio/` のProject別サブフォルダーに置く
2. サムネイルがあれば `images/` のProject別サブフォルダーに置く
3. `data/tracks.csv` に1行追加、または既存行を編集する
4. `tools/update-catalog.ps1` を実行して `data/catalog.js` を更新する
5. ブラウザを更新して、曲カードと再生を確認する

## 音源フォルダー

MP3はProject別に以下のサブフォルダーへ置きます。

- `[エールソング]`: `audio/aile-song/`
- `[愛・祈り・癒し]`: `audio/healing/`
- `[プロデュース作品]`: `audio/produce/`
- `[洋楽 / UK & Western]`: `audio/west/`
- `[インストゥルメンタル]`: `audio/instrumental/`
- `[Others]`: `audio/others/`

`data/tracks.csv` の `audio` 欄には、例として `./audio/aile-song/example.mp3` のように書きます。

## tracks.csv の主な列

- `id`: 元の順番に戻すための番号
- `publish`: Webに表示する曲は `1`、非表示は空欄
- `Sweet`: おすすめSweetに表示する曲は `1`
- `Bitter`: おすすめBitterに表示する曲は `1`
- `title`: 曲名
- `description`: カードに表示する説明
- `project`: Projectタブの分類
- `genre`: カードに表示する細かいジャンル
- `genreGroup`: Genreタブの分類
- `style`: 邦楽 / 洋楽
- `vocal`: 男性 / 女性 / 混声など
- `グループ`: PHASE、多摩蘭坂7、Ω5などの想定アーティストやユニット名
- `mood`: 雰囲気
- `audio`: MP3へのパス
- `image`: 曲サムネイルへのパス
- `imageFolder`: 画像管理用の分類メモ
- `note`: 公開しない管理メモ

## 画像フォルダー

画像は以下のように用途別に分けています。

- `images/project/`: Projectカード用画像
- `images/osusume/`: おすすめフォルダー用画像
- `images/folders/`: Genre / Vocal などの仮フォルダー画像
- `images/banner/`: 今後トップ画面などに使うバナー画像
- `images/aile-song/`: `[エールソング]` の曲サムネイル
- `images/healing/`: `[愛・祈り・癒し]` の曲サムネイル
- `images/produce/`: `[プロデュース作品]` の曲サムネイル
- `images/west/`: `[洋楽 / UK & Western]` の曲サムネイル
- `images/instrumental/`: `[インストゥルメンタル]` の曲サムネイル
- `images/others/`: `[Others]` の曲サムネイル

`data/tracks.csv` の `image` 欄には、例として `./images/aile-song/example.png` のように書きます。

## データ更新

`tracks.csv` を編集した後は、PowerShellで以下を実行します。

```powershell
powershell -ExecutionPolicy Bypass -File outputs\tools\update-catalog.ps1
```

実行後、ブラウザを更新すると変更が反映されます。

## GitHub Pages公開の考え方

GitHub公開時は、`outputs` の中身をリポジトリへ置きます。

- `index.html`, `styles.css`, `app.js`, `data/`, `images/`, `audio/` が必要
- `data/catalog.js` は更新済みにしておく
- GitHubに置く `audio/` には、公開対象のMP3だけを入れるのが安全
- MP3は容量が大きくなりやすいので、リポジトリ全体を大きくしすぎない

## 現在の状態

- 曲台帳は40行
- `publish=1` の公開対象は30曲
- 音源リンク切れは0件
- MP3はProject別の `audio/` サブフォルダーへ整理済み
