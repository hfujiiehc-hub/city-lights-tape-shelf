# HANDOFF - 自作曲公開Webサイト

このメモは、Codexの会話履歴が途切れても作業を再開できるようにするための引き継ぎ資料です。

## 再開時にCodexへ伝える文

以下をそのまま新しいチャットで伝えてください。

```text
C:\Users\fujii\Documents\Codex\2026-06-13\web-url-web-mp3-html-css\outputs
にある自作曲公開Webサイトの続きをしてください。
まず HANDOFF.md、README.md、data/tracks.csv、tools/update-catalog.mjs を読んで、現状を把握してください。
既存の曲情報とファイルは壊さず、変更前にリンク切れを確認してください。
```

## 現在の目的

自作曲MP3を一般共有できる静的Webサイトを作成中。

- 視聴者はGitHub Pages上のWebページで曲を聴く
- 管理作業はPC上で行う
- GitHubは公開先として使う
- PC上で動作確認してからGitHubへ反映する

重要な方針:

- GitHub上では管理画面や書き込み機能は作らない
- PC上の `tracks.csv` を曲台帳として使う
- `publish` 列でWebに表示する曲を選ぶ
- GitHubへ置く `audio/` には公開対象のMP3だけを入れるのが安全

## 作業場所

ルート:

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
- `app.js`: 表示・フォルダー切り替え・再生処理
- `data/tracks.csv`: 曲台帳。Excelで編集する主ファイル
- `data/catalog.js`: Webページが読むデータ。`tracks.csv` から自動生成
- `tools/update-catalog.ps1`: CSVをWeb用データへ反映する入口
- `tools/update-catalog.mjs`: 変換本体
- `tools/normalize-tracks-csv.mjs`: CSVをExcel向けUTF-8 BOM付きに整え、列を補正する
- `audio/`: MP3置き場
- `images/`: サムネイル置き場
- `README.md`: 基本手順
- `HANDOFF.md`: この引き継ぎメモ

## 現在の機能

- Project / Genre / Vocal タブでフォルダー表示
- Projectフォルダーを指定順で表示
- フォルダーを開くと、その中の公開曲だけ表示
- 曲カードをクリックすると下部のHTML5 audio playerで再生
- `publish=1` の曲だけWebに表示
- `publish` 空欄の曲は台帳に残るがWebには出ない
- Project用の仮サムネイルPNGを反映済み
- スマホでも縦に見やすいレスポンシブデザイン

## 現在の曲数

`data/tracks.csv` には39行の曲情報があります。

Project別の台帳上の内訳:

- `[エールソング]`: 8曲
- `[愛・祈・癒]`: 7曲
- `[プロデュース]`: 9曲
- `[West]`: 7曲
- `[インスト]`: 2曲
- `[Othes]`: 6曲

現在 `publish=1` の公開対象は28曲です。

## Project表示順

UIではProjectフォルダーを以下の順番で表示します。

1. `[エールソング]`
2. `[愛・祈・癒]`
3. `[プロデュース]`
4. `[West]`
5. `[インスト]`
6. `[Othes]`

この順序は `app.js` の `folderOrder.project` で管理しています。

## Project説明文

Projectカードには説明文を表示します。

説明文は `tools/update-catalog.mjs` の `folderDescriptions` にあります。

現在の説明:

- `[エールソング]`: 背中を押す言葉や、前へ進む気持ちを軸にした楽曲。
- `[愛・祈・癒]`: 愛、祈り、喪失、回復の余韻を静かに描く楽曲。
- `[プロデュース]`: 架空のバンドやグループを想定して制作した、キャラクター性のある楽曲。
- `[West]`: UKロック、ニューウェーブ、洋楽ポップの質感を意識した楽曲。
- `[インスト]`: ギターやアンサンブルの響きを中心にしたインストゥルメンタル系の楽曲。
- `[Othes]`: 実験的な曲、ホラー、ゲーム音楽的な小品など、既存枠に収まりにくい楽曲。

## 表記ゆれ吸収

CSV内に古い表記があっても、Web用データ生成時に一部吸収します。

`tools/update-catalog.mjs` の `normalizeProject()` で処理しています。

- `[？]` -> `[Othes]`
- `[癒し]` -> `[愛・祈・癒]`
- `[洋楽]` -> `[West]`
- `[Other]` -> `[Othes]`
- `[インスト曲]` -> `[インスト]`

## Projectサムネイル

Project用の仮サムネイルPNGを作成済みです。

保存場所:

```text
outputs\images
```

現在使っているファイル:

- `[エールソング]`: `./images/project-ailesong.png`
- `[愛・祈・癒]`: `./images/project-healing.png`
- `[プロデュース]`: `./images/project-produce.png`
- `[West]`: `./images/project-west.png`
- `[インスト]`: `./images/project-instrumental.png`
- `[Othes]`: `./images/project-othes.png`

対応表は `tools/update-catalog.mjs` の `folderImages` にあります。

後で差し替える場合:

- 同じファイル名で `outputs/images/` に上書きする
- これが最も安全
- ファイル名を変える場合は `folderImages` も変更し、`update-catalog.ps1` を実行する

## 曲サムネイル

曲ごとのサムネイルは未整備です。

今後の方針:

- 画像ファイルは `outputs/images/` に置く
- ファイル名は英数字・ハイフン中心にする
- 例: `track-001-mada-minu-sekai.png`
- `data/tracks.csv` の `image` 列に `./images/track-001-mada-minu-sekai.png` のように書く
- 空欄なら共通仮画像 `thumb-default.svg` が表示される

文字入りサムネイルは避ける。曲名はHTML側で表示されるため、画像は抽象イメージのみが安全。

## tracks.csv の列

`data/tracks.csv` はExcelで開けるよう、UTF-8 BOM付きCSVです。

主な列:

- `id`: 管理番号。元の順番へ戻すためにも使う
- `publish`: `1` ならWeb表示、空欄なら非表示
- `title`: 曲名
- `description`: カードに表示する説明
- `project`: Project分類
- `genre`: カードに表示する細かいジャンル
- `genreGroup`: Genreタブの分類
- `style`: 邦楽 / 洋楽
- `vocal`: 男性 / 女性 / 混声 / 電子音など
- `mood`: 雰囲気
- `audio`: MP3へのパス
- `image`: 曲サムネイルへのパス

Excelで編集するとき:

- 行全体を崩さない
- ソートは行全体を選ぶ
- `publish` は `1` または空欄
- ファイルを保存して閉じてからCodexに更新を依頼する

## 音源ファイル

MP3はここに置く:

```text
outputs\audio
```

現在、`tracks.csv` 内の `audio` 欄は非公開曲も含めて全件存在確認済み。

ただし、GitHub公開時は注意:

- UIに表示しなくても、GitHubに置いたMP3はURLを知ればアクセス可能
- 本当に公開しない曲は、GitHub側の `audio/` には入れない方が安全
- PC上の `audio/` は候補曲置き場として多めに入れてよい

## データ更新手順

`tracks.csv` を編集した後は、以下を実行して `data/catalog.js` を更新します。

```powershell
powershell -ExecutionPolicy Bypass -File outputs\tools\update-catalog.ps1
```

その後、ブラウザを更新します。

## CSV整形手順

`tracks.csv` の文字化け対策や列補正が必要な場合:

```powershell
node outputs\tools\normalize-tracks-csv.mjs
powershell -ExecutionPolicy Bypass -File outputs\tools\update-catalog.ps1
```

注意:

- Excelで `tracks.csv` を開いたままだと上書きできずエラーになる
- 必ずExcelを閉じてから実行する

## リンク切れ確認

Codexは変更後、最低限以下を確認すること。

1. `tracks.csv` の公開対象 `publish=1` の `audio` が存在するか
2. 非公開曲も含めて `audio` 欄に書いたファイルが存在するか
3. `image` 欄に書いたファイルが存在するか
4. `catalog.js` と `app.js` の構文チェック

実施済みの状態:

- `audio` 欄のリンク切れは修正済み
- 重複して同じMP3を指していた箇所も修正済み
- `catalog.js` 更新済み
- Project PNG画像参照は存在確認済み

## 最近修正した音源リンク

以下を修正済み。

- `.mp4` / `.mp5` になっていたパスを `.mp3` に修正
- `J-POP` / `J-pop` の違いを実ファイルに合わせて修正
- `West` / `west` の違いを実ファイルに合わせて修正
- 空欄だった `旅立ちのうた` の音源パスを追加
- `Signal Manners` が別曲を指していたので修正
- `Space_Between_the_Scenes` が別曲を指していたので修正
- `The Glass and the Stone` と `The Stopped Watch` を実ファイル名に修正
- `Not Yor Monster` を `Not your Monster` に修正し、音源パスも修正

## 次にやる予定

優先順:

1. 曲サムネイルを作る
2. `tracks.csv` の `image` 列へ対応させる
3. PC上でProject -> 曲カード -> 再生を確認
4. 公開対象曲を `publish` で絞る
5. GitHub公開用に `audio/` を公開対象だけへ整理する
6. GitHub Pagesへ移行
7. 公開URLでスマホ表示と再生を確認

## GitHub移行の考え方

PC上:

- 制作、編集、確認、候補曲管理

GitHub:

- 視聴者向け公開ページ
- 管理機能は置かない

GitHubへ渡すとき:

- `outputs` の中身をリポジトリに置く
- 公開対象のMP3だけ `audio/` に入れる
- `data/catalog.js` は更新済みにする
- `index.html`, `styles.css`, `app.js`, `data/`, `images/`, `audio/` が必要

## 重要な注意

このプロジェクトの成果物は会話ではなくPC上のファイルとして保存されています。

再契約や新しいチャットで会話文脈が失われても、以下が残っていれば再開できます。

```text
C:\Users\fujii\Documents\Codex\2026-06-13\web-url-web-mp3-html-css\outputs
```

新しいCodexには必ず最初に `HANDOFF.md` を読ませてください。
