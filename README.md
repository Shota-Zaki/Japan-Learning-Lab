# Japan Learning Lab

日本語で学習できる複数の学習サイトを、共通プラットフォーム上で提供するRepositoryです。

## Current status

現在の進行中タスクは、FE Learning Labの演習・模擬試験機能の修正です。

状態: `needs_fix`

主な実装は進んでいますが、2022年12月公開の科目Aサンプル問5に必要な公式図表が保持されておらず、最新CIは失敗しています。Java Learning Labの作業再開は、FEタスクの確認合格後です。

最新状態は次の順番で確認してください。

1. `task-list.md`
2. `NEXT_WORK.md`
3. GitHub Pull Request #1
4. 最新GitHub Actions
5. GitHub Pages

## Repository

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Pull Request direction: `work` -> `main`
- Public preview: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Published artifact: Repository root `docs/`

`work`は恒久作業Branchです。タスク完了後も削除しません。

## Project structure

```text
/
├─ .github/
│  └─ workflows/
├─ docs/
│  └─ GitHub Pages用ビルド成果物
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

## Management documents

### `AGENTS.md`

Repository全体の実装、レビュー、Branch、Pages、禁止事項を定義します。

### `PROJECT_CONTEXT.md`

サービス目的、技術スタック、URL、Branch、機能範囲、現在状態を記録します。

### `DESIGN.md`

プラットフォーム全体の画面構成、デザイン原則、レスポンシブ、アクセシビリティを記録します。

### `task-list.md`

タスク状態を管理する唯一の正本です。

### `NEXT_WORK.md`

次の担当が、そのファイルだけで作業を開始できる具体的な引継ぎです。

## Technology

アプリケーション本体は`prototype/`配下にあります。

- Node.js 22
- npm
- React 19
- Vite 6
- ESLint
- TypeScript compilerによる型検査
- Node.js built-in test runner
- GitHub Actions
- GitHub Pages

## Setup

```bash
cd prototype
npm ci
npm run dev
```

## Validation

```bash
cd prototype
npm run build
npm test
npm run typecheck
npm run lint
npm run build:pages
```

FE実装の一括検証:

```bash
cd prototype
npm run verify:fe
```

`npm run verify:fe`は、FE問題同期、通常build、全テスト、型検査、Lint、Pages buildを実行します。

## GitHub Pages

公開成果物は、build処理によってRepository直下`docs/`へ生成します。

最低限、次を維持します。

- `docs/index.html`
- `docs/404.html`
- `docs/.nojekyll`
- 静的アセット
- 必要な公開データ

`docs/`は直接編集せず、原則としてbuildから生成します。

CI失敗時は、直前の成功デプロイが公開され続けます。そのため、現在HEADと公開済みRevisionを区別して確認してください。

## Workflow

### Implementation

新しいチャットで`実装`または`修正`と送ると、Repositoryの`task-list.md`と`NEXT_WORK.md`から作業を再開します。

実装担当は、コード、テスト、設定、設計、`docs/`を更新できますが、自分の実装を`main`へマージしません。

### Review

別の新しいチャットで`確認`と送ると、固定HEAD、差分、テスト、CI、GitHub Pagesを独立して確認します。

Blocking問題がある場合はマージせず、`needs_fix`へ戻します。問題がない場合だけ、管理文書更新、merge commit方式でのマージ、`work`同期、Pages再確認まで行います。

## Current Pull Request

- Pull Request: `#1`
- State: Draft / Open / Unmerged
- Base: `main`
- Head: `work`

現在のBlocking問題と修正手順は`NEXT_WORK.md`を参照してください。
