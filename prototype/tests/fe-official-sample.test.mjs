import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { mergeQuestionBanks, normalizedFingerprint } from "../src/feQuestionBank.js";
import { selectPracticeQuestions } from "../src/feSession.js";

const primaryBank = JSON.parse(fs.readFileSync(new URL("../public/data/fe-official-past-questions.json", import.meta.url), "utf8"));
const supplementalBank = JSON.parse(fs.readFileSync(new URL("../public/data/fe-official-supplemental-questions.json", import.meta.url), "utf8"));
const bank = mergeQuestionBanks(primaryBank.questions, supplementalBank.questions);

function richImageBlocks(question) {
  return [
    ...(Array.isArray(question.questionBlocks) ? question.questionBlocks : []),
    ...question.choices.flatMap((choice) => Array.isArray(choice.contentBlocks) ? choice.contentBlocks : []),
  ].filter((block) => block?.type === "image" && block.src);
}

function isSafeImageSource(source) {
  return typeof source === "string" && source.trim() && !/^javascript:/iu.test(source);
}

test("runtime question bank merge preserves both subjects and folds repeated supplemental occurrences", () => {
  assert.equal(primaryBank.questions.length, 1977);
  assert.equal(supplementalBank.questions.length, 20);
  assert.equal(bank.length, 1996);
  assert.equal(bank.filter((question) => question.subject === "A").length, 1829);
  assert.equal(bank.filter((question) => question.subject === "B").length, 167);
  assert.equal(
    bank.reduce((sum, question) => sum + Math.max(1, question.sourceOccurrences?.length || 0), 0),
    1997,
  );
});

test("fingerprints distinguish subjects and questions that reuse source coordinates", () => {
  const sharedSource = {
    sourceCategory: "official-sample",
    periodId: "2022-sample",
    sourceQuestionNumber: 1,
    choices: [{ id: "a", text: "one" }, { id: "b", text: "two" }],
    correctAnswers: ["a"],
  };
  const subjectA = normalizedFingerprint({ ...sharedSource, subject: "A", question: "shared question" });
  const subjectB = normalizedFingerprint({ ...sharedSource, subject: "B", question: "shared question" });
  const distinctContent = normalizedFingerprint({ ...sharedSource, subject: "A", question: "different question" });
  assert.notEqual(subjectA, subjectB);
  assert.notEqual(subjectA, distinctContent);
  assert.equal(subjectA, normalizedFingerprint({ ...sharedSource, subject: "A", question: "shared question" }));
});

test("merge keeps the primary canonical record for an exact supplemental duplicate", () => {
  const common = {
    subject: "A",
    sourceCategory: "archive",
    periodId: "shared-period",
    sourceQuestionNumber: 1,
    unitId: "basic-theory",
    choices: [{ id: "a", text: "one" }, { id: "b", text: "two" }],
    correctAnswers: ["a"],
    explanation: "explanation",
  };
  const first = { ...common, id: "first", question: "first question" };
  const duplicate = { ...common, id: "duplicate", question: "first question" };
  const distinct = { ...common, id: "distinct", question: "second question" };

  const merged = mergeQuestionBanks([first, distinct], [duplicate]);
  assert.deepEqual(merged.map((question) => question.id), ["first", "distinct"]);
});

for (const [subject, expectedCount] of [["A", 60], ["B", 20]]) {
  test(`2022 official sample set for subject ${subject} is complete after runtime merge and keeps official order`, () => {
    const selected = selectPracticeQuestions({
      type: "mock",
      mockMode: "official-sample",
      subjects: [subject],
      periodIds: ["2022-sample"],
      count: expectedCount,
      preserveOrder: true,
      sampleSetId: "2022-12",
    }, bank, [], () => 0.999);

    assert.equal(selected.length, expectedCount);
    assert.ok(selected.every((question) => question.subject === subject));
    assert.ok(selected.every((question) => question.periodId === "2022-sample"));
    assert.deepEqual(selected.map((question) => Number(question.sourceQuestionNumber)), Array.from({ length: expectedCount }, (_, index) => index + 1));
  });
}

test("subject B official sample can start with the full configured count", () => {
  const selected = selectPracticeQuestions({
    type: "mock",
    mockMode: "official-sample",
    subjects: ["B"],
    periodIds: ["2022-sample"],
    count: 20,
    durationMinutes: 100,
    officialQuestionCount: 20,
    preserveOrder: true,
    sampleSetId: "2022-12",
  }, bank, [], () => 0.999);

  assert.equal(selected.length, 20);
});

test("subject A sample retains the three official figure-dependent questions", () => {
  const expectedAssets = new Map([
    [5, "assets/fe/a-2022-005-figure.svg"],
    [6, "assets/fe/a-2022-006-figure.svg"],
    [7, "assets/fe/a-2022-007-figure.svg"],
  ]);
  for (const [number, expectedAsset] of expectedAssets) {
    const id = `fe-ipa-2022sample-a-${String(number).padStart(3, "0")}`;
    const question = bank.find((item) => item.id === id);
    assert.ok(question, `${id} is missing`);
    const imageBlocks = richImageBlocks(question);
    assert.ok(imageBlocks.length > 0, `${id} must retain its official figure`);
    assert.ok(imageBlocks.every((block) => isSafeImageSource(block.src)), `${id} contains an invalid figure URL`);
    assert.ok(imageBlocks.some((block) => block.src === expectedAsset), `${id} must reference ${expectedAsset}`);
  }
});

test("subject A sample question 9 remains a complete text-only official question", () => {
  const question = bank.find((item) => item.id === "fe-ipa-2022sample-a-009");
  assert.ok(question, "subject A sample question 9 is missing");
  assert.match(question.question, /コーディング規約/u);
  assert.equal(question.choices.length, 4);
  assert.deepEqual(question.correctAnswers, ["エ"]);
});
