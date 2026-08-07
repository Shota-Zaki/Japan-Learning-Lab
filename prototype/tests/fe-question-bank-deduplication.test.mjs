import assert from "node:assert/strict";
import test from "node:test";
import {
  mergeQuestionBanks,
  normalizedFingerprint,
  normalizedSourceFingerprint,
} from "../src/feQuestionBank.js";

function makeQuestion(overrides = {}) {
  return {
    id: "primary-question",
    subject: "A",
    question: "同じ内容の問題",
    choices: [
      { id: "ア", text: "選択肢A" },
      { id: "イ", text: "選択肢B" },
      { id: "ウ", text: "選択肢C" },
      { id: "エ", text: "選択肢D" },
    ],
    correctAnswer: "ア",
    sourceCategory: "past-exam",
    sourceType: "official-past-question",
    periodId: "2020-spring",
    periodLabel: "2020年春期",
    sourceQuestionNumber: 1,
    ...overrides,
  };
}

test("content fingerprint ignores occurrence metadata", () => {
  const primary = makeQuestion();
  const repeated = makeQuestion({
    id: "repeated-question",
    sourceCategory: "exemption-completion",
    sourceType: "official-exemption-question",
    periodId: "2024-exemption-06",
    periodLabel: "2024年6月 科目A免除制度修了試験",
    sourceQuestionNumber: 42,
  });

  assert.equal(normalizedFingerprint(primary), normalizedFingerprint(repeated));
  assert.notEqual(normalizedSourceFingerprint(primary), normalizedSourceFingerprint(repeated));
});

test("merge keeps the primary canonical question and preserves all source occurrences", () => {
  const primary = makeQuestion();
  const repeated = makeQuestion({
    id: "repeated-question",
    sourceCategory: "exemption-completion",
    sourceType: "official-exemption-question",
    periodId: "2024-exemption-06",
    periodLabel: "2024年6月 科目A免除制度修了試験",
    sourceQuestionNumber: 42,
  });

  const merged = mergeQuestionBanks([primary], [repeated]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, primary.id);
  assert.equal(merged[0].sourceOccurrences.length, 2);
  assert.deepEqual(merged[0].sourceOccurrences.map((occurrence) => occurrence.periodId), ["2020-spring", "2024-exemption-06"]);
});

test("primary records are never removed when historical occurrences repeat the same content", () => {
  const firstPrimary = makeQuestion();
  const secondPrimary = makeQuestion({
    id: "second-primary",
    periodId: "2021-autumn",
    periodLabel: "2021年秋期",
    sourceQuestionNumber: 17,
  });

  const merged = mergeQuestionBanks([firstPrimary, secondPrimary], []);
  assert.equal(merged.length, 2);
  assert.deepEqual(merged.map((question) => question.id), [firstPrimary.id, secondPrimary.id]);
});

test("ambiguous primary content does not cause a supplemental occurrence to be attached arbitrarily", () => {
  const firstPrimary = makeQuestion();
  const secondPrimary = makeQuestion({
    id: "second-primary",
    periodId: "2021-autumn",
    periodLabel: "2021年秋期",
    sourceQuestionNumber: 17,
  });
  const supplemental = makeQuestion({
    id: "supplemental-question",
    sourceCategory: "exemption-completion",
    sourceType: "official-exemption-question",
    periodId: "2024-exemption-06",
    periodLabel: "2024年6月 科目A免除制度修了試験",
    sourceQuestionNumber: 42,
  });

  const merged = mergeQuestionBanks([firstPrimary, secondPrimary], [supplemental]);
  assert.equal(merged.length, 3);
  assert.equal(merged[2].id, supplemental.id);
});

test("merge rejects a conflicting supplemental record for the same unique primary source occurrence", () => {
  const primary = makeQuestion();
  const conflictingOccurrence = makeQuestion({
    id: "conflicting-question",
    question: "異なる本文",
  });

  const merged = mergeQuestionBanks([primary], [conflictingOccurrence]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, primary.id);
  assert.equal(merged[0].sourceOccurrences.length, 1);
});

test("different content from a different source occurrence remains available", () => {
  const primary = makeQuestion();
  const distinct = makeQuestion({
    id: "distinct-question",
    question: "別の問題",
    sourceCategory: "exemption-completion",
    sourceType: "official-exemption-question",
    periodId: "2024-exemption-06",
    periodLabel: "2024年6月 科目A免除制度修了試験",
    sourceQuestionNumber: 43,
  });

  const merged = mergeQuestionBanks([primary], [distinct]);
  assert.equal(merged.length, 2);
  assert.deepEqual(merged.map((question) => question.id), [primary.id, distinct.id]);
});
