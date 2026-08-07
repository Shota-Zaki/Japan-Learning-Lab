# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-LESSON-001`

### Title

FEレッスン内容を作成する

### Status

`planned`

### Purpose

FE演習UI修正完了後、Java実装へ進まず、学習用レッスンの構成と本文作成を開始する。

### Scope

- 既存レッスン画面、データ構造、設計方針、対象ユーザーの再確認
- レッスン単元、学習順序、到達目標、本文、例、確認項目の具体化
- UI変更が必要な場合はRoot / prototypeの`DESIGN.md`を実装前に更新
- 実装、テスト、typecheck、lint、build、`docs/`、Draft PR、管理文書の更新

### Out of scope

- Java Learning Labの再開
- 公式問題本文、選択肢、正答、解説の改変
- `JLL-FE-QBANK-001`の同時進行
- 実装担当による`main` merge
- squash / rebase / force push / `work`削除

### Completion criteria

- Repository実状態から最初のレッスン作成範囲を単一タスクとして具体化する
- 必要な設計更新とレッスン成果物を実装する
- `npm ci`、test、typecheck、lint、normal build、Pages buildを成功させる
- `docs/`をbuildで更新し、PC / スマートフォン表示を確認する
- Draft PR、CI、Pages、管理文書を最新GitHub実状態と一致させて`review_ready`へ渡す

### Dependencies

- `JLL-FE-004`: completed / PR #5 merged / final Pages verification passed

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に最新`work` HEADを固定する。

### Current HEAD

未着手。最新GitHub実状態を正本とする。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

未着手。

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

- 問題文と解説の文字サイズ、太さ、見出し、余白を分離
- 模擬試験残時間をサイトヘッダー内の専用ステータス行へ移動
- 残時間を設定durationで上限clampし、active mock切替時にclockを即時更新
- 375px / 768px / 1,280pxの専用browser auditを追加・検証
- 2022年科目Aサンプルを通常topic演習のみから除外し、mock経路と科目B経路を維持
- `2026-exemption-07`を`令和8年度 免除試験`と表示し、元データは非改変
- Root / prototype `DESIGN.md`、回帰テスト、Pages成果物、QA証拠を同期

### Out of scope respected

- 問題本文、選択肢、正答、解説内容そのものの改変なし
- `JLL-FE-003`の絞り込み配置・順序・単元名表示の再変更なし
- レッスン本文、Java Learning Labの実装なし
- squash / rebase / force push / `work`削除なし

### Completion criteria result

全項目合格。Blocking findingなし。

### Dependencies

- `JLL-FE-003`: completed / PR #4 merged / final Pages verification passed

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
- Corrected application source: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Latest audited PR merge ref: `c15147336e56bc0d605e026302c61e59f2f48e7e`
- Confirmation management HEAD before merge: `30107a653f773df9bee00911fb657d55418129d6`
- Post-merge handoff / final Pages source HEAD: `a958c782e0a0604f71028c81dcf8796bf8f30b2a`
- Final Pages evidence synchronization HEAD: `77c5f2c0d84f72b32a4387e77e150047e6f97df3`

### Validation result

`passed / completed`

- PR mergeable before merge: true
- Review threads: 0
- PR build workflow: `31184205320` / run `475` / success
- PR CI checkout merge ref: `c15147336e56bc0d605e026302c61e59f2f48e7e`
- Node.js: 22.23.1
- `npm ci`: success
- `npm run verify:fe`: success
- Tests: 64 / 64 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Filter browser workflow: `31184205833` / run `95` / success
- Mock timer browser workflow: `31184205087` / run `19` / success
- Browser artifact: `8996046151`
- Artifact digest: `sha256:3c357958f2e7042b2ca75948b80845c78873a33f9cf695824882baffe76ae184`
- 375px / 768px / 1,280pxで開始直後`残り 90:00`、約1.2秒後`残り 89:59`
- brand / navigation / header actions / problem heading / problem body / answers / session actionsとのoverlap: 全てfalse
- 180pxスクロール後もtimer Y座標不変、viewport内表示維持
- horizontal overflowなし
- 通常topic演習ではmock timer / status row / legacy inline timer 0件
- browser console warning/errorなし、failed requestなし
- 科目B 100分上限、topic除外、mock維持、科目B維持、learner-facing表示、元データ非改変は回帰テストで確認
- JLL-FE-003 filter browser audit run `95`もsuccess
- 確認環境の外向きDNS制約でlocal cloneは不可。GitHub Actions固定PR merge ref、workflow log、browser artifact、Repository差分、Pages公開証拠を独立照合
- Actions runtimeのNode.js 20 deprecated warningはproject Node.js 22の検証失敗ではなくNon-blocking

### Merge commit

`36641bb1c183ecd489d15280f3070aa98fd1868d`

### GitHub Pages result

- Pre-merge Pages: workflow `31184200357` / run `474` / success / published sourceRevision `518cd1e8a75ed4acad89c080e81673de6ef7279e`
- `main` merge後に`work`をmerge commitへfast-forward同期済み
- Final post-merge Pages workflow: `31185585362` / run `483` / success
- Final build job: `92889182863` / success
- Final deploy job: `92889369591` / success
- Final `Verify FE implementation`: success
- Final `Verify public Pages resources and revision`: success
- Public smoke check: success
- Published sourceRevision: `a958c782e0a0604f71028c81dcf8796bf8f30b2a`
- Public / repository `build-info.json` sourceRevision一致
- Published script: `/Japan-Learning-Lab/assets/index-CYNhSz4W.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-D0cQvWA9.css`
- Final Pages evidence synchronization HEAD: `77c5f2c0d84f72b32a4387e77e150047e6f97df3`

### Next task

`JLL-FE-LESSON-001`

---

## Planned task

### Task ID

`JLL-FE-QBANK-001`

### Title

FE科目A問題バンクを公式一次資料ベースで拡充する

### Status

`planned`

### Purpose

現行科目A収録数と外部サイトで確認できる2,960問相当の収録規模との差を監査し、第三者サイトから問題文・解説を転載せず、公式一次資料で出典と正答を確認できる問題だけを追加する。2,960問は比較ベンチマークであり、ユニーク問題数の目標値としない。

### Scope

- 年度・開催回・公開区分別の収録状況と欠落範囲を実測
- 公式一次資料の設問、選択肢、正答、図表、出典識別情報を確認
- 正規化指紋による重複判定
- 同期・検証スクリプト、テスト、出典メタデータを更新
- 最終収録数と追加不可範囲・理由を記録
- 第三者サイトは収録範囲の比較・欠落調査の参考に限定し、内容を転用しない

### Out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- 科目B問題バンクの増減
- 問題演習・絞り込み・模擬試験UI変更
- FEレッスン本文、Java Learning Labの実装
- 出典未確認・不完全問題を件数合わせで追加すること
- 進行中タスクへ割り込むこと

### Completion criteria

- 年度・開催回・公開区分別の収録状況と欠落範囲をRepository管理下へ記録
- 追加問題すべての公式一次資料出典と正答を追跡可能にする
- 既存問題を意図せず欠落・改変しない
- 選択肢、正答、重複、図表、出典の自動検証成功
- 2,960問相当との差を理由別に説明可能にする
- 最終収録数を実測して`PROJECT_CONTEXT.md`と`task-list.md`へ反映
- test、typecheck、lint、normal build、Pages build成功
- 必要なら小タスクへ分割する

### Dependencies

- `JLL-FE-LESSON-001`完了後が既定優先順位
- 着手時点で進行中作業が完了または明示停止していること
- 最新ユーザー指示による優先順位変更を優先する

### Research reference

- Google Drive: [JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ](https://docs.google.com/document/d/1A1CvxwXzK5LvfxReNuSXrk5DZRdh4ZF-iWe35fhbNM4/edit)
- Intent: 2,960問という延べ収録規模とユニーク問題数を混同せず、公式一次資料の所在、重複問題、著作権・出典要件、追加候補の優先順位を固定する調査ナビとして使う
- Key finding: 比較対象サイトの分野別件数は合計2,175問で別開催期の同題重複除外履歴もあるため、2,960をユニーク目標値としない。着手時に年度・開催回・正規化指紋で実測する
- Data-model intent: `canonicalQuestion`と`sourceOccurrence`を分離し、重複登録を避けつつ開催回フィルタと出典履歴を維持する構造を優先検討
- Source authority: Driveメモは調査結果と着手順の参照資料であり、問題本文・選択肢・正答の正本ではない。採用時は公式一次資料を再確認する
- Concurrency guard: 調査資料作成だけでは本タスクを開始扱いにしない

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

Repository内のJava Learning Lab設計、既存実装、テスト、未完了範囲を再確認し、単一の実装タスクとして具体化して再開する。

### Scope

Root / `prototype/`管理文書、設計、既存Java実装、テストを確認し、現状・変更対象・対象外・完了条件・検証方法を確定して必要な実装を行う。

### Out of scope

- FE優先タスクを飛ばして着手すること
- 実装担当による`main` merge

### Completion criteria

FE優先タスク完了後、最新ユーザー指示とRepository実状態から着手可否を再判定する。

### Dependencies

- `JLL-FE-LESSON-001`以降のFE優先タスク

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

### Status

`completed`

### Purpose

FE絞り込みの余白を減らし、完全日本語単元名と「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」の順序を確定した。

### Branch

`work`

### Pull Request

`#4` / merged / merge commit方式

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Current HEAD

Final PR HEAD `66ba0a45ba2cb963bb96fba144021073fb66e279`。Final Pages source `dc290e1ba9a0a8101fabf187ac52add2730851c4`。

### Validation result

`passed / completed`。tests 60 / 60、TypeScript、ESLint、normal build、Pages build、9 browser scenarios、DOM / keyboard order、subject selector independence、horizontal overflow、unit-label verification、console/network checksを確認。

### Merge commit

`90f33bbcb01792e22426123f90f454bf3a7e4134`

### GitHub Pages result

Workflow `31157266500` / run `406` / success。Public smoke check success。

### Next task

`JLL-FE-004`

---

## Completed task summary

### JLL-FE-002

- Status: `completed`
- Branch: `work`
- Pull Request: `#3` / merged
- Start HEAD: Repository履歴を参照
- Current HEAD: Final PR HEAD `aaac236ab887c7a55f0491cf40a9c88824e3507b`
- Validation result: tests 56 / 56、TypeScript、ESLint、build、Pages build、9 browser scenarios success
- Merge commit: `c01be523eb78d0a4ce9d7e6c8cf13eeb7868b3a8`
- GitHub Pages result: completed / task history参照
- Next task: `JLL-FE-003`

### JLL-FE-001

- Status: `completed`
- Branch: `work`
- Pull Request: `#1` / merged
- Start HEAD: Repository履歴を参照
- Current HEAD: Final PR HEAD `b50b5b2f301e135d7140aee015a41c12e8b62ab8`
- Validation result: tests 52 / 52、TypeScript、ESLint、build、Pages build、PC / tablet / mobile browser review success
- Merge commit: `82b7a01c042f339b5eae019f851905ce7505b39a`
- GitHub Pages result: completed / task history参照
- Next task: `JLL-FE-002`
