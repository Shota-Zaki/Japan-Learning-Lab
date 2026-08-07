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

現在の優先タスクは`JLL-FE-003`であり、状態は`review_ready`である。

目的は、採用済みのFE絞り込みパターンBを既定表示にし、内容量の異なるカード間に生じる不要な空白を減らすとともに、canonical IDと実行時に日本語へ正規化された旧単元値を完全な日本語で、可能な限り1行、必要時は意味のまとまりで自然に折り返して表示することである。最新ユーザー指定により、絞り込みのDOM・キーボード順は「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」とする。

確認対象:

- Pull Request: `#4` / open / draft / unmerged
- Fixed application / order-test HEAD: `8e9c0dfcf5ad23e60a40abb090180c526d0347d9`
- Latest audited workflow / Pages source HEAD: `afa550a41d2776543445a3cb727731f6fb902608`
- Repository Pages output synchronization commit: `4cd677854fda9f4a4f204df5519e86f5600fc595`
- Browser audit: workflow `31155342511` / run `63` / success / 9 scenarios
- Browser evidence artifact: `8984932272` / `sha256:e504fafd4f823c65d7ae0f222c1e2aa3869568ed3d2bda2c7a908e1a748aca8c`
- Pages deployment: workflow `31155340547` / run `403` / success
- Pages public revision check: `afa550a41d2776543445a3cb727731f6fb902608` / success
- 受験科目は独立ブロックのまま変更しない
- 分野と回答・復習状態を左側で縦積みする
- 開催回・公開区分を右側の縦長領域として扱う
- 単元は左右スタックの下に全幅カードとして配置する
- カード高さを固定せず、内部スクロールを追加しない
- 現在収録中のcanonical `unitId`と旧形式の実行時単元値を完全な日本語名へ対応付ける
- 単元名は幅を有効利用して1行表示を優先する
- 改行時は意味のまとまりに設定した候補位置だけを使用する
- 375px、768px、1,280pxで検証する
- 未解決単元名と英語ID露出はCIブラウザ監査で失敗させる

`JLL-FE-003`確認合格後の優先順は次のとおり。

1. `JLL-FE-004`: 問題文と解説の視覚階層、模擬試験の固定残り時間、2022年科目Aサンプルの通常演習除外、`令和8年度 免除試験`表記
2. `JLL-FE-LESSON-001`: FEレッスン内容作成
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

`JLL-FE-001`と`JLL-FE-002`は確認合格し、merge commit方式で`main`へマージ済みである。

FE問題数は次の区分を正確に使う。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）

## 5.1 GitHub Pages status

2026-08-07に一時適用したPagesスキップ方針は解除済みとする。

解除根拠:

- workflow `31155340547` / run `403` のbuildがsuccess
- GitHub Pages deployがsuccess
- 公開URLの`build-info.json` Revision一致確認がsuccess
- index、生成アセット、問題データ、サンプル図表のpublic smoke checkがsuccess
- Repository `docs/`と公開証拠の同期commit `4cd677854fda9f4a4f204df5519e86f5600fc595`が作成済み
- `prototype/qa/pages-deployment.json`は`status: success`、`publicSmokeCheck: success`を記録済み

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

絞り込みレイアウトの3案化は`JLL-FE-002`で完了済みであり、パターンBの既定化、余白削減、単元名表示改善、最新の絞り込み順修正は`JLL-FE-003`で`review_ready`である。これ以外の追加変更は別Task IDとして管理する。

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
