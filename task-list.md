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

### Current implementation

2026-08-06の修正希望3件を同一タスクへ反映した。

1. 問題一覧へ問題番号入力を追加し、Enterまたは移動ボタンで指定問題へ移動する
2. 問題数が多い場合、問題一覧領域内だけを縦スクロールさせ、移動後の現在問題を一覧内へ表示する
3. 通常演習と結果レビューの解説を、正答、正答の根拠、選択肢ごとの判断、関連知識の共通構造へ変更する

データに選択肢別解説がある場合は優先し、ない場合は個別解説未登録であることを明示する。保存データにない技術的理由は生成しない。

### Fixed revisions

- Application implementation HEAD: `a38c9af1ce63ac98cd870d2ce3f175636cc7ac46`
- Pages workflow correction HEAD: `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`
- Previous blocked handoff HEAD: `76d8a20d4c578fb62391863c31a9e75ac07a6bac`
- Retry failure evidence commit: `834e18a`（full SHAは最新HEAD確認時に固定する）

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

### Pages recovery attempt 2

2026-08-06、GitHub公式ステータスでActionsとPagesがOperationalであることを確認し、push workflow run ID `31110515900`のfailed jobsを再実行した。

- Run attempt: `2`
- Rebuilt build job ID: `92652535075` / success
- Re-run deploy job ID: `92652494381`
- Stale deployment cancellation request: success
- Pages deployment for source `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`: success
- Public revision verification: failure
- Expected public revision: `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`
- Observed public revision: `8515d2c8773a16c559b461f2351a3487fba54765`
- Failure evidence was committed by workflow to `work` as commit prefix `834e18a`

Pages deployment service自体は回復しており、前回の`deployment_in_progress` timeoutは再現しなかった。一方、過去runの再実行は古いsourceを使用するため、既に公開されているより新しいRevisionを置き換えず、公開Revision一致検証に失敗した。

この結果から、次は過去runを再実行せず、最新`work` HEADをsourceとするpush workflowを新規起動する。アプリケーションコードは変更しない。

### Previous blocker B-03: GitHub Pages deployment service

初回push workflow run `31110515900` attempt 1では、source `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`のPages deploymentが`deployment_in_progress`のまま600秒timeoutとなった。

Attempt 2では同じdeploymentが成功したため、外部Pages deployment service blockerは解消済みと判断する。

### Pending validation

最新`work` sourceのPages公開成功後、固定された公開Revisionに対して次を確認する。

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
- Observed public source revision after attempt 2: `8515d2c8773a16c559b461f2351a3487fba54765`
- Attempt 2 Pages deploy: success
- Attempt 2 public revision verification: failure because the rerun source was older than the published revision
- Latest `work` source deployment: 実行待ち
- `docs/`の成功時同期: 最新source deployment成功後に実施

### Resume procedure

1. `task-list.md`を`in_progress`へ更新する
2. `NEXT_WORK.md`を最新`work` sourceのPages deploy工程へ更新する
3. `NEXT_WORK.md`更新commitをpush workflowのtriggerとして使用する
4. 新規runのbuild、deploy、公開Revision、公開スモーク、`docs/`同期を確認する
5. 成功時に`review_ready`へ更新する
6. 失敗時は新しい固定HEAD、run ID、job ID、原因を記録する

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
