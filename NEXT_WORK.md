# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`in_progress` — 2009年6月・7月160問は設問単位review manifestへ構造化済み、公式正答160件を個別固定済み。content triageは160 / 160分類済み。106問は公式PDFテキスト層で本文・4択境界を照合済み、39問はvisual-risk、15問はnonvisual hold。今回、external-reference hold 6問の参照対象・maintainer・参照カテゴリを設問単位で特定し、専用manifestと通常FE検証へ固定した。ただし2009年当時の版、第三者権利、再利用可否の最終確認は未完了のため6問ともholdを維持する。PDF screenshot取得は引き続きtool cache missで、formatting 9問およびvisual-risk 39問の実画像確認は未完了。2009年Repository-readyは0問を維持する。

## Next role

実装担当。

## Objective

FE科目A問題バンクを、公式一次資料で設問・選択肢・正答・出典を追跡できる問題だけで拡充する。同一問題の別開催回掲載はcanonical問題として重複させずsource occurrenceとして保持する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Task: `JLL-FE-QBANK-001`
- Task status: `in_progress`
- Task Start HEAD: `2dfb8e2034644bd9f595b44167eb5ec04b76ff1b`
- Latest audited application/data implementation HEAD: `d086197f5cf8ac40dcabcefecf31a15a24857981`
- Pull Request: `#7` / `work` → `main` / Draft / open
- `main` baseline: `2c3700f57f195199d365e009b7b9248746366eab`
- この管理文書更新後の最新`work` HEADはGitHub実状態を正本とする

## Implemented in latest phase

1. `prototype/data/source/fe/question-extraction-external-reference-review.json`
   - external-reference hold 6問を設問単位で分類
   - government standard: 3問
   - official agency framework: 1問
   - industry framework: 1問
   - industrial standard: 1問
   - current maintainer/source pageは発行・管理主体の確認証拠に限定し、2009年当時版の内容証明には使わない
   - 全件`historicalEditionReview=required_before_import`
   - 全件`thirdPartyMaterialReview=pending_review`
   - 全件`importDecision=hold`
2. `prototype/data/source/fe/question-extraction-candidates.json`
   - `externalReferenceReviewManifest`を追加
   - `externalReferenceReviewedCount=6`
   - `externalReferenceHistoricalEditionPendingCount=6`
   - source別3問ずつを同期
3. `prototype/scripts/audit-fe-question-external-reference-review.mjs`
   - content hold 6問とexternal-reference review 6問の1対1対応を検証
   - question number / PDF page / reference category / HTTPS evidence / historical edition pending / third-party pending / hold維持を検証
   - 参照特定だけでimportを許可しないことを固定
4. `prototype/package.json`
   - `audit:fe-question-external-reference-review`を追加
   - `sync:fe`へ組み込み、normal build / Pages build / `verify:fe`の通常経路から必ず実行
5. 実画像確認
   - 2009年6月・7月公式PDFの対象ページ screenshot を再試行
   - 全対象でtool cache missが再現したため、visual確認済みには変更していない

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
  - external-reference hold: 6問
- external-reference identified/reviewed: 6 / 6
- external-reference historical-edition final review pending: 6 / 6
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

Application/data HEAD `d086197f5cf8ac40dcabcefecf31a15a24857981`:

- work-push Pages workflow: `31257143225` / run `551` / success
- build job: `93102171045` / success
- `npm ci`: success
- `Verify FE implementation`: success
- Pages deploy job: skipped for PR-context path as expected
- FE mock timer workflow: `31257143229` / run `52` / success
- FE filter layout / lesson layout workflows were still running when this management record was prepared; latest GitHub state must be rechecked before handoff

External-reference audit expected result:

- reviewedReferenceQuestionCount: 6
- governmentStandardReferenceCount: 3
- officialAgencyFrameworkReferenceCount: 1
- industryFrameworkReferenceCount: 1
- industrialStandardReferenceCount: 1
- historicalEditionPendingCount: 6
- importAuthorizedCount: 0

## Next implementation sequence

1. external-reference 6問は、2009年当時の版・定義と設問の依存範囲を確認し、第三者権利・再利用可否を設問単位で確定する。参照主体の特定だけではhold解除しない。
2. formatting ambiguity hold 9問は、公式PDF実画像で数式・記号・下線等の意味を安全に再構成できるまでholdを維持する。
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
- content triage、visual triage、text-layer review、external-reference identificationのいずれか単独で採用可否を自動判定すること
- PDF実画像未確認のvisual-risk / formatting hold問題を確認済みと扱うこと
- current standard/framework pageだけで2009年当時版の意味を確定すること
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
npm run audit:fe-question-external-reference-review
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
- Repository: `prototype/data/source/fe/question-extraction-external-reference-review.json`

## Unresolved findings

- content triageは160 / 160分類済みだが、final content reviewは未完了
- 2009年54問はfinal text-layer content review未完了
- visual-risk 39問中35問は図・表・レイアウト再構成確認待ち
- PDF実画像確認はscreenshot tool cache missのため未完了
- formatting ambiguity 9問は未解消
- external-reference 6問は参照対象の特定完了、historical edition / third-party / reuse reviewは6問とも未完了
- 160問すべてdomain/unit、explanation quality、最終fingerprint照合が未完了
- 2009年Repository-readyは0問

## Latest user request

`実装`。現在タスク`JLL-FE-QBANK-001`を継続する。

## Completion update targets

- `task-list.md`
- `NEXT_WORK.md`
- 必要時`PROJECT_CONTEXT.md`
- Draft PR #7 body
- CI / Pages evidence
