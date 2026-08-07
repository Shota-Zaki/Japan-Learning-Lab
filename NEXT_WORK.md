# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`in_progress` — 公式ソース台帳、正規化指紋、source occurrence保持、自動監査まで実装済み。大量の問題本文取り込みは未完了。

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
- Latest application/data implementation HEAD before management-document updates: `37aa0e7e35745fb62d99645f15e8c834b775246e`
- Pull Request: `#7` / `work` → `main` / Draft
- `main` baseline: `2c3700f57f195199d365e009b7b9248746366eab`
- 最新`work` HEADはこの文書更新後に再取得し、GitHub実状態を正本とする

## Implemented in this phase

1. `prototype/data/source/fe/question-source-inventory.json`
   - 2024〜2026の公式候補13ソースをRepository管理下へ固定
   - 候補総数660問
   - 公開問題60問 / 免除制度修了試験600問
   - Repositoryで本文まで検証済みとして扱える件数20問
   - 本文取り込み待ち640問
   - 各ソースに問題PDF、解答PDF、件数、availability、answer mapping、第三者著作物確認フラグを保持
2. `prototype/scripts/audit-fe-question-source-inventory.mjs`
   - source ID / URL重複、HTTPS、公式host、PDF形式、件数、ready件数、著作物確認フラグを自動検証
3. `prototype/src/feQuestionBank.js`
   - `normalizedFingerprint`: 問題内容のcanonical指紋
   - `normalizedSourceFingerprint`: 開催回・問番号のoccurrence指紋
   - primary bankをcanonical優先に変更
   - 別開催回の同一内容を重複登録せず、`sourceOccurrences`へ開催履歴を集約
   - 同一source occurrenceで本文が競合するレコードも二重採用しない
4. `prototype/tests/fe-question-bank-deduplication.test.mjs`
   - 開催回をまたぐ内容重複、primary優先、occurrence保持、source競合、別内容保持を回帰テスト化
5. `prototype/scripts/audit-fe-question-bank-coverage.mjs`
   - primary / supplemental / canonical統合後件数、科目別件数、重複occurrence数、source occurrence総数、staging進捗を実測
6. `prototype/package.json`
   - source inventory監査とcanonical coverage監査を通常`sync:fe` / build経路へ統合
   - 通常buildは外部通信へ依存しない

## Source audit findings

- 公式アーカイブには2009年度以降の免除制度修了試験問題・解答が継続掲載されている。
- 2020年6月、2022年6月、2026年7月の公式問題PDFを実測し、問題本文を安定抽出できるテキストレイヤーがないことを確認した。
- 2009年6月・7月は公式PDF本文をテキスト抽出可能で、各80問・公式解答も確認可能。ただし図表依存問題、第三者著作物、既存primaryとの内容重複、単元分類、解説品質を個別監査してから採用する必要がある。
- Google Driveの2024〜2026 stagingは候補660件と公式URL・正答調査を持つが、問題本文は0件。Driveは調査ナビであり採用データの正本にしない。
- 最近の画像主体PDFを500問規模でOCRして投入する方法は、誤認識と検証コストが大きいため採用しない。
- 第三者サイトの問題文・選択肢・解説・画像は取り込み元にしない。

## Next implementation sequence

1. PR #7の最新HEADに対するPages build workflowと既存browser audit workflowの結果を確認する。
2. `audit:fe-question-coverage`ログからcanonical統合後の実測件数、重複occurrence数を固定する。
3. source inventoryとDrive stagingを照合し、既存primaryと同一開催回・同一内容の候補を除外する。
4. 公式PDF本文を再現可能に抽出できる開催回を優先する。まず2009年6月・7月を候補とし、図表依存・抽出崩れ・第三者著作物を除外する。
5. 採用問題は、設問、4選択肢、公式正答、公式出典、domain/unit、必要な解説を検証した固定source dataとしてRepositoryへ置く。件数合わせのplaceholderは作らない。
6. supplemental生成を複数開催回対応へ拡張し、canonical指紋でprimaryとの重複を除外しつつ`sourceOccurrences`を保持する。
7. 追加データ監査、回帰テスト、normal build / Pages build / `verify:fe`を実行する。
8. 最終収録数、追加不可範囲と理由を`PROJECT_CONTEXT.md` / `task-list.md`へ反映する。
9. Completion criteriaを満たした時点で`review_ready`へ更新する。実装担当はPRをReady for review化しない。

## Change forbidden / out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- OCR結果を人手照合なしで大量投入すること
- 出典未確認・正答未確認・不完全問題を件数合わせで追加すること
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
- 既存問題を意図せず欠落・改変しない
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
npm run audit:fe-question-coverage
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm run verify:fe
```

`audit:fe-question-coverage`はprimary生成後のデータを読むため、clean環境では`npm run sync:fe`または`npm run build`経由でも確認する。

## Current CI / Pages

- Draft PR #7作成済み。
- Application/data implementation HEAD `37aa0e7e35745fb62d99645f15e8c834b775246e`に対しPR workflowが起動済み。
- Pages build workflow run `31194371538` / run `505` は文書更新時点でqueued。
- Filter layout run `31194369077` / run `105` は文書更新時点でin_progress。
- Lesson layout run `31194369156` / run `6` はqueued。
- Mock timer run `31194369155` / run `29` はqueued。
- 最終結果は次回継続前にGitHub実状態から再確認する。

## Research reference

- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ`
- Google Drive: `JLL-FE-QBANK-001 科目A問題バンク ステージング統合版 2024-2026`
- 用途: source候補・欠落範囲・事前調査のナビ
- 正本: Repositoryに固定したsource inventoryと、採用時に再確認した公式一次資料

## Completion updates

完了またはneeds_fixへ移す際は最低限以下を更新する。

- `task-list.md`: status、Current HEAD、検証、PR、Pages、最終件数、未採用理由
- `NEXT_WORK.md`: 確認担当が固定HEADから独立確認できるhandoff
- `PROJECT_CONTEXT.md`: 問題バンク件数、canonical/sourceOccurrence方針、Pages状態
- Repository内source inventory / provenance記録

## Next user command

`実装`で継続。Completion criteria達成後は別チャットで`確認`。
