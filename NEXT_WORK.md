# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`needs_fix`

## Next role

実装担当。

最新のユーザー指定により、絞り込みブロックの順番を変更する必要がある。旧仕様の実装・検証は完了していたが、現在のDOM順「分野 → 単元 → 開催回・公開区分 → 回答・復習状態」は新しい完了条件を満たさないため、`review_ready`を取り消して`needs_fix`へ戻した。

新しいチャットで`修正`と送られたら、Pull Request `#4`の最新`work` HEADから修正を開始し、コード、テスト、ブラウザ監査、`docs/`、管理文書を新しい順序へ合わせる。実装担当は`main`へマージしない。

## Objective

Bento Gridの既存方針、不要な余白削減、受験科目の独立状態、完全な日本語単元名表示を維持しつつ、絞り込みブロックの表示・DOM・キーボード移動順を次へ変更する。

1. 分野
2. 回答・復習状態
3. 開催回・公開区分
4. 単元

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-003`
- Task status: `needs_fix`
- Pull Request: `#4`
- Pull Request state: open / draft / unmerged
- PR HEAD before this memo: `25c43fa10a3686cf4507d344a832d630669ea1d7`
- Task-list memo commit: `52d37bec7c1a859b8a4150844c2c063785f8262c`
- Current `work` HEAD: 実装開始時にGitHub実状態から再取得して固定する
- Prior fixed application / test / browser audit HEAD: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Prior Pages output synchronization commit: `875ac26e5dd506e11a6ec0ff52a48c223251cdb9`

## Latest user request

絞り込みブロックを次の順番にする。

1. 分野
2. **回答・復習状態**
3. 開催回・公開区分
4. 単元

この指定は`JLL-FE-003`の既存範囲内の修正として扱う。別Task IDは作成しない。

## Required implementation

1. `work`とPull Request `#4`の最新HEADを取得し、開始HEADとして固定する。
2. `AGENTS.md`、`PROJECT_CONTEXT.md`、`DESIGN.md`、`task-list.md`を再確認する。
3. 現在の絞り込みDOM・CSS Grid・テスト・監査コードを確認する。
4. 表示順を「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」へ変更する。
5. DOM順も同じ順序にし、キーボード移動順と読み上げ順を一致させる。
6. 375pxの1列表示でも同じ順序を維持する。
7. 768px・1,280pxでは既存Bento Gridの不規則配置方針を維持しつつ、順序と余白削減を両立する。
8. 受験科目ブロックは独立した現在の状態を変更しない。
9. 単元名の完全日本語表示、可能な限り1行、必要時のみ自然な折返しを維持する。
10. 既存の絞り込み条件、OR/AND評価、件数、開始条件を変更しない。
11. 自動テストとブラウザ監査を新しい順序へ更新する。
12. 必須検証成功後、最新固定HEADのPages buildを生成し、Repository直下`docs/`を同期する。
13. `task-list.md`を`review_ready`へ更新し、`NEXT_WORK.md`を確認担当向けに更新する。
14. `work`へcommit / pushし、Draft Pull Request `#4`を更新する。
15. CI結果を確認し、固定HEADと検証証拠を管理文書へ記録する。

## Change allowed

- `prototype/src/`内のJLL-FE-003絞り込みUIに必要なコード
- JLL-FE-003のレイアウトCSS
- JLL-FE-003に対応するテスト
- JLL-FE-003のbrowser audit
- 必要に応じた`DESIGN.md`
- `docs/`の生成済みPages成果物
- `task-list.md`
- `NEXT_WORK.md`
- Pull Request `#4`の説明

## Change forbidden

- 受験科目ブロックの位置、構造、文言、選択肢、操作変更
- 問題本文、選択肢、正答、解説、図表の改変
- 絞り込み条件、OR/AND評価、件数、開始条件の仕様変更
- `JLL-FE-004`の問題文・解説階層、固定タイマー、出題対象、開催回表記の先行実装
- レッスン内容作成の先行実装
- Java Learning Labの実装
- GitHub Pages deployment障害の復旧や不要なretry
- `main`へのマージ
- Pull Requestを勝手にReady for reviewへ変更すること
- Squash merge、rebase merge、force push
- `work` Branchの削除

## Completion criteria

- 375px、768px、1,280pxで表示順が「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」になっている
- DOM順とキーボード移動順が表示順と一致する
- Bento Gridの既存方針を維持し、不自然な大きな空白がない
- カード高さ固定や条件群内部スクロールを追加していない
- 受験科目ブロックの独立状態が維持されている
- 単元名が完全な日本語で、可能な限り1行、必要時のみ自然に折り返される
- 横はみ出し、重なり、内容切れ、操作不能がない
- fieldset/legend、label/input関連付けが維持される
- Tests、TypeScript、ESLint、normal build、Pages build、browser auditが成功する
- Repository直下`docs/`が最新固定アプリケーションHEADのPages buildと一致する
- Pull Request `#4`がopen / draft / unmergedのまま更新される
- `task-list.md`と`NEXT_WORK.md`が実状態と一致し、確認担当が独立レビュー可能な`review_ready`になる

## Required verification

```bash
cd prototype
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm run audit:fe-filter-layouts
```

ブラウザ監査では最低限、3レイアウト × 375px / 768px / 1,280pxを確認し、順序、横overflow、カード内scroll/clipping、単元名表示、キーボード操作、console error、network errorを記録する。

## Prior evidence retained for regression comparison

旧仕様では次が成功済み。新しい順序へ変更した後も、順序以外の回帰がないことを比較する。

- Tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Browser audit: 3 layouts × 375px / 768px / 1,280px、9 scenarios success
- Horizontal overflow: 0
- Internal scrollbar / clipping: 0
- Raw English unit identifier / unresolved unit label: 0
- Console warning/error: 0
- Failed network request: 0
- Keyboard checkbox operation: success
- Previous DOM order: `分野 → 単元 → 開催回・公開区分 → 回答・復習状態`

## Pages policy

- Pages build: 必須
- Repository `docs/` synchronization: 必須
- Pages artifact upload: 必須
- Pages deployment: temporary skip
- Public URL revision verification: temporary skip
- Pages障害だけを理由に追加retryしない

## Queued work after this task

`JLL-FE-003`確認合格・merge後、`JLL-FE-004`として次を実装する。

- 問題文と解説の文字サイズ・太さ・構造に差を付ける
- 模擬試験の残り時間を右上へ固定する
- 2022年科目Aサンプルを通常演習へ入れない
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

その後はJavaへ進まず、`JLL-FE-LESSON-001`としてレッスン内容作成を優先する。

## Work completion update targets

- `task-list.md`
- `NEXT_WORK.md`
- `DESIGN.md`（必要な場合）
- Pull Request `#4`
- 最新固定HEAD
- CI結果
- `docs/`同期結果

## Next user command

`修正`
