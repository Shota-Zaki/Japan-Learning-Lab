# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`in_progress` — 公式ソース候補管理、canonical/source occurrence分離、重複監査、2009年テキスト抽出候補の安全ガードまで実装済み。問題本文の大量取り込みは未完了。

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
- Latest application/data implementation HEAD: `31f53da8203ffdd451ef45a7d60173e19466fb45`
- Pull Request: `#7` / `work` → `main` / Draft
- `main` baseline: `2c3700f57f195199d365e009b7b9248746366eab`
- 最新`work` HEADはこの管理文書更新後に再取得し、GitHub実状態を正本とする

## Implemented in this phase

1. `prototype/data/source/fe/question-source-inventory.json`
   - 2024〜2026の公式候補13ソースをRepository管理下へ固定
   - staging候補660問 / Repository content-ready 20問 / 640問pending
2. `prototype/scripts/audit-fe-question-source-inventory.mjs`
   - source ID / URL重複、HTTPS、公式host、PDF、件数、ready件数、著作物確認フラグを自動検証
3. `prototype/src/feQuestionBank.js`
   - `normalizedFingerprint`: 問題内容のcanonical指紋
   - `normalizedSourceFingerprint`: 開催回・問番号のsource occurrence指紋
   - 既存primary 1,977問は互換性baselineとして一切削除しない
   - supplementalだけをprimaryへ照合し、unique一致時は`sourceOccurrences`へ開催履歴を集約
   - primary側に同一内容候補が複数ある曖昧一致では勝手に統合しない
4. `prototype/tests/fe-question-bank-deduplication.test.mjs`
   - primary保持、unique一致、ambiguous一致、source競合、別内容保持を回帰テスト化
5. `prototype/scripts/audit-fe-question-bank-coverage.mjs`
   - primary / supplemental / canonical件数、科目別件数、source occurrence総数、primary重複group、候補Universeを実測
6. `prototype/data/source/fe/question-extraction-candidates.json`
   - 2009年6月・7月の公式修了試験を、各80問・合計160問の`candidate_only`としてRepositoryへ固定
   - 公式問題PDF / 公式解答PDF / text layer確認 / 1〜80連番確認を記録
   - `repositoryReadyCount=0`を維持
7. `prototype/scripts/audit-fe-question-extraction-candidates.mjs`
   - OCR禁止を自動検証
   - 設問本文、4択、公式正答、図表依存、第三者著作物、domain/unit、解説品質を確認するまで採用不可という方針を固定
8. `prototype/package.json`
   - source inventory監査、extraction candidate監査、canonical coverage監査を通常`sync:fe` / build経路へ統合
   - 通常buildは外部通信へ依存しない

## Current measured counts

Latest CI (`31f53da8203ffdd451ef45a7d60173e19466fb45`)で実測:

- primary: 1,977問（A 1,810 / B 167）
- supplemental source occurrences: 20問
- runtime canonical: 1,996問（A 1,829 / B 167）
- runtime source occurrences: 1,997件
- supplementalと既存primaryのunique重複occurrence: 1件
- existing primary duplicate-content groups: 80
- existing primary duplicate-source groups: 62
- 2024〜2026 staging candidates: 660問
- 2009 text-extractable candidates: 160問
- audited candidate universe: 820問
- candidate universeでRepository-ready: 20問
- candidate universe pending review: 800問

primary内の重複groupは既存互換性のため削除せず、監査値として扱う。

## Source audit findings

- 公式アーカイブには2009年度以降の免除制度修了試験問題・解答が継続掲載されている。
- 2020年6月、2022年6月、2026年7月の公式問題PDFは、問題本文を安定抽出できるテキストレイヤーがない。
- 2009年6月・7月は公式PDF本文をテキスト抽出可能で、それぞれ問1〜80の連番見出しと公式解答を確認した。
- 2009年分には表・図・数式を含む設問があり、単純なテキスト分割だけで全160問を安全に再現できるとは限らない。
- Google Driveの2024〜2026 stagingは候補660件と公式URL・正答調査を持つが、問題本文は0件。Driveは調査ナビであり採用データの正本にしない。
- 最近の画像主体PDFを大量OCRして投入する方法は採用しない。
- 第三者サイトの問題文・選択肢・解説・画像は取り込み元にしない。

## Next implementation sequence

1. 2009年6月・7月160問を、`question-extraction-candidates.json`を入口に構造化抽出する。
2. 各設問について、設問本文・4択・公式正答が機械抽出結果と公式PDFで一致するか監査する。
3. 表・図・数式依存、抽出崩れ、第三者著作物を要人手確認へ分離し、自動採用しない。
4. 既存primary 1,977問とのsource fingerprint / content fingerprint照合を行う。ambiguous一致は自動統合しない。
5. 採用可能な設問だけdomain/unitを確認し、学習用途として十分な解説を追加して固定source data化する。placeholder解説は作らない。
6. supplemental生成を複数開催回対応へ拡張し、canonical問題と`sourceOccurrences`を分離して出力する。
7. 追加データ監査、回帰テスト、normal build / Pages build / `verify:fe`を再実行する。
8. 最終収録数と未採用理由を`PROJECT_CONTEXT.md` / `task-list.md`へ反映する。
9. Completion criteria達成後のみ`review_ready`へ更新する。実装担当はPRをReady for review化しない。

## Change forbidden / out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- OCR結果を人手照合なしで大量投入すること
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

Application/data implementation HEAD `31f53da8203ffdd451ef45a7d60173e19466fb45`:

- Draft PR #7: open
- Pages build / verify workflow: `31195732534` / run `523` / success
- Build job: `92923438558` / success
- PR-context deploy job: skipped as expected
- Filter layout workflow: `31195732632` / run `114` / success
- Mock timer workflow: `31195732251` / run `38` / success
- Lesson layout workflow: `31195732735` / run `15` / success
- `npm ci` / `verify:fe` / normal build / tests / typecheck / lint / Pages build are covered by the successful Pages build job.
- work-push側の公開sourceRevisionは次回開始時にもGitHub実状態から再確認する。

## Research reference

- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ`
- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク ステージング統合版 2024-2026`
- 用途: source候補・欠落範囲・事前調査のナビ
- 正本: Repository内source/extraction candidate記録と、採用時に再確認した公式一次資料

## Completion updates

完了またはneeds_fixへ移す際は最低限以下を更新する。

- `task-list.md`: status、Current HEAD、検証、PR、Pages、最終件数、未採用理由
- `NEXT_WORK.md`: 確認担当が固定HEADから独立確認できるhandoff
- `PROJECT_CONTEXT.md`: 問題バンク件数、canonical/sourceOccurrence方針、Pages状態
- Repository内source inventory / provenance記録

## Next user command

`実装`で継続。Completion criteria達成後は別チャットで`確認`。
