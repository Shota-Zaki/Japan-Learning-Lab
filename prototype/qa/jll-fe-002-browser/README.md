# JLL-FE-002 Browser Evidence

## Fixed implementation

- Application HEAD: `ca5212d91b3b9792a53d0fac4bc7f69648682798`
- Pull Request: `#3`
- Browser audit workflow run: `31137470033` / run `3`
- Result: success

## Artifact

- Artifact ID: `8978513504`
- Name: `fe-filter-layout-evidence`
- Digest: `sha256:ff04460276151e4a2fc02d65296514d96e6bc3213504ca886b898129bb3b97b7`
- Files: detailed `audit.json`, three 1280px screenshots, artifact README

## Coverage

The Chromium audit executed layouts `1`, `2`, and `3` at `375px`, `768px`, and `1280px`, for nine scenarios in total.

All scenarios confirmed:

- the subject selector remains above and outside the filter grid
- the same four filter fieldsets and DOM order are used
- no page-level horizontal overflow
- no vertical scrollbar or content clipping inside a filter card
- no truncated filter labels
- keyboard checkbox operation remains available
- no console warning, console error, or failed request
- all three layouts return to one column at 375px
- all three layouts are geometrically distinct at 768px and 1280px

`audit-summary.json` preserves the fixed evidence needed for independent review. The full measurements and screenshots remain in the immutable workflow artifact identified above.
