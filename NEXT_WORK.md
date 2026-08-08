# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`in_progress` — 2009年6月・7月160問は設問単位review manifestへ構造化済み、公式正答160件を個別固定済み。content triageは160 / 160を分類し、未分類0問。106問は公式問題PDFのテキスト層で本文と4択の境界を安全に照合済み、39問はvisual-risk、残る非visual 15問は個別holdへ分類した。15問の内訳は数式・記号等のテキスト層表現が曖昧な9問、外部規格・基準等の参照確認が必要な6問。visual-riskは39 / 39 triage済みで、35問は図・表・レイアウト再構成が必要、4問はテキスト層で意味保持できる可能性が高い候補。PDF screenshot取得はtool cache missのため実画像確認済みとは扱わず、全160問`hold`、2009年Repository-ready 0問を維持する。

## Next role

実装担当。

## Objective

FE科目A問題バンクを、公式一次資料で設問・選択肢・正答・出典を追跡できる問題だけで拡充する。外部の延べ収録数は比較ベンチマークに限定し、同一問題の別開催回掲載をユニーク問題として水増ししない。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Task: `JLL-FE-QBANK-001`
- Task status: `in_progress`
- Task Start HEAD: `2dfb8e2034644bd9f595b44167eb5ec04b76ff1b`
- Latest audited application/data implementation HEAD: `e670376a419280dde08d298037a5c3ad9701b174`
- Latest successful Pages evidence synchronization HEAD: `c04c65f2d5f0b0a3287c77fa1ca19c624e8ce174`
- Pull Request: `#7` / `work` → `main` / Draft / open
- `main` baseline: `2c3700f57f195199d365e009b7b9248746366eab`
- この管理文書更新後の最新`work` HEADはGitHub実状態を正本とする

## Implemented in this phase

1. `prototype/data/source/fe/question-extraction-content-review.json`
   - 公式PDFテキスト層で本文・4択境界を安全に照合できた106問を記録（6月56問 / 7月50問）
   - visual-risk問題と個別hold問題を除外
   - 最終import判定は行わず、共通assertionは`visualRenderVerified=false` / `importDecision=hold`
2. `prototype/data/source/fe/question-extraction-content-holds.json`
   - schema: `fe-question-extraction-content-holds-v1`
   - 非visualで最終content review未完了の15問を独立分類
   - `text_layer_formula_or_symbol_formatting_ambiguous`: 9問
   - `external_standard_or_framework_reference_requires_review`: 6問
   - 全件`importDecision=hold`
3. `prototype/data/source/fe/question-extraction-risk-hints.json`
   - 監査中に従来heuristic hintの漏れ9問を補正
   - 2009年6月18問 / 7月21問 / 合計39問
4. `prototype/data/source/fe/question-extraction-visual-review.json`
   - visual-risk 39 / 39をtriage
   - visual/layout reconstruction required: 35問
   - text-layer-sufficient candidate: 4問
   - `visualRenderVerified=false`、`visualRenderVerificationStatus=screenshot_tool_cache_miss`を維持
5. `prototype/data/source/fe/question-extraction-candidates.json`
   - `contentHoldManifest`を追加
   - `textLayerContentReviewedCount=106`
   - `textLayerContentPendingCount=54`
   - `nonVisualContentHoldCount=15`
   - `contentTriageClassifiedCount=160`
   - `contentTriageUnclassifiedCount=0`
   - visual-risk / triage / reconstruction countを39 / 39 / 35へ同期
   - 既存監査契約に合わせ`contentStatus=structured_pending_content_review`を維持
   - 2009年Repository-ready 0問を維持
6. `prototype/scripts/audit-fe-question-content-review.mjs`
   - content review / nonvisual hold / visual-riskの3レーンが重複せず160問すべてを覆うことを検証
   - 15 holdのreason code、PDF page、base reviewのhold維持を検証
   - 106 review済み問題のbase最終フラグを勝手にtrue化しないことを検証
   - content triageだけではimportを許可しないことを固定
7. `prototype/package.json`
   - `audit:fe-question-content-review`は`sync:fe`経由でnormal build / Pages build / `verify:fe`の通常経路から実行される

## Current measured counts

- audited candidate universe: 820問
- candidate universe Repository-ready: 20問
- candidate universe final pending review: 800問
- 2009 structured candidates: 160問
- 2009 official-answer verified: 160問
- 2009 content triage classified: 160問
- 2009 content triage unclassified: 0問
- 2009 text-layer content reviewed: 106問
- 2009 text-layer content review pending: 54問
- 2009 nonvisual content hold: 15問
  - formatting ambiguity: 9問
  - external reference review required: 6問
- 2009 visual-risk hints: 39問
- visual-risk triaged: 39問
- visual/layout reconstruction required: 35問
- text-layer-sufficient visual-risk candidate: 4問
- 2009 Repository-ready: 0問

Runtime baselineは不変:

- primary: 1,977問（A 1,810 / B 167）
- supplemental occurrence: 20件
- runtime canonical: 1,996問（A 1,829 / B 167）
- runtime source occurrence: 1,997件
- primary duplicate-content groups: 80
- primary duplicate-source groups: 62

## Latest verification / CI / Pages

Application/data HEAD `e670376a419280dde08d298037a5c3ad9701b174`:

- PR Pages build / verify workflow: `31241587942` / run `543` / success
- PR build job: `93063390999` / success
- `npm ci`: success
- `Verify FE implementation`: success
- Tests: 73 / 73 passed
- Typecheck: success
- Lint: success
- Normal build: success
- Pages build: success
- Filter layout workflow: `31241587939` / run `124` / success
- Mock timer workflow: `31241587945` / run `48` / success
- Lesson layout workflow: `31241587930` / run `25` / success
- PR context deploy job: skipped（期待どおり）
- work-push Pages workflow: `31241585687` / run `542` / success
- Public smoke check: success
- Published sourceRevision: `e670376a419280dde08d298037a5c3ad9701b174`
- Public / repository `build-info.json` sourceRevision一致
- Successful Pages evidence synchronization HEAD: `c04c65f2d5f0b0a3287c77fa1ca19c624e8ce174`
- GitHub Actions内部のNode.js 20 deprecated warningはproject Node.js 22検証とは別でNon-blocking

`Verify FE implementation`内のcontent audit実測:

- candidateQuestionCount: 160
- reviewedQuestionCount: 106
- pendingTextLayerContentReviewCount: 54
- nonVisualContentHoldCount: 15
- visualRiskQuestionCount: 39
- contentTriageClassifiedCount: 160
- contentTriageUnclassifiedCount: 0
- formattingHoldCount: 9
- externalReferenceHoldCount: 6
- visualRenderVerifiedCount: 0
- mayAuthorizeImport: false

## Next implementation sequence

1. formatting ambiguity hold 9問は、公式PDF実画像で数式・記号・下線等の意味を安全に再構成できるまでholdを維持する。
2. external reference hold 6問は、外部規格・基準・フレームワーク等への依存範囲と再利用可否を設問単位で確認する。
3. visual-risk 39問は実画像確認を行い、35問の図・表・レイアウトを意味保持して再構成できるか確認する。text-layer-sufficient候補4問もvisual render未確認のため最終確認する。
4. content review済み106問から第三者著作物・外部資料依存を設問単位で確認する。
5. 本文・4択・図表・第三者著作物reviewを通過した設問だけ、既存primaryとのsource/content fingerprint照合へ進める。
6. ambiguous一致は自動統合しない。
7. 採用候補だけdomain/unitを確認し、placeholderではない学習用解説を作成・検証する。
8. ready条件をすべて満たした設問のみsupplemental source dataへ移す。
9. `npm test`、typecheck、lint、normal build、Pages build、`verify:fe`を再実行する。
10. Completion criteria達成後のみ`review_ready`へ更新する。実装担当はPRをReady for review化しない。

## Change forbidden / out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- OCR結果を人手照合なしで大量投入すること
- content triage、heuristic risk hint、visual triage、text-layer content reviewのいずれか単独で採用可否を自動判定すること
- PDF実画像未確認のvisual-risk問題やformatting hold問題を確認済みと扱うこと
- 出典未確認・正答未確認・不完全問題を件数合わせで追加すること
- placeholder解説で件数を増やすこと
- primary 1,977問を互換性確認なく削除すること
- 科目B問題バンクの意図しない増減
- 問題演習・絞り込み・模擬試験UIの目的外変更
- FEレッスン本文変更
- Java Learning Labの先行実装
- `docs/`手編集
- 実装担当による`main` merge、Ready for review化
- squash / rebase / force push / `work`削除

## Completion criteria

- 年度・開催回・公開区分別の収録状況と欠落範囲をRepositoryへ記録
- 追加問題の公式一次資料出典と正答を追跡可能にする
- 同一問題の別開催回掲載はcanonical問題を重複させずsource occurrenceとして保持
- 既存primaryを意図せず欠落・改変しない
- 選択肢、正答、重複、図表、出典の自動検証成功
- 外部の延べ収録規模との差を理由別に説明可能
- 最終収録数を`PROJECT_CONTEXT.md`と`task-list.md`へ反映
- `docs/`をbuildで生成
- Draft PR、CI、Pages、固定HEADの証拠を管理文書へ記録

## Required verification

`prototype/package.json`を正本として実行する。

```bash
cd prototype
npm ci
npm run audit:fe-question-sources
npm run audit:fe-question-extraction-candidates
npm run audit:fe-question-content-review
npm run audit:fe-question-coverage
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm run verify:fe
```

## Research reference

- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ`
- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク ステージング統合版 2024-2026`
- Repository: `prototype/data/source/fe/question-source-inventory.json`
- Repository: `prototype/data/source/fe/question-extraction-candidates.json`
- Repository: `prototype/data/source/fe/question-extraction-review.json`
- Repository: `prototype/data/source/fe/question-extraction-risk-hints.json`
- Repository: `prototype/data/source/fe/question-extraction-visual-review.json`
- Repository: `prototype/data/source/fe/question-extraction-content-review.json`
- Repository: `prototype/data/source/fe/question-extraction-content-holds.json`

## Unresolved findings

- content triageは160 / 160分類済みだが、final content reviewは未完了
- 2009年54問はfinal text-layer content review未完了
- visual-risk 39問中35問は図・表・レイアウト再構成確認待ち
- PDF実画像確認はscreenshot tool cache missのため未完了
- nonvisual hold 15問はformatting ambiguity 9問 / external reference review 6問に分類済みだが未解消
- 160問すべてthird-party material review、domain/unit、explanation quality、最終fingerprint照合が未完了
- 2009年Repository-readyは0問

## Latest user request

`実装`。現在タスク`JLL-FE-QBANK-001`を継続する。

## Completion update targets

- `task-list.md`
- `NEXT_WORK.md`
- 必要時`PROJECT_CONTEXT.md`
- Draft PR #7 body
- CI / Pages evidence
