# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試を完成させる

### Status

`needs_fix`

### Purpose

FE Learning Labの演習機能を、公式問題データ、複合絞り込み、科目A・科目B分離、科目B演習、構造化表示、模擬試験、履歴復元、GitHub Pages公開まで含めて完成させる。

### Scope

- Repository直下`docs/`へのPages成果物生成
- 科目Aと科目Bの単一選択
- 分野、単元、開催回、回答状態の複数選択
- 同一条件群OR、条件群間AND
- 選択中条件の上部表示、全選択、全解除
- コンパクトグリッド型の絞り込み
- 項目名の全文表示
- 選択肢数に応じた可変高さ
- 絞り込み条件群の全件表示と内部縦スクロール廃止
- 科目Bの単一正答・複数正答
- 問題本文、コード、表、リスト、注記、画像、解説の構造化表示
- ランダム模擬試験
- 2022年12月公開サンプル問題の固定模擬試験
- セッション保存、再開、履歴、復習、再挑戦
- 完了済み模擬試験の回答・正答・解説レビュー
- 模擬試験種別と対象セットを識別できる履歴表示
- CI、GitHub Pages、公開スモークテスト
- 管理文書とGitHub実状態の整合

### Out of scope

- Java Learning Labの新規実装または再開
- 実装担当による`main`へのマージ
- 実装担当によるPull RequestのReady for review変更
- 問題一覧の番号入力による直接移動
- 問題一覧が多い場合の一覧領域内スクロール

### Completion criteria

1. 科目A 60問、科目B 20問の2022年12月公開サンプルが公式問番号順に揃う
2. 科目A問5、問6、問7の図表と問9の本文・4選択肢を維持する
3. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を利用できる
4. 模擬試験中は正誤と解説を隠す
5. 完了後は各問題の問題文、ユーザー回答、正答、正誤または未回答、解説を確認できる
6. 公式サンプル模試の履歴に対象セットを表示する
7. 絞り込みはコンパクトグリッド型だけを使用する
8. 絞り込み項目名を省略せず、複数行で全文表示する
9. 条件群は選択肢数に応じて伸長し、内部縦スクロールなしで全件表示する
10. `npm run verify:fe`、CI、Pages build、Pages deployが成功する
11. `docs/`が最新実装から生成される
12. 確認担当が固定HEAD、差分、複数画面幅、GitHub Pagesの最新公開Revisionを独立検証できる

### Dependencies

- GitHub Actions
- GitHub Pages
- Repository管理下の公式問題データと補完図表

### Branch

`work`

### Pull Request

- Number: `#1`
- State: Draft / Open / Unmerged
- Base: `main`
- Head: `work`

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Fix start HEAD

`a1912c53719b64bfcc5b4e83bb5eb2bcf8ef5796`

### Independent review fixed HEAD

`fe1ee2aaaace3f89170544aaeca1a7d4d545d4e2`

### Current implementation and generated output

- Review handoff source revision: `93cfb3bcc3c67668f10bd87c9a4f32deb8453849`
- Generated output commit: `5700b363fe233594c7717d483da44fe37aecf81f`
- Repository `docs/build-info.json` sourceRevision: `93cfb3bcc3c67668f10bd87c9a4f32deb8453849`
- Pull Request CI merge revision: `1ac951a6095ca78582517d9f1c222f2165a69c53`
- Fix audit: `prototype/qa/fe-result-filter-fix-2026-08-06/audit.md`

### Independent confirmation result

#### Verified

- `a1912c53719b64bfcc5b4e83bb5eb2bcf8ef5796`から固定HEADまで18コミットで、修正対象は絞り込み、結果レビュー、履歴表示、テスト、設計文書、生成成果物、管理文書に限定されている
- 絞り込み表示切替は廃止され、コンパクトグリッド型だけを使用する実装になっている
- 絞り込み項目は通常折返し、`overflow-wrap: anywhere`、省略記号なしで表示する定義になっている
- 条件群は内容量に応じて伸長し、条件群内部へ固定高または縦スクロールを設定していない
- 模擬試験回答後は正誤・正答・解説を表示せず、終了後の結果レビューで問題文、回答、正答、判定、選択肢、解説を表示する実装になっている
- 履歴表示は通常演習、ランダム模擬試験、公式サンプル模擬試験を区別し、公式サンプルでは保存済みセット名を使用する
- Pull Request workflow run `31083188418` / run number `197` はsuccess
- `npm run verify:fe`: success
- Tests: 50 / 50 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- CI成果物内の公開資産は`index-DwpxsVOM.js`と`index-DLyq4kZw.css`
- 科目B: 167問
- 2022年12月公開サンプル科目A: 60問、公式問番号順
- 2022年12月公開サンプル科目B: 20問、公式問番号順

#### Blocking B-03: 最新Pages公開証拠が未固定

- `prototype/qa/pages-deployment.json`は旧source revision `eeb71ff55296687c4908240c7f92aae7ff9d3f6d`、workflow run number `191`のままである
- 最新実装source revision `93cfb3bcc3c67668f10bd87c9a4f32deb8453849`またはその生成成果物commit `5700b363fe233594c7717d483da44fe37aecf81f`に対応するPages deploy run、deployment URL、公開スモーク結果が管理記録に存在しない
- 固定済みのrun number `197`はPull Request検証であり、buildとartifact uploadは成功したがdeploy jobはskippedである
- 最新公開Revisionを識別できないため、375px、768px、1280px以上の公開画面、完了済み模擬試験レビュー、履歴セット名、Console / Page / Networkの独立確認を完了できない
- Completion criteria 10および12が未達であるため、`main`へマージしない

### Required fix

1. `work`の最新`docs/`を使用するPages deployを成功させる
2. deploy run ID、run number、deploy対象commit、公開URLを固定する
3. 公開`build-info.json`、HTMLが参照するJS/CSS資産、Repository内`docs/`を照合する
4. 375px、768px、1280px以上で絞り込みの全文表示、可変高さ、内部縦スクロールなし、1〜3列表示を確認する
5. 公開画面で科目B公式サンプル模試、試験中の正誤非表示、終了後レビュー、複数正答、未回答、履歴セット名を確認する
6. キーボード、フォーカス、Console error、Page error、HTTP error、Request failureを確認する
7. `prototype/qa/pages-deployment.json`へ最新のdeployと公開スモーク結果を記録する
8. `task-list.md`と`NEXT_WORK.md`を`review_ready`へ戻し、再確認用の固定HEADを記録する

### Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- GitHub Actionsで一部ActionのNode.js 20非推奨warning
- Repositoryのdefault branchが`work`である。現在タスクのbase branchは`main`でありPR構成は正しいが、運用方針として意図した設定かは後続タスクで確認余地がある

### Merge commit

未マージ。Blocking B-03が解消されるまでマージしない。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Repository内の最新Pages成果物はsource revision `93cfb3bcc3c67668f10bd87c9a4f32deb8453849`から生成済み
- 最新実装に対応する公開deploy証拠と独立スモーク結果は未固定
- 現在の確定済み公開証拠は旧source revision `eeb71ff55296687c4908240c7f92aae7ff9d3f6d`、workflow run number `191`

### Next task

`JLL-JAVA-001`は`planned`のまま維持する。`JLL-FE-001`が確認合格、merge、`work`同期、公開再確認を経て`completed`になるまで開始しない。

---

## Planned task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Dependency

`JLL-FE-001`の確認合格、`main`へのmerge commit、`work`同期、GitHub Pages再確認

### Branch

`work`

### Pull Request

未作成。既存PR完了後に必要に応じて新しいDraft Pull Requestを作成する。
