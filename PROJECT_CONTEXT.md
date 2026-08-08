# Project Context

このファイルはJapan Learning Labで使用するプロジェクト固有情報の正本とする。進行中タスク、固定HEAD、PR、CI、Pagesの最終状態は`task-list.md`、`NEXT_WORK.md`とGitHub実状態を優先する。

## 1. Project values

| 項目 | プロジェクト固有値 |
|---|---|
| Repository | `Shota-Zaki/Japan-Learning-Lab` |
| Base Branch | `main` |
| Permanent working Branch | `work` |
| Repository default Branch | `work` |
| Pull Request direction | `work` → `main` |
| Application directory | `prototype/` |
| GitHub Pages output | Repository root `docs/` |
| GitHub Pages URL | `https://shota-zaki.github.io/Japan-Learning-Lab/` |
| CI runtime | Node.js 22 |
| Package manager | npm |
| Frontend | React 19.2 |
| Build tool | Vite 6.4.2 |
| Main language | JavaScript / JSX |
| Type validation | TypeScript 7系 `tsc --noEmit` |
| Lint | ESLint 10系 |
| Test runner | Node.js built-in test runner |
| CI / Pages workflow | `.github/workflows/pages.yml` |

`work`は恒久Branchであり削除しない。Pages成果物は`work` push時にGitHub Actionsから検証・build・deployする。`docs/`は手編集せずbuildで生成する。

## 2. Service purpose

日本語で学習できる複数の学習サイトを共通プラットフォーム上で提供する。現在の主要領域は情報技術者試験向け学習サイトとJava学習サイトであり、各サイトは共通プラットフォームからの導線と固有URLからの入口を持つ。

## 3. Information priority

情報が競合する場合は次の順で判断する。

1. 最新のユーザー指示
2. 現在のRepository内容とGitHub実状態
3. `task-list.md`
4. `NEXT_WORK.md`
5. `AGENTS.md`
6. `PROJECT_CONTEXT.md`
7. `DESIGN.md`
8. PR・Issue・CI・Pages
9. 過去チャット
10. 推測

## 4. Current priority

現在の優先タスクは`JLL-FE-QBANK-001`で、状態は`in_progress`。Task Start HEADは`2dfb8e2034644bd9f595b44167eb5ec04b76ff1b`、Draft PRは#7。2009年候補の本文・4択・図表、第三者著作物、分類、解説品質の個別監査が未完了のため、次の`実装`でも同タスクを継続する。

`JLL-FE-LESSON-001`は確認担当の独立確認に合格し、完了済み。

### JLL-FE-QBANK-001 current state

- Latest audited application/data implementation HEAD: `6833ea8b73503c151ecc34a28c19159ef1afaa2b`
- Latest successful Pages evidence synchronization HEAD: `6377bf9bb45db1c5d30558b63a30ea76d8df556b`
- PR #7: Draft / open / `work` → `main`
- 2024〜2026 source inventory: 13ソース / 660候補 / 20 content-ready / 640 pending
- 2009年6月・7月 official text-extractable candidate: 2ソース / 160候補 / 0 ready
- 2009年160問は設問単位review manifestへ構造化済みで、公式正答160件を個別確認済み
- official PDF text-layer content review: 106問（6月56問 / 7月50問）
- text-layer content review pending: 54問
- heuristic visual-risk hint: 39問
- visual-risk triage: 39 / 39完了。35問は図・表・レイアウト再構成が必要、4問はテキスト層だけで意味を保持できる可能性が高い。ただしtriage単独では採用を許可しない
- 監査中に従来visual-risk hintの漏れ9問を検出して補正した
- PDF screenshot取得はtool cache missのため実画像確認未完了。visual review manifestでは`visualRenderVerified=false`を維持する
- 54問の内訳はvisual-risk 39問と、visual-riskではないが数式・下線・テキスト抽出崩れまたは規格・基準等の外部資料参照を別監査すべき15問
- Audited candidate universe: 820問 / 20 ready / 800 final pending review
- 公式の過去問題利用条件を確認し、教育目的利用について許諾・使用料不要、著作権存続、出典明記、改変時明示が必要という条件をRepositoryへ記録した。第三者著作物は設問単位で別途確認する
- Recent image-only official PDFsは無検証OCRで取り込まない
- 2009年候補も、設問・4択・公式正答・図表/表・第三者著作物・domain/unit・解説品質を確認するまでruntimeへ入れない
- text-layer content review済み106問もbase reviewの最終フラグを自動true化せず、全160問`hold`、Repository-ready 0問を維持する
- Existing primary 1,977問は互換性baselineとして保持し、primary-primary重複を自動削除しない
- New supplemental dataだけをsource/content fingerprintで照合する
- unique一致は`sourceOccurrences`へ統合し、ambiguous一致は自動統合しない

Latest measured runtime at `6833ea8b73503c151ecc34a28c19159ef1afaa2b`:

- Primary: 1,977問（A 1,810 / B 167）
- Supplemental source occurrences: 20件
- Runtime canonical: 1,996問（A 1,829 / B 167）
- Runtime source occurrences: 1,997件
- Supplementalとprimaryのunique repeated occurrence: 1件
- Existing primary duplicate-content groups: 80
- Existing primary duplicate-source groups: 62

Latest CI for the audited application/data HEAD:

- PR Pages build / verify: `31241278123` / run `539` / success
- PR build job: `93062558874` / success
- Filter layout: `31241278121` / run `122` / success
- Mock timer layout: `31241278182` / run `46` / success
- Lesson layout: `31241278139` / run `23` / success
- work-push Pages build/deploy: `31241276543` / run `538` / success
- Public smoke check: success
- Published sourceRevision: `6833ea8b73503c151ecc34a28c19159ef1afaa2b`
- Public / repository `build-info.json` sourceRevision一致

### JLL-FE-LESSON-001 final state

- Start HEAD: `82b7c277347c4c6d9c1703a97e2e4c7f185b06df`
- Final audited application / workflow source: `614827ca62be5b72885b7774dc4f621975a6482f`
- Independent confirmation pre-record work HEAD: `6c53a4da57d926cdc2abac62ef8d3a7b6932592b`
- Confirmation record commit: `85943bd4095e88912f8ddae10ad4cc84686f7396`
- Confirmation management PR HEAD: `dc8d93fece42082b18f187ff1b053949c6045cd5`
- PR #6: merged
- Merge method: merge commit
- Merge commit: `2c3700f57f195199d365e009b7b9248746366eab`
- `work`はmerge直後にmerge commitへforceなしでfast-forward同期済み
- Post-merge handoff / final Pages source: `1ed246c1c1f89c968edfd4dc2dacf082a40aecd8`
- Final Pages evidence synchronization HEAD: `07cd2d4aaeed66b6d48734ba470cc747713bd472`
- 以後の`[skip ci]`管理文書commitを含む最新`work` HEADはGitHub実状態を正本とする

JLL-FE-LESSON-001で確定した方針:

1. 最初のFEレッスンは科目B「代入と繰返しを追跡する」とし、擬似言語の代入、繰返し、変数追跡を1つの学習単位にまとめる
2. 到達目標3件、学習順序4段階、本文、擬似言語例、変数追跡表、確認ポイント、4択確認問題を提供する
3. レッスン概要・本文は`FeLessonApp`として演習・模試・履歴処理から分離し、既存の演習UIとフィルターを目的外に変更しない
4. レッスン内容は`prototype/src/data/feLessons.js`へ構造化し、定義整合性を回帰テストで検証する
5. 学習進捗やレッスン完了状態の永続保存は今回の範囲外とし、確認問題の回答だけを画面内状態として扱う
6. Root / `prototype/`の既存`DESIGN.md`方針を維持する
7. 375px / 768px / 1,280pxのレッスン専用browser auditで概要・本文・コード・表・確認問題・responsive layout・horizontal overflow・browser errorを検査する
8. Pages buildの既存webfont除去仕様は維持し、Ubuntu CIのスクリーンショット確認だけ日本語fallback fontを導入する

JLL-FE-LESSON-001 independent validation:

- PR review threads: 0
- PR mergeable before merge: true
- PR merge ref: `c388e165344da10bddbe61f1bcd83b1e46a782a0`
- Node.js: 22.23.1
- Tests: 67 / 67 passed
- TypeScript / ESLint / normal build / Pages build: success
- PR Pages build workflow: `31188040484` / run `491` / success
- Filter browser workflow: `31188040386` / run `102` / success
- Mock timer browser workflow: `31188040635` / run `26` / success
- Lesson browser workflow: `31188040404` / run `3` / success
- Lesson browser artifact: `8997593877`
- Artifact digest: `sha256:288341a6c3961aace6e7b11464dc5c306782f668d51472888ca5f983b30000fa`
- 375px / 768px / 1,280pxの概要・本文6枚を確認担当が独立実画像確認
- horizontal overflow、console error、runtime exception、failed requestなし
- 開始ボタン48px、確認問題選択肢最小54px
- 375px / 768pxは本文ナビを下段stack、1,280pxは右側配置
- 日本語表示、文字切れ、重なりにBlocking findingなし
- 公式問題データファイルはPR変更対象外
- `.github/workflows/pages.yml`は`main` pushでは起動せず、PR (`main`) と`work` pushで検証する構成。standalone main push CIがないことを確認
- Actions runtimeのNode.js 20 deprecated warningはproject Node.js 22検証とは別でNon-blocking

JLL-FE-004で確定した方針も維持する。

1. 問題文は解説より明確に大きく・強く表示し、視覚階層を分離する
2. 模擬試験残時間はサイトヘッダー内の専用ステータス行へ表示する
3. 残時間は設定durationを超えず、active mock切替時に即時更新し、その後1秒単位で減少する
4. タイマーはスクロール中も可視で、通常topic演習には表示しない
5. 2022年科目Aサンプルは通常topic演習から除外し、公式サンプルmock経路は維持する
6. `2026-exemption-07`のlearner-facing表示は`令和8年度 免除試験`とし、元問題データは変更しない
7. `JLL-FE-003`で確定した絞り込み順「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」、受験科目ブロック独立、完全日本語単元名を維持する

### 4.1 Work queue

1. `JLL-FE-QBANK-001`: `in_progress`。次の`実装`で未完了54問をvisual-risk 39問と非visual-risk 15問へ分離して個別監査し、content review済み106問の第三者著作物・分類・解説品質・fingerprint照合も継続する
2. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

`JLL-FE-001`、`JLL-FE-002`、`JLL-FE-003`、`JLL-FE-004`、`JLL-FE-LESSON-001`は確認合格し、merge commit方式で`main`へマージ済み。詳細は`task-list.md`を正本とする。

## 5. FE question-bank counts

`JLL-FE-QBANK-001`の現行実測は次のとおり。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足source occurrence: 科目A 20件
- 実行時canonical: 1,996問（科目A 1,829 / 科目B 167）
- 実行時source occurrence: 1,997件
- primary duplicate-content groups: 80
- primary duplicate-source groups: 62
- 2024〜2026 staging candidate: 660問
- 2009 text-extractable candidate: 160問
- 2009 official-answer verified: 160問
- 2009 text-layer content reviewed: 106問 / pending 54問
- 2009 visual-risk hints: 39問 / triaged 39問 / visual or layout reconstruction required 35問 / text-layer-sufficient candidate 4問
- 2009 Repository-ready: 0問
- audited candidate universe: 820問 / ready 20問 / final pending review 800問

外部サイトの2,960問相当はユニーク問題数の目標値として扱わず、公式一次資料と正規化指紋を使って年度・開催回・公開区分別に実測する。第三者サイトの問題本文・選択肢・解説・画像は転載しない。Google Drive調査メモは調査ナビであり、採用データの正本はRepositoryに固定したprovenanceと公式一次資料とする。canonical問題とsource occurrenceは分離し、同一内容の再出題を単純に問題数へ加算しない。

2009年候補については、公式過去問題利用条件をRepositoryのcandidate manifestに固定した。教育目的利用について許諾・使用料不要であっても著作権は存続し、出典明記と改変時の明示が必要である。第三者著作物や外部資料依存はこの一般条件で自動許可せず、設問単位で確認する。

## 6. GitHub Pages status

Current JLL-FE-QBANK-001 validation:

- Audited application/data HEAD: `6833ea8b73503c151ecc34a28c19159ef1afaa2b`
- PR Pages build / verify workflow: `31241278123` / run `539` / success
- PR build job: `93062558874` / success
- PR-context deploy job: skipped as expected
- Filter browser workflow: `31241278121` / run `122` / success
- Mock timer browser workflow: `31241278182` / run `46` / success
- Lesson browser workflow: `31241278139` / run `23` / success
- work-push Pages workflow: `31241276543` / run `538` / success
- Deploy to GitHub Pages: success
- Verify public Pages resources and revision: success
- Public smoke check: success
- Published sourceRevision: `6833ea8b73503c151ecc34a28c19159ef1afaa2b`
- Public / repository `build-info.json` sourceRevision一致
- Latest successful Pages evidence synchronization HEAD: `6377bf9bb45db1c5d30558b63a30ea76d8df556b`

JLL-FE-LESSON-001 final post-merge publication:

- Intermediate workflow: `31189901419` / run `492`; Pages deploy・public revision確認成功後、後続pushのconcurrencyでjob全体はcancelled
- Final workflow: `31190078701` / run `493` / success
- Final build job: `92904398023` / success
- Final deploy job: `92904601920` / success
- `Deploy to GitHub Pages`: success
- `Verify public Pages resources and revision`: success
- Public smoke check: success
- Published sourceRevision: `1ed246c1c1f89c968edfd4dc2dacf082a40aecd8`
- Public / repository `build-info.json` sourceRevision一致
- Published script: `/Japan-Learning-Lab/assets/index-CVu1iGiK.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-lbWVvDdR.css`
- Final Pages evidence synchronization HEAD: `07cd2d4aaeed66b6d48734ba470cc747713bd472`

管理文書の`[skip ci]`commitは公開sourceRevisionより先行してよい。公開アプリ成果物sourceRevisionと最新Branch HEADは区別して扱う。

## 7. Technical stack

- Runtime used by CI: Node.js 22
- Package manager: npm
- Frontend: React 19.2
- Build tool: Vite 6.4.2
- Language: JavaScript / JSX
- Type validation: TypeScript 7系 `tsc --noEmit`
- Lint: ESLint 10系
- Test runner: Node.js built-in test runner
- Hosting: GitHub Pages
- Static artifact: Repository root `docs/`
- Additional builds: worker / server build

依存versionとscriptは`prototype/package.json`とlockfileを正本とする。

## 8. Commands

```bash
cd prototype
npm ci
npm run dev
npm run audit:fe-question-sources
npm run audit:fe-question-extraction-candidates
npm run audit:fe-question-content-review
npm run audit:fe-question-coverage
npm run build
npm test
npm run typecheck
npm run lint
npm run build:pages
npm run verify:fe
```

## 9. Repository structure

```text
/
├─ .github/workflows/
├─ docs/
├─ prototype/
│  ├─ src/
│  ├─ tests/
│  ├─ scripts/
│  ├─ public/
│  ├─ qa/
│  ├─ worker/
│  └─ package.json
├─ AGENTS.md
├─ PROJECT_CONTEXT.md
├─ DESIGN.md
├─ task-list.md
├─ NEXT_WORK.md
└─ README.md
```

## 10. Management documents

- `AGENTS.md`: 恒久ルール、禁止事項、検証規則
- `PROJECT_CONTEXT.md`: サービス目的、技術構成、URL、Branch、確定方針
- `DESIGN.md`: UI、レスポンシブ、アクセシビリティ方針
- `task-list.md`: タスク状態の唯一の正本
- `NEXT_WORK.md`: 次担当が単独で開始できる具体的指示書
- `prototype/AGENTS.md` / `prototype/DESIGN.md`: application固有補足