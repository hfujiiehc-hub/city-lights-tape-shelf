# HANDOFF - 自作曲公開Webサイト

このメモは、Codexの会話履歴が途切れても作業を再開できるようにするための引き継ぎ資料です。

## 再開時にCodexへ伝える文

```text
C:\Users\fujii\Documents\Codex\2026-06-13\web-url-web-mp3-html-css\outputs
にある自作曲公開Webサイトの続きをしてください。
まず HANDOFF.md、README.md、data/tracks.csv、tools/update-catalog.mjs を読んで、現状を把握してください。
既存の曲情報とファイルは壊さず、変更前にリンク切れを確認してください。
```

## 目的

自作曲・AIセッション曲のMP3を、GitHub Pagesなどで限定共有できる静的Webサイトとして整理しています。

- 視聴者はWebページ上で曲を選び、下部プレイヤーで再生する
- 管理作業はPC上の `tracks.csv` を中心に行う
- GitHub側には視聴者向けUIだけを置く
- `publish` 列で公開する曲を選ぶ
- GitHubに置く `audio/` には、公開対象のMP3だけを入れるのが安全

## 作業場所

```text
C:\Users\fujii\Documents\Codex\2026-06-13\web-url-web-mp3-html-css\outputs
```

ブラウザで開くファイル:

```text
C:\Users\fujii\Documents\Codex\2026-06-13\web-url-web-mp3-html-css\outputs\index.html
```

## 主要ファイル

- `index.html`: Webページ本体
- `styles.css`: 画面デザイン、スマホ対応
- `app.js`: 表示、フォルダー切り替え、再生処理
- `data/tracks.csv`: 曲台帳。Excelで編集する主ファイル
- `data/catalog.js`: Webページが読むデータ。`tracks.csv` から自動生成
- `tools/update-catalog.ps1`: CSVをWeb用データへ反映する入口
- `tools/update-catalog.mjs`: 変換本体
- `tools/normalize-tracks-csv.mjs`: CSVをExcel向けUTF-8 BOM付きに整え、列を補正する
- `audio/`: MP3置き場。Project別のサブフォルダーに整理済み
- `images/`: サムネイル置き場。用途別のサブフォルダーに整理済み
- `README.md`: 基本手順
- `HANDOFF.md`: この引き継ぎメモ

## 現在の機能

- おすすめ / Project / Genre / Vocal タブでフォルダー表示
- おすすめには `[Sweet]` と `[Bitter]` のサブフォルダーがある
- Projectフォルダーを指定順で表示
- `[プロデュース作品]` を開いた時だけ、さらにアーティスト別フォルダーを表示
- フォルダーを開くと、その中の公開曲だけ表示
- 曲カードをクリックすると下部のHTML5 audio playerで再生
- `publish=1` の曲だけWebに表示
- `publish` 空欄の曲は台帳に残るがWebには出ない
- Project用の仮サムネイルPNGを反映済み
- スマホでも縦に見やすいレスポンシブデザイン

## 現在の曲数

`data/tracks.csv` には40行の曲情報があります。

Project別の台帳上の内訳:

- `[エールソング]`: 8曲
- `[愛・祈り・癒し]`: 7曲
- `[プロデュース作品]`: 10曲
- `[洋楽 / UK & Western]`: 7曲
- `[インストゥルメンタル]`: 2曲
- `[Others]`: 6曲

現在 `publish=1` の公開対象は30曲です。

## Project表示順

UIではProjectフォルダーを以下の順番で表示します。

1. `[エールソング]`
2. `[愛・祈り・癒し]`
3. `[プロデュース作品]`
4. `[洋楽 / UK & Western]`
5. `[インストゥルメンタル]`
6. `[Others]`

この順序は `app.js` の `folderOrder.project` で管理しています。

## プロデュース作品のサブフォルダー

Projectタブで `[プロデュース作品]` を開いた時だけ、曲一覧の前に以下のアーティスト別フォルダーを表示します。

- `多摩蘭坂7`
- `Ω5`
- `The Phase`

この分類は `tracks.csv` の `グループ` 列を使います。

- `多摩蘭坂7` -> `多摩蘭坂7`
- `Ω5` -> `Ω5`
- `The Phase` と `The Phase&Ω5` -> `The Phase`

表示ロジックは `app.js` の `producerFolders` にあります。

アーティストフォルダー用画像:

- `多摩蘭坂7`: `./images/produce/TRS7.png`
- `Ω5`: `./images/produce/omega5.png`
- `The Phase`: `./images/produce/the-phase.png`

各アーティストの曲別サムネイルは、それぞれ以下へ置きます。

- `images/produce/TRS7/`
- `images/produce/omega5/`
- `images/produce/the-phase/`

## おすすめ

おすすめタブでは、`tracks.csv` の以下の列を見ます。

- `Sweet`: `1` の曲を `[Sweet]` に表示
- `Bitter`: `1` の曲を `[Bitter]` に表示

説明文と画像は `tools/update-catalog.mjs` の `folderDescriptions` と `folderImages` で管理しています。

## Project説明文

Projectカードの説明文は `tools/update-catalog.mjs` の `folderDescriptions` にあります。

短い説明文:

- `[エールソング]`: 旅立ち、変化、迷いの中で、少し前を向くための曲たち。
- `[愛・祈り・癒し]`: 愛、喪失、祈り、記憶の余韻を静かに描いた曲たち。
- `[プロデュース作品]`: 架空のバンドやユニットを想定して制作したポップ／ロック作品。
- `[洋楽 / UK & Western]`: 80年代UKロックやニューウェーブの質感を意識した洋楽系作品。
- `[インストゥルメンタル]`: ギターとハーモニーで、朝や昼の風景を描いた器楽曲。
- `[Others]`: ゲーム、ホラー、映画的楽曲、実験作など、分類しにくい小品集。

## 画像フォルダー

画像は用途別に以下のサブフォルダーへ整理済みです。

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

曲サムネイルを追加するときは、`tracks.csv` の `image` 欄に `./images/aile-song/example.png` のように書きます。

## Projectサムネイル

Project用の仮サムネイルPNGを作成済みです。

現在使っているファイル:

- `[エールソング]`: `./images/project/project-ailesong.png`
- `[愛・祈り・癒し]`: `./images/project/project-healing.png`
- `[プロデュース作品]`: `./images/project/project-produce.png`
- `[洋楽 / UK & Western]`: `./images/project/project-west.png`
- `[インストゥルメンタル]`: `./images/project/project-instrumental.png`
- `[Others]`: `./images/project/project-othes.png`
- `[Sweet]`: `./images/osusume/osusume-Sweet.png`
- `[Bitter]`: `./images/osusume/osusume-Bitter.png`

対応表は `tools/update-catalog.mjs` の `folderImages` にあります。

## tracks.csv の列

`data/tracks.csv` はExcelで開けるよう、UTF-8 BOM付きCSVです。

現在の主な列:

- `id`
- `publish`
- `Sweet`
- `Bitter`
- `title`
- `description`
- `project`
- `genre`
- `genreGroup`
- `style`
- `vocal`
- `グループ`
- `mood`
- `audio`
- `image`
- `imageFolder`
- `note`

## 音源ファイル

MP3は `audio/` の直下ではなく、Project別のサブフォルダーに整理済みです。

- `[エールソング]`: `audio/aile-song/`
- `[愛・祈り・癒し]`: `audio/healing/`
- `[プロデュース作品]`: `audio/produce/`
- `[洋楽 / UK & Western]`: `audio/west/`
- `[インストゥルメンタル]`: `audio/instrumental/`
- `[Others]`: `audio/others/`

`tracks.csv` の `audio` 欄も、上記のサブフォルダーを含む形に更新済みです。

現在、`tracks.csv` 内の `audio` 欄は非公開曲も含めて全件存在確認済みです。

## データ更新手順

`tracks.csv` を編集した後は、以下を実行して `data/catalog.js` を更新します。

```powershell
powershell -ExecutionPolicy Bypass -File outputs\tools\update-catalog.ps1
```

Excelで `tracks.csv` を開いたままだと上書きできずエラーになるため、必ずExcelを閉じてから実行します。

## リンク切れ確認

Codexは変更後、最低限以下を確認してください。

1. `tracks.csv` の `audio` 欄に書いたファイルが存在するか
2. `image` 欄に書いたファイルが存在するか
3. `catalog.js` と `app.js` の構文チェック
4. ブラウザ更新後に、フォルダー表示と再生ができるか

## 次にやること

1. 曲ごとのサムネイルを用意する
2. `tracks.csv` の `image` 列へ対応させる
3. PC上でProject、曲カード、再生を確認する
4. 公開対象曲を `publish` で絞る
5. GitHub公開用に `audio/` を公開対象だけへ整理する
6. GitHub Pagesへ移行する
7. 公開URLでスマホ表示と再生を確認する

## 重要な注意

このプロジェクトの成果物は会話ではなくPC上のファイルとして保存されています。

再契約や新しいチャットで会話文脈が失われても、以下が残っていれば再開できます。

- `outputs/`
- `outputs/HANDOFF.md`
- `outputs/README.md`
- `outputs/data/tracks.csv`
- `outputs/audio/`
- `outputs/images/`
