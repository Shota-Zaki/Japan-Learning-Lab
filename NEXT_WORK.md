# Next Work

## Current Task ID

`JLL-FE-004`

## Current phase

`needs_fix`

## Next role

修正担当。

確認担当がDraft PR #5を固定HEADで独立確認した結果、模擬試験の固定残り時間がグローバルヘッダー右側の操作領域と重なるBlocking findingを確認した。`main`へのmergeは行わず、PR #5はDraftのまま維持する。

## Objective

FE演習について、次の4点を完了させる。

1. 問題文と解説の文字サイズ・太さ・構造に明確な差を付け、読み分けやすくする
2. 模擬試験の残り時間を画面右上へ固定し、スクロール中も常時確認でき、ヘッダー・本文・操作を覆わないようにする
3. 2022年科目Aサンプルを通常演習の出題対象から除外する
4. `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-004`
- Task status: `needs_fix`
- Draft Pull Request: `#5` / `work` → `main`
- Review input HEAD: `c2bde678c721ce3f889a9b8a380843e20068fdad`
- Start HEAD: `10ba7d3a1d8a08c7294fb1d361221533314ca9d5`
- Fixed implementation HEAD before review: `5e6036980195108ed9f9429be53ebdba01e9ddcb`
- CI-verified application source revision before review management updates: `a1851e21ab0192c3577a03b67f4f79e0b99ce08f`
- PR CI Pages build: workflow `31159735333` / run `413` / success / build job `92807114332`
- PR CI browser audit: workflow `31159735305` / run `64` / success / job `92807114034`
- Review-input work Pages: workflow `31159729019` / run `412` / build・deploy success / sourceRevision `a1851e21ab0192c3577a03b67f4f79e0b99ce08f`
- Review-management work Pages: workflow `31175896418` / run `414` / build job `92857703115` / deploy job `92857819536` / success
- Current published/repository build-info sourceRevision after review-management Pages sync: `f8bccf21e421c0e5e2d442fa1e253ed0891318f5`
- Pages evidence synchronization commit for run 414: `04a075686789012af45ca4347287b0b714224d72`
- Published assets remain `index-CCwVLhbI.js` / `index-eTi5h_EL.css`; review management commits do not change application code
- PR review threads: none

## Blocking finding

### B1. 固定タイマーがヘッダー操作を覆う

**Severity:** Blocking

**Affected files:**

- `prototype/src/FeSessionView.jsx`
- `prototype/src/fe-session-enhancements.css`
- 必要に応じてグローバルヘッダーを定義するコンポーネント / CSS
- Root / prototype `DESIGN.md`（配置方針を変える場合）

**Evidence / reproduction:**

1. `App.jsx`の`.header-actions`には「検索」と「アカウント」の2ボタンがあり、各`.icon-action`は`min-width: 42px`、ボタン間gapは`8px`で、ヘッダー右端へ配置される。
2. JLL-FE-004の`.session-topbar > span > strong`は`position: fixed`、`z-index: 30`で同じ右端へ配置される。
3. 520px以下ではタイマーが`right: 12px`、768pxでは`right: 16px`となり、ヘッダー右端の`.header-actions`と同じ領域を占有する。
4. 1,280pxでもヘッダー右端付近とタイマー右端が重なるため、検索・アカウント操作領域へ被る。
5. 受入条件「375pxを含む対象画面幅で本文や操作を妨げない」およびDESIGNの「ブランド、ナビゲーション、主要操作を覆わない」を満たさない。

**Cause:**

タイマーをヘッダー右上の空き領域へ配置する前提でCSSのみを追加したが、実際のヘッダー右上には`.header-actions`が存在する。実装時の`responsiveBrowserAudit`は`npm run audit:fe-filter-layouts`を再利用しており、JLL-FE-004のタイマー重なりを検査していなかった。

**Required fix:**

- 固定タイマー用の専用領域を確保し、検索・アカウント・グローバルナビゲーションと座標が競合しない構造へ変更する。
- 単純な`z-index`変更で隠すのではなく、DOMまたはレイアウト上でタイマー領域を予約する。必要ならHeaderへ模擬試験タイマー用slot/propを追加するか、ヘッダー直下の固定領域へ移す。
- 375px、768px、1,280pxで、タイマーとブランド、検索、アカウント、グローバルナビ、問題本文、回答操作の矩形が重ならないことを実ブラウザで検証する。
- スクロール後もタイマーが常時見えることを確認する。
- 通常演習では固定タイマーを表示しないことを維持する。
- UI配置方針を変更する場合は実装前にRoot / prototype `DESIGN.md`を更新する。

## Non-blocking / passed checks

- `main`と`work`は分岐なし。review input時点で`work`は`main`より26 commits ahead。
- PR #5はmergeable、Draft維持。
- 問題文と解説の視覚階層CSSは明確に分離されている。
- 2022年科目Aサンプルは通常`topic`候補から除外され、`mock`経路は維持されている。
- `2026-exemption-07`はlearner-facing helperで`令和8年度 免除試験`へ表示され、元データを変更していない。
- PR CIの`npm run verify:fe`はsuccess。63 tests passed、TypeScript、ESLint、normal build、Pages build success。
- review-management Pages run `414`もbuild・deploy・public revision verificationまでsuccess。
- 未解決review thread / reviewなし。
- 保留メモ「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」は完了済み`JLL-FE-003`で既に実装・検証済みのため、追加タスク化不要。

## Change forbidden

- 問題本文、選択肢、正答、解説内容そのものの改変
- JLL-FE-003の絞り込み順・レイアウト・受験科目ブロックの再変更
- `JLL-FE-LESSON-001`、`JLL-FE-QBANK-001`、Java Learning Labの先行実装
- `main`へのmerge
- Pull Requestを勝手にReady for reviewへ変更すること
- Squash merge / rebase merge / force push
- `work` Branchの削除

## Completion criteria for repair

- Blocking B1を解消する
- 375px、768px、1,280pxの実ブラウザ監査でタイマーとヘッダー/主要操作の非重複を証拠化する
- 問題文/解説階層、通常演習除外、免除試験表示の既存3要件を維持する
- 既存セッション、模擬試験、結果レビュー、履歴に回帰がない
- `npm ci`、tests、typecheck、lint、normal build、Pages build、`npm run verify:fe`が成功する
- `docs/`を最新buildで生成する
- Draft PR #5を更新し、CIとwork Pages公開Revisionを確認する
- `task-list.md`と`NEXT_WORK.md`を`review_ready`へ戻し、修正後固定HEADとブラウザ証拠を記録する

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
```

加えてJLL-FE-004専用のブラウザ監査を追加または実行し、少なくとも375px / 768px / 1,280pxでタイマー非重複を機械的に検証する。既存`audit:fe-filter-layouts`だけをJLL-FE-004のタイマー証拠として扱わない。

## Queued work after JLL-FE-004

1. `JLL-FE-LESSON-001`: FEレッスン内容作成
2. `JLL-FE-QBANK-001`: 公式一次資料ベースの問題バンク拡充
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## Work completion update targets

- `DESIGN.md` / `prototype/DESIGN.md`（配置方針変更時）
- `task-list.md`
- `NEXT_WORK.md`
- `PROJECT_CONTEXT.md`
- `docs/`
- Draft Pull Request #5
- CI / JLL-FE-004専用browser evidence / Pages公開結果
- 修正後固定HEAD

## Next user command

`修正`
