# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試、演習ナビゲーション、詳細解説を完成させる

### Status

`blocked`

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

### Current implementation

2026-08-06の修正希望3件を同一タスクへ反映した。

1. 問題一覧へ問題番号入力を追加し、Enterまたは移動ボタンで指定問題へ移動する
2. 問題数が多い場合、問題一覧領域内だけを縦スクロールさせ、移動後の現在問題を一覧内へ表示する
3. 通常演習と結果レビューの解説を、正答、正答の根拠、選択肢ごとの判断、関連知識の共通構造へ変更する

データに選択肢別解説がある場合は優先し、ない場合は個別解説未登録であることを明示する。保存データにない技術的理由は生成しない。

### Fixed revisions

- Application implementation HEAD: `a38c9af1ce63ac98cd870d2ce3f175636cc7ac46`
- Pages workflow correction HEAD: `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`
- Latest failure evidence commit before management update: `63c8920e4f5cf79f6620f8e70571c57763b6a01a`

### Automated validation

Pull Request workflow run ID `31110519907`、run number `248`、build job ID `92646803294`は成功した。

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
- Generated Pages assets: `index-Ck9d4Xmf.css`, `index-C7PAGcGn.js`

Push workflow run ID `31110515900`、run number `247`でもbuild job ID `92646789661`は成功した。

- `npm run verify:fe`: success
- Pages artifact ID: `8971468045`
- Generated repository output artifact ID: `8971469109`
- Stale deployment cancellation request: success
- New Pages deployment creation: success
- Public verification: deploy未完了のためskipped

### Blocking B-03: GitHub Pages deployment service

Push workflow run `31110515900`では、固定された旧deploymentの状態が`deployment_in_progress`のままだったが、キャンセル要求が受理されたためworkflowは停止せず、正式な`actions/deploy-pages@v4`まで進んだ。

source `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`、artifact `8971468045`の新規Pages deploymentは2026-08-06 14:23:35 UTCに作成された。その後、2026-08-06 14:23:41 UTCから14:33:36 UTCまで約10分間`deployment_in_progress`のまま変化せず、600秒timeoutで失敗し、workflowがdeploymentをキャンセルした。

次は成功しているため、アプリケーション、テスト、型検査、Lint、通常build、Pages build、artifact生成、artifact upload、権限、旧deploymentキャンセル要求、deployment作成は原因から除外する。

GitHub Pages側でdeployment処理が完了しない外部Blockerであり、Completion criteria 16、17、18は未達。`main`へマージしない。

### Failure evidence

- Evidence file: `prototype/qa/pages-deployment-failure.json`
- Evidence commit: `63c8920e4f5cf79f6620f8e70571c57763b6a01a`
- Source revision: `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`
- Push workflow run ID: `31110515900`
- Run number: `247`
- Build job ID: `92646789661` / success
- Deploy job ID: `92646971036` / failure
- Pages artifact ID: `8971468045`
- Generated output artifact ID: `8971469109`
- Failure: deployment remained `deployment_in_progress` until 600-second timeout

### Pending validation

Pages公開成功後、固定された公開Revisionに対して次を確認する。

- 375px、768px、1280px以上の表示
- ページ全体の横スクロール有無
- 問題番号入力、Enter、移動ボタン、範囲外エラー
- 問題一覧内部スクロールと現在問題の視認性
- 通常演習回答直後の詳細解説
- 模擬試験中の正誤・解説非表示
- 模擬試験終了後レビューの詳細解説
- キーボード、フォーカス、Console、Network

### Non-blocking issues

- 一部GitHub ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点
- 隔離用Branch `pages-recovery`が残っている点

### Merge commit

未マージ。確認担当が合格するまでマージしない。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Latest successful evidence source: `eeb71ff55296687c4908240c7f92aae7ff9d3f6d`
- Current implementation sourceのPages buildとartifact upload: success
- Current implementation sourceのPages deployment: `deployment_in_progress`のままtimeout / failure
- Current implementation sourceの公開Revision確認: 未実施
- `docs/`の成功時同期: deploy失敗により未実施

### Resume condition

GitHub Pagesのdeployment処理が完了可能になった時点で、最新`work`から同じworkflowを再実行する。アプリケーションの追加修正は行わず、deploy、公開Revision、公開スモークが成功した場合に`review_ready`へ進める。

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
