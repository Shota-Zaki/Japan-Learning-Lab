# JLL-FE-003 Browser Evidence

- Status: passed
- Fixed implementation HEAD: `8e9c0dfcf5ad23e60a40abb090180c526d0347d9`
- Audited `work` HEAD: `afa550a41d2776543445a3cb727731f6fb902608`
- Workflow: `31155342511` / run `63`
- Artifact: `8984932272`
- Artifact digest: `sha256:e504fafd4f823c65d7ae0f222c1e2aa3869568ed3d2bda2c7a908e1a748aca8c`
- Variants: 1, 2, 3
- Viewports: 375, 768, 1280px
- Scenarios: 9
- Required order: `分野 → 回答・復習状態 → 開催回・公開区分 → 単元`
- Japanese unit-label verification: passed
- Screenshots: 9 files, one for each layout and viewport combination
- Checks: independent subject selector, four filter groups, stable DOM order, stable keyboard group order, layout 2 left-stack gap, no page overflow, no card scrollbars, no clipping, complete Japanese labels, keyboard checkbox operation, distinct layouts at 768px and 1280px, no console or network errors.

The full generated evidence is retained in GitHub Actions artifact `8984932272`. `audit.json` contains the fixed evidence summary used for review handoff.
