# JLL-FE-001 Final Independent Review

## Review result

- Role: confirmation
- Result: pass
- Blocking findings: none
- Reviewed Pull Request: `#1`
- Base Branch: `main`
- Head Branch: `work`
- Fixed review HEAD: `d4003fbc2b80a05402100d5bbe4e51a44c87d21f`
- Application validation source: `1c102065233d67253ea89f71f41ff6c9e4aaca3d`
- Pull Request synthetic merge revision used by CI artifact: `95966a21741ba9d06060ae6b10c377ce063675ca`

The eight commits between the application validation source and the fixed review HEAD changed only management documents and Pages failure evidence. No application source, test, build configuration, question data, or generated application asset changed in that interval.

## Automated validation

Pull Request workflow:

- Workflow run ID: `31112859435`
- Run number: `250`
- Build job ID: `92654857512`
- Result: success
- `npm run verify:fe`: success
- Automated tests: 54 passed / 0 failed
- TypeScript validation: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact ID: `8972435856`
- Artifact digest: `sha256:e7ecf4b7966fcddfbc5d5b585f10397e8bfee669ec2baec226cf60a51fe16685`
- Deploy job: skipped as expected for a Pull Request event

## Question-bank validation

The counts have two distinct layers and must not be conflated.

- Primary distributed bank: 1,977 questions
  - Subject A: 1,810
  - Subject B: 167
- Supplemental bank: 20 Subject A questions
- Runtime merged bank shown by the application: 1,997 questions
  - Subject A: 1,830
  - Subject B: 167
- Structured Subject B questions: 142
- 2022 public sample set:
  - Subject A: 60 questions
  - Subject B: 20 questions

Runtime merge tests confirmed that Subject A and Subject B questions sharing source coordinates are not incorrectly deduplicated. Subject A sample questions 5, 6, and 7 retain their figure assets and alternative text. Subject A sample question 9 retains its complete text and four choices.

## Independent artifact browser validation

The downloaded CI Pages artifact was served locally and exercised in a browser. Public GitHub Pages was not used because the temporary Pages skip policy remains active.

### Responsive layout

Validated at viewport widths 1,280 px, 768 px, and 375 px.

- No document-level horizontal overflow
- Filter labels display without ellipsis
- Filter groups use content-dependent height
- Filter groups do not introduce internal vertical scrollbars
- The 1,830-question navigator uses an internal vertical scrollbar

### Standard practice flow

- Started a 30-question standard session
- Direct jump to question 30 succeeded
- Question 30 remained visible in the navigator after the jump
- Input `31` was rejected without navigation and displayed `1から30の問題番号を入力してください。`
- After answering, the result showed the correct answer, correct-answer rationale, per-choice judgments, and related knowledge
- Pause persisted the session to device storage
- A fresh application load detected the paused session and restored question 1 of 30

### Subject B official sample mock flow

- The Subject B official sample was available and enabled as 20 questions / 100 minutes
- During the mock, an answered question displayed only the recorded-answer notice
- Correctness styling and explanation were not exposed during the mock
- After completion, all 20 questions were available in the per-question review
- The review displayed question text, user answer, correct answer, judgment, choices, rationale, per-choice judgments, and related knowledge
- History identified the session as `2022年12月公開サンプル問題` rather than standard practice
- The history view had no horizontal overflow at 375 px

## Previous blocking findings

All previous implementation findings are resolved.

1. Subject B questions were incorrectly removed during runtime merge: resolved by including the subject and full normalized content in the fingerprint; regression tests pass.
2. Completed mock sessions lacked question-by-question answers and explanations: resolved; source, tests, and artifact browser flow pass.
3. Official sample history was labeled as standard practice: resolved; source, tests, and artifact browser flow pass.
4. Current public Pages evidence was unavailable: retained as a deferred non-blocking infrastructure item under the user-approved temporary Pages skip policy.

## Deferred non-blocking items

- GitHub Pages deployment remains affected by the external deployment queue/timeout issue.
- Public revision matching, public UI checks, public Console/Network checks, and successful deployment evidence synchronization remain deferred.
- GitHub Actions reports Node.js 20 deprecation warnings for upstream action versions. The workflow ran those actions on Node.js 24 and completed successfully.

## Decision

`JLL-FE-001` satisfies all non-Pages completion criteria and is approved for merge with a merge commit. GitHub Pages-dependent checks remain explicitly deferred and must not be represented as successful.