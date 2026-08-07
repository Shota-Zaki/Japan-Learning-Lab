# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-003`

### Title

FE絞り込みの不要な余白を減らし、単元名を完全な日本語で自然に表示する

### Status

`review_ready`

### Purpose

採用済みのパターンBを通常表示の既定にし、内容量の異なるカードを無理に同じ高さへ揃えず不要な空白を減らす。単元名は実行時に正規化された旧形式を含めて完全な日本語名で表示し、表示幅が許す限り1行に収め、折り返す場合は意味のまとまりで自然に改行する。最新ユーザー指定に従い、絞り込みブロックの表示・DOM・キーボード順を「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」にする。

### Scope

- `filterLayout=2`を指定なし・無効値時の既定表示として維持
- 絞り込みブロックを「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」の順に表示
- DOM順・キーボード順も同じ順序へ揃え、375pxの1列表示でも維持
- 既存のBento Grid方針と不要な余白削減方針を維持
- 受験科目ブロックの独立状態を維持
- canonical `unitId`と旧形式の実行時単元値を完全な日本語表示名へ解決
- 単元名を可能な限り1行表示し、必要時のみ自然な位置で折り返す
- 3レイアウト × 375px・768px・1,280pxを自動監査
- Pages build、Repository `docs/`、公開Revisionを固定検証対象へ含める

### Out of scope

- 受験科目ブロックの位置、構造、文言、選択肢、操作変更
- 絞り込み条件、OR/AND評価、件数、開始条件の変更
- 問題本文、選択肢、正答、解説、図表の変更
- `JLL-FE-004`の先行実装
- レッスン内容作成
- Java Learning Labの実装
- 実装担当による`main`へのマージ
- Pull RequestをReady for reviewへ変更すること
- Squash merge、rebase merge、force push
- `work` Branchの削除

### Completion criteria

- 指定なし・無効な`filterLayout`でパターンBが表示される
- 375px、768px、1,280pxのすべてで順序が「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」になっている
- DOM順・キーボード順が表示順と一致する
- 3つの`filterLayout`すべてで同じ論理順序を維持する
- 不要な大きな未使用空間が発生しない
- カード高さを固定せず、条件群内部へ縦スクロールを追加しない
- 単元名が英語IDや「単元名未登録」ではなく完全な日本語名で表示される
- 単元カードは表示幅を有効利用し、必要時のみ自然に折り返す
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- fieldset/legend、label/input関連付けが維持される
- テスト、型検査、Lint、通常build、Pages build、Chromium監査が成功する
- Repository直下`docs/`と公開Pagesが検証済みRevisionと一致する
- Draft Pull Requestと固定検証証拠が存在する

### Dependencies

- `JLL-FE-001`: completed
- `JLL-FE-002`: completed
- ユーザー指定: パターンB採用、不要な余白削減、単元名の完全日本語表示と自然な折返し
- 最新ユーザー指定: 絞り込み順を「1. 分野 2. 回答・復習状態 3. 開催回・公開区分 4. 単元」に変更

### Branch

`work`

### Pull Request

- Number: `#4`
- Base: `main`
- Head: `work`
- State: open / draft / unmerged
- Review state: review ready

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Prior confirmation review HEAD

`86883cf71b7a13c4ee741372f3101d6a452ff8a3`

### Fixed implementation and order-test HEAD

`8e9c0dfcf5ad23e60a40abb090180c526d0347d9`

このHEADで最新の絞り込み順、CSS配置、可変高さ計測、ソース回帰テストを確定した。

### Audited workflow / Pages source HEAD

`afa550a41d2776543445a3cb727731f6fb902608`

アプリケーション差分を保持したまま、Pages成功証拠同期の`git add`処理を修正した。Browser auditとPages公開確認はこのHEADで成功している。

### Pages output synchronization HEAD

`4cd677854fda9f4a4f204df5519e86f5600fc595`

### Latest handoff preparation HEAD

`1588fd2b84f48ae5ba3ee1887dbf6a3cd968ca09`

このHEADまでに一時補助workflowを削除し、最新監査証拠とPages復旧状態を管理文書へ反映した。最終Repository HEADは`NEXT_WORK.md`更新後にGitHub実状態で確認する。

### Validation result

`passed / review_ready`

#### Automated verification

- Standard PR workflow on `8e9c0dfcf5ad23e60a40abb090180c526d0347d9`: success
- Browser audit workflow on `8e9c0dfcf5ad23e60a40abb090180c526d0347d9`: success
- Latest PR build workflow on `afa550a41d2776543445a3cb727731f6fb902608`: `31155342510` / run `404` / success
- Latest browser audit workflow: `31155342511` / run `63` / success
- Browser audit job: `92793509597` / success
- Browser evidence artifact: `8984932272`
- Browser artifact digest: `sha256:e504fafd4f823c65d7ae0f222c1e2aa3869568ed3d2bda2c7a908e1a748aca8c`
- Browser scenarios: 3 layouts × 375px / 768px / 1,280px = 9 / 9 passed
- Required DOM order: passed
- Required keyboard group order: passed
- Layout 2 left-stack gap: passed
- Subject selector independence: passed
- Horizontal overflow: none
- Card internal scrollbar / clipping: none
- Japanese unit-label verification: passed
- Console warning/error: none
- Failed network request: none
- `npm ci`: success in CI
- Tests: success through `npm run verify:fe`
- TypeScript: success through `npm run verify:fe`
- ESLint: success through `npm run verify:fe`
- Normal build: success through `npm run verify:fe`
- Pages build: success through `npm run verify:fe`

### GitHub Pages result

- Pages workflow: `31155340547` / run `403` / success
- Build job: `92793503577` / success
- Deploy job: `92793641839` / success
- Deploy to GitHub Pages: success
- Public Pages resources and Revision verification: success
- Public source Revision: `afa550a41d2776543445a3cb727731f6fb902608`
- Repository `docs/build-info.json` sourceRevision: `afa550a41d2776543445a3cb727731f6fb902608`
- Repository `prototype/qa/pages-deployment.json`: `status: success`, `publicSmokeCheck: success`
- Repository `docs/` synchronization commit: `4cd677854fda9f4a4f204df5519e86f5600fc595`
- 旧Pages一時スキップ方針: 解除済み

### Implementation notes

- `prototype/src/FePracticeSetup.jsx`: `domains → reviewScopes → periodIds → unitIds`へDOM順を変更
- `prototype/src/main.jsx`: pattern Bの左スタック高さ計測を新DOMインデックスへ追従
- `prototype/src/fe-filter-variants.css`: 3レイアウトを新DOM順へ再マッピングし、単元カードの広幅指定を4番目カードへ移動
- `prototype/tests/fe-filter-layout.test.mjs`: 4条件群の順序と旧番号が残らないことを明示検証
- `prototype/scripts/audit-fe-filter-layouts.mjs`: DOM順、キーボード群順、新option順、単元カード位置を検証
- Root / prototype `DESIGN.md`: 最新順序とpattern B配置へ同期
- `.github/workflows/pages.yml`: optional QAファイル削除時でも成功証拠を安全にstageできるよう修正
- 作業中に使用した一時補助workflow / triggerは削除済み

### Merge commit

未着手。確認担当が合格した場合のみmerge commit方式で`main`へマージする。

### Next task

確認合格・merge・`work`同期後に`JLL-FE-004`へ進む。その後はJavaではなく`JLL-FE-LESSON-001`を優先する。

---

## Planned task

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
- 必要に応じて`DESIGN.md`を実装前に更新する
- 自動テスト、型検査、Lint、通常build、Pages build、PC・スマートフォン表示を検証する

### Out of scope

- 問題本文、選択肢、正答、解説内容そのものの改変
- `JLL-FE-003`の絞り込み配置変更
- レッスン本文の作成
- Java Learning Labの実装
- 実装担当による`main`へのマージ

### Completion criteria

- 問題文と解説が文字サイズ・太さ・構造で明確に区別できる
- 模擬試験の残り時間が右上へ固定され、375pxを含む対象画面幅で本文や操作を妨げない
- 2022年科目Aサンプルが通常演習の候補へ入らない
- 対象開催回が`令和8年度 免除試験`と表示される
- 既存セッション、模擬試験、結果レビュー、履歴に回帰がない
- 必須検証、`docs/`更新、Draft Pull Request更新、Pages公開確認が完了する

### Dependencies

- `JLL-FE-003`: completed後に開始

### Branch

`work`

### Pull Request

`JLL-FE-003`確認合格・マージ後に作成または更新する。

### Start HEAD

実装開始時にGitHub実状態から固定する。

### Current HEAD

未着手。

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

現在の科目A 1,830問と、外部の過去問学習サイトで確認できる2,960問相当の収録規模との差を監査し、第三者サイトから問題文・解説を転載せず、公式一次資料で出典と正答を確認できる問題だけを追加して科目A問題バンクの網羅性を高める。2,960問は収録規模の比較ベンチマークとして扱い、根拠なく件数だけを合わせない。

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
- 現在並行して進行中の作業へ割り込んで着手すること

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

- 最新ユーザー指示: 現在並行している2つの作業と競合させない
- 着手時点で既存の進行中作業が完了または明示的に停止しており、`task-list.md`とGitHub実状態が整合していること
- 既定優先順位では`JLL-FE-LESSON-001`の後に着手する。ユーザーが明示的に優先順位を変更した場合はその指示を優先する

### Research reference

- Google Drive: [JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ](https://docs.google.com/document/d/1A1CvxwXzK5LvfxReNuSXrk5DZRdh4ZF-iWe35fhbNM4/edit)
- Intent: 実装着手前に、外部サイトの「2,960問」という延べ収録規模とユニーク問題数を混同しないようにし、公式一次資料の所在、重複問題の扱い、著作権・出典要件、追加候補の優先順位を固定するための調査ナビとして使用する。
- Key finding: 比較対象サイトの分野別件数は合計2,175問で、別開催期の同題を重複除外した履歴も確認できるため、2,960はユニーク問題数の目標値として扱わない。現行1,830問との差345問も厳密な不足数とはみなさず、着手時に年度・開催回・正規化指紋で実測する。
- Primary-source priority: まず公式の科目A免除制度修了試験とCBT移行後の公開問題を全件監査し、旧年度で現行公式ページから一次資料を取得しにくい範囲は後段で公的保存資料を探索する。
- Data-model intent: `canonicalQuestion`（ユニーク問題）と`sourceOccurrence`（開催回ごとの出現）を分離し、同一問題の重複登録を避けつつ開催回フィルタと出典履歴を維持できる構造を優先検討する。
- Source authority: Driveメモは調査結果と実装着手順をまとめた参照資料であり、問題本文・選択肢・正答の正本ではない。実際の採用判断では必ず公式一次資料を再確認し、公式情報とDriveメモが競合する場合は公式一次資料を優先する。
- Freshness: 実装開始時にDriveメモのリンク先と公開状況を再確認し、公式ページの追加・移動・利用条件変更があれば最新状態へ更新する。
- Concurrency guard: この調査資料の作成・参照登録だけでは`JLL-FE-QBANK-001`を開始扱いにしない。`planned`を維持し、既存の進行中作業が解消されるまで`NEXT_WORK.md`、アプリケーションコード、問題データ、現在のPull Requestの実装範囲へ変更を加えない。

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

未着手。着手時のRepositoryルールに従う。

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

未着手。Repositoryルールに従う。

### Next task

着手時に決定する。

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
