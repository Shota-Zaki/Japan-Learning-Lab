import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { isFeQuestionAvailableForSetup } from "../src/feQuestionAvailability.js";
import { fePeriodLabel, feQuestionTitle, feSourceDisplayLabel } from "../src/feLearnerLabels.js";

test("2022 subject A sample is excluded only from normal topic setup", () => {
  const sample = { subject: "A", periodId: "2022-sample" };
  assert.equal(isFeQuestionAvailableForSetup(sample, "topic"), false);
  assert.equal(isFeQuestionAvailableForSetup(sample, "mock"), true);
  assert.equal(isFeQuestionAvailableForSetup({ ...sample, subject: "B" }, "topic"), true);
});

test("exemption exam learner-facing labels are normalized without mutating source data", () => {
  const question = {
    id: "fe-exemption-202607-q001",
    periodId: "2026-exemption-07",
    periodLabel: "2026年7月 科目A免除制度 修了試験",
    title: "2026年7月 修了試験 問1",
    sourceRef: "2026年7月 科目A免除制度 修了試験 問1",
    sourceQuestionNumber: 1,
  };
  assert.equal(fePeriodLabel(question.periodId, question.periodLabel), "令和8年度 免除試験");
  assert.equal(feQuestionTitle(question), "令和8年度 免除試験 問1");
  assert.equal(feSourceDisplayLabel(question), "令和8年度 免除試験 問1");
  assert.equal(question.periodLabel, "2026年7月 科目A免除制度 修了試験");
  assert.equal(question.sourceRef, "2026年7月 科目A免除制度 修了試験 問1");
});

test("mock timer never exceeds configured duration even when the first clock value is stale", () => {
  const learningApp = fs.readFileSync(new URL("../src/FeLearningApp.jsx", import.meta.url), "utf8");
  const helperSource = learningApp.match(/function mockDurationMinutes\(session\) \{[\s\S]*?\n\}\n\nfunction calculateMockRemainingSeconds\(session, nowMs\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(helperSource, "mock timer calculation helpers must remain available for regression testing");
  const calculateMockRemainingSeconds = runInNewContext(`(() => { ${helperSource}; return calculateMockRemainingSeconds; })()`);
  const startedAt = "2026-08-07T12:00:00.000Z";
  const startedAtMs = Date.parse(startedAt);
  const subjectA = { config: { type: "mock", subject: "A" }, status: "in_progress", startedAt };
  const subjectB = { config: { type: "mock", subject: "B" }, status: "in_progress", startedAt };

  assert.equal(calculateMockRemainingSeconds(subjectA, startedAtMs - 15_000), 90 * 60);
  assert.equal(calculateMockRemainingSeconds(subjectA, startedAtMs), 90 * 60);
  assert.equal(calculateMockRemainingSeconds(subjectA, startedAtMs + 1_500), 90 * 60 - 1);
  assert.equal(calculateMockRemainingSeconds(subjectB, startedAtMs - 15_000), 100 * 60);
  assert.equal(calculateMockRemainingSeconds({ ...subjectA, status: "completed" }, startedAtMs), null);
  assert.match(learningApp, /if \(!activeMockSessionId\) return undefined;\s*setHeaderClockMs\(Date\.now\(\)\);\s*const timerId = window\.setInterval/s);
});

test("session stylesheet keeps question hierarchy and moves the mock timer into a reserved header row", () => {
  const css = fs.readFileSync(new URL("../src/fe-session-enhancements.css", import.meta.url), "utf8");
  const shell = fs.readFileSync(new URL("../src/PlatformShell.jsx", import.meta.url), "utf8");
  const app = fs.readFileSync(new URL("../src/AppV5.jsx", import.meta.url), "utf8");
  const learningApp = fs.readFileSync(new URL("../src/FeLearningApp.jsx", import.meta.url), "utf8");

  assert.match(css, /\.fe-question-content \{[^}]*font-size:\s*1\.075rem;[^}]*font-weight:\s*620;/s);
  assert.match(css, /\.fe-explanation-content \{[^}]*font-size:\s*\.95rem;[^}]*font-weight:\s*400;/s);
  assert.match(css, /\.session-topbar > span > strong \{[^}]*display:\s*none;/s);
  assert.match(css, /\.header-session-status-inner \{[^}]*display:\s*flex;[^}]*justify-content:\s*flex-end;/s);
  assert.match(css, /\.fe-mock-timer \{[^}]*min-height:\s*40px;[^}]*font-variant-numeric:\s*tabular-nums;/s);
  assert.doesNotMatch(css, /\.session-topbar > span > strong \{[^}]*position:\s*fixed;/s);
  assert.match(shell, /data-fe-session-status="mock"/);
  assert.match(shell, /className="fe-mock-timer"/);
  assert.match(app, /statusText=\{headerStatus\}/);
  assert.match(learningApp, /remainingMockSeconds === null \? null : `残り \$\{formatMockRemaining\(remainingMockSeconds\)\}`/);
});
