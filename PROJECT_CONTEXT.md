# Project Context

## 1. Project

- Project name: `Japan Learning Lab`
- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Public preview: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Base Branch: `main`
- Permanent working Branch: `work`
- Repository default Branch: `work`
- Pull Request direction: `work` -> `main`
- GitHub Pages artifact: Repository root `docs/`

`work`は継続利用する恒久Branchであり、タスク完了後も削除しない。

## 2. Service purpose

日本語で学習できる複数の学習サイトを、共通プラットフォーム上で提供する。

現在の主要領域は次のとおり。

1. 情報技術者試験向け学習サイト
2. Java学習サイト

各学習サイトは、共通プラットフォームから遷移できるだけでなく、固有URLから直接利用できる独立した入口を持つ。

## 3. Current priority

現在の進行中タスクは、情報技術者試験向け演習機能の修正と検証である。

最新の実装では、複合絞り込み、科目A・科目Bの分離、科目B演習、構造化コンテンツ表示、公式サンプル模擬試験、免除制度問題の補足収録まで進んでいる。

ただし、2022年12月公開の科目Aサンプル問題の図表保持テストが1件失敗しているため、状態は`needs_fix`である。Java学習サイトの再開は、このタスクの確認合格後に行う。

現在状態の詳細は`task-list.md`と`NEXT_WORK.md`を正本とする。

## 4. Technical stack

アプリケーション本体は`prototype/`配下にある。

- Runtime used by CI: Node.js 22
- Package manager: npm
- Frontend: React 19
- Build tool: Vite 6
- Language: JavaScript / JSX
- Type validation: TypeScript compilerによる`checkJs`相当の検査
- Lint: ESLint
- Test runner: Node.js built-in test runner
- Hosting:
  - GitHub Pages
  - 静的成果物はRepository直下`docs/`
  - 別ホスティング向けworkerとserver buildも保持

## 5. Commands

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

- `npm run build`: 通常buildと配布準備
- `npm test`: 全自動テスト
- `npm run typecheck`: 型検査
- `npm run lint`: 静的解析
- `npm run build:pages`: GitHub Pages用成果物をRepository直下`docs/`へ生成
- `npm run verify:fe`: FE同期、通常build、テスト、型検査、Lint、Pages buildを一括実行

## 6. Repository structure

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

## 7. Product hierarchy

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

## 8. FE Learning Lab scope

FE演習は、公式に出典を確認できる問題だけを使用する。

主な機能:

- 科目Aと科目Bを別セッションとして開始
- 科目、分野、単元、開催回、回答状態による絞り込み
- 同一条件群はOR、条件群間はAND
- 各条件群の全選択・全解除
- 選択中条件の上部表示と個別解除
- 折りたたみ型とコンパクトグリッド型の切替
- 科目Bの単一正答・複数正答
- 問題本文、コード、表、リスト、注記、画像、解説の構造化表示
- 通常演習
- ランダム模擬試験
- 2022年12月公開サンプルの固定模擬試験
- 科目A免除制度問題の補足収録
- 一時停止、再開、履歴、復習、再挑戦

問題冊子や解答資料への外部リンクは、学習画面へ表示しない。

## 9. Source data policy

FE問題データの同期元は、Repository内の管理文書と同期スクリプトで固定された別Repositoryの特定commitとblobを使用する。

- 問題文、選択肢、正答を意図せず変更しない
- 出典識別情報を内部データに保持する
- 公式サンプルと実試験過去問題を区別する
- 重複は、科目、問題文、選択肢、正答を正規化した指紋で扱う
- 図表付き問題は、本文、選択肢、図表、正答が揃うまで公開セットとして完成扱いにしない

## 10. Current GitHub state at document creation

- Open Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Base: `main`
- Head: `work`
- Implementation review target HEAD before management-document commits: `64ac59b5631507da07da459c1cc52e9ed9ffdffc`
- Latest failed workflow run: `31073454949`
- Failure: 42 tests中1件失敗
- Failed requirement: 科目Aサンプル問5の公式図表が`image`ブロックとして保持されていない
- Last successful Pages source revision: `a0a3f665dbe9ccb8cbcd829cd7d8af69171996a7`

管理文書追加後のBranch HEADは、この値より後のcommitになる。実装レビューでは、管理文書commitとアプリケーション実装HEADを区別する。
