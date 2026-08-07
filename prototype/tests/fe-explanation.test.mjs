import assert from "node:assert/strict";
import test from "node:test";
import { buildChoiceJudgments, correctAnswerLabel, relatedKnowledgeLabels } from "../src/feExplanation.js";

const baseQuestion = {
  correctAnswer: "b",
  choices: [
    { id: "a", label: "ア", text: "選択肢A" },
    { id: "b", label: "イ", text: "選択肢B" },
  ],
};

test("正答ラベルと選択肢別の既定判断を生成する", () => {
  assert.equal(correctAnswerLabel(baseQuestion), "イ");
  const judgments = buildChoiceJudgments(baseQuestion);
  assert.equal(judgments[0].isCorrect, false);
  assert.match(judgments[0].reasonText, /正答は「イ」/);
  assert.equal(judgments[1].isCorrect, true);
  assert.match(judgments[1].reasonText, /正答根拠に対応する選択肢/);
});

test("選択肢別解説データがある場合は既定文より優先する", () => {
  const question = {
    ...baseQuestion,
    choiceExplanations: {
      a: "条件Xを満たさないため不適切です。",
      b: { reason: "条件Xと条件Yを満たすため適切です。" },
    },
  };
  const judgments = buildChoiceJudgments(question);
  assert.equal(judgments[0].reasonText, "条件Xを満たさないため不適切です。");
  assert.equal(judgments[1].reasonText, "条件Xと条件Yを満たすため適切です。");
  assert.equal(judgments.every((item) => item.isExplicit), true);
});

test("関連知識ラベルは重複と未分類を除外して上限件数に収める", () => {
  const labels = relatedKnowledgeLabels({
    unitId: "ネットワーク",
    keywords: ["TCP/IP", "ネットワーク", "ルーティング"],
    tags: ["未分類", "OSI参照モデル", "サブネット"],
  }, 4);
  assert.deepEqual(labels, ["ネットワーク", "TCP/IP", "ルーティング", "OSI参照モデル"]);
});
