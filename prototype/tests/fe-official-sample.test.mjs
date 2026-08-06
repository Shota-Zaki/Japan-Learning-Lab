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

test("subject A sample retains rich media for the four figure-dependent questions", () => {
  const ids = new Set(bank.questions.map((question) => question.id));
  for (const number of [5, 6, 7, 9]) {
    const id = `fe-ipa-2022sample-a-${String(number).padStart(3, "0")}`;
    assert.ok(ids.has(id), `${id} is missing`);
    const question = bank.questions.find((item) => item.id === id);
    const imageBlocks = richImageBlocks(question);
    assert.ok(imageBlocks.length > 0, `${id} must retain its official figure in the question or choices`);
    assert.ok(imageBlocks.every((block) => /^https?:\/\//u.test(block.src)), `${id} contains an invalid figure URL`);
  }
});

test("subject A sample question 5 keeps renderable tree figures", () => {
  const question = bank.questions.find((item) => item.id === "fe-ipa-2022sample-a-005");
  assert.ok(question, "subject A sample question 5 is missing");
  assert.ok(richImageBlocks(question).length > 0, "subject A sample question 5 must keep renderable rich media");
});
