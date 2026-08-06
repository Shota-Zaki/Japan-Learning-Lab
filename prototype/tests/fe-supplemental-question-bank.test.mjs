import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const supplementalUrl = new URL("../public/data/fe-official-supplemental-questions.json", import.meta.url);

async function readSupplementalBank() {
  return JSON.parse(await readFile(supplementalUrl, "utf8"));
}

test("supplemental FE bank contains the verified exemption batch", async () => {
  const payload = await readSupplementalBank();
  assert.equal(payload.schemaVersion, "fe-official-supplement-v1");
  assert.equal(payload.questionCount, 20);
  assert.equal(payload.questions.length, payload.questionCount);
  assert.equal(payload.sourceSummary.category, "exemption-completion");
  assert.equal(payload.sourceSummary.periodId, "2026-exemption-07");
});

test("every supplemental exemption question is a valid attributable four-choice question", async () => {
  const payload = await readSupplementalBank();
  const ids = new Set();
  const sourceNumbers = new Set();

  for (const question of payload.questions) {
    assert.equal(question.subject, "A");
    assert.equal(question.sourceType, "official-exemption-question");
    assert.equal(question.sourceCategory, "exemption-completion");
    assert.equal(question.periodId, "2026-exemption-07");
    assert.equal(question.choices.length, 4);
    assert.equal(question.correctAnswers.length, 1);
    assert.equal(question.correctAnswer, question.correctAnswers[0]);
    assert.ok(question.choices.some((choice) => choice.id === question.correctAnswer));
    assert.ok(question.question.length > 10);
    assert.ok(question.explanation.length > 10);
    assert.ok(question.sourceRef.includes(`問${question.sourceQuestionNumber}`));
    assert.ok(!ids.has(question.id), `duplicate id: ${question.id}`);
    assert.ok(!sourceNumbers.has(question.sourceQuestionNumber), `duplicate source number: ${question.sourceQuestionNumber}`);
    ids.add(question.id);
    sourceNumbers.add(question.sourceQuestionNumber);
  }
});
