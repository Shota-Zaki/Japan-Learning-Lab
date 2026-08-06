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
- Pull Request workflow run ID `31105741489`, run number `238`: success
- Pull Request検証source: `3cf01154f44a3fa8d101bf5aa04b983e99e819a7`

### Blocking B-03: GitHub Pages deployment queue

再開工程では、残留していたPages deploymentを公式REST APIで解除し、workflow内にも旧deploymentの終端状態を確認するpreflightを追加した。GitHub Pages APIが返す`deployment_cancelled`を終端状態として扱う修正後、source `3cf01154f44a3fa8d101bf5aa04b983e99e819a7`でpush workflowを実行した。

push workflow run ID `31105739031`、run number `237`では、build、`npm run verify:fe`、Pages artifact upload、生成成果物artifact upload、preflight、Pages deployment作成がすべて成功した。artifact ID `8969439155`からsource `3cf01154f44a3fa8d101bf5aa04b983e99e819a7`のdeploymentが作成されたが、2026-08-06 13:25:06 UTCから13:34:42 UTCまで`deployment_queued`のまま変化せず、`actions/deploy-pages@v4`の600秒timeoutで`Deployment cancelled.`となった。

残留deployment競合とworkflow上の状態判定不備を解消した後も、新しいsourceとartifactでqueue停止が再現した。アプリケーション、テスト、build、artifact、権限、deployment作成、preflightは原因ではなく、GitHub Pages側のdeployment queue処理が外部Blockerである。Completion criteria 10および12は未達であり、`main`へマージしない。

### Failure evidence

- Latest failure evidence commit: `7800509b3840780dbcd2d6eee1ae115e1e34a70a`
- Evidence file: `prototype/qa/pages-deployment-failure.json`
- Source revision: `3cf01154f44a3fa8d101bf5aa04b983e99e819a7`
- Push workflow run ID: `31105739031`
- Push workflow run number: `237`
- Build job ID: `92630289040`
- Build job: success
- Preflight: success
- Deploy job ID: `92630432990`
- Deploy job: failure
- Pages artifact ID: `8969439155`
- Deployment creation: success
- Failure: Pages state remained `deployment_queued` until the 600-second timeout
- Pull Request workflow run ID: `31105741489`
- Pull Request workflow run number: `238`
- Pull Request build job: success
- Temporary recovery and patch workflows on `work`: removed

### Resume condition

GitHub Pages deployment queueが処理可能な状態へ戻った後、`work`の最新sourceでpush workflowを再実行する。deploy成功後に公開`build-info.json`、JS/CSS、問題データ、図表を照合し、公開画面の独立確認を完了する。

同じqueue状態が継続している間は、アプリケーションコード、build設定、artifact生成を変更しない。現行`.github/workflows/pages.yml`のpreflightは、今回の残留deployment `7ac17dd605546149649223e88dd67f22d32c70d3`が終端状態であることを確認してからdeployする。

### Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- 一部GitHub ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点
- 一時復旧Branch `pages-recovery`が残っているが、workflowは手動実行専用のretired状態

### Merge commit

未マージ。GitHub Pages Blockerが解消され、確認合格するまでマージしない。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- 最新sourceのPages buildとartifact upload: success
- 最新sourceのpreflight: success
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
