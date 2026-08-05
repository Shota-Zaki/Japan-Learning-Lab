# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable design decisions

- The core hierarchy is `Japan Learning Lab` -> `Engineer Learning Lab` -> either `情報技術者試験` or `Java`.
- Every downstream screen exposes the hierarchy with breadcrumbs and a working return path.
- The information-technology-exam home prioritizes resuming the current lesson, then shows weak areas and review work.
- The `苦手分野` table contains only `分野` and `正答率`; do not add a `状況` column or status badges.
- Use bright surfaces, deep forest-green accents, restrained borders, generous whitespace, and clear Japanese typography. Avoid gradients, heavy shadows, and excessive rounded cards.

## Updated product and visual rules

- Use pale water blue as the shared platform base color. Course sites keep that base but use distinct accents: green for information-technology exams and orange for Java.
- `Japan Learning Lab`, `Engineer Learning Lab`, the information-technology exam site, and the Java site must each work as an independent direct-entry site with its own brand, local navigation, URL, and return path to the wider network.
- The information-technology exam site's user-facing brand is `FE Learning Lab`.
- Do not show time estimates or elapsed-time values in the UI, including lesson duration, review duration, and history duration.
- Every course site has two primary learning modes: `レッスンで学ぶ` and `演習・模試で試す`.
- Platform home pages should feel more editorial and structurally rich than simple link lists, while keeping the existing flat, spacious, accessible visual language.
- Do not expose design rationale or implementation requirements as visible body copy. Write learner-facing guidance only.
- Use an appropriately licensed Java or programming icon in Java Blue / Java Orange. An official Coffee Cup mark is not required.
- FE exercises and mock exams must contain only official past Basic Information Technology Engineer questions. Use `https://www.fe-siken.com/fekakomon.php` only as a UX reference for filtering, question setup, review, and mock-exam flows; do not treat it as the question-content source.
- Treat `https://github.com/Shota-Zaki/Engineer-License-Lab` as the source repository for FE question data.
- Treat the shared Google Drive LAB catalog as the implementation-candidate backlog: `https://drive.google.com/drive/folders/12kS9I7VlZ4zS3FviurYMXX-_hy8WGKCP?usp=drive_link`.
- Implement the initial Engineer Learning Lab courses in this order: `FE Learning Lab` first, then `Java Learning Lab`.
- FE practice loads the image-free, four-choice, subject-A official past-question collection generated from `Engineer-License-Lab/docs/labs/fe/data/question-bank.json` at commit `1402da68e2e74945bc8fa4add829458220917512` and blob `82e64654a22d706a168563883752add70e70ad71`. Regenerate it with `npm run sync:fe`; keep question text, choices, and correct answers byte-stable.
- Keep the 18-question FE seed in `src/data/feQuestions.js` as a byte-stable direct-session and load-failure fallback.
- FE practice supports a setup screen at `/engineer/it-exam/practice/` and an answer session at `/engineer/it-exam/practice/session/`, including source links and results. Do not add time estimates or countdowns.
- FE practice sessions use the lifecycle `in_progress` -> `paused` or `completed`; starting a different session abandons the prior active session so attempts are not duplicated.
- Persist FE session payloads through the Sites D1 binding `DB`. Keep the device cache as an offline/recovery copy, not as the only authoritative store. Validate and normalize saved payloads against the current question bank before displaying them.
- Preserve FE direct-entry routes after the private Sites gateway by mirroring the canonical pathname in the `#jll=` fragment. Keep the existing pathname URLs unchanged.
- FE history is available at `/engineer/it-exam/history/` and must be derived from saved sessions. Do not display invented progress, weak-area, review, or history values.
- FE results show counts, score, conditions, and completion datetime. They do not show estimated or elapsed duration.
- The responsive acceptance widths for FE setup, player, result, and history are 375px, 768px, and 1280px or wider, with no horizontal scrolling and accessible names on icon-only navigation.
