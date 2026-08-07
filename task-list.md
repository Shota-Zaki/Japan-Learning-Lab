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
- 実装、テスト、typecheck、lint、build、`docs/`、Draft Pull Request、管理文書の更新

### Out of scope

- Java Learning Labの再開
- 公式問題本文、選択肢、正答、解説の改変
- `JLL-FE-QBANK-001`の問題バンク拡充を同時進行させること
- 実装担当による`main`へのマージ
- squash merge、rebase merge、force push
- `work` Branchの削除

### Completion criteria

- Repository実状態から最初のレッスン作成範囲を単一タスクとして具体化する
- 必要な設計更新とレッスン成果物を実装する
- `npm ci`、test、typecheck、lint、normal build、Pages buildの必須検証を成功させる
- `docs/`をbuildで更新し、PC / スマートフォン表示を確認する
- Draft PR、CI、Pages、管理文書を最新GitHub実状態と一致させて`review_ready`へ渡す

### Dependencies

- `JLL-FE-004`: confirmation passed。PR #5 merge・`work`同期・最終Pages確認を確認担当が現在実施中であり、この確認チャット完了後に実装開始する

### Branch

`work`

### Pull Request

未作成。

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

問題文と解説の視覚的な区別を明確にし、模擬試験中の残り時間を常時かつ正確に確認できるようにする。通常演習へ混在させない公式サンプルの扱いと、免除試験の表示名を指定どおり整える。

### Scope completed

- 問題文と解説で文字サイズ、太さ、見出し、余白に明確な差を付与
- 模擬試験の残り時間をサイトヘッダー内の専用ステータス行へ移動し、sticky表示を維持
- 残時間計算を設定durationで上限clampし、active mock切替時にclockを即時更新
- 375px / 768px / 1,280pxの専用browser auditを追加・実行
- 2022年科目Aサンプルを通常topic演習のみから除外し、mock経路と科目B経路を維持
- `2026-exemption-07`のlearner-facing表示を`令和8年度 免除試験`へ正規化し、元データは非改変
- Root / prototype `DESIGN.md`、回帰テスト、Pages成果物、QA証拠を同期

### Out of scope respected

- 問題本文、選択肢、正答、解説内容そのものの改変なし
- 完了済み`JLL-FE-003`の絞り込み配置・順序・単元名表示の再変更なし
- レッスン本文の作成なし
- Java Learning Labの実装なし
- squash / rebase / force pushなし
- `work` Branch削除なし

### Completion criteria result

全項目について独立確認合格。Blocking findingなし。

### Dependencies

- `JLL-FE-003`: completed / PR #4 merged / final Pages verification passed

### Branch

`work`

### Pull Request

`#5` / Draft / `work` → `main`。確認合格。merge commit方式でのmerge工程へ移行済み。

### Start HEAD

`10ba7d3a1d8a08c7294fb1d361221533314ca9d5`

### Fixed HEAD and evidence

- Confirmation fixed `work` / PR HEAD: `07e50fa81197899c8b5f740ceceef72aa8d85fb5`
- CI / browser audited source HEAD: `518cd1e8a75ed4acad89c080e81673de6ef7279e`
- Fixed implementation source HEAD: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Fixed PR merge ref used by latest CI/browser evidence: `c15147336e56bc0d605e026302c61e59f2f48e7e`
- Fixed HEADとの差はPages成功証拠同期の`docs/build-info.json`と`prototype/qa/pages-deployment.json`のみ

### Validation result

`passed / confirmation`

- PR mergeable: true
- Review threads: 0
- Latest PR build workflow: `31184205320` / run `475` / success
- Build workflow checkout: PR merge ref `c15147336e56bc0d605e026302c61e59f2f48e7e` = `518cd1e8...` into `f71decc...`
- Node.js: 22.23.1
- `npm ci`: success
- `npm run verify:fe`: success
- Tests: 64 / 64 passed
- TypeScript `tsc --noEmit`: success
- ESLint: success
- Normal build: success
- Pages build: success
- Latest filter browser workflow: `31184205833` / run `95` / success
- Latest mock timer browser workflow: `31184205087` / run `19` / success
- Browser artifact: `8996046151`
- Artifact digest: `sha256:3c357958f2e7042b2ca75948b80845c78873a33f9cf695824882baffe76ae184`
- 375px / 768px / 1,280pxすべてで開始直後`残り 90:00`、約1.2秒後`残り 89:59`
- timerは専用status row内、brand / navigation / header actions / problem heading / problem body / answers / session actionsとのoverlapは全てfalse
- 180pxスクロール後もtimer Y座標不変、viewport内表示維持
- horizontal overflowなし
- 通常topic演習ではmock timer / status row / legacy inline timerはいずれも0件
- browser audit console warning/errorなし、failed requestなし
- 科目B 100分上限は決定的回帰テストで確認
- 2022年科目Aサンプルのtopic除外、mock経路維持、科目B維持を回帰テストで確認
- `令和8年度 免除試験`表示と元データ非改変を回帰テストで確認
- 確認環境の外向きDNS制約によりlocal cloneは不可だったため、GitHub Actions固定PR merge ref、workflow log、browser artifact、Repository差分、Pages公開検証を独立照合
- GitHub Actions内のactions runtimeにNode.js 20 deprecated warningがあるが、project CI runtimeはNode.js 22であり本タスクのBlockingではない

### Blocking finding

なし。旧`B1` / `B2`はいずれもresolvedを独立確認済み。

### Merge commit

確認合格時点ではmerge工程中。実merge SHAはmerge後の最終記録で更新する。

### GitHub Pages result

Pre-merge confirmation result:

- `work` Pages workflow: `31184200357` / run `474` / success
- Build job: success
- Deploy job: success
- Public smoke check: success
- Published sourceRevision: `518cd1e8a75ed4acad89c080e81673de6ef7279e`
- Public / repository `build-info.json` sourceRevision一致
- Published script: `/Japan-Learning-Lab/assets/index-CYNhSz4W.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-D0cQvWA9.css`
- Pages evidence synchronization HEAD: `07e50fa81197899c8b5f740ceceef72aa8d85fb5`
- merge後の`work` Pages最終公開結果は最終記録で更新する

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

現在の科目A収録数と外部の過去問学習サイトで確認できる2,960問相当の収録規模との差を監査し、第三者サイトから問題文・解説を転載せず、公式一次資料で出典と正答を確認できる問題だけを追加して網羅性を高める。2,960問は比較ベンチマークであり、根拠なく件数だけを合わせない。

### Scope

- 年度・開催回・公開区分別の収録状況と欠落範囲を実測
- 旧制度午前試験、免除試験、CBT移行後の公開問題・サンプルについて公式一次資料を確認
- 公式一次資料から問題文、選択肢、正答、必要図表、出典識別情報を取り込み可能な形式へ整備
- 正規化指紋による重複判定
- 図表付き問題は必要要素が揃ったものだけを公開対象とする
- 同期・検証スクリプト、テスト、出典メタデータを更新
- 最終収録数と追加できなかった範囲・理由を管理文書へ記録
- 第三者サイトは収録範囲の比較・欠落調査の参考に限定し、問題文、選択肢、解説、画像を転用しない

### Out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- 科目B問題バンクの増減
- 問題演習UI、絞り込みUI、模擬試験UIの変更
- FEレッスン本文の作成・変更
- Java Learning Labの実装
- 件数を2,960問へ合わせるための出典未確認問題・不完全問題の追加
- 既存の進行中作業へ割り込むこと

### Completion criteria

- 年度・開催回・公開区分別の収録状況と欠落範囲をRepository管理下へ記録
- 追加問題すべての公式一次資料出典と正答を追跡可能にする
- 既存問題を意図せず欠落・改変しない
- 選択肢、正答、重複、図表、出典の自動検証を成功させる
- 2,960問相当との差を理由別に説明可能にする
- 最終収録数を実測して`PROJECT_CONTEXT.md`と`task-list.md`へ反映
- test、typecheck、lint、normal build、Pages buildを成功させる
- 必要なら小タスクへ分割し、巨大な一括取り込みを避ける

### Dependencies

- `JLL-FE-LESSON-001`完了後が既定優先順位
- 着手時点で進行中作業が完了または明示停止していること
- 最新ユーザー指示が優先順位を変更した場合はその指示を優先

### Research reference

- Google Drive: [JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ](https://docs.google.com/document/d/1A1CvxwXzK5LvfxReNuSXrk5DZRdh4ZF-iWe35fhbNM4/edit)
- Intent: 外部サイトの「2,960問」という延べ収録規模とユニーク問題数を混同せず、公式一次資料の所在、重複問題の扱い、著作権・出典要件、追加候補の優先順位を固定する調査ナビとして使用する
- Key finding: 比較対象サイトの分野別件数は合計2,175問で、別開催期の同題を重複除外した履歴もあるため、2,960をユニーク問題数の目標値として扱わない。差分は年度・開催回・正規化指紋で着手時に実測する
- Data-model intent: `canonicalQuestion`と`sourceOccurrence`を分離し、同一問題の重複登録を避けつつ開催回フィルタと出典履歴を維持する構造を優先検討する
- Source authority: Driveメモは調査・着手順の参照資料であり、問題本文・選択肢・正答の正本ではない。採用判断では必ず公式一次資料を再確認する
- Concurrency guard: 調査資料の作成・参照登録だけでは本タスクを開始扱いにしない

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

- Root / `prototype/`管理文書、設計文書、既存Java実装、テストの確認
- 現状、変更対象、対象外、完了条件、検証方法の確定
- 必要な設計更新、実装、検証、`docs/`更新、Draft PR作成

### Out of scope

- 未完了のFE優先タスクを飛ばして着手すること
- 実装担当による`main`へのマージ

### Completion criteria

FE優先タスク完了後、最新ユーザー指示とRepository実状態を確認して着手可否を再判定する。

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

FE絞り込みの不要な余白を減らし、単元名を完全な日本語で表示し、条件群順序を「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」へ確定した。

### Branch

`work`

### Pull Request

`#4` / merged / merge commit方式

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Current HEAD

- Final PR HEAD: `66ba0a45ba2cb963bb96fba144021073fb66e279`
- Final Pages verification source: `dc290e1ba9a0a8101fabf187ac52add2730851c4`
- Final Pages evidence synchronization HEAD: `207fb822434735d36bc0d240e6c440f7b67c7eee`

### Validation result

`passed / completed`。tests 60 / 60、TypeScript、ESLint、normal build、Pages build、9 browser scenarios、DOM / keyboard order、subject selector independence、horizontal overflow、unit-label verification、console/network checksを確認。

### Merge commit

`90f33bbcb01792e22426123f90f454bf3a7e4134`

### GitHub Pages result

Workflow `31157266500` / run `406` / success。Public smoke check success。Published sourceRevision `dc290e1ba9a0a8101fabf187ac52add2730851c4`。

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
