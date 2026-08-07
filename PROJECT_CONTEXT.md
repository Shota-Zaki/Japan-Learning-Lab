# Project Context

このファイルは、Japan Learning Labで使用するプロジェクト固有情報の正本とする。
チャットや作業指示内にプレースホルダーがある場合は、以下の値へ置き換える。

## 1. Chat project context values

| 項目 | プロジェクト固有値 |
|---|---|
| Repository | `Shota-Zaki/Japan-Learning-Lab` |
| Base Branch | `main` |
| Permanent working Branch | `work` |
| Repository default Branch | `work` |
| Pull Request direction | `work` → `main` |
| Application directory | `prototype/` |
| GitHub Pages output | `work` BranchのRepository直下`docs/` |
| GitHub Pages URL | `https://shota-zaki.github.io/Japan-Learning-Lab/` |
| CI runtime | Node.js 22 |
| Package manager | npm |
| Frontend | React 19.2 |
| Build tool | Vite 6.4 |
| Main language | JavaScript / JSX |
| Type validation | TypeScript compiler 7による`tsc --noEmit` |
| Lint | ESLint 10 |
| Test runner | Node.js built-in test runner |
| Install command | `cd prototype && npm ci` |
| Development command | `cd prototype && npm run dev` |
| Build command | `cd prototype && npm run build` |
| Test command | `cd prototype && npm test` |
| Typecheck command | `cd prototype && npm run typecheck` |
| Lint command | `cd prototype && npm run lint` |
| Pages build command | `cd prototype && npm run build:pages` |
| Full FE verification | `cd prototype && npm run verify:fe` |
| CI workflow | `.github/workflows/pages.yml` |

`work`は継続利用する恒久Branchであり、タスク完了後も削除しない。
GitHub Pages用の公開成果物は`work` BranchのRepository直下`docs/`へ生成する。検証、artifact upload、公開はGitHub Actions Workflowから実行する。

## 2. Project

- Project name: `Japan Learning Lab`
- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Public preview: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Base Branch: `main`
- Permanent working Branch: `work`
- Repository default Branch: `work`
- Pull Request direction: `work` → `main`
- GitHub Pages artifact: Repository root `docs/`

## 3. Service purpose

日本語で学習できる複数の学習サイトを、共通プラットフォーム上で提供する。

現在の主要領域は次のとおり。

1. 情報技術者試験向け学習サイト
2. Java学習サイト

各学習サイトは、共通プラットフォームから遷移できるだけでなく、固有URLから直接利用できる独立した入口を持つ。

## 4. Information priority

情報が競合する場合は、次の順番で判断する。

1. 最新のユーザー指示
2. 現在のRepository内容とGitHub設定
3. `task-list.md`
4. `NEXT_WORK.md`
5. `AGENTS.md`
6. この`PROJECT_CONTEXT.md`
7. `DESIGN.md`
8. Pull Request、Issue、CI、GitHub Pagesの実状態
9. 過去チャット
10. 推測または一般的慣習

進行中タスク、HEAD、CI、Pull Request、GitHub Pagesの詳細な最新状態は、`task-list.md`、`NEXT_WORK.md`、GitHub実状態を確認する。

## 5. Current priority

現在の優先タスクは`JLL-FE-004`であり、状態は`review_ready`である。Draft PR #5は未mergeのまま維持し、別チャットの確認担当が固定HEAD、差分、CI、専用browser evidence、Pagesを独立確認する。

JLL-FE-004の目的は次のとおり。

1. 問題文と解説の文字サイズ・太さ・構造に明確な差を付ける
2. 模擬試験の残り時間をサイトヘッダー内の専用ステータス行へ固定し、スクロール中も常時表示し、開始直後を含め設定時間を超えないようにする
3. 2022年科目Aサンプルを通常演習の出題対象から除外する
4. `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

Blocking状態:

- `B1`: resolved。公開アプリのlive entry pointは`AppV5.jsx` → `PlatformShell.jsx` → `FeLearningApp.jsx` / `FeSessionView.jsx`であり、模擬試験タイマーは本文overlayではなく`PlatformHeader`内の専用ステータス行へ移動済み。375px / 768px / 1,280pxで非重複、sticky、通常topic非表示を確認済み
- `B2`: resolved。`FeLearningApp.jsx`で残時間を設定durationへ上限clampし、active mock切替時は1秒intervalを待たずmicrotaskでclockを更新する。専用browser auditで3幅すべて開始直後`残り 90:00`、約1.2秒後`残り 89:59`を確認済み
- 修正担当が把握しているBlocking findingはない。合否は確認担当が固定HEADを基準に独立判定する

修正固定情報:

- `main` HEAD at repair start: `f71decc77ef5d2a8f44ca8a08b1bbfdce5f1b366`
- Repair input HEAD: `1c7da3ad2d5e1a8f68b62de6b5b41045311d0863`
- Corrected implementation / PR source HEAD: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Corrected browser evidence PR merge ref: `a0262bdf0f24d3e02e76eb31a673382e4721c0fc`
- Corrected Pages evidence synchronization HEAD: `a6fed94aba21f8a3298ea72a78b3339c822c5b06`
- `task-list.md` review-ready management commit: `a47882c97f262f50ac00b9a795b3b85e98d74b14`
- この管理文書更新以後の最新`work` / PR HEADはGitHub実状態を正本とする
- PR #5: Draft / `work` → `main` / unmerged
- PR build workflow at corrected source: `31183473005` / run `473` / success
- `npm run verify:fe`: success / tests 64 passed / TypeScript・ESLint・normal build・Pages build success
- PR filter browser workflow: `31183473253` / run `94` / success
- JLL-FE-004専用browser workflow: `31183473016` / run `18` / success
- Browser evidence artifact: `8995751840` / digest `sha256:30fac541c3d940967884c5d85316395675013d20754658bcc9eda5bd5b359872`
- Browser correctness: 375px / 768px / 1,280pxで開始直後`90:00`以下、約1.2秒後`89:59`へ減少
- Browser layout checks: 3幅で全overlap false、180pxスクロール後もtimer Y不変、horizontal overflowなし、通常topicでtimer/status/legacy timer 0件、console message / failed requestなし
- 2022年科目Aサンプルは通常`topic`のみ除外し、`mock`と科目B経路を維持
- `2026-exemption-07`はlearner-facing helperのみで`令和8年度 免除試験`へ変換し、元問題データは非改変
- JLL-FE-003の絞り込み順・レイアウト・受験科目独立性の既存browser auditはsuccess
- 保留メモ「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」は完了済み`JLL-FE-003`で既に反映済みのため追加タスク化不要

`JLL-FE-004`完了後の優先順は次のとおり。

1. `JLL-FE-LESSON-001`: FEレッスン内容作成
2. `JLL-FE-QBANK-001`: 公式一次資料ベースの問題バンク拡充。既存の進行中作業と競合しない時点で着手
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

`JLL-FE-001`、`JLL-FE-002`、`JLL-FE-003`は確認合格し、merge commit方式で`main`へマージ済みである。詳細な完了証拠は`task-list.md`を正本とする。

FE問題数は次の区分を正確に使う。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）

## 5.1 GitHub Pages status

2026-08-07に一時適用したPagesスキップ方針は解除済みとする。

JLL-FE-004修正ソースの最新正常公開:

- Workflow: `31183469063` / run `472` / success
- Public smoke check: success
- Published source Revision: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Public `build-info.json` sourceRevision: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Repository `docs/build-info.json` sourceRevision: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Repository `prototype/qa/pages-deployment.json`: `status: success`, `publicSmokeCheck: success`, workflow run `31183469063` / run `472`
- Published script: `/Japan-Learning-Lab/assets/index-CYNhSz4W.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-D0cQvWA9.css`
- Pages evidence synchronization commit: `a6fed94aba21f8a3298ea72a78b3339c822c5b06`
- `a6fed94`はPages成功証拠同期のみで、修正アプリケーションsourceRevisionは`8e894da0dcf13828151446315b0a53e00e3d62f7`

Pages successだけでタスク完了とはしない。JLL-FE-004は修正担当の検証を満たして`review_ready`へ戻した状態であり、確認担当が独立確認に合格した場合のみ管理文書更新、merge commit方式の`main` merge、`work`同期、最終Pages再確認を行う。

Pages成功後の証拠同期処理で、存在しない任意QAファイルを明示的に`git add`していた不具合は`afa550a41d2776543445a3cb727731f6fb902608`で修正済み。以後は通常どおりPages build、deployment、公開Revision確認を完了条件へ含める。

## 6. Technical stack

アプリケーション本体は`prototype/`配下にある。

- Runtime used by CI: Node.js 22
- Package manager: npm
- Frontend: React 19.2
- Build tool: Vite 6.4
- Language: JavaScript / JSX
- Type validation: TypeScript compiler 7による`tsc --noEmit`
- Lint: ESLint 10
- Test runner: Node.js built-in test runner
- Hosting: GitHub Pages
- Static artifact: Repository root `docs/`
- Additional builds: worker and server build

依存パッケージの正確なversionは`prototype/package.json`とlockfileを正本とする。

## 7. Commands

Repository rootから実行する場合は`prototype/`へ移動する。

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
- `npm run build:pages`: GitHub Pages用成果物をRepository直下`docs/`へ生成
- `npm run verify:fe`: FE同期、通常build、テスト、型検査、Lint、Pages buildを一括実行

## 8. Repository structure

```text
/
├─ .github/
│  └─ workflows/
├─ docs/
│  ├─ index.html
│  ├─ 404.html
│  ├─ .nojekyll
│  └─ 公開用ビルド成果物
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

`prototype/AGENTS.md`と`prototype/DESIGN.md`は、`prototype/`固有の補足規則として扱う。Repository全体の正本はRoot文書である。

## 9. Product hierarchy

```text
Japan Learning Lab
└─ Engineer Learning Lab
   ├─ FE Learning Lab
   └─ Java Learning Lab
```

確定済み方針:

- 各階層でパンくずと戻り先を提供する
- 各コースサイトは独立した入口、ローカルナビゲーション、URLを持つ
- 各コースに「レッスンで学ぶ」と「演習・模試で試す」を用意する
- 学習時間、推定時間、経過時間は表示しない
- 保存値や進捗値を捏造しない

## 10. FE Learning Lab scope

FE演習は、公式に出典を確認できる問題だけを使用する。

主な機能:

- 科目Aと科目Bを別セッションとして開始
- 科目、分野、単元、開催回、回答状態による絞り込み
- 同一条件群はOR、条件群間はAND
- 各条件群の全選択・全解除
- 選択中条件の上部表示と個別解除
- 項目名の全文表示
- 条件群の内容量に応じた可変高さ
- 条件群内スクロールの不使用
- 科目Bの単一正答・複数正答
- 問題本文、コード、表、リスト、注記、画像、解説の構造化表示
- 通常演習
- ランダム模擬試験
- 2022年12月公開サンプルの固定模擬試験
- 科目A免除制度問題の補足収録
- 一時停止、再開、履歴、復習、再挑戦
- 問題番号入力による直接移動
- 問題一覧の内部スクロール
- 通常演習と結果レビューで共通する詳細解説

問題冊子や解答資料への外部リンクは、学習画面へ表示しない。

絞り込みレイアウトの3案化は`JLL-FE-002`で完了済みであり、パターンBの既定化、余白削減、単元名表示改善、最新の絞り込み順修正は`JLL-FE-003`で確認合格・merge済みである。以後の追加変更は別Task IDとして管理する。

## 11. Source data policy

FE問題データの同期元は、Repository内の管理文書と同期スクリプトで固定された別Repositoryの特定commitとblobを使用する。

- 問題文、選択肢、正答を意図せず変更しない
- 出典識別情報を内部データに保持する
- 公式サンプルと実試験過去問題を区別する
- 重複は、科目、問題文、選択肢、正答を正規化した指紋で扱う
- 図表付き問題は、本文、選択肢、正答、必要図表が揃うまで公開セットとして完成扱いにしない
- 固定同期元に公式冊子の図表が存在しない場合は、公式冊子と照合した補完資産をRepository管理下へ置き、対象問題IDを明示して付与する
- 補完資産には意味のある代替テキストを付け、通常buildとPages buildの双方へ含める
- 図表要件は公式冊子の実構成を根拠とし、引継ぎ文書の誤った前提を優先しない

## 12. Chat startup rule

新しいチャットでは、過去チャットの説明だけで作業を開始しない。

最初に次を確認する。

1. Repositoryとアクセス権
2. `main`と`work`
3. Open Pull Request
4. Root `AGENTS.md`
5. Root `PROJECT_CONTEXT.md`
6. Root `task-list.md`
7. Root `NEXT_WORK.md`
8. 必要に応じてRootおよび`prototype/`の`DESIGN.md`
9. 最新CI
10. `docs/`とGitHub Pagesの公開状態

新しいチャットでユーザーが送る起動コマンドは、原則として`実装`、`修正`、`確認`のいずれかとする。