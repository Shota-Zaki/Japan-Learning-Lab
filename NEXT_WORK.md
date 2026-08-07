# Next Work

## Current Task ID

`JLL-FE-LESSON-001`

## Current phase

`review_ready`

## Next role

確認担当。

実装担当は最初のFEレッスン実装、回帰テスト、375px / 768px / 1,280px browser audit、Draft PR、CI、Pages公開まで完了している。確認担当は実装説明を前提にせず、GitHub実状態と固定HEADから独立確認する。合格時のみ管理文書を更新してmerge commit方式で`main`へmergeし、`work`同期とPages再確認まで行う。不合格時はmergeせず`needs_fix`へ戻す。

## Objective

FE Learning Labの最初のレッスン「代入と繰返しを追跡する」が、学習順序・到達目標・本文・例・確認項目を実用的に提供し、既存の演習・模試・絞り込み・履歴へ回帰を起こしていないことを固定HEADで独立確認する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-LESSON-001`
- Task status: `review_ready`
- Pull Request: `#6` / `work` → `main` / open Draft
- Predecessor merge commit / current `main` base at implementation start: `36641bb1c183ecd489d15280f3070aa98fd1868d`
- Start HEAD: `82b7c277347c4c6d9c1703a97e2e4c7f185b06df`
- Final audited implementation / workflow source: `614827ca62be5b72885b7774dc4f621975a6482f`
- Pages evidence synchronization HEAD before review management updates: `6676ac2f0ed0539d3202db5dc9d500f2c6c301eb`
- `task-list.md` review handoff commit: `0dee6ef67a8a473ca119af24419d0f23151b6c9f`
- `PROJECT_CONTEXT.md` review handoff commit: `0e0450a94c256d0b3d3e0cec3ed6cafbc8137b5e`
- Current HEAD: この`NEXT_WORK.md`更新以後の最新`work` HEADをGitHub実状態から取得する。`614827ca62be5b72885b7774dc4f621975a6482f`以後が管理文書・Pages証拠同期だけか必ず差分確認する

## Implemented scope to inspect

- `prototype/src/data/feLessons.js`
  - Lesson 1 / 科目B / `プログラムの基本要素`
  - 代入、繰返し、変数追跡
  - 到達目標3件、学習順序4段階、本文、擬似言語例、追跡表、確認ポイント、4択確認問題
- `prototype/src/FeLessonApp.jsx`
  - レッスン概要と本文リーダー
  - 演習・模試・履歴から独立した表示
  - 回答後の解説・再確認導線
  - 永続的な完了状態は保存しない
- `prototype/src/fe-lesson.css`
  - desktop / tablet / mobile responsive layout
  - 本文ナビゲーション、確認問題、タップ領域
- `prototype/src/AppV5.jsx` / `prototype/src/main.jsx`
  - FE lesson routeとCSS読込
  - practice / history / session route分離
- `prototype/tests/fe-lessons.test.mjs`
  - レッスン定義、内容要素、knowledge check、route分離の回帰
- `prototype/scripts/audit-fe-lesson.mjs` / `.github/workflows/fe-lesson-audit.yml`
  - 375px / 768px / 1,280px browser audit
  - Pages buildの既存webfont除去仕様は変更せず、CI screenshot環境だけ日本語fallback fontを導入

## Change forbidden during confirmation

- 原則アプリコードを修正しない
- 問題本文、選択肢、正答、解説内容を改変しない
- `JLL-FE-004`で確定した演習・模試UIを目的外に再変更しない
- `JLL-FE-003`で確定した絞り込み順序・配置・単元名表示を変更しない
- `JLL-FE-QBANK-001`を同時に開始しない
- Java Learning Labを先行実装しない
- squash / rebase / force push / `work`削除を行わない
- 合格前にmergeしない

## Independent confirmation checklist

1. GitHub実状態から`main` / `work`最新HEAD、PR #6、レビューthread、CI、Pagesを再取得する
2. `main`との差分を確認し、`614827ca62be5b72885b7774dc4f621975a6482f`以後が管理文書・Pages証拠同期だけであることを確認する
3. `AGENTS.md`、`PROJECT_CONTEXT.md`、`task-list.md`、`NEXT_WORK.md`、Root / `prototype/` `DESIGN.md`を再読する
4. レッスン内容が既存設計と整合し、学習順序・到達目標・本文・例・確認項目を実画面で利用できるか確認する
5. `FeLessonApp`へのrouteがpractice / history / sessionの既存挙動を破壊していないか確認する
6. 公式問題本文、選択肢、正答、解説データに意図しない変更がないか確認する
7. 永続保存を実装していないのに「完了済み」と誤認させる状態がないか確認する
8. PC / tablet / mobileで文字切れ、横はみ出し、重なり、フォーカス、タップ領域、コード・表の可読性を確認する
9. 既存filter auditとmock timer auditも成功していることを確認する
10. 下記必須検証を独立実行または固定PR merge refのCI証拠から再検証する

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
npm run audit:fe-lesson
```

既存回帰確認としてfilter browser auditとmock timer browser auditも確認する。

## Implementation evidence to distrust and independently verify

- Node.js: 22.23.1
- Tests: 67 / 67 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- PR Pages build workflow: `31188040484` / run `491` / success
- Existing filter browser workflow: `31188040386` / run `102` / success
- Existing mock timer browser workflow: `31188040635` / run `26` / success
- FE lesson browser workflow: `31188040404` / run `3` / success
- FE lesson browser artifact: `8997593877`
- Artifact digest: `sha256:288341a6c3961aace6e7b11464dc5c306782f668d51472888ca5f983b30000fa`
- Lesson audit PR merge-ref sourceRevision: `c388e165344da10bddbe61f1bcd83b1e46a782a0`
- 375px / 768px / 1,280px: overview / reader audited, horizontal overflowなし、console / runtime / network failureなし
- 最小target: start 48px、knowledge check choice 54px
- 375px / 768px: lesson section nav下段stack
- 1,280px: body右側に260px section nav
- 6枚の最終screenshotを実装担当が実画像確認し、日本語表示・文字切れ・重なりにBlocking issueなしと報告

## Pages evidence to independently verify

- Final pre-review publication workflow: `31188038465` / run `490` / success
- Build job: `92897489459` / success
- Deploy job: `92897691974` / success
- Published sourceRevision: `614827ca62be5b72885b7774dc4f621975a6482f`
- Public / repository `build-info.json`: sourceRevision一致
- Public smoke check: success
- Published script: `/Japan-Learning-Lab/assets/index-CVu1iGiK.js`
- Published stylesheet: `/Japan-Learning-Lab/assets/index-lbWVvDdR.css`
- Pages evidence synchronization HEAD: `6676ac2f0ed0539d3202db5dc9d500f2c6c301eb`

## Known resolved findings

- Lesson browser audit run #1はアプリ不具合ではなく、読込途中の`document.body`を監査スクリプトが参照したnull error。`31b20188b0d7111976d3c8d9590e16031bfa21a2`でstartup guardを追加しrun #2以後成功
- Pagesは既存方針としてwebfontを除去しsystem font stackを使う。Ubuntu CIには日本語glyphがなかったため初回成功screenshotが豆腐表示になった。`614827ca62be5b72885b7774dc4f621975a6482f`でCI audit環境だけ`fonts-noto-cjk`を導入し、最終run #3のscreenshotで日本語表示を確認。アプリ配信仕様は変更していない
- GitHub Actions側のNode.js 20 deprecated warningはactions runtimeに対する警告で、project検証runtimeはNode.js 22.23.1。Non-blocking

## Unresolved findings

実装担当時点でBlocking findingなし。確認担当が独立確認で新規findingを判断する。

## Pass procedure

合格の場合:

1. `task-list.md`を`completed`向け、`NEXT_WORK.md`を次タスク向けに更新する
2. 管理文書更新を`work`へcommit / pushする
3. 更新後HEADで必要な再検証を行う
4. PR #6をmerge commit方式で`main`へmergeする
5. main CIを確認する
6. `work`を最新mainへfast-forward同期する
7. Pages再公開・public revisionを確認する
8. 最終記録とGitHub実状態を一致させる
9. 次タスク`JLL-FE-QBANK-001`を最新優先順位に従って引き継ぐ

## Fail procedure

不合格の場合:

1. Blocking / Non-blockingを分類する
2. 再現方法、原因候補、対象ファイル、具体的修正、再検証項目を記録する
3. `task-list.md`を`needs_fix`へ更新する
4. `NEXT_WORK.md`を修正担当向けに更新する
5. PR #6はDraft / unmergedのまま維持する

## Dependencies and queued work

1. `JLL-FE-LESSON-001`: `review_ready` / independent confirmation pending
2. `JLL-FE-QBANK-001`: lesson確認・merge完了後。Google Drive調査メモを参照し、公式一次資料を正本として問題バンクを拡充する
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## Latest user correction / memo

保留メモ「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」は`JLL-FE-003`で実装済みのため追加対応不要。

## Completion updates

確認担当は合否に応じて最低限次を更新する。

- `task-list.md`: status、確認固定HEAD、検証、merge commit、Pages、次タスク
- `NEXT_WORK.md`: 次担当が単独で開始できる状態
- `PROJECT_CONTEXT.md`: current priority、確定方針、最終Pages
- PR #6 / `main` / `work`: GitHub実状態と記録を一致させる

## Next user command

`確認`
