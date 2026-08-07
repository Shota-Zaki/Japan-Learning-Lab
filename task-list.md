# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-004`

### Title

FE演習の可読性、模擬試験タイマー、出題対象、開催回表記を修正する

### Status

`planned`

### Purpose

問題文と解説の視覚的な区別を明確にし、模擬試験中の残り時間を常時確認できるようにする。通常演習へ混在させない公式サンプルの扱いと、免除試験の表示名をユーザー指定に合わせる。

### Scope

- 問題文と解説で文字サイズ、太さ、見出し、余白に明確な差を付ける
- 模擬試験の残り時間を画面右上へ固定し、スクロール中も常時表示する
- 2022年科目Aサンプルを通常の演習出題対象から除外する
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する
- UI変更前にRoot / prototypeの`DESIGN.md`を必要に応じて更新する
- 自動テスト、型検査、Lint、通常build、Pages build、PC・スマートフォン表示を検証する

### Out of scope

- 問題本文、選択肢、正答、解説内容そのものの改変
- 完了済み`JLL-FE-003`の絞り込み配置・順序・単元名表示の再変更
- レッスン本文の作成
- Java Learning Labの実装
- 実装担当による`main`へのマージ
- Squash merge、rebase merge、force push
- `work` Branchの削除

### Completion criteria

- 問題文と解説が文字サイズ・太さ・構造で明確に区別できる
- 模擬試験の残り時間が右上へ固定され、375pxを含む対象画面幅で本文や操作を妨げない
- 2022年科目Aサンプルが通常演習の候補へ入らない
- 対象開催回が`令和8年度 免除試験`と表示される
- 既存セッション、模擬試験、結果レビュー、履歴に回帰がない
- 必須検証、`docs/`更新、Draft Pull Request更新、Pages公開確認が完了する

### Dependencies

- `JLL-FE-003`: completed / PR #4 merged

### Branch

`work`

### Pull Request

未作成。実装開始時のGitHub実状態から作成または更新する。

### Start HEAD

実装開始時に、JLL-FE-003完了後の最新`work` HEADをGitHub実状態から固定する。

### Current HEAD

未着手。確認完了後の`work`同期・Pages証拠更新が終わった状態を開始点とする。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

未着手。通常のPages build、deployment、公開Revision確認を必須とする。

### Next task

`JLL-FE-LESSON-001`

---

## Planned task

### Task ID

`JLL-FE-LESSON-001`

### Title

FEレッスン内容を作成する

### Status

`planned`

### Purpose

FE演習のUI修正完了後、Java実装へ進まず、学習用レッスンの構成と本文作成を開始する。

### Scope

- 既存レッスン画面、データ構造、設計方針、対象ユーザーの再確認
- レッスン単元、学習順序、到達目標、本文、例、確認項目の具体化
- UI変更が必要な場合は`DESIGN.md`を実装前に更新
- 実装、テスト、build、`docs/`、Draft Pull Request、管理文書の更新

### Out of scope

- Java Learning Labの再開
- 公式問題本文や正答の改変
- 実装担当による`main`へのマージ

### Completion criteria

`JLL-FE-004`完了後、Repository実状態から最初のレッスン作成範囲を単一タスクとして具体化し、検証可能な成果物を作成する。

### Dependencies

- `JLL-FE-004`: completed後に開始

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に記録する。

### Current HEAD

未着手。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

未着手。必要な公開成果物とPages確認をRepositoryルールに従って実施する。

### Next task

レッスン内容作成の進捗から決定する。

---

## Planned task

### Task ID

`JLL-FE-QBANK-001`

### Title

FE科目A問題バンクを公式一次資料ベースで拡充する

### Status

`planned`

### Purpose

現在の科目A 1,830問と外部の過去問学習サイトで確認できる2,960問相当の収録規模との差を監査し、第三者サイトから問題文・解説を転載せず、公式一次資料で出典と正答を確認できる問題だけを追加して科目A問題バンクの網羅性を高める。2,960問は収録規模の比較ベンチマークとして扱い、根拠なく件数だけを合わせない。

### Scope

- 現在の科目A 1,830問を基準に、年度・開催回・公開区分別の収録状況と欠落範囲を一覧化する
- 旧制度の午前試験、免除試験、CBT移行後の公開問題・サンプルについて、公式一次資料の有無と利用可能な設問・選択肢・正答・図表を確認する
- 公式一次資料から問題文、選択肢、正答、必要な図表、出典識別情報を取り込み可能な形式へ整備する
- 正規化指紋による重複判定を行い、既存問題との二重登録を防止する
- 図表付き問題は本文、選択肢、正答、必要図表が揃ったものだけを公開対象とする
- 新規追加問題について同期スクリプト、検証スクリプト、テスト、出典メタデータを更新する
- 最終的な科目A収録数と、追加できなかった範囲・理由を管理文書へ記録する
- 第三者サイトは収録範囲の比較・欠落調査の参考に限定し、問題文、選択肢、解説、画像を転用しない

### Out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載またはスクレイピングによる再配布
- 科目B問題バンクの増減
- 問題演習UI、絞り込みUI、模擬試験UIの変更
- FEレッスン本文の作成・変更
- Java Learning Labの実装
- 件数を2,960問へ合わせるための出典未確認問題や不完全問題の追加
- 既存の進行中作業へ割り込んで着手すること

### Completion criteria

- 年度・開催回・公開区分別の科目A収録状況と欠落範囲がRepository管理下に記録されている
- 追加した全問題について公式一次資料の出典と正答を追跡できる
- 既存の科目A 1,830問を意図せず欠落・改変していない。除外が必要な場合は理由と対象IDを明示する
- 新規追加問題で選択肢、正答、重複、図表、出典の自動検証が成功する
- 2,960問相当との差について、追加済み・公式資料不足・データ不完全・重複などの理由別に説明できる
- 最終収録数を実測して`PROJECT_CONTEXT.md`と`task-list.md`へ反映する
- テスト、型検査、Lint、通常build、Pages buildが成功する
- 実装開始時に必要なら作業を複数の小タスクへ分割し、1タスクで巨大な一括取り込みを行わない

### Dependencies

- 最新ユーザー指示: 他の進行中作業と競合させない
- 着手時点で既存の進行中作業が完了または明示的に停止していること
- 既定優先順位では`JLL-FE-LESSON-001`の後。ユーザーが明示的に優先順位を変更した場合はその指示を優先する

### Research reference

- Google Drive: [JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ](https://docs.google.com/document/d/1A1CvxwXzK5LvfxReNuSXrk5DZRdh4ZF-iWe35fhbNM4/edit)
- Intent: 外部サイトの「2,960問」という延べ収録規模とユニーク問題数を混同せず、公式一次資料の所在、重複問題の扱い、著作権・出典要件、追加候補の優先順位を固定するための調査ナビとして使用する
- Key finding: 比較対象サイトの分野別件数は合計2,175問で、別開催期の同題を重複除外した履歴も確認できるため、2,960はユニーク問題数の目標値として扱わない。現行1,830問との差345問も厳密な不足数とはみなさず、着手時に年度・開催回・正規化指紋で実測する
- Data-model intent: `canonicalQuestion`と`sourceOccurrence`を分離し、同一問題の重複登録を避けつつ開催回フィルタと出典履歴を維持できる構造を優先検討する
- Source authority: Driveメモは調査結果と実装着手順をまとめた参照資料であり、問題本文・選択肢・正答の正本ではない。採用判断では必ず公式一次資料を再確認する
- Concurrency guard: 調査資料の作成・参照登録だけでは本タスクを開始扱いにしない。既存の進行中作業が解消されるまで`planned`を維持する

### Branch

`work`

### Pull Request

未作成。着手時に既存の進行中Pull Requestと競合しないことを確認して作成または更新する。

### Start HEAD

実装開始時にGitHub実状態から固定する。

### Current HEAD

未着手。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

未着手。

### Next task

着手完了時の最新優先順位から決定する。

---

## Deferred task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Purpose

Repository内のJava Learning Labの設計、既存実装、テスト、未完了範囲を再確認し、単一の実装タスクとして具体化して再開する。

### Scope

- Rootおよび`prototype/`配下の管理文書、設計文書、既存Java実装、テストの確認
- 現状、変更対象、対象外、完了条件、検証方法の確定
- 必要な設計更新、実装、検証、`docs/`更新、Draft Pull Request作成

### Out of scope

- 未完了のFE修正とレッスン作成を飛ばして着手すること
- 実装担当による`main`へのマージ

### Completion criteria

FEレッスン内容作成の優先タスク完了後、最新のユーザー指示とRepository実状態を確認して着手可否を再判定する。

### Dependencies

- `JLL-FE-LESSON-001`以降の優先タスク

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に記録する。

### Current HEAD

未着手。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

未着手。

### Next task

着手時に決定する。

---

## Completed task

### Task ID

`JLL-FE-003`

### Title

FE絞り込みの不要な余白を減らし、単元名を完全な日本語で自然に表示する

### Status

`completed`

### Purpose

採用済みのパターンBを通常表示の既定にし、内容量の異なるカードを固定高へ揃えず不要な空白を減らす。単元名は旧形式を含めて完全な日本語名へ解決し、最新ユーザー指定の順序「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」を表示・DOM・キーボード順で一致させる。

### Scope completed

- `filterLayout=2`を既定表示へ変更
- 4条件群を`domains → reviewScopes → periodIds → unitIds`へ変更
- 受験科目ブロックの独立状態を維持
- pattern Bを左2段・右縦長・下全幅の構成へ調整し、カード固定高と内部縦スクロールを使用しない
- canonical `unitId`、旧形式、日本語正規化値を完全な日本語単元名へ解決
- 自然な改行候補を持つ単元ラベルを実装
- 3レイアウト × 375px / 768px / 1,280pxのChromium監査を実施
- Root / prototype `DESIGN.md`、テスト、Pages workflow、公開証拠を同期

### Out of scope respected

- 受験科目ブロックの構造・文言・操作変更なし
- 絞り込みロジック、OR/AND評価、件数、開始条件の変更なし
- 問題本文、選択肢、正答、解説、図表の変更なし
- `JLL-FE-004`、レッスン、Javaの先行実装なし

### Completion criteria result

全項目合格。Blocking findingなし。

### Dependencies

- `JLL-FE-001`: completed
- `JLL-FE-002`: completed
- ユーザー指定: pattern B、不要な余白削減、完全日本語単元名、最新4条件群順序

### Branch

`work`

### Pull Request

- Number: `#4`
- Base: `main`
- Head: `work`
- State: merged
- Final Pull Request HEAD: `66ba0a45ba2cb963bb96fba144021073fb66e279`
- Review result: pass
- Merge method: merge commit

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Fixed implementation and order-test HEAD

`8e9c0dfcf5ad23e60a40abb090180c526d0347d9`

### Audited workflow / Pages source HEAD

`afa550a41d2776543445a3cb727731f6fb902608`

### Pages output synchronization HEAD

`4cd677854fda9f4a4f204df5519e86f5600fc595`

### Confirmation review input HEAD

`31332628e5ad412c685c1e19f0c31eda99c51d43`

### Confirmation management HEAD

`66ba0a45ba2cb963bb96fba144021073fb66e279`

### Validation result

`passed / completed`

- PR mergeable before merge: true
- Review threads: none
- PR build workflow: `31155342510` / run `404` / success
- CI `npm ci`: success
- `npm run verify:fe`: success
- Tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Browser audit workflow: `31155342511` / run `63` / success
- Browser evidence artifact: `8984932272`
- Artifact digest: `sha256:e504fafd4f823c65d7ae0f222c1e2aa3869568ed3d2bda2c7a908e1a748aca8c`
- Browser scenarios: 9 / 9 passed
- DOM order: passed
- Keyboard group order: passed
- Subject selector independence: passed
- Horizontal overflow: none
- Card internal scrollbar / clipping: none
- Japanese unit-label data verification: passed
- Console error/warning and failed request: none
- Main Branch CI after merge: no new run/status because current workflow triggers `push` only for `work` and `pull_request` for `main`
- Confirmation environment limitation: local cloneは実行環境の外向きDNS制約で不可。GitHub Actionsの固定PR merge refログ、artifact、GitHub差分を独立照合した
- Non-blocking observation: CIスクリーンショット環境は日本語システムフォント不足により一部グリフが豆腐表示するが、DOM監査・単元ラベル検証では完全な日本語文字列を確認済み。公開利用環境の機能不良を示す証拠はない

### Merge commit

`90f33bbcb01792e22426123f90f454bf3a7e4134`

### GitHub Pages result

- Pre-merge verified workflow: `31155340547` / run `403` / success
- Build job: `92793503577` / success
- Deploy job: `92793641839` / success
- Public smoke check: success
- Pre-merge public source Revision: `afa550a41d2776543445a3cb727731f6fb902608`
- Repository `docs/build-info.json` sourceRevision before final sync: `afa550a41d2776543445a3cb727731f6fb902608`
- Pages temporary skip policy: removed
- Final post-merge `work` sync / deployment: confirmation flowで再実行し、最終実状態を確認する

### Next task

`JLL-FE-004`

---

## Completed task summary

### JLL-FE-002

- Status: `completed`
- Pull Request: `#3` / merged
- Final Pull Request HEAD: `aaac236ab887c7a55f0491cf40a9c88824e3507b`
- Merge commit: `c01be523eb78d0a4ce9d7e6c8cf13eeb7868b3a8`
- Validation: tests 56 / 56、TypeScript、ESLint、build、Pages build、9 browser scenarios success
- Next task: `JLL-FE-003`

### JLL-FE-001

- Status: `completed`
- Pull Request: `#1` / merged
- Final Pull Request HEAD: `b50b5b2f301e135d7140aee015a41c12e8b62ab8`
- Merge commit: `82b7a01c042f339b5eae019f851905ce7505b39a`
- Validation: tests 52 / 52、TypeScript、ESLint、build、Pages build、PC/tablet/mobile browser review success
- Next task: `JLL-FE-002`
