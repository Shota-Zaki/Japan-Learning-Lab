# Next Work

## Current Task ID

`JLL-FE-002`

## Current phase

`planned`

## Role

次の担当は実装担当。

新しいチャットでRepository実状態を再取得し、現行FE絞り込みUIと関連設計・テストを確認したうえで、受験科目を独立維持したモジュール不規則型Bento Gridを3パターン実装する。

## Objective

FE演習の現在の絞り込み機能、要素、文言、選択肢、操作を変更せず、次の条件でレイアウトだけを変更する。

- **受験科目**は現在と同じ独立ブロックとして維持する
- 受験科目をBento Gridへ含めない
- 受験科目より下にある既存の絞り込みブロックだけをモジュール不規則型Bento Gridへ変更する
- 同じ形へ揃えず、カードごとに幅、高さ、列占有数、段組みを変える
- 視覚的に明確に異なる3パターンを実装する
- 現行画面に存在しない要素は追加しない

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current task: `JLL-FE-002`
- Previous Pull Request: `#1` / merged
- Previous task merge commit: `afbbc24d375c699be0e7b0c5758d9318dc97c1d5`
- Task registration start HEAD: `54352c47d2c904fcba3fe822e09a3ae95f6807ad`
- Task registration commit: `2b2e3a31227ad314e4dca03c65b87489a5a6cc72`
- Open Pull Request at task registration: none
- `work` was one commit ahead of `main` only because `prototype/qa/pages-deployment-failure.json` had been updated automatically before this task was registered
- Implementation start HEAD: 実装開始時にGitHub実状態から再取得して固定する

## User latest instructions

2026-08-07:

- 絞り込みブロックをBento Gridにする
- 各ブロックは同じ形でなくてよい
- モジュール不規則型で実装を進める
- 現在ある要素の追加・変更はしない
- 3パターン作る
- **受験科目は独立させた現在の状態を維持する**

これらを最新かつ優先度の高い仕様として扱う。

## Existing UI constraints to preserve

- 現行コードと実画面から、実際に存在する絞り込み要素、見出し、選択肢、ボタン、説明文を取得する
- 画像生成時に仮置きされた要素や文言を実装根拠にしない
- 条件名と選択肢を省略記号で切らず、全文表示する
- 条件ブロックの高さは内容量に応じて可変にする
- 条件ブロック内には縦スクロールバーを設けない
- 既存の条件群内OR、条件群間ANDを維持する
- 既存の全選択、全解除、選択中条件表示、個別解除を維持する
- 既存のセッション開始条件、問題抽出結果、件数表示を変更しない

## Three-pattern requirement

3パターンは、同一の既存DOM要素または同一データから描画される同一コンポーネントを使用し、配置ルールだけを変える。

各パターンで変更してよいもの:

- CSS Gridの列数
- `grid-column`、`grid-row`、`span`
- カードの幅と高さ
- 条件ブロックの相対的な配置
- 画面幅ごとの再配置順序
- 余白、カード間隔、整列方法

各パターンで変更してはいけないもの:

- 受験科目ブロックの独立性
- 既存要素の追加、削除、名称変更
- 選択肢の追加、削除、並び替え
- 新しい利用者向けパターン切替ボタン
- 新しい説明、凡例、アイコン、装飾目的の情報
- 絞り込みロジック、状態管理、保存値

3パターンの比較方法は、利用者向けUIを増やさずに実現する。実装方法は既存構成に合わせて選ぶが、例として開発・検証用の非表示設定、query parameter、個別の検証ビルド、テスト用routeなどを使用できる。採用候補を切り替えるためだけの通常画面上の操作要素は追加しない。

## First implementation procedure

1. Repository、アクセス権、`main`、`work`、Open Pull Requestを再確認する
2. Root `AGENTS.md`、`PROJECT_CONTEXT.md`、`task-list.md`、この文書を確認する
3. Rootおよび`prototype/`配下の`DESIGN.md`を確認する
4. 現行FE絞り込みコンポーネント、CSS、テスト、画面文言を確認する
5. 受験科目ブロックの現在の構造と配置を固定基準として記録する
6. 現在存在する絞り込み要素を列挙し、生成画像の仮要素を除外する
7. `DESIGN.md`へ、受験科目の独立維持、Bento Grid対象範囲、3パターン、レスポンシブ、アクセシビリティ方針を先行反映する
8. `task-list.md`の状態を`in_progress`へ変更し、開始HEADを固定する
9. 同一要素を使用するモジュール不規則型レイアウトを3パターン実装する
10. 既存の絞り込み操作と抽出結果を自動テストまたはブラウザテストで確認する
11. 375px、768px、1,280px以上で各パターンを確認する
12. 各パターンの比較用スクリーンショットまたは同等証拠をRepositoryへ保存する
13. `npm run verify:fe`を実行する
14. `/docs`をPages buildで更新し、artifact uploadまで確認する
15. Pages deploymentと公開確認は一時スキップ方針に従って延期する
16. `task-list.md`とこの文書を確認工程向けに更新する
17. `work`へcommit、pushする
18. `work`から`main`へのDraft Pull Requestを作成または更新する
19. CI結果を確認し、`review_ready`まで自走する

## Change allowed

- FE絞り込みレイアウトに直接関係するReactコンポーネント
- FE絞り込みレイアウトに直接関係するCSS
- 3パターンの比較・検証に必要な内部設定または検証経路
- 既存挙動の回帰を検出するテスト
- Rootおよび`prototype/`配下の設計文書
- `task-list.md`
- `NEXT_WORK.md`
- buildによって生成される`docs/`
- 3パターンの比較用検証証拠

## Change forbidden

- 受験科目ブロックをBento Gridへ含めること
- 受験科目ブロックの位置、構造、文言、選択肢、操作を変更すること
- 現行画面にない要素、カテゴリ、選択肢、ボタン、アイコン、説明文を追加すること
- 生成イメージだけにある仮要素を追加すること
- 問題本文、選択肢、正答、解説、図表を変更すること
- 絞り込みロジック、問題抽出、状態保存、セッション開始仕様を変更すること
- Java Learning Labの変更を混在させること
- GitHub Pages障害の復旧作業
- Pages復旧前の連続retry
- Force push
- `work`の削除
- 実装担当による`main`へのマージ

## Completion criteria

- `DESIGN.md`が実装前に更新されている
- 受験科目ブロックが現在の独立状態を維持している
- 現行要素だけを使用したモジュール不規則型Bento Gridが3パターン存在する
- 3パターンを比較できるが、通常画面に新しい切替UIが追加されていない
- すべての条件名と選択肢が全文表示される
- 条件ブロック内に縦スクロールバーがない
- 375px、768px、1,280px以上で横はみ出し、重なり、操作不能がない
- キーボード操作、フォーカス表示、ラベル関連付けが維持される
- 既存の絞り込みロジックと抽出結果に回帰がない
- 3パターンの比較証拠がRepositoryに保存される
- `npm run verify:fe`、Pull Request CI、Pages build、artifact uploadが成功する
- Draft Pull Requestが存在し、`task-list.md`と`NEXT_WORK.md`が`review_ready`向けに更新される

## Required validation

- Existing automated tests
- FE filter-specific tests
- TypeScript compiler
- ESLint
- Normal build
- Pages build
- Pages artifact upload
- Browser checks at 375px, 768px, 1,280px以上 for all three patterns
- No page-level horizontal overflow
- No filter-card internal vertical scrollbar
- Full filter-label visibility
- Independent subject block remains unchanged
- Filter selection, deselection, all-select, all-clear, selected-chip removal, question count, and start action behave identically across all three patterns
- Keyboard-only operation and visible focus state

## Temporary GitHub Pages policy

2026-08-07のユーザー指示により、GitHub Pagesが正常完了可能と確認され、方針が明示的に解除されるまで、Pages依存工程を全タスクでスキップする。

スキップ対象:

- Pages deploymentの手動実行または再実行
- 公開Revision一致確認
- 公開画面、Console、Network、公開リソースの確認
- deployment成功後にだけ行える`docs/`と公開証拠の同期
- Pages障害だけを理由にした`blocked`または`needs_fix`

継続対象:

- 通常build
- 自動テスト
- 型検査
- Lint
- Pages build
- Pages artifact upload
- 固定HEAD、差分、ソース、生成物の確認

## Work completion updates

実装完了時に更新する対象:

- `DESIGN.md`
- 必要な場合は`prototype/DESIGN.md`
- `task-list.md`
- `NEXT_WORK.md`
- 3パターンの比較証拠
- Draft Pull Request本文
- CI、検証結果、固定HEAD

## Next planned task

`JLL-JAVA-001`は削除しない。`JLL-FE-002`の確認、採用レイアウト確定、マージ後に再開する。

## Next user command

`実装`
