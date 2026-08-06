import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { selectPracticeQuestions } from "../src/feSession.js";

const bank = JSON.parse(fs.readFileSync(new URL("../public/data/fe-official-past-questions.json", import.meta.url), "utf8"));

function richImageBlocks(question) {
  return [
    ...(Array.isArray(question.questionBlocks) ? question.questionBlocks : []),
    ...question.choices.flatMap((choice) => Array.isArray(choice.contentBlocks) ? choice.contentBlocks : []),
  ].filter((block) => block?.type === "image" && block.src);
}

function isSafeImageSource(source) {
  return typeof source === "string" && source.trim() && !/^javascript:/iu.test(source);
}

for (const [subject, expectedCount] of [["A", 60], ["B", 20]]) {
  test(`2022 official sample set for subject ${subject} is complete and keeps official order`, () => {
    const selected = selectPracticeQuestions({
      type: "mock",
      mockMode: "official-sample",
      subjects: [subject],
      periodIds: ["2022-sample"],
      count: expectedCount,
      preserveOrder: true,
      sampleSetId: "2022-12",
    }, bank.questions, [], () => 0.999);

    assert.equal(selected.length, expectedCount);
    assert.ok(selected.every((question) => question.subject === subject));
    assert.ok(selected.every((question) => question.periodId === "2022-sample"));
    assert.deepEqual(selected.map((question) => Number(question.sourceQuestionNumber)), Array.from({ length: expectedCount }, (_, index) => index + 1));
  });
}

test("subject A sample retains the three official figure-dependent questions", () => {
  const expectedAssets = new Map([
    [5, "assets/fe/a-2022-005-figure.svg"],
    [6, "assets/fe/a-2022-006-figure.svg"],
    [7, "assets/fe/a-2022-007-figure.svg"],
  ]);
  for (const [number, expectedAsset] of expectedAssets) {
    const id = `fe-ipa-2022sample-a-${String(number).padStart(3, "0")}`;
    const question = bank.questions.find((item) => item.id === id);
    assert.ok(question, `${id} is missing`);
    const imageBlocks = richImageBlocks(question);
    assert.ok(imageBlocks.length > 0, `${id} must retain its official figure`);
    assert.ok(imageBlocks.every((block) => isSafeImageSource(block.src)), `${id} contains an invalid figure URL`);
    assert.ok(imageBlocks.some((block) => block.src === expectedAsset), `${id} must reference ${expectedAsset}`);
  }
});

test("subject A sample question 9 remains a complete text-only official question", () => {
  const question = bank.questions.find((item) => item.id === "fe-ipa-2022sample-a-009");
  assert.ok(question, "subject A sample question 9 is missing");
  assert.match(question.question, /コーディング規約/u);
  assert.equal(question.choices.length, 4);
  assert.deepEqual(question.correctAnswers, ["エ"]);
});
