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
| CI workflow | `.github/workflows/pages.yml` |

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

次の実装タスクは`JLL-FE-LESSON-001`で、状態は`planned`。

`JLL-FE-004`は確認担当の独立確認でBlocking findingなしと判定済み。確認固定HEADは`07e50fa81197899c8b5f740ceceef72aa8d85fb5`、最新CI / browser evidence sourceは`518cd1e8a75ed4acad89c080e81673de6ef7279e`。固定HEADとの差はPages成功証拠同期のみだった。PR #5はmerge commit方式でのmerge、`work`同期、最終Pages再確認を確認担当がこの確認工程内で完了させる。

JLL-FE-004で確定した方針:

1. 問題文は解説より明確に大きく・強く表示し、見出し・余白を含め視覚階層を分離する
2. 模擬試験残時間は本文overlayではなくサイトヘッダー内の専用ステータス行へ表示する
3. 残時間は設定durationを超えず、active mock切替時にclockを即時更新し、その後1秒単位で減少する
4. タイマーはスクロール中も可視で、通常topic演習には表示しない
5. 2022年科目Aサンプルは通常topic演習から除外するが、公式サンプルmock経路は維持する
6. `2026-exemption-07`のlearner-facing表示は`令和8年度 免除試験`とし、元問題データは変更しない
7. `JLL-FE-003`で確定した絞り込み順「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」、受験科目ブロック独立、完全日本語単元名を維持する

JLL-FE-004独立確認証拠:

- PR build workflow: `31184205320` / run `475` / success
- Tests: 64 / 64 passed
- TypeScript / ESLint / normal build / Pages build: success
- Filter browser workflow: `31184205833` / run `95` / success
- Mock timer browser workflow: `31184205087` / run `19` / success
- Browser evidence artifact: `8996046151`
- Artifact digest: `sha256:3c357958f2e7042b2ca75948b80845c78873a33f9cf695824882baffe76ae184`
- 375px / 768px / 1,280pxで開始直後`残り 90:00`、約1.2秒後`残り 89:59`
- timer overlap / horizontal overflow / console error / failed requestなし
- topic演習ではmock timer / status row / legacy inline timer 0件

## 4.1 Work queue

1. `JLL-FE-LESSON-001`: FEレッスン内容作成
2. `JLL-FE-QBANK-001`: 公式一次資料ベースの問題バンク拡充。lesson完了後か、最新ユーザー指示で優先順位が変更された場合に着手
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

`JLL-FE-001`、`JLL-FE-002`、`JLL-FE-003`は確認合格し、merge commit方式で`main`へマージ済み。詳細な完了証拠は`task-list.md`を正本とする。

## 5. FE question-bank counts

現行の区分は次のとおり。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）

`JLL-FE-QBANK-001`では外部サイトの2,960問相当をユニーク問題数の目標値として扱わず、公式一次資料と正規化指紋を使って年度・開催回・公開区分別に実測する。調査参照先と意図は`task-list.md`に記録する。

## 6. GitHub Pages status

JLL-FE-004 pre-merge確認時の最新正常公開:

- Workflow: `31184200357` / run `474` / success
- Build job: success
- Deploy job: success
- Public smoke check: success
- Published sourceRevision: `518cd1e8a75ed4acad89c080e81673de6ef7279e`
- Public / repository `build-info.json` sourceRevision一致
- Published script: `/Japan-Learning-Lab/assets/index-CYNhSz4W.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-D0cQvWA9.css`
- Pages evidence synchronization HEAD: `07e50fa81197899c8b5f740ceceef72aa8d85fb5`

PR #5 merge後は`work`を最新`main`へfast-forward同期し、Pages再公開と公開Revision一致を再確認して最終記録を更新する。

## 7. Technical stack

アプリケーション本体は`prototype/`配下にある。

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

主な用途:

- `npm run build`: FE問題同期、通常build、配布準備
- `npm test`: 全自動テスト
- `npm run typecheck`: 型検査
- `npm run lint`: 静的解析
- `npm run build:pages`: Pages成果物をRepository root `docs/`へ生成
- `npm run verify:fe`: FE同期、通常build、test、typecheck、lint、Pages buildを一括実行

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
