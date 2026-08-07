# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Purpose

Repository内のJava Learning Labの設計、既存実装、テスト、未完了範囲を再確認し、単一の実装タスクとして再開できる状態にする。

### Scope

- Rootおよび`prototype/`配下の管理文書、設計文書、既存Java実装、テストの確認
- 現状と完了条件の確定
- 必要な場合の`DESIGN.md`先行更新
- `work` BranchでのJava Learning Lab実装
- 自動テスト、型検査、Lint、通常build、Pages build、artifact upload

### Out of scope

- `JLL-FE-001`の追加仕様変更
- GitHub Pages障害の復旧作業
- Pages復旧前のdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

次回の実装担当がRepository実状態を確認し、Java Learning Labの現在設計と未完了範囲を具体化した後、目的、範囲、対象外、完了条件、検証方法をこのファイルと`NEXT_WORK.md`へ記録して実装を進める。

### Dependencies

- `JLL-FE-001`確認合格: completed
- Pull Request #1のmerge commit: completed
- `work`の最新`main`同期: 確認工程で実施

GitHub Pages公開成功は開始条件に含めない。

### Branch

`work`

### Pull Request

未作成。実装開始後にDraft Pull Requestを作成する。

### Start HEAD

実装開始時に同期済み`work` HEADを記録する。

### Current HEAD

GitHub実状態を正本とし、実装開始時に固定する。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。Pages deployment、公開Revision一致、公開画面確認、公開証拠同期はBlocking条件にしない。

### Next task

Java Learning Labの現状調査後に決定する。

---

## Completed task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試、演習ナビゲーション、詳細解説を完成させる

### Status

`completed`

### Purpose

FE演習機能を、公式問題データ、複合絞り込み、科目A・科目B、模擬試験、履歴、結果レビュー、問題移動、詳細解説まで含めて完成させる。

2026-08-07のユーザー指示により、GitHub Pages deployment、公開Revision一致、公開画面確認、`docs/`成功同期はBlocking完了条件から除外し、延期項目として扱う。

### Scope completed

- 科目A・科目Bの通常演習
- ランダム模擬試験
- 2022年12月公開サンプル模擬試験
- 複合絞り込みとコンパクトグリッド表示
- 項目名の全文表示、条件群の可変高さ、条件群内スクロール廃止
- 構造化問題、図表、解説表示
- 模擬試験中の正誤・解説非表示
- 完了後の問題別レビュー
- セッション保存、再開、履歴、復習、再挑戦
- 問題番号入力による直接移動
- 範囲外入力の拒否と許容範囲表示
- 問題一覧領域の高さ制限と内部縦スクロール
- 正答、正答根拠、選択肢ごとの判断、関連知識を含む詳細解説
- 自動テスト、型検査、Lint、通常build、Pages build、artifact upload
- 固定CI artifactを用いた1,280px、768px、375pxの独立ブラウザ確認

### Out of scope retained

- Java Learning Labの実装
- 問題データに存在しない技術的根拠の生成
- GitHub Pages障害を回避する追加workflow
- GitHub Pages障害中の連続retry
- Pages公開成功まで本タスクのマージを停止すること

### Completion criteria result

- 科目A 60問、科目B 20問の公式サンプルセット: pass
- 科目A問5、6、7の図表、問9の本文と選択肢: pass
- 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦: pass
- 模擬試験中の正誤・解説非表示: pass
- 完了後の問題別回答・正答・判定・詳細解説: pass
- 公式サンプル模試の履歴識別: pass
- 絞り込み全文表示、可変高さ、条件群内スクロール廃止: pass
- 問題番号直接移動、範囲外拒否、問題一覧スクロール: pass
- 正答、正答根拠、選択肢ごとの判断、関連知識: pass
- `npm run verify:fe`、Pull Request CI、Pages build、Pages artifact upload: pass
- 固定HEADと`main`との差分の独立検証: pass
- Pages依存項目の延期とNon-blocking扱い: applied

### Branch

`work`

### Pull Request

- Number: `#1`
- Base: `main`
- Head: `work`
- State: merged
- Review decision: pass
- Merge method: merge commit

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Fixed review HEAD

`d4003fbc2b80a05402100d5bbe4e51a44c87d21f`

### Final Pull Request HEAD

`4e1b719ad6b7d620c795914ecd28efa1660c9b6f`

`89c35c3a2dce552616472d9fd30d3056b2de2b31`以降の差分はPages失敗証拠ファイルのみで、アプリケーションコード、テスト、設定、問題データの変更はない。

### Confirmation evidence

- Evidence file: `prototype/qa/fe-final-review-2026-08-07/audit.md`
- Evidence commit: `5d58f6c396721a4764218b27914c79702f3b2e57`

### Validation result

Application validation:

- Workflow run ID: `31112859435`
- Run number: `250`
- Build job ID: `92654857512`
- Application source: `1c102065233d67253ea89f71f41ff6c9e4aaca3d`
- Pull Request synthetic merge revision: `95966a21741ba9d06060ae6b10c377ce063675ca`
- Tests: 54 / 54 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact ID: `8972435856`
- Artifact digest: `sha256:e7ecf4b7966fcddfbc5d5b585f10397e8bfee669ec2baec226cf60a51fe16685`

Final management HEAD validation:

- Workflow run ID: `31134642544`
- Run number: `264`
- Head: `89c35c3a2dce552616472d9fd30d3056b2de2b31`
- Build and `npm run verify:fe`: success
- Pages build and artifact upload: success
- Deploy: Pull Request eventのためskipped

Independent artifact browser validation:

- 1,280px、768px、375pxで横方向のページはみ出しなし
- 絞り込み項目名の省略なし、条件群内縦スクロールなし
- 1,830問の問題一覧は内部縦スクロールあり
- 問題30への直接移動、現在問題の視認、範囲外31の拒否
- 通常演習回答後の詳細解説
- 一時停止、端末保存、再読込後の再開
- 科目B公式サンプル20問の開始
- 模擬試験中の正誤・解説非表示
- 完了後の20問問題別レビュー
- 履歴の`2022年12月公開サンプル問題`識別

### Question data result

- 配信基本問題バンク: 1,977問
  - 科目A: 1,810問
  - 科目B: 167問
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問
  - 科目A: 1,830問
  - 科目B: 167問
- 構造化済み科目B: 142問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

### Merge commit

`afbbc24d375c699be0e7b0c5758d9318dc97c1d5`

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Pages build and artifact upload: success
- Latest deployment attempt: timeout / failure
- Public revision verification: deferred
- Public UI, Console, Network checks: deferred
- `docs/` successful deployment evidence sync: deferred
- Disposition: 2026-08-07のユーザー指示によりNon-blockingで延期

### Non-blocking issues

- GitHub Pages deployment queue/timeout
- GitHub Actionsで使用する一部upstream actionのNode.js 20非推奨warning
- Repository default Branchが`work`
- 隔離用Branch `pages-recovery`が残っている

### Next task

`JLL-JAVA-001`。`work`同期後、ユーザーの`実装`で開始する。
