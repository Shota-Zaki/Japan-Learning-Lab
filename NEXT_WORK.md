# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`in_progress` — 2009年6月・7月の160問は設問単位review manifestへ構造化済みで、公式正答160件を個別固定済み。今回、公式問題PDFのテキスト層だけで本文と4択の境界を明確に照合できる非visual-risk 20問（各開催回10問）を第1 content-review batchとして別manifestへ記録した。20問はquestion text / 4 choicesのテキスト層照合のみ完了で、visual render、第三者著作物、domain/unit、解説品質、最終import判定は未完了。全160問`hold`、2009年Repository-ready 0問を維持する。

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
- Latest audited application/data implementation HEAD: `fbf8982a83d1e4a7fe81128569545b2d72ea92c7`
- Successful Pages evidence synchronization HEAD: `600fde2f949d4f5a56567dd8f9a7cf1320472534`
- Pull Request: `#7` / `work` → `main` / Draft / open
- `main` baseline: `2c3700f57f195199d365e009b7b9248746366eab`
- この管理文書更新後の最新`work` HEADはGitHub実状態を正本とする

## Implemented in this phase

1. `prototype/data/source/fe/question-extraction-content-review.json`
   - schema: `fe-question-extraction-content-review-v1`
   - review scope: official PDF text-layer question / four-choice cross-check
   - 第1 batch: 20問（2009年6月10問、7月10問）
   - visual-risk hint対象30問はこのbatchから除外
   - 20問すべてでquestion textと4択のテキスト層境界を個別照合
   - choice boundaryは20 / 20 `unambiguous`
   - テキスト層上の明示的な外部資料参照検出は0 / 20。ただし第三者著作物review完了を意味しない
   - `visualRenderVerified=false`、`importDecision=hold`を維持
2. `prototype/data/source/fe/question-extraction-candidates.json`
   - `contentReviewManifest`を追加
   - `textLayerContentReviewedCount=20`
   - `textLayerContentPendingCount=140`
   - 各sourceはreviewed 10 / pending 70
   - Repository-ready 0、既存visual counts 30 / 30 / 26は不変
3. `prototype/scripts/audit-fe-question-content-review.mjs`
   - content-review schema / policy / source count / question number / PDF pageを検証
   - visual-risk questionがtext-layer-only batchへ混入しないことを検証
   - 20問のquestion text / 4 choices / choice boundary監査値を検証
   - base review manifestの最終フラグが勝手にtrue化されず、全件hold・visual pending・third-party pendingのままであることを検証
   - content reviewだけではimportを許可しないことを固定
4. `prototype/package.json`
   - `audit:fe-question-content-review`を追加
   - `sync:fe`へ新auditを組み込み
   - normal build / Pages build / `verify:fe`の通常経路で毎回content-review整合を検証

## Existing implementation kept intact

- 2024〜2026 source inventory: 13ソース / 660候補 / 20 content-ready / 640 pending
- 2009 structured candidates: 160問
- 2009 official-answer verified: 160 / 160
- 2009 Repository-ready: 0問
- heuristic visual-risk hints: 30問
- visual-risk triaged: 30問
- visual/layout reconstruction required: 26問
- text-layer-sufficient visual-triage candidates: 4問。ただしvisual render未確認のため採用許可ではない
- primary: 1,977問（A 1,810 / B 167）
- supplemental occurrence: 20件
- runtime canonical: 1,996問（A 1,829 / B 167）
- runtime source occurrence: 1,997件
- primary duplicate-content groups: 80
- primary duplicate-source groups: 62
- canonical content fingerprint / source occurrence fingerprintを分離
- primary 1,977問は互換性baselineとして削除しない
- unique一致のみ`sourceOccurrences`へ統合し、ambiguous一致は自動統合しない

## Source verification constraints

- 公式問題PDFのみを本文・4択照合の正本として使う
- OCR大量投入は禁止のまま
- PDF screenshot取得は今回もtool cache missのため、実画像確認済みとは扱わない
- `visualRenderVerified=false`を維持する
- text-layer content reviewはvisual review、第三者著作物review、domain/unit、解説品質、最終import判定を完了させない
- 第三者著作物・外部資料依存は設問単位で別途確認する

## Current measured counts

- audited candidate universe: 820問
- candidate universe Repository-ready: 20問
- candidate universe final pending review: 800問
- 2009 structured candidates: 160問
- 2009 official-answer verified: 160問
- 2009 text-layer content reviewed: 20問
- 2009 text-layer content review pending: 140問
- 2009 Repository-ready: 0問
- heuristic visual-risk hints: 30問
- visual-risk triaged: 30問
- visual/layout reconstruction required: 26問

## Latest verification / CI / Pages

Application/data HEAD `fbf8982a83d1e4a7fe81128569545b2d72ea92c7`:

- PR Pages build / verify workflow: `31240893604` / run `537` / success
- PR build job: `93061540800` / success
- `npm ci`: success
- `Verify FE implementation`: success
- Filter layout workflow: `31240893614` / run `121` / success
- Mock timer workflow: `31240893615` / run `45` / success
- Lesson layout workflow: `31240893603` / run `22` / success
- PR contextのdeploy jobはskipped（期待どおり）
- work-push Pages workflow: `31240891864` / run `536` / success
- Public smoke check: success
- Published sourceRevision: `fbf8982a83d1e4a7fe81128569545b2d72ea92c7`
- Public / repository `build-info.json` sourceRevision一致
- Successful Pages evidence synchronization HEAD: `600fde2f949d4f5a56567dd8f9a7cf1320472534`

`verify:fe`内でnormal build、tests、typecheck、lint、Pages buildが成功し、`sync:fe`経由で新しい`audit:fe-question-content-review`も実行される。

## Next implementation sequence

1. `question-extraction-content-review.json`を拡張し、残り140問のうちvisual-risk hint対象外かつテキスト層で本文・4択境界を安全に確認できる問題から次batchを進める。
2. text-layerで曖昧な数式・下線・表組み・選択肢配置がある問題は無理にverified扱いせずhold理由を固定する。
3. visual/layout reconstruction required 26問は、実画像ベースで図・表・下線・グラフ等の意味を安全に再構成できることを確認するまで`figureOrTableDependency=pending_review`を維持する。
4. text-layer content review済みの問題から第三者著作物・商標・外部資料依存を設問単位で確認する。
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

- 2009年140問のtext-layer content reviewが未完了
- 26問はvisual/layout reconstruction確認待ち
- PDF実画像確認はtool cache missのため未完了
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
