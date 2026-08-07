# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-002`

### Title

FE演習の絞り込みを、独立した受験科目ブロックを維持したモジュール不規則型Bento Gridの3パターンへ変更する

### Status

`planned`

### Purpose

FE演習の既存絞り込み機能、文言、選択肢、操作を変更せず、受験科目ブロックを現在の独立配置のまま維持したうえで、その下の既存絞り込みブロックだけをモジュール不規則型のBento Gridとして3パターン実装し、比較・確認できる状態にする。

### Scope

- 現在の受験科目ブロックをBento Gridへ含めず、独立した現在の状態を維持する
- 受験科目以外の既存絞り込みブロックを対象に、カードの幅、高さ、列数、段組みが均一ではないモジュール不規則型レイアウトを3パターン作成する
- 3パターンは、同一の既存要素、文言、選択肢、操作を使用し、配置とカード寸法だけを変える
- 3パターンを比較できる実装または検証経路を用意する。ただし、利用者向けの新しい切替ボタン、説明文、カテゴリ、アイコン、選択肢は追加しない
- 既存の絞り込みロジック、条件群内OR、条件群間AND、全選択、全解除、選択中条件表示、個別解除を維持する
- PC、タブレット、スマートフォンでレスポンシブに再配置する
- 必要なRootおよび`prototype/`配下の`DESIGN.md`を実装前に更新する
- 自動テスト、型検査、Lint、通常build、Pages build、artifact uploadを実施する

### Out of scope

- 受験科目ブロックの位置、構造、文言、選択肢、操作の変更
- 既存の絞り込み要素、カテゴリ、選択肢、ボタン、アイコン、説明文の追加、削除、名称変更
- 生成イメージにだけ存在する「お気に入りのみ」「図表あり」「その他」など、現行画面に存在しない要素の追加
- 問題データ、問題本文、選択肢、正答、解説、図表の変更
- 絞り込み条件またはセッション開始条件の仕様変更
- Java Learning Labの実装
- GitHub Pages障害の復旧作業、復旧前のdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

- 実装前に、受験科目を独立維持し、その下だけをBento Grid化する設計方針が`DESIGN.md`へ記録されている
- 受験科目ブロックが現在と同じ独立領域として表示され、Bento Gridへ取り込まれていない
- 現行画面に存在する要素だけで、視覚的に明確に異なるモジュール不規則型レイアウトが3パターン実装されている
- 3パターン間で変更されるのは配置、カード幅、カード高さ、列構成、レスポンシブ再配置だけである
- 3パターンを確認するための新しい利用者向けUI要素が追加されていない
- 各条件名と選択肢が省略されず全文表示され、条件ブロック内に縦スクロールバーが発生しない
- 375px、768px、1,280px以上でページ横方向のはみ出し、重なり、操作不能がない
- キーボード操作、フォーカス表示、チェックボックスのラベル関連付けが維持されている
- 絞り込みロジックと既存操作に回帰がない
- 3パターンそれぞれの比較用スクリーンショットまたは同等のブラウザ検証証拠がRepositoryに保存されている
- `npm run verify:fe`、Pull Request CI、Pages build、Pages artifact uploadが成功している
- `task-list.md`と`NEXT_WORK.md`が確認担当向けに更新され、Draft Pull Requestが存在する

### Dependencies

- `JLL-FE-001`: completed
- 現行受験科目ブロックの独立配置: 変更禁止の基準状態
- ユーザー指定: モジュール不規則型を3パターン作成し、現在の要素は追加・変更しない

GitHub Pages公開成功は開始条件またはBlocking条件に含めない。

### Branch

`work`

### Pull Request

未作成。実装開始後に`work`から`main`へのDraft Pull Requestを作成する。

### Start HEAD

`54352c47d2c904fcba3fe822e09a3ae95f6807ad`

### Current HEAD

管理文書更新後の最新`work` HEADをGitHub実状態から取得し、実装開始時に固定する。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。Pages deployment、公開Revision一致、公開画面確認、公開証拠同期はBlocking条件にしない。

### Next task

`JLL-JAVA-001`。`JLL-FE-002`の確認、採用レイアウト確定、マージ後に再開する。

---

## Planned task

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

- `JLL-FE-001`または`JLL-FE-002`の追加仕様変更
- GitHub Pages障害の復旧作業
- Pages復旧前のdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

`JLL-FE-002`完了後、実装担当がRepository実状態を確認し、Java Learning Labの現在設計と未完了範囲を具体化して、目的、範囲、対象外、完了条件、検証方法をこのファイルと`NEXT_WORK.md`へ記録して実装を進める。

### Dependencies

- `JLL-FE-001`: completed
- `JLL-FE-002`: completed後に開始

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に記録する。

### Current HEAD

実装開始時にGitHub実状態から固定する。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。

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

### Scope completed

- 科目A・科目Bの通常演習
- ランダム模擬試験と2022年12月公開サンプル模擬試験
- 複合絞り込み、全文表示、可変高さ、条件群内スクロール廃止
- 構造化問題、図表、詳細解説
- 模擬試験中の正誤・解説非表示と完了後レビュー
- セッション保存、再開、履歴、復習、再挑戦
- 問題番号入力による直接移動と問題一覧内部スクロール
- 自動テスト、型検査、Lint、通常build、Pages build、artifact upload
- 固定CI artifactによる1,280px、768px、375pxの独立ブラウザ確認

### Out of scope retained

- Java Learning Labの実装
- 問題データに存在しない技術的根拠の生成
- GitHub Pages障害を回避する追加workflowまたは連続retry

### Completion criteria result

Pages依存項目を除く全完了条件、自動検証、固定CI artifactによる独立ブラウザ検証に合格した。

### Branch

`work`

### Pull Request

- Number: `#1`
- Base: `main`
- Head: `work`
- State: merged
- Merge method: merge commit

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Fixed review HEAD

`d4003fbc2b80a05402100d5bbe4e51a44c87d21f`

### Final Pull Request HEAD

`4e1b719ad6b7d620c795914ecd28efa1660c9b6f`

### Confirmation evidence

- Evidence: `prototype/qa/fe-final-review-2026-08-07/audit.md`
- Evidence commit: `5d58f6c396721a4764218b27914c79702f3b2e57`

### Validation result

- Application workflow run: `31112859435` / run `250` / success
- Final management workflow run: `31134642544` / run `264` / success
- Tests: 54 / 54 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact ID: `8972435856`
- Artifact digest: `sha256:e7ecf4b7966fcddfbc5d5b585f10397e8bfee669ec2baec226cf60a51fe16685`
- Independent artifact browser validation: pass

### Question data result

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）
- 構造化済み科目B: 142問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

### Merge commit

`afbbc24d375c699be0e7b0c5758d9318dc97c1d5`

### GitHub Pages result

- Pages build and artifact upload: success
- Latest deployment attempt: timeout / failure
- Public revision and public UI verification: deferred
- Disposition: Non-blockingで延期

### Non-blocking issues

- GitHub Pages deployment queue/timeout
- upstream GitHub ActionsのNode.js 20非推奨warning
- Repository default Branchが`work`
- 隔離用Branch `pages-recovery`が残っている

### Next task

`JLL-FE-002`。ユーザー指定のBento Grid 3パターンを先に実施し、その後`JLL-JAVA-001`へ進む。
