# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`in_progress` — 2009年6月・7月160問は設問単位review manifestへ構造化済みで、公式正答160件を個別固定済み。今回、公式問題PDFのテキスト層だけで本文と4択の境界を安全に照合できた非visual-risk 106問（6月56問 / 7月50問）をcontent-review manifestへ記録した。監査中に従来のvisual-risk hint漏れ9問も検出して補正し、visual-riskは39問、triage済み39問、図・表・レイアウト再構成必要35問となった。PDF screenshot取得はtool cache missのため実画像確認済みとは扱わず、全160問`hold`、2009年Repository-ready 0問を維持する。

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
- Latest audited application/data implementation HEAD: `6833ea8b73503c151ecc34a28c19159ef1afaa2b`
- Latest successful Pages evidence synchronization HEAD: `6377bf9bb45db1c5d30558b63a30ea76d8df556b`
- Pull Request: `#7` / `work` → `main` / Draft / open
- `main` baseline: `2c3700f57f195199d365e009b7b9248746366eab`
- この管理文書更新後の最新`work` HEADはGitHub実状態を正本とする

## Implemented in this phase

1. `prototype/data/source/fe/question-extraction-content-review.json`
   - schema: `fe-question-extraction-content-review-v2`
   - review scope: official PDF text-layer question / four-choice cross-check
   - 106問を記録（2009年6月56問、7月50問）
   - 各記録はquestion textと4択のテキスト層境界が明確なものだけを採用
   - 106 / 106でchoice boundaryを`unambiguous`として扱う共通assertionを固定
   - テキスト層上で明示的な外部資料参照を検出した問題はこのbatchへ入れない
   - visual-risk対象はこのbatchから除外
   - `visualRenderVerified=false`、`importDecision=hold`を共通assertionとして維持
2. `prototype/data/source/fe/question-extraction-risk-hints.json`
   - 監査中に従来のheuristic hint漏れ9問を補正
   - 2009年6月: 18問
   - 2009年7月: 21問
   - 合計39問
3. `prototype/data/source/fe/question-extraction-visual-review.json`
   - visual-risk 39 / 39をテキスト層上の明示参照でtriage
   - visual/layout reconstruction required: 35問
   - text-layer-sufficient candidate: 4問
   - `visualRenderVerified=false`、`visualRenderVerificationStatus=screenshot_tool_cache_miss`を維持
   - triage単独ではimportを許可しない
4. `prototype/data/source/fe/question-extraction-candidates.json`
   - `contentReviewManifest`参照を維持
   - `textLayerContentReviewedCount=106`
   - `textLayerContentPendingCount=54`
   - visual-risk / triage / reconstruction countを39 / 39 / 35へ同期
   - 2009年Repository-ready 0問を維持
5. `prototype/scripts/audit-fe-question-content-review.mjs`
   - v2 content-review schema / policy / common assertionsを検証
   - visual-risk問題がtext-layer-only reviewへ混入しないことを検証
   - base review manifestの最終フラグを勝手にtrue化せず、全件hold / visual pending / third-party pendingのまま維持することを検証
6. `prototype/package.json`
   - `audit:fe-question-content-review`を`sync:fe`へ組み込んだ状態を維持
   - normal build / Pages build / `verify:fe`の通常経路でcontent-review整合を毎回検証

## Existing implementation kept intact

- 2024〜2026 source inventory: 13ソース / 660候補 / 20 content-ready / 640 pending
- 2009 structured candidates: 160問
- 2009 official-answer verified: 160 / 160
- 2009 Repository-ready: 0問
- primary: 1,977問（A 1,810 / B 167）
- supplemental occurrence: 20件
- runtime canonical: 1,996問（A 1,829 / B 167）
- runtime source occurrence: 1,997件
- primary duplicate-content groups: 80
- primary duplicate-source groups: 62
- canonical content fingerprint / source occurrence fingerprintを分離
- primary 1,977問は互換性baselineとして削除しない
- unique一致のみ`sourceOccurrences`へ統合し、ambiguous一致は自動統合しない

## Current measured counts

- audited candidate universe: 820問
- candidate universe Repository-ready: 20問
- candidate universe final pending review: 800問
- 2009 structured candidates: 160問
- 2009 official-answer verified: 160問
- 2009 text-layer content reviewed: 106問
- 2009 text-layer content review pending: 54問
- 2009 Repository-ready: 0問
- heuristic visual-risk hints: 39問
- visual-risk triaged: 39問
- visual/layout reconstruction required: 35問
- text-layer-sufficient visual-risk candidate: 4問

54問の内訳は、visual-risk 39問と、visual-riskではないが数式・下線・表現崩れまたは規格・基準等の外部資料参照を別監査すべき15問。15問は2009年6月6問 / 7月9問。

## Latest verification / CI / Pages

Application/data HEAD `6833ea8b73503c151ecc34a28c19159ef1afaa2b`:

- PR Pages build / verify workflow: `31241278123` / run `539` / success
- PR build job: `93062558874` / success
- `npm ci`: success
- `Verify FE implementation`: success
- Filter layout workflow: `31241278121` / run `122` / success
- Mock timer workflow: `31241278182` / run `46` / success
- Lesson layout workflow: `31241278139` / run `23` / success
- PR context deploy job: skipped（期待どおり）
- work-push Pages workflow: `31241276543` / run `538` / success
- Public smoke check: success
- Published sourceRevision: `6833ea8b73503c151ecc34a28c19159ef1afaa2b`
- Public / repository `build-info.json` sourceRevision一致
- Successful Pages evidence synchronization HEAD: `6377bf9bb45db1c5d30558b63a30ea76d8df556b`

`Verify FE implementation`成功により、`sync:fe`経由のsource inventory audit、extraction candidate audit、content-review audit、coverage audit、normal build、tests、typecheck、lint、Pages buildまで成功している。

## Next implementation sequence

1. text-layer content review未完了54問を、次の2群へ分けて継続する。
   - visual-risk 39問: 実画像確認と安全な図・表・レイアウト再構成確認が必要
   - 非visual-risk 15問: 数式・下線・テキスト抽出崩れ、または規格・基準等の外部資料参照を個別監査
2. visual-risk 39問のうちtext-layer-sufficient候補4問も、visual render未確認のため別経路で最終確認する。
3. visual/layout reconstruction required 35問は、実画像ベースの意味保持確認まで`figureOrTableDependency=pending_review`を維持する。
4. content review済み106問から第三者著作物・商標・外部資料依存を設問単位で確認する。
5. 本文・4択・図表・第三者著作物reviewを通過した設問だけ、既存primaryとのsource/content fingerprint照合へ進める。
6. ambiguous一致は自動統合しない。
7. 採用候補だけdomain/unitを確認し、placeholderではない学習用解説を作成・検証する。
8. ready条件をすべて満たした設問のみsupplemental source dataへ移す。
9. `npm test`、typecheck、lint、normal build、Pages build、`verify:fe`を再実行する。
10. Completion criteria達成後のみ`review_ready`へ更新する。実装担当はPRをReady for review化しない。

## Change forbidden / out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- OCR結果を人手照合なしで大量投入すること
- heuristic risk hint、visual triage、text-layer content reviewのいずれか単独で採用可否を自動判定すること
- PDF実画像未確認のvisual-risk問題を「図表確認済み」と扱うこと
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

## Unresolved findings

- 2009年54問のtext-layer content reviewが未完了
- visual-risk 39問中35問は図・表・レイアウト再構成確認待ち
- PDF実画像確認はscreenshot tool cache missのため未完了
- 非visual-risk 15問は数式・下線・テキスト抽出崩れまたは外部規格・基準参照の個別監査が必要
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
