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

現在の優先タスクは`JLL-FE-QBANK-001`で、状態は`in_progress`。Task Start HEADは`2dfb8e2034644bd9f595b44167eb5ec04b76ff1b`、Draft PRは#7。2009年候補160問のcontent triageは全件分類済みだが、実画像確認、第三者著作物・外部資料review、fingerprint照合、domain/unit、解説品質、最終import判定は未完了のため、次の`実装`でも同タスクを継続する。

### JLL-FE-QBANK-001 current state

- Latest audited application/data implementation HEAD: `e670376a419280dde08d298037a5c3ad9701b174`
- Latest successful Pages evidence synchronization HEAD: `c04c65f2d5f0b0a3287c77fa1ca19c624e8ce174`
- PR #7: Draft / open / `work` → `main`
- 2024〜2026 source inventory: 13ソース / 660候補 / 20 content-ready / 640 pending
- 2009年6月・7月 official text-extractable candidate: 2ソース / 160候補 / 0 ready
- 2009年160問は設問単位review manifestへ構造化済みで、公式正答160件を個別確認済み
- content triage: 160 / 160 classified / 0 unclassified
- official PDF text-layer content review: 106問（6月56問 / 7月50問）
- final text-layer content review pending: 54問
- nonvisual content hold: 15問
  - formatting ambiguity: 9問
  - external reference review required: 6問
- heuristic visual-risk hint: 39問
- visual-risk triage: 39 / 39完了
- visual/layout reconstruction required: 35問
- text-layer-sufficient visual-risk candidate: 4問。ただしvisual render未確認のため採用可ではない
- 監査中に従来visual-risk hintの漏れ9問を検出して補正した
- PDF screenshot取得はtool cache missのため実画像確認未完了。`visualRenderVerified=false`を維持する
- content triage 160 / 160分類済みはfinal content review完了を意味しない
- content review済み106問もbase reviewの最終フラグを自動true化せず、全160問`hold`、Repository-ready 0問を維持する
- `question-extraction-content-holds.json`で非visual 15問を理由別に固定
- `audit-fe-question-content-review.mjs`で106 reviewed / 15 nonvisual hold / 39 visual-riskの3レーンが重複せず160問すべてを覆うことを検証する
- Recent image-only official PDFsは無検証OCRで取り込まない
- 公式の過去問題利用条件はRepositoryへ記録済み。第三者著作物・外部資料依存は設問単位で別途確認する
- Existing primary 1,977問は互換性baselineとして保持し、primary-primary重複を自動削除しない
- New supplemental dataだけをsource/content fingerprintで照合する
- unique一致は`sourceOccurrences`へ統合し、ambiguous一致は自動統合しない

Latest measured runtime at `e670376a419280dde08d298037a5c3ad9701b174`:

- Primary: 1,977問（A 1,810 / B 167）
- Supplemental source occurrences: 20件
- Runtime canonical: 1,996問（A 1,829 / B 167）
- Runtime source occurrences: 1,997件
- Supplementalとprimaryのunique repeated occurrence: 1件
- Existing primary duplicate-content groups: 80
- Existing primary duplicate-source groups: 62

Latest CI for the audited application/data HEAD:

- PR Pages build / verify: `31241587942` / run `543` / success
- PR build job: `93063390999` / success
- Filter layout: `31241587939` / run `124` / success
- Mock timer layout: `31241587945` / run `48` / success
- Lesson layout: `31241587930` / run `25` / success
- `npm ci`: success
- `Verify FE implementation`: success
- Tests: 73 / 73 passed
- Typecheck / lint / normal build / Pages build: success
- work-push Pages build/deploy: `31241585687` / run `542` / success
- Public smoke check: success
- Published sourceRevision: `e670376a419280dde08d298037a5c3ad9701b174`
- Public / repository `build-info.json` sourceRevision一致

### Completed FE work kept as baseline

`JLL-FE-001`、`JLL-FE-002`、`JLL-FE-003`、`JLL-FE-004`、`JLL-FE-LESSON-001`は確認合格し、merge commit方式で`main`へマージ済み。詳細な固定HEAD、CI、Pages証拠は`task-list.md`を正本とする。

JLL-FE-LESSON-001で確定した方針:

1. 最初のFEレッスンは科目B「代入と繰返しを追跡する」とし、擬似言語の代入、繰返し、変数追跡を1つの学習単位にまとめる
2. 到達目標、学習順序、本文、擬似言語例、変数追跡表、確認ポイント、4択確認問題を提供する
3. レッスン概要・本文を演習・模試・履歴処理から分離し、既存の演習UIとフィルターを目的外に変更しない
4. 学習進捗やレッスン完了状態の永続保存は範囲外
5. 375px / 768px / 1,280pxのbrowser audit方針を維持する

JLL-FE-004で確定した方針:

1. 問題文と解説の視覚階層を分離する
2. 模擬試験残時間はサイトヘッダー内の専用ステータス行へ表示する
3. タイマーはactive mock切替時に即時更新し、その後1秒単位で減少する
4. 通常topic演習には模擬試験タイマーを表示しない
5. 公式サンプルの通常topic演習への意図しない混在を防ぐ
6. `JLL-FE-003`で確定した絞り込み順「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」、受験科目ブロック独立、完全日本語単元名を維持する

### 4.1 Work queue

1. `JLL-FE-QBANK-001`: `in_progress`。次の`実装`でformatting ambiguity hold 9問、external-reference hold 6問、visual-risk 39問の最終確認を進め、content review済み106問の第三者著作物・分類・解説品質・fingerprint照合も継続する
2. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## 5. FE question-bank counts

`JLL-FE-QBANK-001`の現行実測:

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足source occurrence: 科目A 20件
- 実行時canonical: 1,996問（科目A 1,829 / 科目B 167）
- 実行時source occurrence: 1,997件
- primary duplicate-content groups: 80
- primary duplicate-source groups: 62
- 2024〜2026 staging candidate: 660問
- 2009 text-extractable candidate: 160問
- 2009 official-answer verified: 160問
- 2009 content triage: classified 160 / unclassified 0
- 2009 text-layer content reviewed: 106問 / pending 54問
- 2009 nonvisual hold: 15問（formatting ambiguity 9 / external reference review 6）
- 2009 visual-risk hints: 39問 / triaged 39問 / visual or layout reconstruction required 35問 / text-layer-sufficient candidate 4問
- 2009 Repository-ready: 0問
- audited candidate universe: 820問 / ready 20問 / final pending review 800問

外部サイトの延べ収録数はユニーク問題数の目標値として扱わず、公式一次資料と正規化指紋を使って年度・開催回・公開区分別に実測する。第三者サイトの問題本文・選択肢・解説・画像は転載しない。Google Drive調査メモは調査ナビであり、採用データの正本はRepositoryに固定したprovenanceと公式一次資料とする。canonical問題とsource occurrenceは分離し、同一内容の再出題を単純に問題数へ加算しない。

## 6. GitHub Pages status

Current `JLL-FE-QBANK-001` validation:

- Audited application/data HEAD: `e670376a419280dde08d298037a5c3ad9701b174`
- PR Pages build / verify workflow: `31241587942` / run `543` / success
- PR build job: `93063390999` / success
- PR-context deploy job: skipped as expected
- Filter browser workflow: `31241587939` / run `124` / success
- Mock timer browser workflow: `31241587945` / run `48` / success
- Lesson browser workflow: `31241587930` / run `25` / success
- work-push Pages workflow: `31241585687` / run `542` / success
- Deploy to GitHub Pages: success
- Verify public Pages resources and revision: success
- Public smoke check: success
- Published sourceRevision: `e670376a419280dde08d298037a5c3ad9701b174`
- Public / repository `build-info.json` sourceRevision一致
- Latest successful Pages evidence synchronization HEAD: `c04c65f2d5f0b0a3287c77fa1ca19c624e8ce174`

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