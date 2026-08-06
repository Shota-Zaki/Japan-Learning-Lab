# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試を完成させる

### Status

`blocked`

### Purpose

FE演習機能を、公式問題データ、複合絞り込み、科目A・科目B、模擬試験、履歴、結果レビュー、GitHub Pages公開まで含めて完成させる。

### Scope

- Repository直下`docs/`へのPages成果物生成
- 科目A・科目Bの演習と公式サンプル模試
- 複合絞り込みとコンパクトグリッド表示
- 項目名の全文表示、条件群の可変高さ、内部縦スクロール廃止
- 構造化問題・解説表示
- 模擬試験中の正誤非表示と完了後レビュー
- セッション保存、再開、履歴、復習、再挑戦
- CI、GitHub Pages、公開スモーク
- 管理文書とGitHub実状態の整合

### Out of scope

- Java Learning Labの実装
- 実装担当による`main`へのマージ
- Pull RequestのReady for review変更
- 問題一覧の番号入力による直接移動
- 問題一覧領域内スクロール
- 演習解説の詳細化

### Completion criteria

1. 2022年12月公開サンプルが科目A 60問、科目B 20問で公式問番号順に揃う
2. 科目A問5、6、7の図表と問9の本文・選択肢を維持する
3. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を利用できる
4. 模擬試験中は正誤と解説を隠す
5. 完了後は問題文、ユーザー回答、正答、判定、解説を確認できる
6. 公式サンプル模試の履歴に対象セットを表示する
7. 絞り込みはコンパクトグリッド型のみを使用する
8. 項目名を省略せず全文表示する
9. 条件群は可変高さで内部縦スクロールなしとする
10. `npm run verify:fe`、CI、Pages build、Pages deployが成功する
11. `docs/`が最新sourceから生成される
12. 確認担当が固定HEAD、複数画面幅、最新公開Revisionを独立検証できる

### Dependencies

- GitHub Actions
- GitHub Pages
- Repository管理下の問題データと図表

### Branch

`work`

### Pull Request

- Number: `#1`
- State: Draft / Open / Unmerged
- Base: `main`
- Head: `work`

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Independent review fixed HEAD

`fe1ee2aaaace3f89170544aaeca1a7d4d545d4e2`

### Latest implementation verification

- アプリケーション修正と回帰検証は合格範囲
- Tests: 50 / 50 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- 科目B: 167問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問
- Pull Request workflow run ID `31100569052`, run number `211`: success

### Blocking B-03: GitHub Pages deployment queue

最新source `9d75f3269a7c01acbed4844cc9bea17394c0e538`のpush workflow run ID `31100563343`、run number `210`で、build、`npm run verify:fe`、Pages artifact upload、生成成果物artifact uploadはすべて成功した。

`actions/deploy-pages@v4`はartifact ID `8967283019`を取得し、source revision `9d75f3269a7c01acbed4844cc9bea17394c0e538`のPages deployment作成にも成功した。しかしGitHub Pages側の状態が2026-08-06 12:15:29 UTCから12:25:02 UTCまで`deployment_queued`のまま変化せず、actionの600秒timeoutで`Deployment cancelled.`となった。

直前のsource `80dc9748122060efa437540fb4474b5ce69fda19`でもrun ID `31099619029`、run number `208`が同じ理由で失敗した。Branchをdeploy前に変更しないworkflowへ修正したうえで再試行しても再現している。

したがって、アプリケーション、テスト、build、artifact、権限、deployment作成ではなく、GitHub Pages側のdeployment queue処理が外部Blockerである。Completion criteria 10および12は未達であり、`main`へマージしない。

### Failure evidence

- Latest failure evidence commit: `f56eafee55059bc46621a7288553f827ddb1d4d2`
- Evidence file: `prototype/qa/pages-deployment-failure.json`
- Source revision: `9d75f3269a7c01acbed4844cc9bea17394c0e538`
- Push workflow run ID: `31100563343`
- Push workflow run number: `210`
- Build job: success
- Deploy job ID: `92612988173`
- Deploy job: failure
- Failure: Pages state remained `deployment_queued` for 600 seconds, then cancelled
- PR workflow run ID: `31100569052`
- PR workflow run number: `211`
- PR build job: success

### Resume condition

GitHub Pages deployment queueが処理可能な状態へ戻った後、`work`の最新sourceでpush workflowを再実行する。deploy成功後に公開`build-info.json`、JS/CSS、問題データ、図表を照合し、公開画面の独立確認を完了する。

### Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- 一部GitHub ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点

### Merge commit

未マージ。GitHub Pages Blockerが解消され、確認合格するまでマージしない。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- 最新sourceのPages buildとartifact upload: success
- 最新sourceのPages deployment: queuedのままtimeout / failure
- 最新公開Revisionと公開スモーク: 未固定

### Next task

`JLL-JAVA-001`は`planned`のまま維持する。`JLL-FE-001`が`completed`になるまで開始しない。

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

未作成。既存PR完了後に必要に応じてDraft Pull Requestを作成する。
