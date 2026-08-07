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

`JLL-FE-LESSON-001`は確認担当の独立確認に合格し、PR #6をmerge commit方式で`main`へmerge済み。

- Start HEAD: `82b7c277347c4c6d9c1703a97e2e4c7f185b06df`
- Final audited application / workflow source: `614827ca62be5b72885b7774dc4f621975a6482f`
- Independent confirmation pre-record work HEAD: `6c53a4da57d926cdc2abac62ef8d3a7b6932592b`
- Confirmation task-list record: `85943bd4095e88912f8ddae10ad4cc84686f7396`
- Confirmation management PR HEAD: `dc8d93fece42082b18f187ff1b053949c6045cd5`
- PR #6: merged
- Merge method: merge commit
- Merge commit: `2c3700f57f195199d365e009b7b9248746366eab`
- `work`はmerge commitへforceなしでfast-forward同期済み
- このcommitはpost-merge handoffとして`work`へ通常pushし、最終Pages build/deployを起動する

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
- Submitted reviews: 0
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
- 確認環境の外向きDNS制約でlocal clone再実行は不可。固定PR merge ref CI、workflow log、browser artifact、Repository差分、Pages公開HTTP smoke checkを独立照合
- Actions runtimeのNode.js 20 deprecated warningはproject Node.js 22とは別でNon-blocking

JLL-FE-004も確認合格・PR #5 merge済み。確定方針は以下を維持する。

1. 問題文は解説より明確に大きく・強く表示し、視覚階層を分離する
2. 模擬試験残時間はサイトヘッダー内の専用ステータス行へ表示する
3. 残時間は設定durationを超えず、active mock切替時に即時更新し、その後1秒単位で減少する
4. タイマーはスクロール中も可視で、通常topic演習には表示しない
5. 2022年科目Aサンプルは通常topic演習から除外し、公式サンプルmock経路は維持する
6. `2026-exemption-07`のlearner-facing表示は`令和8年度 免除試験`とし、元問題データは変更しない
7. `JLL-FE-003`で確定した絞り込み順「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」、受験科目ブロック独立、完全日本語単元名を維持する

### 4.1 Work queue

1. `JLL-FE-QBANK-001`: 次タスク。最終Pages確認完了後、`実装`で開始する
2. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

`JLL-FE-001`、`JLL-FE-002`、`JLL-FE-003`、`JLL-FE-004`、`JLL-FE-LESSON-001`は確認合格し、merge commit方式で`main`へマージ済み。詳細は`task-list.md`を正本とする。

## 5. FE question-bank counts

現行の区分は次のとおり。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）

`JLL-FE-QBANK-001`では外部サイトの2,960問相当をユニーク問題数の目標値として扱わず、公式一次資料と正規化指紋を使って年度・開催回・公開区分別に実測する。第三者サイトの問題本文・選択肢・解説・画像は転載しない。Google Drive調査メモは調査ナビであり、採用データの正本は公式一次資料とする。

## 6. GitHub Pages status

JLL-FE-LESSON-001 pre-merge publication:

- Workflow: `31188038465` / run `490` / success
- Build job: `92897489459` / success
- Deploy job: `92897691974` / success
- `Verify FE implementation`: success
- `Verify public Pages resources and revision`: success
- Public smoke check: success
- Published sourceRevision: `614827ca62be5b72885b7774dc4f621975a6482f`
- Public / repository `build-info.json` sourceRevision一致
- Published script: `/Japan-Learning-Lab/assets/index-CVu1iGiK.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-lbWVvDdR.css`
- Pre-merge Pages evidence synchronization HEAD: `6676ac2f0ed0539d3202db5dc9d500f2c6c301eb`

Post-merge final publicationはこのhandoff commitをsourceRevisionとして`work` pushから再実行する。成功後、workflow run / build job / deploy job / public revision / asset名 / evidence synchronization HEADを`task-list.md`、`NEXT_WORK.md`、本ファイルへ最終記録する。

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
