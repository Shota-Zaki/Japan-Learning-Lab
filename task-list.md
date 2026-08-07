# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-QBANK-001`

### Title

FE科目A問題バンクを公式一次資料ベースで拡充する

### Status

`in_progress`

### Purpose

現行科目A収録数と外部で確認できる延べ収録規模との差を監査し、第三者サイトから問題文・解説を転載せず、公式一次資料で出典と正答を確認できる問題だけを追加する。外部の延べ収録数は比較ベンチマークであり、ユニーク問題数の目標値としない。

### Scope

- 年度・開催回・公開区分別の収録状況と欠落範囲を実測
- 公式一次資料の設問、選択肢、正答、図表、出典識別情報を確認
- 正規化したcontent fingerprintとsource occurrence fingerprintを分離
- 同一問題が別開催回に掲載された場合、canonical問題を重複登録せず`sourceOccurrences`で開催履歴を保持
- 2024〜2026の候補13ソース・660問をRepository管理下のsource inventoryへ固定
- source inventory監査とcanonical統合件数監査を通常build経路へ組み込む
- 同期・検証スクリプト、テスト、出典メタデータを更新
- 最終収録数と追加不可範囲・理由を記録
- 規模が大きいため、完了条件を維持したまま段階実装する

### Implemented / current findings

- Task Start HEAD: `2dfb8e2034644bd9f595b44167eb5ec04b76ff1b`
- Source inventory: 13ソース / 候補660問 / 公開60問 / 免除600問
- Repository content-ready: 20問 / pending body acquisition: 640問
- `audit-fe-question-source-inventory.mjs`でID、URL、件数、公式PDF、ready件数、第三者著作物確認フラグを検証
- `feQuestionBank.js`でcontent fingerprintとsource occurrence fingerprintを分離
- primary bankをcanonical優先とし、別開催回の同一問題を`sourceOccurrences`へ統合
- 同一source occurrenceで本文が競合するレコードは二重採用しない
- cross-occurrence deduplication / occurrence preservationを回帰テスト化
- `audit-fe-question-bank-coverage.mjs`を追加し、primary / supplemental / canonical統合件数をbuild時に実測する
- 2020年6月、2022年6月、2026年7月の公式問題PDFは安定した本文テキストレイヤーがないことを確認
- 2009年6月・7月は公式PDF本文と各80問の公式解答を機械抽出可能。ただし既存問題との重複、図表、第三者著作物、分類、解説品質を個別監査してから採用する
- 画像主体PDFを大量OCRして件数を作る方法は品質保証上採用しない

### Out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- OCR結果の無検証大量投入
- 科目B問題バンクの意図しない増減
- 問題演習・絞り込み・模擬試験UI変更
- FEレッスン本文の変更
- Java Learning Labの実装
- 出典未確認・不完全問題を件数合わせで追加すること

### Completion criteria

- 年度・開催回・公開区分別の収録状況と欠落範囲をRepository管理下へ記録
- 追加問題すべての公式一次資料出典と正答を追跡可能にする
- 同一問題の別開催回掲載をcanonical重複にせずsource occurrenceとして保持
- 既存問題を意図せず欠落・改変しない
- 選択肢、正答、重複、図表、出典の自動検証成功
- 外部の延べ収録規模との差を理由別に説明可能にする
- 最終収録数を実測して`PROJECT_CONTEXT.md`と`task-list.md`へ反映
- `npm test`、typecheck、lint、normal build、Pages build、`verify:fe`成功
- 必要なbrowser / Pages確認を完了する

### Dependencies

- `JLL-FE-LESSON-001`: completed / PR #6 merged / final Pages public revision verification passed
- 最新ユーザー指示による優先順位変更を優先する

### Research reference

- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ`
- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク ステージング統合版 2024-2026`
- Intent: 公式一次資料の所在、重複問題、著作権・出典要件、追加候補の優先順位を固定する調査ナビとして使う
- Source authority: Driveは調査結果の参照資料であり、問題本文・選択肢・正答の正本ではない。採用時は公式一次資料を再確認する
- Repository source inventory: `prototype/data/source/fe/question-source-inventory.json`

### Branch

`work`

### Pull Request

- Number: `#7`
- Base: `main`
- Head: `work`
- State: Draft / open
- Ready for review化: 実装担当は禁止。Completion criteria達成後に確認担当へ引き継ぐ

### Start HEAD

`2dfb8e2034644bd9f595b44167eb5ec04b76ff1b`

### Current HEAD

- Latest application/data implementation HEAD: `37aa0e7e35745fb62d99645f15e8c834b775246e`
- Management handoff HEAD before this `task-list.md` update: `c70d4065c11fc14c7897a493abada96c9c2872d9`
- この管理文書更新commit以後の最新`work` HEADはGitHub実状態を正本とする

### Validation result

`in_progress`

- Source inventory standalone audit: 13 sources / 660 candidates / 20 ready / 640 pendingをローカルNode実行で確認
- Deduplication algorithmの代表ケースをローカルNode実行で確認
- Draft PR #7作成済み
- Implementation HEAD `37aa0e7e35745fb62d99645f15e8c834b775246e`に対するPR workflows起動済み
- Pages build workflow: `31194371538` / run `505` / 文書更新時点 queued
- Filter layout workflow: `31194369077` / run `105` / 文書更新時点 in_progress
- Lesson layout workflow: `31194369156` / run `6` / 文書更新時点 queued
- Mock timer workflow: `31194369155` / run `29` / 文書更新時点 queued
- CI完了後にcanonical統合実測件数と全検証結果を追記する

### Merge commit

未着手。実装担当はmergeしない。

### GitHub Pages result

進行中。最新application HEADのwork push Pages deploy / public revision結果をGitHub実状態から再確認する。

### Next task

`JLL-FE-QBANK-001`を継続。完了後の既定次タスクは`JLL-JAVA-001`。

---

## Completed task

### Task ID

`JLL-FE-LESSON-001`

### Title

FEレッスン内容を作成する

### Status

`completed`

### Purpose

FE Learning Labの最初の実用レッスンとして、科目Bの擬似言語における代入・繰返し・変数追跡を、到達目標、本文、例、確認問題まで含む独立した学習画面として提供する。

### Scope completed

- 第1レッスン「代入と繰返しを追跡する」を構造化データで実装
- 到達目標3件、学習順序4段階、本文、擬似言語例、変数追跡表、確認ポイントを追加
- レッスン概要・本文リーダーを演習・模試・履歴から分離
- 4択確認問題、解説、再確認導線を追加
- 学習進捗・完了状態は永続保存せず、画面内状態だけを使用
- レッスン定義・確認問題・route分離を回帰テスト化
- 375px / 768px / 1,280pxのbrowser auditとスクリーンショット証拠を追加
- Pages buildのwebfont除去仕様を維持し、CI screenshot環境だけ日本語fallback fontを導入
- `docs/`、CI、Pages、管理文書を同期

### Out of scope respected

- 公式問題本文、選択肢、正答、解説データの改変なし
- `JLL-FE-004`で確定した演習・模試UIの目的外変更なし
- `JLL-FE-003`で確定した絞り込み順序・配置・単元名表示の変更なし
- `JLL-FE-QBANK-001`の同時実装なし
- Java Learning Labの再開なし
- 永続的なレッスン完了状態なし
- squash / rebase / force push / `work`削除なし

### Completion criteria result

確認担当の独立確認に合格。Blocking findingなし。PR #6をmerge commit方式で`main`へmergeし、`work`同期と最終Pages公開確認まで完了。

### Dependencies

- `JLL-FE-004`: completed / PR #5 merged

### Branch

`work`

### Pull Request

- Number: `#6`
- Base: `main`
- Head: `work`
- State: merged
- Review result: pass
- Review threads: 0
- Merge method: merge commit
- Confirmation management PR HEAD: `dc8d93fece42082b18f187ff1b053949c6045cd5`

### Start HEAD

`82b7c277347c4c6d9c1703a97e2e4c7f185b06df`

### Current HEAD / fixed evidence

- First complete lesson routing source: `db8323921ee08e8fbe6df26c771ea9eed0d8480c`
- Final audited application / workflow source: `614827ca62be5b72885b7774dc4f621975a6482f`
- Independent confirmation pre-record work HEAD: `6c53a4da57d926cdc2abac62ef8d3a7b6932592b`
- Confirmation record commit: `85943bd4095e88912f8ddae10ad4cc84686f7396`
- Confirmation management PR HEAD: `dc8d93fece42082b18f187ff1b053949c6045cd5`
- Merge commit: `2c3700f57f195199d365e009b7b9248746366eab`
- Post-merge handoff / final Pages source HEAD: `1ed246c1c1f89c968edfd4dc2dacf082a40aecd8`
- Final Pages evidence synchronization HEAD: `07cd2d4aaeed66b6d48734ba470cc747713bd472`

### Validation result

`passed / completed`

- Node.js: 22.23.1
- `npm ci`: success
- `npm run verify:fe`: success
- Tests: 67 / 67 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- PR Pages workflow: `31188040484` / run `491` / success
- PR CI checkout merge ref: `c388e165344da10bddbe61f1bcd83b1e46a782a0`
- Filter browser workflow: `31188040386` / run `102` / success
- Mock timer browser workflow: `31188040635` / run `26` / success
- FE lesson browser workflow: `31188040404` / run `3` / success
- FE lesson browser artifact: `8997593877`
- Artifact digest: `sha256:288341a6c3961aace6e7b11464dc5c306782f668d51472888ca5f983b30000fa`
- 375px / 768px / 1,280pxの概要・本文6枚を確認担当が独立実画像確認
- horizontal overflowなし、開始ボタン48px、確認問題選択肢最小54px
- 375px / 768pxで本文ナビ下段stack、1,280pxで本文右側配置
- code / table / 4 sections / 5 navigation links / 4 choices確認
- console error / runtime exception / failed requestなし
- 日本語表示、文字切れ、横はみ出し、カード重なりにBlockingなし
- routeはlessonとpractice / history / sessionで分離
- 公式問題データファイルはPR変更対象外
- `614827ca62be5b72885b7774dc4f621975a6482f`以後、merge前の後続差分は管理文書・Pages証拠のみ
- `.github/workflows/pages.yml`は`main` pushでは起動せず、PR (`main`) と`work` pushで検証する構成。standalone main push CIが存在しないことを確認
- Actions runtimeのNode.js 20 deprecated warningはproject Node.js 22検証とは別でNon-blocking

### Merge commit

`2c3700f57f195199d365e009b7b9248746366eab`

### GitHub Pages result

- Pre-merge workflow: `31188038465` / run `490` / success / sourceRevision `614827ca62be5b72885b7774dc4f621975a6482f`
- `main` merge後、`work`をmerge commitへforceなしでfast-forward同期
- Intermediate post-merge workflow: `31189901419` / run `492`; Pages deploy・public revision checkは成功したが後続pushのconcurrencyでjob全体はcancelled
- Final post-merge workflow: `31190078701` / run `493` / success
- Final build job: `92904398023` / success
- Final deploy job: `92904601920` / success
- `Deploy to GitHub Pages`: success
- `Verify public Pages resources and revision`: success
- Public smoke check: success
- Published sourceRevision: `1ed246c1c1f89c968edfd4dc2dacf082a40aecd8`
- Public / repository `build-info.json` sourceRevision一致
- Published script: `/Japan-Learning-Lab/assets/index-CVu1iGiK.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-lbWVvDdR.css`
- Final Pages evidence synchronization HEAD: `07cd2d4aaeed66b6d48734ba470cc747713bd472`

### Next task

`JLL-FE-QBANK-001`

---

## Completed task

### Task ID

`JLL-FE-004`

### Title

FE演習の可読性、模擬試験タイマー、出題対象、開催回表記を修正する

### Status

`completed`

### Purpose

問題文と解説の視覚階層、模擬試験タイマーの常時・正確表示、通常演習へ混在させない公式サンプルの扱い、免除試験のlearner-facing表示を修正する。

### Scope completed

- 問題文と解説の視覚階層を分離
- 模擬試験残時間をサイトヘッダー専用ステータス行へ移動し正確化
- 375px / 768px / 1,280px browser auditを追加
- 2022年科目Aサンプルを通常topic演習から除外しmock経路を維持
- `2026-exemption-07`を`令和8年度 免除試験`と表示し元データは非改変
- Root / prototype `DESIGN.md`、回帰テスト、Pages、QA証拠を同期

### Out of scope respected

- 公式問題本文、選択肢、正答、解説の改変なし
- `JLL-FE-003`の絞り込み配置・順序・単元名表示の再変更なし
- レッスン本文、Java Learning Labの実装なし
- squash / rebase / force push / `work`削除なし

### Completion criteria result

全項目合格。Blocking findingなし。

### Dependencies

- `JLL-FE-003`: completed / PR #4 merged

### Branch

`work`

### Pull Request

- Number: `#5`
- Base: `main`
- Head: `work`
- State: merged
- Confirmation management PR HEAD: `30107a653f773df9bee00911fb657d55418129d6`
- Review result: pass
- Merge method: merge commit

### Start HEAD

`10ba7d3a1d8a08c7294fb1d361221533314ca9d5`

### Current HEAD / fixed evidence

- Independent confirmation fixed HEAD: `07e50fa81197899c8b5f740ceceef72aa8d85fb5`
- Latest CI / browser audited source: `518cd1e8a75ed4acad89c080e81673de6ef7279e`
- Confirmation management HEAD before merge: `30107a653f773df9bee00911fb657d55418129d6`
- Final Pages evidence synchronization HEAD: `77c5f2c0d84f72b32a4387e77e150047e6f97df3`

### Validation result

`passed / completed`

- PR build workflow: `31184205320` / run `475` / success
- Tests: 64 / 64 passed
- TypeScript / ESLint / normal build / Pages build: success
- Filter browser workflow: `31184205833` / run `95` / success
- Mock timer browser workflow: `31184205087` / run `19` / success
- Browser artifact: `8996046151`
- 375px / 768px / 1,280pxでtimer、overlap、horizontal overflow、通常topic演習非表示を確認
- Blocking findingなし

### Merge commit

`36641bb1c183ecd489d15280f3070aa98fd1868d`

### GitHub Pages result

- Final post-merge Pages workflow: `31185585362` / run `483` / success
- Published sourceRevision: `a958c782e0a0604f71028c81dcf8796bf8f30b2a`
- Public smoke check: success
- Final Pages evidence synchronization HEAD: `77c5f2c0d84f72b32a4387e77e150047e6f97df3`

### Next task

`JLL-FE-LESSON-001`

---

## Deferred task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Purpose

Repository内のJava Learning Lab設計、既存実装、テスト、未完了範囲を再確認し、単一の実装タスクとして具体化して再開する。

### Scope

Root / `prototype/`管理文書、設計、既存Java実装、テストを確認し、現状・変更対象・対象外・完了条件・検証方法を確定して必要な実装を行う。

### Out of scope

- `JLL-FE-QBANK-001`を飛ばして着手すること（最新ユーザー指示で優先順位変更された場合を除く）
- 実装担当による`main` merge

### Completion criteria

FE優先タスク完了後、最新ユーザー指示とRepository実状態から着手可否を再判定する。

### Dependencies

- `JLL-FE-QBANK-001`

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
