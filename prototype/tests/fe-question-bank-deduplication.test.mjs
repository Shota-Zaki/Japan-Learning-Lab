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
    periodId: "2020-spring",
    sourceQuestionNumber: 1,
    ...overrides,
  };
}

test("content fingerprint ignores occurrence metadata", () => {
  const primary = makeQuestion();
  const repeated = makeQuestion({
    id: "repeated-question",
    sourceCategory: "exemption-completion",
    periodId: "2024-exemption-06",
    sourceQuestionNumber: 42,
  });

  assert.equal(normalizedFingerprint(primary), normalizedFingerprint(repeated));
  assert.notEqual(normalizedSourceFingerprint(primary), normalizedSourceFingerprint(repeated));
});

test("merge keeps the primary canonical question when the same content appears in another occurrence", () => {
  const primary = makeQuestion();
  const repeated = makeQuestion({
    id: "repeated-question",
    sourceCategory: "exemption-completion",
    periodId: "2024-exemption-06",
    sourceQuestionNumber: 42,
  });

  const merged = mergeQuestionBanks([primary], [repeated]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, primary.id);
});

test("merge also rejects conflicting duplicate records for the same source occurrence", () => {
  const primary = makeQuestion();
  const conflictingOccurrence = makeQuestion({
    id: "conflicting-question",
    question: "異なる本文",
  });

  const merged = mergeQuestionBanks([primary], [conflictingOccurrence]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, primary.id);
});

test("different content from a different source occurrence remains available", () => {
  const primary = makeQuestion();
  const distinct = makeQuestion({
    id: "distinct-question",
    question: "別の問題",
    sourceCategory: "exemption-completion",
    periodId: "2024-exemption-06",
    sourceQuestionNumber: 43,
  });

  const merged = mergeQuestionBanks([primary], [distinct]);
  assert.equal(merged.length, 2);
  assert.deepEqual(merged.map((question) => question.id), [primary.id, distinct.id]);
});
