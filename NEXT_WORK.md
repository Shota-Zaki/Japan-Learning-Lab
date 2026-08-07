# Next Work

## Current Task ID

`JLL-FE-004`

## Current phase

`review_ready`

## Next role

確認担当。

修正担当がBlocking `B1`を修正し、Draft PR #5のアプリケーション実装、専用ブラウザ監査、PR CI、`work` Pages公開確認まで完了した。実装担当は`main`へmergeせず、PR #5をDraftのまま維持する。確認担当は実装説明を前提にせず、GitHub実状態から最新HEADを再固定して独立確認する。

## Objective

FE演習について、次の4点を確認する。

1. 問題文と解説の文字サイズ・太さ・構造に明確な差がある
2. 模擬試験の残り時間がサイトヘッダー内の専用ステータス行へ表示され、スクロール中も常時見え、ヘッダー・問題本文・回答操作を覆わない
3. 2022年科目Aサンプルが通常演習の出題対象から除外されている
4. `2026年7月科目A免除制度修了試験`が学習者向けに`令和8年度 免除試験`と表示される

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-004`
- Task status: `review_ready`
- Draft Pull Request: `#5` / `work` → `main`
- Start HEAD: `10ba7d3a1d8a08c7294fb1d361221533314ca9d5`
- Blocking修正・専用監査固定HEAD: `4178cecde659c4501d04344ca115f3c70bd19663`
- 修正後Pages証拠同期を含むhandoff前`work` HEAD: `2a25e02c1f8fd2c744a96feec41c335721d4bd93`
- 確認開始時は管理文書更新後の最新`work` / PR HEADをGitHubから再取得する
- PR review threads: 確認開始時に再確認する

## Resolved Blocking B1

### 状態

`resolved by repair / confirmation pending`

### 修正内容

- live entry pointが`AppV5.jsx` → `PlatformShell.jsx` → `FeLearningApp.jsx` / `FeSessionView.jsx`であることを再確認した
- 模擬試験タイマーを本文側の`position: fixed`表示から外し、`PlatformHeader`へ`statusText`を渡す専用ステータス行を追加した
- 専用ステータス行は通常のブランド・グローバルナビゲーションとは別行で通常フローの高さを確保し、stickyなサイトヘッダーと一緒に常時表示する
- 旧`.session-topbar > span > strong`は表示しない
- 通常演習では専用ステータス行とタイマーを生成しない
- Root / prototype `DESIGN.md`を実装前に更新し、専用行・代表幅・非重複要件を設計方針へ反映した
- 旧確認ではlegacy `App.jsx`の`.header-actions`をlive headerとして扱っていたが、現在の公開経路は`AppV5.jsx`である。確認担当はlegacy UIではなく実際のentry pointを基準に判定すること。ただし旧タイマーが専用レイアウト領域を持たなかった問題自体は構造修正済み

### 専用browser evidence

Workflow: `Audit FE mock timer layout`

- workflow run: `31180417818` / run `7` / success
- job: `92872090509` / success
- evidence artifact: `8994534328` / `fe-mock-timer-evidence`
- widths: 375px / 768px / 1,280px
- 375px initial: timer `y=80–116`, problem heading `y≈311`以降、problem body `y≈353`以降、answers `y≈408`以降、session actions `y≈821`以降、全overlap `false`
- 768px initial: timer `y=96–136`, problem heading `y≈343`以降、全overlap `false`
- 1,280px initial: timer `y=107–147`, problem heading `y≈360`以降、全overlap `false`
- 180pxスクロール後も各幅でタイマーのY座標は不変
- brand / global navigation / optional header actions / problem heading / problem body / answers / session actionsとの矩形重なりなし
- page horizontal overflowなし
- 通常topic演習では`.fe-mock-timer`、mock status row、legacy inline timerのいずれも0件
- console warning/error、failed requestなし

## Validation already passed by repair role

- PR CI `Build and deploy GitHub Pages`: workflow `31180417745` / run `451` / success
  - `npm ci`: success
  - `npm run verify:fe`: success
  - tests: 63 / 63 passed
  - TypeScript: success
  - ESLint: success
  - normal build: success
  - Pages build: success
- PR CI `Audit FE filter layout variants`: workflow `31180417961` / run `83` / success
- PR CI `Audit FE mock timer layout`: workflow `31180417818` / run `7` / success
- `work` Pages: workflow `31180413956` / run `450` / success
- Pages public smoke check: success
- Pages sourceRevision: `4178cecde659c4501d04344ca115f3c70bd19663`
- public/repository `build-info.json` sourceRevision: `4178cecde659c4501d04344ca115f3c70bd19663`
- published script: `index-22-KQ0Ti.js`
- published stylesheet: `index-D0cQvWA9.css`
- Pages evidence synchronization commit: `2a25e02c1f8fd2c744a96feec41c335721d4bd93`

## Confirmation scope

固定HEADを基準に、実装担当の説明を信用せず次を独立確認する。

- `main`との差分、禁止範囲、Task目的・完了条件
- live entry pointとタイマーの実DOM / CSS構造
- 375px / 768px / 1,280pxでブランド、グローバルナビゲーション、存在する場合のヘッダー操作、問題見出し、問題本文、回答、セッション操作とタイマーが重ならないこと
- スクロール後もタイマーが常時表示されること
- 通常演習にタイマーが出ないこと
- 問題文/解説の視覚階層
- 2022年科目Aサンプルの通常演習除外とmock経路維持
- `令和8年度 免除試験`のlearner-facing表示と元データ非改変
- 既存セッション、模擬試験、結果レビュー、履歴の回帰
- test / typecheck / lint / normal build / Pages build / `verify:fe`
- 専用browser evidence artifactとCIログ
- `docs/`、公開Pages、`build-info.json`、管理文書の整合

## Change forbidden for confirmation role

- 原則としてアプリケーションコードを修正しない
- 問題本文、選択肢、正答、解説内容そのものの改変
- JLL-FE-003の絞り込み順・レイアウト・受験科目ブロックの再変更
- `JLL-FE-LESSON-001`、`JLL-FE-QBANK-001`、Java Learning Labの先行実装
- squash merge / rebase merge / force push
- `work` Branchの削除

## Required verification

```bash
cd prototype
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm run verify:fe
npm run audit:fe-mock-timer
```

GitHub Actionsの固定HEAD evidenceを利用してもよいが、確認担当はPR差分・CI・artifact・Pagesを独立照合する。

## Pass handling

合格なら、確認担当が管理文書を`completed`と次タスク向けに更新し、`work`へcommit/push後に更新後HEADを再検証する。その後PR #5をmerge commit方式で`main`へmergeし、`work`を最新`main`へfast-forward同期し、Pages再公開と最終Revisionを確認する。

## Failure handling

Blockingが残る場合はmergeしない。`task-list.md`を`needs_fix`、この`NEXT_WORK.md`を修正担当向けに更新し、再現方法、原因、修正対象、具体的修正、再検証項目を記録する。

## Queued work after JLL-FE-004

1. `JLL-FE-LESSON-001`: FEレッスン内容作成
2. `JLL-FE-QBANK-001`: 公式一次資料ベースの問題バンク拡充
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## Work completion update targets

- `task-list.md`
- `NEXT_WORK.md`
- `PROJECT_CONTEXT.md`
- Draft Pull Request #5
- merge後の`main` / `work`
- CI / JLL-FE-004専用browser evidence / Pages公開結果

## Next user command

`確認`
