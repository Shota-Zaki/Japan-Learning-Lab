import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
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

test("session stylesheet has a distinct question/explanation hierarchy and fixed mock timer", () => {
  const css = fs.readFileSync(new URL("../src/fe-session-enhancements.css", import.meta.url), "utf8");
  assert.match(css, /\.fe-question-content \{[^}]*font-size:\s*1\.075rem;[^}]*font-weight:\s*620;/s);
  assert.match(css, /\.fe-explanation-content \{[^}]*font-size:\s*\.95rem;[^}]*font-weight:\s*400;/s);
  assert.match(css, /\.session-topbar > span > strong \{[^}]*position:\s*fixed;[^}]*top:[^;]+;[^}]*right:[^;]+;[^}]*z-index:\s*30;/s);
  assert.match(css, /@media \(max-width: 520px\)[\s\S]*\.session-topbar > span > strong/);
});
