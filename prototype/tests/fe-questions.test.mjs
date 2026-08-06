import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import fs from "node:fs";
import { FE_DATASET_META, feQuestions } from "../src/data/feQuestions.js";

const fullBank = JSON.parse(fs.readFileSync(new URL("../public/data/fe-official-past-questions.json", import.meta.url), "utf8"));

function countBySubject(questions) {
  return Object.fromEntries(["A", "B"].map((subject) => [
    subject,
    questions.filter((question) => question.subject === subject).length,
  ]));
}

test("FE seed bank contains only attributable official past questions", () => {
  assert.equal(FE_DATASET_META.sourceRepository, "https://github.com/Shota-Zaki/Engineer-License-Lab");
  assert.ok(feQuestions.length >= 5);
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

test("FE seed bank covers every subject A exam domain", () => {
  assert.deepEqual(new Set(feQuestions.map((question) => question.domain)), new Set(["technology", "management", "strategy"]));
});

test("official seed question text, choices, and answers stay unchanged", () => {
  const canonical = feQuestions.map((question) => ({
    id: question.id,
    question: question.question,
    choices: question.choices.map((choice) => choice.text),
    correctAnswer: question.correctAnswer,
  }));
  const checksum = crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
  assert.equal(checksum, "ceece45258d27649a44024b6087c500836213e1f902993b248f3c971233b73e8");
});

test("generated FE bank contains attributable subject A and B questions", () => {
  assert.equal(fullBank.generatedFrom.commit, "1402da68e2e74945bc8fa4add829458220917512");
  assert.equal(fullBank.generatedFrom.blob, "82e64654a22d706a168563883752add70e70ad71");
  assert.equal(fullBank.questionCount, fullBank.questions.length);
  assert.deepEqual(fullBank.countsBySubject, countBySubject(fullBank.questions));
  assert.ok(fullBank.countsBySubject.A > 0);
  assert.ok(fullBank.countsBySubject.B > 0);
  assert.equal(new Set(fullBank.questions.map((question) => question.id)).size, fullBank.questionCount);

  for (const question of fullBank.questions) {
    assert.ok(["official-past-question", "official-public-question"].includes(question.sourceType));
    assert.ok(["A", "B"].includes(question.subject));
    assert.ok((question.subject === "A"
      ? ["technology", "management", "strategy"]
      : ["algorithm", "security"]
    ).includes(question.domain));
    assert.match(question.sourceUrl, /^https:\/\/www\.ipa\.go\.jp\//);
    assert.match(question.sourceQuestionUrl, /^https:\/\/www\.ipa\.go\.jp\//);
    assert.match(question.sourceAnswerUrl, /^https:\/\/www\.ipa\.go\.jp\//);
    assert.ok(question.choices.length >= 2);
    assert.equal(new Set(question.choices.map((choice) => choice.id)).size, question.choices.length);
    const correctAnswers = Array.isArray(question.correctAnswers) && question.correctAnswers.length > 0
      ? question.correctAnswers
      : [question.correctAnswer];
    assert.ok(correctAnswers.every((answer) => question.choices.some((choice) => choice.id === answer)));
    assert.equal(question.correctAnswer, correctAnswers[0]);
    assert.ok(question.periodId);
    assert.ok(question.periodLabel);
    assert.ok(question.title);
    assert.ok(question.question);
    assert.ok(question.explanation);
    assert.doesNotMatch(`${question.title}${question.question}${question.explanation}`, /(?:<script|javascript:|onerror\s*=|�|繧|繝)/iu);
  }
});

test("repeated official questions stay attributable instead of being silently removed", () => {
  const normalized = new Map();
  for (const question of fullBank.questions) {
    const key = JSON.stringify({
      question: question.question.replace(/\s+/gu, " ").trim(),
      choices: question.choices.map((choice) => choice.text.replace(/\s+/gu, " ").trim()),
      correctAnswers: question.correctAnswers || [question.correctAnswer],
    });
    normalized.set(key, [...(normalized.get(key) || []), question]);
  }
  const repeatedGroups = [...normalized.values()].filter((questions) => questions.length > 1);
  assert.ok(repeatedGroups.length > 0);
  assert.ok(repeatedGroups.reduce((total, questions) => total + questions.length, 0) >= repeatedGroups.length * 2);
  assert.ok(repeatedGroups.every((questions) => new Set(questions.map(({ id }) => id)).size === questions.length));
  assert.ok(repeatedGroups.every((questions) => questions.every(({ sourceRef }) => sourceRef.includes("基本情報技術者試験"))));
});

test("generated FE bank preserves its canonical structured payload", () => {
  const canonical = fullBank.questions.map(({ id, subject, question, questionBlocks, choices, correctAnswers }) => ({
    id,
    subject,
    question,
    questionBlocks,
    choices,
    correctAnswers,
  }));
  const checksum = crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
  assert.match(fullBank.canonicalSha256, /^[a-f0-9]{64}$/u);
  assert.equal(checksum, fullBank.canonicalSha256);
});
