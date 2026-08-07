# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`in_progress` — 2009年6月・7月の160問を設問単位のレビューmanifestへ構造化し、公式正答160件を個別に固定済み。問題本文・4択・図表・第三者著作物・domain/unit・解説品質は未確認のため、全件`hold`を維持している。

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
- Latest application/data implementation HEAD: `009c62046e8cc7e45b779a2d96c9e739552c3401`
- Pull Request: `#7` / `work` → `main` / Draft
- `main` baseline: `2c3700f57f195199d365e009b7b9248746366eab`
- 最新`work` HEADはこの管理文書更新後にGitHub実状態を再取得して正本とする

## Implemented in this phase

1. `prototype/data/source/fe/question-extraction-review.json`
   - 2009年6月・7月の各80問、計160問を設問単位で構造化
   - 問1〜80の連番を各開催回で保持
   - 公式解答PDFから各設問の正答を個別固定
   - `officialAnswerVerified=true`を160問すべてで保持
   - 本文・4択・図表依存・第三者著作物・domain/unit・解説品質は未確認として明示
   - 全件`importDecision=hold`、Repository-ready 0件を維持
2. `prototype/data/source/fe/question-extraction-candidates.json`
   - `structuredQuestionCount=160`
   - `officialAnswerVerifiedCount=160`
   - review manifest参照を追加
   - source単位の状態を`structured_pending_content_review`へ更新
3. `prototype/data/source/fe/question-extraction-risk-hints.json`
   - PDFテキスト抽出結果の保守的ヒューリスティックから、図・表依存の可能性がある設問を別manifestへ分離
   - 2009年6月: 13件、2009年7月: 17件、計30件
   - heuristic hintは自動採用根拠にせず、個別確認を要求する
4. `prototype/scripts/audit-fe-question-extraction-candidates.mjs`
   - candidate / review / risk-hint 3manifestの整合を検証
   - 160問連番、正答値、正答確認フラグ、全件holdを自動検証
   - 未確認の本文・4択・図表・第三者著作物・分類・解説が勝手にready化されないことを検証
   - visual risk hintがある設問は必ずmanual review待ち・holdであることを検証
   - OCR禁止を維持

既存実装も維持:

- 2024〜2026 source inventory: 13ソース / 660候補 / 20 content-ready / 640 pending
- primary: 1,977問（A 1,810 / B 167）
- supplemental occurrence: 20件
- runtime canonical: 1,996問（A 1,829 / B 167）
- runtime source occurrence: 1,997件
- primary duplicate-content groups: 80
- primary duplicate-source groups: 62
- canonical content fingerprint / source occurrence fingerprintを分離
- primary 1,977問は互換性baselineとして削除しない
- unique一致のみ`sourceOccurrences`へ統合し、ambiguous一致は自動統合しない

## Source verification

公式アーカイブで2009年6月・7月の問題PDF・解答PDFを再確認した。各開催回80問で、公式解答表から問1〜80の正答を個別取得した。問題PDFはテキスト抽出可能だが、表・図・数式を含むため単純なテキスト分割をそのまま配信データへ採用しない。

Web PDF screenshot取得はツール側cache missで失敗したため、今回の実装ではPDFテキスト抽出と公式解答表の照合結果だけを中間manifestへ反映し、本文の「確認済み」判定には使用していない。

## Current measured counts

- audited candidate universe: 820問
- 2024〜2026 staging candidates: 660問
- 2009 structured candidates: 160問
- 2009 official-answer verified: 160問
- 2009 Repository-ready: 0問
- candidate universe Repository-ready: 20問
- candidate universe pending content review: 800問
- heuristic visual-risk hints: 30問

## Next implementation sequence

1. 2009年160問について設問本文と4択を公式PDFと個別照合する。
2. visual-risk hint 30問を優先して、図・表・数式がテキストだけで再現可能か確認する。
3. 第三者著作物・商標・外部資料依存を設問単位で確認し、問題があるものは採用不可理由を固定する。
4. 本文・4択が安全に固定できた設問だけ、既存primaryとのsource/content fingerprint照合へ進める。
5. ambiguous一致は自動統合しない。
6. 採用候補だけdomain/unitを確認し、placeholderではない学習用解説を作成・検証する。
7. ready条件を満たした設問のみsupplemental source dataへ移す。
8. `npm test`、typecheck、lint、normal build、Pages build、`verify:fe`を再実行する。
9. 最終件数と未採用理由を`PROJECT_CONTEXT.md` / `task-list.md`へ反映する。
10. Completion criteria達成後のみ`review_ready`へ更新する。実装担当はPRをReady for review化しない。

## Change forbidden / out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- OCR結果を人手照合なしで大量投入すること
- heuristic risk hintを採用可否の自動判定に使うこと
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
npm run audit:fe-question-coverage
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm run verify:fe
```

## Current CI / Pages

- HEAD `99a43baa156a86369b0e19793438582c196967f0` ではPages build / filter / mock timer / lesson layoutの4workflowがsuccess。
- Latest application/data HEAD `009c62046e8cc7e45b779a2d96c9e739552c3401` の4workflowは実行中。完了結果を次工程開始時にも再取得する。
- PR #7はDraft / open / mergeable。
- work-push Pagesの公開sourceRevisionは最新successful deploy完了後に再確認する。

## Research reference

- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ`
- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク ステージング統合版 2024-2026`
- Repository: `prototype/data/source/fe/question-source-inventory.json`
- Repository: `prototype/data/source/fe/question-extraction-candidates.json`
- Repository: `prototype/data/source/fe/question-extraction-review.json`
- Repository: `prototype/data/source/fe/question-extraction-risk-hints.json`
- 正本はRepository内provenanceと、採用時に再確認した公式一次資料

## Completion updates

完了またはneeds_fixへ移す際は最低限以下を更新する。

- `task-list.md`: status、Current HEAD、検証、PR、Pages、最終件数、未採用理由
- `NEXT_WORK.md`: 固定HEADと次担当向けhandoff
- `PROJECT_CONTEXT.md`: 問題バンク件数、canonical/sourceOccurrence方針、Pages状態
- Repository内source inventory / provenance記録

## Next user command

`実装`で継続。Completion criteria達成後は別チャットで`確認`。
