import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { FE_DATASET_META, feQuestions } from "../src/data/feQuestions.js";

test("FE seed bank contains only attributable official past questions", () => {
  assert.equal(FE_DATASET_META.sourceRepository, "https://github.com/Shota-Zaki/Engineer-License-Lab");
  assert.ok(feQuestions.length >= 15);
  assert.equal(new Set(feQuestions.map((question) => question.id)).size, feQuestions.length);

  for (const question of feQuestions) {
    assert.equal(question.sourceType, "official-past-question");
    assert.match(question.sourceUrl, /^https:\/\/www\.ipa\.go\.jp\//);
    assert.match(question.sourceQuestionUrl, /^https:\/\/www\.ipa\.go\.jp\/.+\.pdf$/);
    assert.match(question.sourceAnswerUrl, /^https:\/\/www\.ipa\.go\.jp\/.+\.pdf$/);
    assert.ok(question.sourceRef.includes("基本情報技術者試験"));
    assert.ok(question.choices.some((choice) => choice.id === question.correctAnswer));
  }
});

test("FE seed bank covers every exam domain", () => {
  assert.deepEqual(new Set(feQuestions.map((question) => question.domain)), new Set(["technology", "management", "strategy"]));
});

test("official question text, choices, and answers stay unchanged", () => {
  const canonical = feQuestions.map((question) => ({
    id: question.id,
    question: question.question,
    choices: question.choices.map((choice) => choice.text),
    correctAnswer: question.correctAnswer,
  }));
  const checksum = crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
  assert.equal(checksum, "ceece45258d27649a44024b6087c500836213e1f902993b248f3c971233b73e8");
});
