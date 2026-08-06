# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試、演習ナビゲーション、詳細解説を完成させる

### Status

`in_progress`

### Purpose

FE演習機能を、公式問題データ、複合絞り込み、科目A・科目B、模擬試験、履歴、結果レビュー、問題移動、詳細解説、GitHub Pages公開まで含めて完成させる。

### Scope

- Repository直下`docs/`へのPages成果物生成
- 科目A・科目Bの演習と公式サンプル模試
- 複合絞り込みとコンパクトグリッド表示
- 項目名の全文表示、条件群の可変高さ、内部縦スクロール廃止
- 構造化問題・解説表示
- 模擬試験中の正誤非表示と完了後レビュー
- セッション保存、再開、履歴、復習、再挑戦
- 問題番号入力による直接移動
- 問題一覧領域の高さ制限と内部縦スクロール
- 正答根拠、選択肢ごとの判断、関連知識を含む詳細解説
- 通常演習と結果レビューで共通する解説表示
- CI、GitHub Pages、公開スモーク
- 管理文書とGitHub実状態の整合

### Out of scope

- Java Learning Labの実装
- 実装担当による`main`へのマージ
- Pull RequestのReady for review変更
- 問題データに存在しない技術的根拠の生成
- GitHub Pages queue障害を回避するための新規復旧workflow追加

### Completion criteria

1. 2022年12月公開サンプルが科目A 60問、科目B 20問で公式問番号順に揃う
2. 科目A問5、6、7の図表と問9の本文・選択肢を維持する
3. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を利用できる
4. 模擬試験中は正誤と解説を隠す
5. 完了後は問題文、ユーザー回答、正答、判定、詳細解説を確認できる
6. 公式サンプル模試の履歴に対象セットを表示する
7. 絞り込みはコンパクトグリッド型のみを使用する
8. 項目名を省略せず全文表示する
9. 条件群は可変高さで内部縦スクロールなしとする
10. 問題番号へ数値入力とEnterまたは移動ボタンで直接移動できる
11. 範囲外の問題番号は移動せず、入力可能範囲を表示する
12. 問題一覧が多い場合は一覧領域だけを縦スクロールでき、現在問題を視認できる
13. 解説に正答、正答の根拠、選択肢ごとの判断、関連知識を表示する
14. 選択肢別解説データがある場合はそれを優先し、ない場合は未登録であることが分かる汎用説明を使用する
15. 通常演習の回答直後と模擬試験終了後レビューで同じ詳細解説構造を使用する
16. `npm run verify:fe`、CI、Pages build、Pages deployが成功する
17. `docs/`が最新sourceから生成される
18. 確認担当が固定HEAD、375px、768px、1280px以上、最新公開Revisionを独立検証できる

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

- Task start: `af7be0dbc73b8bce193defefdd013e13a667596f`
- Current revision start: `88c0b50e86a7c3a1fde542b4b5163931daef0695`

### Current revision

2026-08-06のユーザー修正希望を同一タスクへ追加した。

1. 問題一覧の進捗表示付近へ問題番号入力を追加し、指定問題へ移動する
2. 問題数が多い場合、問題一覧領域内へ縦スクロールを表示する
3. 演習解説を正答根拠、選択肢ごとの判断、関連知識まで確認できる構造へ改善する

設計文書、実装、単体テスト、回帰検証、`docs/`生成、Pull Request更新、CI確認を実施する。アプリケーション変更後のPages deployは既知の外部queue障害を再評価する。

### Previous verified baseline

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

### Known external blocker B-03: GitHub Pages deployment queue

Authoritative push workflow run ID `31105739031`、run number `237`では、build、`npm run verify:fe`、Pages artifact upload、生成成果物artifact upload、旧deployment確認preflight、Pages deployment作成が成功した。その後、source `3cf01154f44a3fa8d101bf5aa04b983e99e819a7`のdeploymentが2026-08-06 13:25:06 UTCから13:34:42 UTCまで`deployment_queued`のまま進まず、`actions/deploy-pages@v4`の600秒timeoutで失敗した。

残留deployment競合、workflow状態判定、アプリケーション、build、artifact、権限、deployment作成、preflightは原因から除外済み。現在も同じqueue障害が再現する場合、Completion criteria 16および18は未達として`main`へマージしない。

### Failure evidence

- Authoritative failure evidence commit: `a344262d45d0ffe661d8e64e9437f0f9e04244dc`
- Evidence file: `prototype/qa/pages-deployment-failure.json`
- Source revision: `3cf01154f44a3fa8d101bf5aa04b983e99e819a7`
- Push workflow run ID: `31105739031`
- Build job ID: `92630289040` / success
- Deploy job ID: `92630432990` / failure
- Pages artifact ID: `8969439155`
- Failure: Pages state remained `deployment_queued` until timeout
- Excluded transient run: `31107033694` / run number `239`

### Non-blocking issues

- 一部GitHub ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点
- 隔離用Branch `pages-recovery`が残っている点

### Merge commit

未マージ。確認担当が合格するまでマージしない。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Previous latest sourceのPages buildとartifact upload: success
- Previous latest sourceのPages deployment: queuedのままtimeout / failure
- Current revisionのPages結果: 実装後に更新する

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
