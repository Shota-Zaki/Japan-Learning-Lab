# Next Work

## Current Task ID

`JLL-FE-004`

## Current phase

`review_ready`

## Next role

確認担当。

修正担当がBlocking `B2`を解消し、回帰テスト、PR CI、専用browser evidence、`work` Pagesを更新した。Draft PR #5は未mergeのまま維持する。確認担当は修正担当の説明を前提にせず、最新GitHub実状態と固定HEADを基準に独立確認する。

## Objective

JLL-FE-004の全完了条件と、前回Blockingだった模擬試験開始直後の残時間上限を独立確認する。合格なら管理文書更新、merge commit方式の`main` merge、`work`同期、最終Pages再確認まで行う。不合格ならmergeせず`needs_fix`へ戻す。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-004`
- Task status: `review_ready`
- Draft Pull Request: `#5` / `work` → `main` / unmerged
- Start HEAD: `10ba7d3a1d8a08c7294fb1d361221533314ca9d5`
- Repair input HEAD: `1c7da3ad2d5e1a8f68b62de6b5b41045311d0863`
- Corrected implementation / PR source HEAD: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Corrected browser evidence PR merge ref: `a0262bdf0f24d3e02e76eb31a673382e4721c0fc`
- Corrected Pages evidence synchronization HEAD: `a6fed94aba21f8a3298ea72a78b3339c822c5b06`
- `task-list.md` review-ready update: `a47882c97f262f50ac00b9a795b3b85e98d74b14`
- `PROJECT_CONTEXT.md` repair-context update: `2ab21eb316613e67f3c7749e3b6892934d20f762`
- `main` HEAD at repair start: `f71decc77ef5d2a8f44ca8a08b1bbfdce5f1b366`
- この引継ぎcommit以後の最新`work` / PR HEAD、CI、PagesはGitHub実状態を正本とする

## Resolved Blocking B2

### Previous problem

90分の科目A模試開始直後に、古いclock stateを使って残時間を計算するため`残り 90:01`のように設定時間を超える表示が発生していた。

### Correction

- `prototype/src/FeLearningApp.jsx`の残時間計算を設定durationで上限clampし、0秒下限を維持した
- active mock session切替時は1秒intervalを待たず、microtaskで`Date.now()`を反映する
- 科目A/Bのduration、restored session、sticky header、通常topic非表示、既存session completion logicを変更していない
- `prototype/tests/fe-004-regression.test.mjs`へ決定的回帰テストを追加した
- `prototype/scripts/audit-fe-mock-timer.mjs`へ開始直後上限と時間経過後の減少検証を追加した

## Repair verification evidence

- PR CI `Build and deploy GitHub Pages`: workflow `31183473005` / run `473` / success
- `npm ci`: success
- `npm run verify:fe`: success
- tests: 64 / 64 passed
- TypeScript: success
- ESLint: success
- normal build: success
- Pages build: success
- PR filter browser workflow: `31183473253` / run `94` / success
- JLL-FE-004専用browser workflow: `31183473016` / run `18` / success
- Browser evidence artifact: `8995751840`
- Artifact digest: `sha256:30fac541c3d940967884c5d85316395675013d20754658bcc9eda5bd5b359872`
- Browser widths: 375px / 768px / 1,280px
- 3幅すべて開始直後`残り 90:00`、約1.2秒後`残り 89:59`
- brand / navigation / header actions / problem heading / problem body / answers / session actionsとの矩形重なり: 全てfalse
- 180pxスクロール後もtimer Y座標不変、viewport内表示維持
- horizontal overflow: none
- 通常topic演習のmock timer / status row / legacy inline timer: 全て0件
- browser audit console warning/error: none
- failed request: none
- `work` Pages workflow for corrected application source: `31183469063` / run `472` / success
- Public smoke check: success
- Published sourceRevision: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Public / repository `build-info.json` sourceRevision: `8e894da0dcf13828151446315b0a53e00e3d62f7`
- Pages evidence synchronization commit: `a6fed94aba21f8a3298ea72a78b3339c822c5b06`

## Independent confirmation requirements

確認担当は最新PR HEADを固定し、次を独立確認する。

1. `main` / `work`の最新HEADと差分、PR #5のDraft・mergeable状態、review threadsを確認する
2. `task-list.md`、`NEXT_WORK.md`、`PROJECT_CONTEXT.md`、Root / prototype `DESIGN.md`とGitHub実状態の整合を確認する
3. JLL-FE-004の目的・完了条件・変更禁止範囲に対してPR差分を確認し、問題本文、選択肢、正答、解説、JLL-FE-003絞り込み、レッスン、Javaへの意図しない変更がないことを確認する
4. `prototype/src/FeLearningApp.jsx`のduration上限clampとactive mock切替時clock更新を確認する
5. 回帰テストがstale clockでも科目A 90分・科目B 100分の上限を守り、時間経過で減少することを確認する
6. 最新PR CIでtest、typecheck、lint、normal build、Pages buildが成功していることを確認する
7. 専用browser evidenceで375px / 768px / 1,280pxの開始直後が設定durationを超えず、時間経過で減少し、非重複、sticky、通常topic非表示、horizontal overflowなしを確認する
8. JLL-FE-003の既存filter browser auditが成功していることを確認する
9. 最新`work` Pages公開Revision、`build-info.json`、公開リソース、smoke checkを確認する
10. Blocking findingがなければ合格処理へ進み、1件でもBlockingがあればmergeせず`needs_fix`へ戻す

## Required verification commands

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

ローカル実行不能な場合は、その理由を明示したうえでGitHub Actions固定HEADのworkflow log、artifact、差分、Pagesを独立照合する。

## Pass handling

合格時は以下を順に行う。

- `task-list.md`を`completed`へ更新し、固定HEAD、検証結果、merge commit、Pages結果、次Taskを記録する
- `NEXT_WORK.md`を次タスク`JLL-FE-LESSON-001`の実装担当が単独で開始できる状態へ更新する
- 必要な`PROJECT_CONTEXT.md`を同期する
- 管理文書更新後HEADを再検証する
- PR #5をmerge commit方式で`main`へmergeする
- `main`の結果を確認する
- `work`を最新`main`へfast-forward同期する
- `work` Pages再公開と公開Revisionを確認する
- 最終Repository実状態と管理文書を一致させる

## Fail handling

不合格時はBlocking / Non-blockingを分類し、再現方法、原因候補、修正対象ファイル、具体的修正内容、再検証項目を`task-list.md`と`NEXT_WORK.md`へ記録する。`JLL-FE-004`を`needs_fix`へ戻し、PR #5はDraft・未mergeで維持する。確認担当はアプリケーションコードを修正しない。

## Change forbidden before confirmation pass

- 合格判定前の`main` merge
- squash merge / rebase merge / force push
- `work` Branch削除
- 確認担当によるアプリケーションコード修正
- `JLL-FE-LESSON-001`、`JLL-FE-QBANK-001`、`JLL-JAVA-001`の先行実装

## Queued work after JLL-FE-004

1. `JLL-FE-LESSON-001`: FEレッスン内容作成
2. `JLL-FE-QBANK-001`: 公式一次資料ベースの問題バンク拡充
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## Next user command

`確認`