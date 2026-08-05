# Design QA

## Comparison target

- Source visual truth: `C:\Users\shota\.codex\generated_images\019fd1de-4245-7fe3-bec0-adb158398612\exec-9455e3c5-d845-4714-ba51-5db0f4487590.png` (1672 x 941).
- Current user overrides: reduce the oversized Engineer Learning Lab card whitespace, rename the exam brand to `FE Learning Lab`, allow the current licensed Java icon without requiring an official Coffee Cup asset, and keep design instructions out of visible body copy.
- Browser-rendered implementation:
  - `qa/top-desktop.png` (1264 x 1688)
  - `qa/engineer-desktop.png` (1264 x 1391)
  - `qa/exam-desktop.png` (1264 x 1797)
  - `qa/java-desktop.png` (1264 x 1366)
- Full-view comparison evidence: `qa/design-comparison-final.jpg` (1264 x 2315).
- Focused-region evidence: `qa/engineer-desktop.png`; the Java card icon, FE name, course index, and revised copy are readable at capture size.
- Responsive evidence: `qa/responsive-375.png`, `qa/responsive-768.png`, `qa/responsive-1024.png`, `qa/responsive-1280.png`, and `qa/responsive-breakpoints.jpg`.
- Browser CSS viewport: 1280 x 720; device pixel ratio: 1.5.
- Density normalization: `?qaCapture=1` scales desktop pages to 0.666667 for complete-frame capture. Normal user rendering is unscaled.

## Findings

No actionable P0, P1, or P2 visual differences remain. The user explicitly accepted the current licensed Java icon and confirmed that an official Coffee Cup asset is not required.

## Required fidelity surfaces

- Fonts and typography: Noto Sans JP Variable remains bundled locally. Heading wraps, weights, line heights, and small-label spacing were inspected at desktop, tablet, and mobile widths.
- Spacing and layout rhythm: the Japan home directory now uses a compact full-width Engineer Learning Lab card followed by three equal supporting cards. The prior 490px tall card and its large internal blank region are removed.
- Colors and tokens: pale water blue remains the shared foundation; FE uses green and Java uses orange. The Java icon uses Java Blue `#007396` with an orange-tinted surround.
- Image quality and asset fidelity: the source has no photo assets. Standard UI icons use Phosphor, including the user-approved Java icon.
- Copy and content: the exam brand is `FE Learning Lab` in the header, breadcrumb, intro, Engineer hub card, and footer. Design-rationale phrases such as independent-site architecture, direct-entry behavior, and implementation requirements were removed from visible app copy.
- Accessibility: semantic buttons, navigation landmarks, headings, live feedback, focus states, reduced-motion handling, and mobile tap targets remain intact.

## Interaction and browser checks

- Tested Japan Learning Lab -> Engineer Learning Lab.
- Tested Engineer Learning Lab -> FE Learning Lab.
- Tested Engineer Learning Lab -> Java Learning Lab.
- Tested direct entry and refresh for all existing routes.
- Verified `FE Learning Lab` replaces the old Lab brand throughout the rendered exam site.
- Verified no prompt-leak phrases or old Lab brand remain in `src/` or visible QA states.
- Browser console on a fresh direct application tab: no application errors.

## Comparison history

1. [P2] The primary Engineer Learning Lab tile had a 490px minimum height, spanned three rows, and pushed its copy to the bottom, producing excessive blank space.
2. Fix: changed the directory to a three-column grid, made the Engineer tile span the width at 270px minimum height, and restored normal copy spacing.
3. Post-fix evidence: `qa/top-desktop.png` and `qa/responsive-375.png`.
4. [P2] The old `基本情報技術者試験 Lab` brand and design-instruction copy remained visible.
5. Fix: renamed the brand to `FE Learning Lab` and rewrote the affected paragraphs as learner-facing guidance.
6. Post-fix evidence: `qa/engineer-desktop.png`, `qa/exam-desktop.png`, and `qa/design-comparison-final.jpg`.
7. Resolution: the user confirmed that an official Coffee Cup asset is not required and accepted the current licensed library icon.

## Implementation checklist

- [x] Engineer tile whitespace reduced.
- [x] FE Learning Lab brand applied consistently.
- [x] Design instructions removed from visible body copy.
- [x] User-approved licensed Java icon applied in Java colors.
- [x] Navigation and direct-entry routes rechecked.
- [x] Responsive captures refreshed.
- [x] Production build passes.
- [x] Java icon requirement resolved without an official Coffee Cup asset.

final result: passed
