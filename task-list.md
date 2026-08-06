# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試、演習ナビゲーション、詳細解説を完成させる

### Status

`review_ready`

### Purpose

FE演習機能を、公式問題データ、複合絞り込み、科目A・科目B、模擬試験、履歴、結果レビュー、問題移動、詳細解説まで含めて完成させ、確認担当が固定HEADを独立検証できる状態にする。

2026-08-07のユーザー指示「ここはスキップして続けて」により、GitHub Pages deployment、公開Revision一致、公開画面確認、`docs/`成功同期は、このタスクのBlocking完了条件から除外して延期する。

### Scope

- Repository直下`docs/`へのPages成果物生成処理
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
- 自動テスト、型検査、Lint、通常build、Pages build、artifact upload
- 管理文書とGitHub実状態の整合

### Out of scope

- Java Learning Labの実装
- 実装担当による`main`へのマージ
- Pull RequestのReady for review変更
- 問題データに存在しない技術的根拠の生成
- GitHub Pages障害を回避する新規復旧workflow追加
- GitHub Pages障害中の連続retry
- 本タスクの確認・マージをPages公開成功まで停止すること

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
16. `npm run verify:fe`、Pull Request CI、Pages build、Pages artifact uploadが成功する
17. GitHub Pages deployment、公開Revision一致、公開画面確認、`docs/`成功同期は2026-08-07のユーザー指示により延期し、確認・マージのBlocking条件にしない
18. 確認担当が固定HEADと`main`との差分を独立検証できる

### Dependencies

- GitHub Actions
- Repository管理下の問題データと図表
- GitHub Pagesは延期項目であり、現時点のBlocking dependencyではない

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

### Fixed implementation revisions

- Application implementation HEAD: `a38c9af1ce63ac98cd870d2ce3f175636cc7ac46`
- Pages workflow correction HEAD: `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`
- Latest deployment trigger HEAD: `1c102065233d67253ea89f71f41ff6c9e4aaca3d`
- Latest failure evidence commit: `4b52a065ab085d4879ee33f40a2c28272dee7376`
- Previous management HEAD: `3b959e5bfb991c7ba4b183e2516895116598fc89`
- Review preparation HEAD: この文書と`NEXT_WORK.md`の更新後にPR #1のHead SHAを固定する

### Implemented scope

2026-08-06の修正希望3件を同一タスクへ反映済み。

1. 問題一覧へ問題番号入力を追加し、Enterまたは移動ボタンで指定問題へ移動する
2. 問題数が多い場合、問題一覧領域内だけを縦スクロールさせ、移動後の現在問題を一覧内へ表示する
3. 通常演習と結果レビューの解説を、正答、正答の根拠、選択肢ごとの判断、関連知識の共通構造へ変更する

データに選択肢別解説がある場合は優先し、ない場合は個別解説未登録であることを明示する。保存データにない技術的理由は生成しない。

### Automated validation

Pull Request workflow run ID `31112859435`、run number `250`、source revision `1c102065233d67253ea89f71f41ff6c9e4aaca3d`は成功した。

- Build job ID: `92654857512`
- `npm run verify:fe`: success
- Tests: 54 / 54 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Question count: 1977
- 科目A: 1810問
- 科目B: 167問
- 構造化済み科目B: 142問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

### Deferred GitHub Pages validation

Authoritative push workflow run ID `31112855574`ではbuild job `92654844059`が成功し、deploy job `92655070075`が失敗した。

- Source revision: `1c102065233d67253ea89f71f41ff6c9e4aaca3d`
- Pages artifact ID: `8972432604`
- Stale deployment cancellation request: success
- New Pages deployment creation: success
- Deployment status: `deployment_in_progress`が600秒継続
- Result: `actions/deploy-pages@v4` timeout後にdeploymentをcancel
- Public revision verification: skipped
- Public resource smoke: skipped
- `docs/` success sync: skipped
- Evidence: `prototype/qa/pages-deployment-failure.json`

この障害は未解決だが、2026-08-07のユーザー指示によりNon-blockingの延期項目として扱う。確認担当はこの失敗を理由に本タスクを`needs_fix`へ戻さない。

### Required independent validation

確認担当は固定された最新`work` HEADに対して、少なくとも次を独立確認する。

- `main`との差分と変更禁止範囲
- 実装漏れ、仕様不一致、回帰、セキュリティ、互換性
- 既存の自動テスト、型検査、Lint、build結果
- 問題番号入力、Enter、移動ボタン、範囲外エラーの実装
- 問題一覧内部スクロールと現在問題の視認性
- 通常演習回答直後と模擬試験終了後レビューの詳細解説
- 模擬試験中の正誤・解説非表示
- 管理文書とPRの整合

GitHub Pagesの公開画面、公開Revision、`docs/`成功同期は延期項目として記録し、Blocking判定から除外する。

### Non-blocking issues

- GitHub Pages deployment serviceのtimeout
- 一部GitHub ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点
- 隔離用Branch `pages-recovery`が残っている点

### Merge commit

未マージ。確認担当が合格した場合のみmerge commit方式で`main`へマージする。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- 最後に確認できた公開source revision: `8515d2c8773a16c559b461f2351a3487fba54765`
- Latest source Pages build and artifact upload: success
- Latest source Pages deployment: timeout / failure
- Latest source public revision verification: skipped
- `docs/` success sync: skipped
- Disposition: ユーザー指示により延期、Non-blocking

### Next task

`JLL-JAVA-001`は`planned`のまま維持する。`JLL-FE-001`が確認合格し、`main`へのmerge commitと`work`同期を完了した後に開始する。GitHub Pages公開成功は開始条件に含めない。

---

## Planned task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Dependency

`JLL-FE-001`の確認合格、`main`へのmerge commit、`work`同期

### Branch

`work`

### Pull Request

未作成。既存PR完了後に必要に応じてDraft Pull Requestを作成する。
