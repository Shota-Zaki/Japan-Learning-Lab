# Next Work

## Current Task ID

`JLL-FE-004`

## Current phase

`needs_fix`

## Next role

修正担当。

確認担当が固定HEADとPR CI、専用browser evidence、Pagesを独立確認した結果、模擬試験タイマーの開始直後表示にBlocking `B2`を確認した。PR #5はmergeせずDraftのまま維持する。

## Objective

JLL-FE-004の既存修正を維持したまま、模擬試験開始直後の残り時間が設定時間を超えて表示されないように修正し、タイマーの正確性を自動検証する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-004`
- Task status: `needs_fix`
- Draft Pull Request: `#5` / `work` → `main`
- Start HEAD: `10ba7d3a1d8a08c7294fb1d361221533314ca9d5`
- Confirmation input `work` / PR HEAD: `7979e7ad5b42757e6a1045cbf9a6976c7e5189fa`
- Independently verified implementation/CI source HEAD: `c0f32f8e1ac01fea0a56db668a0090eaf3931705`
- PR merge ref used by browser evidence: `991017aa63c87ccf511a474e4047c0803bd7dd49`
- `main` HEAD at confirmation start: `f71decc77ef5d2a8f44ca8a08b1bbfdce5f1b366`
- PR review threads: 0
- PR remains unmerged

## Blocking B2: mock timer can start above configured duration

### Severity

`Blocking`

### Reproduction / evidence

1. Open the FE mock setup and start a new subject A mock session.
2. Inspect the header timer immediately after entering the session.
3. Dedicated browser evidence from workflow `31181066801` / run `10`, artifact `8994787534`, records `残り 90:01` for a 90-minute subject A mock at 375px / 768px / 1,280px.
4. The audit otherwise confirms no overlap, no horizontal overflow, sticky positioning, normal-topic non-display, no console messages, and no failed requests.

Expected: a newly started 90-minute mock must never display more than `90:00`.

Actual: the first rendered value can exceed the configured duration. The recorded evidence shows `90:01`; if the learner remains on setup longer before starting, the stale-clock delta can be larger until the first interval tick.

### Root cause

`prototype/src/FeLearningApp.jsx` initializes `headerClockMs` when the learning app mounts. When a new mock session becomes active later, remaining time is calculated once using that older clock value. The effect for the active mock schedules a 1-second interval but does not synchronously refresh the clock before the first displayed calculation. Therefore `startedAt - headerClockMs` can be positive and is added to the configured duration.

### Required correction

- Ensure the initial remaining-time calculation for a newly active mock cannot exceed the configured duration.
- Refresh the clock immediately when the active mock session changes; do not rely only on the first 1-second interval tick.
- Clamp the displayed remaining seconds to the configured duration as a defensive invariant, while preserving the existing zero-floor behavior.
- Preserve current header status-row layout, sticky behavior, normal-topic non-display, subject A/B durations, restored-session behavior, and existing session completion logic.
- Do not change problem text, choices, answers, explanations, JLL-FE-003 filter ordering/layout, lesson content, question-bank scope, or Java work.

## Required test/audit changes

Update automated verification so this regression cannot pass again.

- `prototype/tests/fe-004-regression.test.mjs`: add a deterministic assertion for the remaining-time calculation / initial mock activation so configured duration is an upper bound.
- `prototype/scripts/audit-fe-mock-timer.mjs`: assert the initial timer value is not greater than the configured subject duration; preferably also verify it decreases after time advances.
- Keep 375px / 768px / 1,280px geometry checks, scroll-position checks, normal-topic timer absence, horizontal-overflow check, console/failed-request checks.

## Independent confirmation evidence already passed

- PR CI `Build and deploy GitHub Pages`: workflow `31181066806` / run `457` / success
  - `npm ci`: success
  - `npm run verify:fe`: success
  - tests: 63 / 63 passed
  - TypeScript: success
  - ESLint: success
  - normal build: success
  - Pages build: success
- PR CI `Audit FE filter layout variants`: workflow `31181066826` / run `86` / success
- PR CI `Audit FE mock timer layout`: workflow `31181066801` / run `10` / success, but the evidence itself exposed Blocking B2 because it did not assert the timer upper bound
- Browser evidence artifact: `8994787534`, digest `bc5edd17b8b2c434c7d9b16a7bb83e4717a966a0a7ba2e8f77fd0e9b76fe7575`
- Existing layout checks: 375px / 768px / 1,280px all non-overlap; timer Y remains fixed after 180px scroll; normal topic timer/status/legacy timer counts are 0; no horizontal overflow; console messages and failed requests are empty
- Current public Pages workflow: `31181063294` / run `456` / success
- Current published sourceRevision: `c0f32f8e1ac01fea0a56db668a0090eaf3931705`
- Public smoke check: success
- Pages evidence synchronization `work` HEAD: `7979e7ad5b42757e6a1045cbf9a6976c7e5189fa`

## Required verification after correction

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

Also confirm the corrected browser evidence at 375px / 768px / 1,280px shows an initial timer not exceeding the configured duration and preserves all existing non-overlap / sticky / normal-topic checks.

## Change forbidden for repair role

- `main`へのmerge
- Ready for reviewへの変更
- squash merge / rebase merge / force push
- `work` Branch削除
- 問題本文、選択肢、正答、解説内容そのものの変更
- JLL-FE-003の絞り込み順・レイアウト・受験科目ブロックの再変更
- `JLL-FE-LESSON-001`、`JLL-FE-QBANK-001`、`JLL-JAVA-001`の先行実装

## Repair completion handling

修正後は`docs/`をbuildで更新し、Draft PR #5を更新する。PR CIと`work` Pages公開を確認し、`task-list.md` / `NEXT_WORK.md` / 必要な`PROJECT_CONTEXT.md`を`review_ready`へ戻す。固定HEAD、専用browser evidence、Pages sourceRevisionを記録し、別チャットの`確認`へ戻す。

## Queued work after JLL-FE-004

1. `JLL-FE-LESSON-001`: FEレッスン内容作成
2. `JLL-FE-QBANK-001`: 公式一次資料ベースの問題バンク拡充
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## Next user command

`修正`
