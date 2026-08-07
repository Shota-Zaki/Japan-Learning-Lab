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

進行中タスク、HEAD、CI、Pull Request、GitHub Pagesの最新状態は、このファイルへ固定値として重複記録しない。`task-list.md`、`NEXT_WORK.md`、GitHub実状態を確認する。

## 5. Current priority

`JLL-FE-001`は確認担当の独立レビューに合格し、merge commit方式での`main`マージと`work`同期を行う完了工程にある。Pages依存項目を除く完了条件、自動検証、固定CI artifactによるブラウザ検証にBlocking問題はない。

次のタスクは`JLL-JAVA-001`である。FEタスクのmerge commitと`work`同期をGitHub実状態で確認した後、Java Learning Labの現在設計、既存実装、テスト、未完了範囲を再確認して実装を開始する。

FE問題数は次の区分を正確に使う。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）

最新状態、検証証拠、確認手順は`task-list.md`と`NEXT_WORK.md`を正本とする。GitHub Pages公開成功はJavaタスク開始の前提条件に含めない。

## 5.1 Temporary GitHub Pages skip policy

2026-08-07のユーザー指示により、GitHub Pagesが正常に完了できる状態へ回復したと確認されるまで、すべてのタスクでPages依存工程をスキップする。

スキップ対象:

- GitHub Pages deploymentの実行または再実行を完了条件にすること
- 公開URLの最新Revision一致確認
- 公開画面を使用した表示確認
- 公開リソースのNetwork、Console、スモーク確認
- deployment成功後にだけ行える`docs/`および公開証拠の同期
- Pages障害だけを理由にタスクを`blocked`または`needs_fix`へ変更すること
- Pages復旧確認前の連続retry

継続対象:

- 通常build
- 自動テスト
- 型検査
- Lint
- `npm run build:pages`によるローカルまたはCI上のPages成果物生成
- Pages artifact uploadまでの検証
- ソースコード、生成物、固定HEAD、Pull Request差分の確認
- Pages以外の完了条件に基づく実装、確認、マージ、次タスク開始

自動workflowがpushにより起動した場合も、Pages deployまたは公開確認の結果は判定に使用せず、build・テスト・型検査・Lint・Pages build・artifact uploadの結果だけを使用する。Pages deployの手動再実行は行わない。

解除条件は、GitHub Pagesのdeploymentが正常完了可能であることを実際に確認し、ユーザーまたはRepository管理文書で本ルールを解除した場合とする。解除後に延期した公開確認を別工程として実施する。

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
- Hosting:
  - GitHub Pages
  - 静的成果物はRepository直下`docs/`
  - 別ホスティング向けworkerとserver buildも保持

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
- コンパクトグリッド型の固定絞り込み表示
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

## 11. Source data policy

FE問題データの同期元は、Repository内の管理文書と同期スクリプトで固定された別Repositoryの特定commitとblobを使用する。

- 問題文、選択肢、正答を意図せず変更しない
- 出典識別情報を内部データに保持する
- 公式サンプルと実試験過去問題を区別する
- 重複は、科目、問題文、選択肢、正答を正規化した指紋で扱う
- 図表付き問題は、本文、選択肢、図表、正答が揃うまで公開セットとして完成扱いにしない
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

GitHub Pagesの一時スキップ方針が有効な間は、手順10を状態記録だけに限定し、公開確認やretryをBlocking条件にしない。

新しいチャットでユーザーが送る起動コマンドは、原則として`実装`、`修正`、`確認`のいずれかとする。
