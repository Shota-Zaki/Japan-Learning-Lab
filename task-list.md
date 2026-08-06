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
- Generated repository output artifact: success
- 科目B: 167問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問
- Pull Request workflow run ID `31101991400`, run number `213`: success
- Pull Request検証source: `7c53501e52aedf31560c6102c71221dfb68e9436`

### Blocking B-03: GitHub Pages deployment queue

2026-08-06の再開工程で、残留していたsource `5ab4919c73371b6df8311b0e4a9c2e27578d797f`のPages deploymentを公式REST APIのcancel endpointで解除した。その後、source `7c53501e52aedf31560c6102c71221dfb68e9436`のpush workflow run ID `31101987545`、run number `212`を実行した。

run `212`ではbuild、`npm run verify:fe`、Pages artifact upload、生成成果物artifact upload、Pages deployment作成がすべて成功した。artifact ID `8967866811`から新規deploymentが作成されたが、2026-08-06 12:35:30 UTCから12:45:02 UTCまで`deployment_queued`のまま変化せず、`actions/deploy-pages@v4`の600秒timeoutで`Deployment cancelled.`となった。

残留deploymentを解除した後に新しいsourceとartifactで再現したため、既存deploymentの競合、アプリケーション、テスト、build、artifact、権限、deployment作成は原因ではない。GitHub Pages側のdeployment queue処理が外部Blockerである。Completion criteria 10および12は未達であり、`main`へマージしない。

### Failure evidence

- Latest failure evidence commit: `fb1661e0222477d35d46203f241adb3899a0c75f`
- Evidence file: `prototype/qa/pages-deployment-failure.json`
- Source revision: `7c53501e52aedf31560c6102c71221dfb68e9436`
- Push workflow run ID: `31101987545`
- Push workflow run number: `212`
- Build job ID: `92617517969`
- Build job: success
- Deploy job ID: `92617656706`
- Deploy job: failure
- Pages artifact ID: `8967866811`
- Deployment creation: success
- Failure: Pages state remained `deployment_queued` for 600 seconds, then cancelled
- Pull Request workflow run ID: `31101991400`
- Pull Request workflow run number: `213`
- PR build job: success
- One-time cleanup workflow removal commit: `1c9d6e78f575e24a8a05891285b9c3b1e19d51a3`

### Resume condition

GitHub Pages deployment queueが処理可能な状態へ戻った後、`work`の最新sourceでpush workflowを再実行する。deploy成功後に公開`build-info.json`、JS/CSS、問題データ、図表を照合し、公開画面の独立確認を完了する。

同じqueue状態が継続している間は、アプリケーションコード、build設定、artifact生成を変更しない。再試行前に現在のPages deployment状態を確認し、進行中deploymentがある場合のみ公式cancel endpointで解除する。

### Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- 一部GitHub ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点

### Merge commit

未マージ。GitHub Pages Blockerが解消され、確認合格するまでマージしない。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- 最新sourceのPages buildとartifact upload: success
- 最新sourceのPages deployment作成: success
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
