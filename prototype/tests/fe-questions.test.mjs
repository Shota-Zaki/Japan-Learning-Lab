import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import fs from "node:fs";
import { FE_DATASET_META, feQuestions } from "../src/data/feQuestions.js";

const fullBank = JSON.parse(fs.readFileSync(new URL("../public/data/fe-official-past-questions.json", import.meta.url), "utf8"));

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

test("generated FE bank contains the image-free official past-question collection", () => {
  assert.equal(fullBank.generatedFrom.commit, "1402da68e2e74945bc8fa4add829458220917512");
  assert.equal(fullBank.generatedFrom.blob, "82e64654a22d706a168563883752add70e70ad71");
  assert.equal(fullBank.questionCount, fullBank.questions.length);
  assert.ok(fullBank.questionCount >= 1600);
  assert.equal(new Set(fullBank.questions.map((question) => question.id)).size, fullBank.questionCount);

  for (const question of fullBank.questions) {
    assert.equal(question.sourceType, "official-past-question");
    assert.ok(["technology", "management", "strategy"].includes(question.domain));
    assert.match(question.sourceUrl, /^https:\/\/www\.ipa\.go\.jp\//);
    assert.match(question.sourceQuestionUrl, /^https:\/\/www\.ipa\.go\.jp\//);
    assert.match(question.sourceAnswerUrl, /^https:\/\/www\.ipa\.go\.jp\//);
    assert.equal(question.choices.length, 4);
    assert.ok(question.choices.some((choice) => choice.id === question.correctAnswer));
  }
});

test("generated FE bank preserves the canonical question payload", () => {
  const canonical = fullBank.questions.map(({ id, question, choices, correctAnswer }) => ({ id, question, choices, correctAnswer }));
  const checksum = crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
  assert.equal(checksum, fullBank.canonicalSha256);
  assert.equal(checksum, "b52e25eb072b11e40f7bf6da14ab6d7a957a1811ae62f6b985329c7b57e0102d");
});
