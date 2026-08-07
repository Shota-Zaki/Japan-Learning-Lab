# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`review_ready`

## Next role

確認担当。

実装担当は、確認でBlockingとなったRepository直下`docs/`の同期を完了した。アプリケーションコードを変更せず、固定アプリケーションHEADのPages成果物を生成・コミットし、同一条件で2回buildして再現性を確認した。

新しいチャットで`確認`と送られたら、Pull Request `#4`の最新HEAD、差分、通常CI、ブラウザ監査、生成済み`docs/`を独立検証する。合格時のみ管理文書更新、merge commit方式のマージ、`work`同期、公開状態確認へ進む。

## Objective

`JLL-FE-003`の実装、ブラウザ挙動、生成済みPages成果物、CI、管理文書の整合性を固定HEADで独立確認する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-003`
- Task status: `review_ready`
- Pull Request: `#4`
- Pull Request state: open / draft / unmerged
- Start HEAD: `1d0eaebf73a4e9567ccb91017edf5b2d470caafe`
- Fixed application / test / browser audit HEAD: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Pages output synchronization commit: `875ac26e5dd506e11a6ec0ff52a48c223251cdb9`
- Standard workflow restoration commit before handoff: `6cc846a4f5b5af97f836f845b96c1a94b8225474`
- Review handoff baseline commit: `3de2d5750678b2cd783f23713e4c95a8a0c6e617`
- Current `work` HEAD: 確認開始時にGitHub実状態から固定する

## Implemented fix

- 固定アプリケーションHEADを`GITHUB_SHA`へ指定してPages buildを実行
- Repository直下`docs/`を完全な生成結果へ置換
- `docs/build-info.json` sourceRevisionを固定HEADへ更新
- `docs/index.html`と`docs/404.html`を最新hash付きassetsへ更新
- `docs/assets/index-BJI--2FR.js`を追加
- `docs/assets/index-DSeV1n5v.css`へ置換
- stale `docs/assets/index-YqsZizrf.js`を削除
- 同一条件のPages buildを2回実行し、`diff -qr`で差分なしを確認
- 一時同期workflowを標準Pages workflowへ復元する工程を実施
- アプリケーションコード、CSS、テスト、監査コード、問題データは変更していない

## Implementation verification evidence

- One-shot synchronization workflow: `31145825406` / run `383` / success
- Synchronization job: `92764918921` / success
- Tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Browser audit: 3 layouts × 375px / 768px / 1,280px、合計9 scenarios success
- Reproducibility: same fixed-revision Pages build twice / no diff
- Fixed sourceRevision: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Generated assets: `index-BJI--2FR.js` / `index-DSeV1n5v.css`
- Pages output commit: `875ac26e5dd506e11a6ec0ff52a48c223251cdb9`

## Previously passed browser evidence

- Pattern B: 単元カード全幅、左側2カード縦積み、右側開催回カード
- 768px left-card gap: `8.8px` / row gap: `8.8px`
- 1,280px left-card gap: `8.8px` / row gap: `8.8px`
- 375px: 既存DOM順の1列
- Final rendered source count: `1997`
- Final option counts: `[3, 24, 28, 4]`
- Horizontal overflow: 0
- Internal scrollbar / clipping: 0
- Raw English unit identifier / unresolved unit label: 0
- Console warning/error: 0
- Failed network request: 0
- Keyboard checkbox operation: success
- DOM order: `分野 → 単元 → 開催回・公開区分 → 回答・復習状態`

## Required independent verification

1. Repository、`main`、`work`、Pull Request `#4`の実状態を再取得する。
2. 最新PR HEADを固定し、`main`との差分を確認する。
3. 一時workflowが残っておらず、`.github/workflows/pages.yml`が標準workflowであることを確認する。
4. `docs/build-info.json` sourceRevisionが`66a03576b5b9ac2c86c35c63045f923137f08a0c`であることを確認する。
5. `docs/index.html`と`docs/404.html`が`index-BJI--2FR.js` / `index-DSeV1n5v.css`を参照することを確認する。
6. stale assetsが削除されていることを確認する。
7. Pages output commit `875ac26e5dd506e11a6ec0ff52a48c223251cdb9`の差分が生成済み`docs/`だけであることを確認する。
8. 最新standard workflowとbrowser workflowのstatus、job、artifact ID、digestを確認する。
9. Tests、TypeScript、ESLint、normal build、Pages build、9-scenario browser auditを独立確認する。
10. PC 1,280px、tablet 768px、mobile 375pxの証拠を確認する。
11. Pull Request commentsと未解決review threadsを確認する。
12. Blocking問題がなければ確認合格処理を一括実行する。

## Required commands

```bash
cd prototype
npm ci
npm test
npm run typecheck
npm run lint
npm run build
GITHUB_SHA=66a03576b5b9ac2c86c35c63045f923137f08a0c npm run build:pages
npm run audit:fe-filter-layouts
```

同じ`GITHUB_SHA`でPages buildを再実行し、Repositoryの`docs/`と生成結果に差分がないことも確認する。

## Change allowed for confirmation

- `task-list.md`
- `NEXT_WORK.md`
- レビュー結果と検証証拠を記録する管理文書
- 明白な管理メタデータの不一致

## Change forbidden for confirmation

- `prototype/src/`のアプリケーションコード
- レイアウトCSS
- テスト、browser audit、workflow
- 問題データ、問題本文、選択肢、正答、解説、図表
- `JLL-FE-004`の先行実装
- レッスン内容作成の先行実装
- Java Learning Labの実装
- Blocking問題がある状態でのマージ
- Squash merge、rebase merge、force push
- `work` Branchの削除

## Pages policy

- Pages build: 必須
- Repository `docs/` synchronization: 完了
- Pages artifact upload: 最新standard workflowで確認
- Pages deployment: temporary skip
- Public URL revision verification: temporary skip
- Pages障害だけを理由に追加retryしない

## Latest user requests queued after this task

`JLL-FE-003`確認合格後、`JLL-FE-004`として次を実装する。

- 問題文と解説の文字サイズ・太さ・構造に差を付ける
- 模擬試験の残り時間を右上へ固定する
- 2022年科目Aサンプルを通常演習へ入れない
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

その後はJavaへ進まず、`JLL-FE-LESSON-001`としてレッスン内容作成を優先する。

## Work completion update targets for confirmation

- `task-list.md`
- `NEXT_WORK.md`
- Pull Request `#4`
- `main` merge commit
- `work` synchronization
- GitHub Pages result

## Next user command

`確認`
