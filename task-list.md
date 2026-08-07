# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-LESSON-001`

### Title

FEレッスン内容を作成する

### Status

`completed`

### Purpose

FE演習UI修正完了後、Java実装へ進まず、学習用レッスンの最初の実用単位として科目Bの擬似言語における代入・繰返し・変数追跡を学べる画面を実装する。

### Scope completed

- Root / `prototype/`の設計方針、既存FEレッスン・演習・履歴・ルーティングを確認
- 既存設計方針内で実装可能と判断し、`DESIGN.md`は方針変更なし
- 最初のレッスンを「代入と繰返しを追跡する」として定義し、到達目標3件、学習順序4段階、本文、擬似言語例、変数追跡表、読み違い防止ポイントを追加
- レッスン概要と本文リーダーを演習・模試から独立したコンポーネントとして実装
- 4択の確認問題、解説、再確認導線を追加。永続的な完了状態は未実装のため完了済み表示は保存しない
- レッスン定義の構造・確認問題・演習ルート分離を回帰テスト化
- 375px / 768px / 1,280pxのレッスン専用browser auditとスクリーンショット証拠を追加
- Pages buildではwebfontを除去する既存仕様のため、CIスクリーンショット時のみ日本語fallback fontを導入して実表示を確認
- `docs/`生成、Draft PR、CI、Pages公開、管理文書を同期
- 確認担当が固定実装HEAD、PR merge ref、後続差分、CIログ、browser artifact実画像、Pages deployログを独立照合し合格判定

### Out of scope respected

- Java Learning Labの再開なし
- 公式問題本文、選択肢、正答、解説の改変なし
- `JLL-FE-QBANK-001`の同時進行なし
- `JLL-FE-004`で確定した演習・模試UIの目的外変更なし
- `JLL-FE-003`で確定した絞り込み順序・配置・単元名表示の変更なし
- 学習進捗・レッスン完了状態の永続保存なし
- squash / rebase / force push / `work`削除なし

### Completion criteria result

確認担当の独立確認に合格。Blocking findingなし。merge commit方式でPR #6を`main`へ統合し、`work`同期と最終Pages確認を行う。

### Dependencies

- `JLL-FE-004`: completed / PR #5 merged / final Pages verification passed

### Branch

`work`

### Pull Request

- Number: `#6`
- Base: `main`
- Head: `work`
- Confirmation result: pass
- Mergeable: true（確認時点）
- Merge method: merge commit
- この管理記録後に確認担当がReady for review化してmergeする

### Start HEAD

`82b7c277347c4c6d9c1703a97e2e4c7f185b06df`

### Current HEAD / fixed evidence

- First complete lesson routing source: `db8323921ee08e8fbe6df26c771ea9eed0d8480c`
- Final audited implementation / workflow source: `614827ca62be5b72885b7774dc4f621975a6482f`
- Final successful Pages evidence synchronization HEAD before management handoff: `6676ac2f0ed0539d3202db5dc9d500f2c6c301eb`
- Independent confirmation pre-record work HEAD: `6c53a4da57d926cdc2abac62ef8d3a7b6932592b`
- `614827ca62be5b72885b7774dc4f621975a6482f`から上記確認HEADまでの変更は`NEXT_WORK.md`、`PROJECT_CONTEXT.md`、`task-list.md`、`docs/build-info.json`、`prototype/qa/pages-deployment.json`のみで、アプリ実装差分なし
- Confirmation management HEAD: この合格記録と`NEXT_WORK.md`更新後の最新`work` HEADをmerge直前に固定する

### Validation result

`passed / completed`

- Review threads: 0
- Submitted reviews: 0
- PR mergeable before confirmation management update: true
- Node.js: 22.23.1
- `npm ci`: success（固定PR merge ref CIログで独立確認）
- `npm run verify:fe`: success
- Tests: 67 / 67 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- PR Pages build workflow on final audited source: `31188040484` / run `491` / success
- PR CI checkout merge ref: `c388e165344da10bddbe61f1bcd83b1e46a782a0` = `main` `36641bb1c183ecd489d15280f3070aa98fd1868d` + source `614827ca62be5b72885b7774dc4f621975a6482f`
- Existing filter browser workflow: `31188040386` / run `102` / success
- Existing mock timer browser workflow: `31188040635` / run `26` / success
- FE lesson browser workflow: `31188040404` / run `3` / success
- FE lesson browser artifact: `8997593877`
- Artifact digest: `sha256:288341a6c3961aace6e7b11464dc5c306782f668d51472888ca5f983b30000fa`
- 375px / 768px / 1,280pxで概要と本文リーダーを独立実画像確認
- 3サイズともhorizontal overflowなし、確認問題の最小選択肢高さ54px、開始ボタン48px
- 375px / 768pxは本文ナビゲーションが下段へstack、1,280pxは本文右側へ配置
- code / table / 4 sections / 5 lesson navigation links / 4 choicesの存在を確認
- browser console error / runtime exception / failed requestなし
- 日本語表示、文字切れ、横はみ出し、カード重なりにBlocking issueなし
- レッスンrouteはpractice / history / sessionから分離され、永続完了状態を作らない実装をソース確認
- 公式問題データファイルはPR変更対象外
- 初回lesson audit失敗は読込途中の`document.body` null参照という監査コード側の問題で、`31b20188b0d7111976d3c8d9590e16031bfa21a2`で修正済み
- Pagesの既存webfont除去仕様によりUbuntu screenshotが日本語glyphを持たなかったため、CI audit専用fallback fontを`614827ca62be5b72885b7774dc4f621975a6482f`で追加。アプリ配信仕様は変更していない
- Actions runtimeのNode.js 20 deprecated warningはproject Node.js 22の検証失敗ではなくNon-blocking
- 確認環境の外向きDNS制約によりlocal cloneからの再実行は不可。固定PR merge refのCIログ、browser artifact、Repository差分、Pages deploy時の公開HTTP smoke checkを独立照合した

### Merge commit

確認合格。PR #6をmerge commit方式で統合後に最終SHAを記録する。

### GitHub Pages result

- Final pre-review Pages workflow: `31188038465` / run `490` / success
- Build job: `92897489459` / success
- Deploy job: `92897691974` / success
- `Verify FE implementation`: success
- `Verify public Pages resources and revision`: success
- Public smoke check: success
- Published sourceRevision: `614827ca62be5b72885b7774dc4f621975a6482f`
- Public / repository `build-info.json` sourceRevision一致
- Published script: `/Japan-Learning-Lab/assets/index-CVu1iGiK.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-lbWVvDdR.css`
- Pages evidence synchronization HEAD: `6676ac2f0ed0539d3202db5dc9d500f2c6c301eb`
- merge後に`work`を最新`main`へfast-forward同期し、最終Pages再公開を確認して追記する

### Next task

`JLL-FE-QBANK-001`。PR #6 merge、`work`同期、最終Pages確認完了後に開始可能。

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
