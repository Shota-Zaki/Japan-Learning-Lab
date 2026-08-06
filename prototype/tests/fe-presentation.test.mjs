import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildSessionReviewItems, choiceLabels, sessionHistoryDescription } from "../src/fePresentation.js";

const questions = [
  {
    id: "single",
    subject: "A",
    choices: [{ id: "a", label: "ア" }, { id: "b", label: "イ" }],
    correctAnswer: "a",
    correctAnswers: ["a"],
  },
  {
    id: "multiple",
    subject: "B",
    answerMode: "multiple",
    choices: [{ id: "a", label: "ア" }, { id: "b", label: "イ" }, { id: "c", label: "ウ" }],
    correctAnswer: "a",
    correctAnswers: ["a", "c"],
  },
  {
    id: "unanswered",
    subject: "B",
    choices: [{ id: "a", label: "ア" }, { id: "b", label: "イ" }],
    correctAnswer: "b",
    correctAnswers: ["b"],
  },
];

const completedSession = {
  status: "completed",
  config: { type: "mock", mockMode: "official-sample", sampleSetLabel: "2022年12月公開サンプル問題" },
  questionIds: questions.map(({ id }) => id),
  answers: {
    single: { selected: "a", selectedIds: ["a"], correct: true },
    multiple: { selected: ["a", "b"], selectedIds: ["a", "b"], correct: false },
  },
};

test("completed-session review keeps single, multiple, and unanswered states", () => {
  const items = buildSessionReviewItems(completedSession, questions);
  assert.deepEqual(items.map(({ status }) => status), ["correct", "incorrect", "unanswered"]);
  assert.deepEqual(items[1].selectedIds, ["a", "b"]);
  assert.deepEqual(items[1].correctIds, ["a", "c"]);
  assert.equal(choiceLabels(questions[1], items[1].selectedIds), "ア、イ");
  assert.equal(choiceLabels(questions[2], items[2].selectedIds), "未回答");
});

test("history descriptions distinguish topic, random mock, and official sample mock", () => {
  assert.equal(sessionHistoryDescription({ config: { type: "topic", reviewScopes: [] } }), "通常演習");
  assert.equal(sessionHistoryDescription({ config: { type: "topic", reviewScopes: ["incorrect", "review"] } }), "間違えた問題・見直し対象");
  assert.equal(sessionHistoryDescription({ config: { type: "mock", mockMode: "random" } }), "ランダム模擬試験");
  assert.equal(sessionHistoryDescription(completedSession), "2022年12月公開サンプル問題");
  assert.equal(sessionHistoryDescription({ config: { type: "mock", mockMode: "official-sample" } }), "公式サンプル模擬試験");
});

test("filter layout permanently uses full-height compact cards without ellipsis or vertical scroll", () => {
  const setupSource = fs.readFileSync(new URL("../src/FePracticeSetup.jsx", import.meta.url), "utf8");
  const filterCss = fs.readFileSync(new URL("../src/fe-filter-variants.css", import.meta.url), "utf8");

  assert.match(setupSource, /className="fe-filter-variant-grid"/);
  assert.doesNotMatch(setupSource, /filterVariant|パターンA|fe-filter-view-switch/);
  assert.doesNotMatch(filterCss, /text-overflow:\s*ellipsis/);
  assert.doesNotMatch(filterCss, /overflow-y:\s*auto/);
  assert.match(filterCss, /white-space:\s*normal/);
});

test("session and result views share detailed explanations and direct question navigation", () => {
  const sessionSource = fs.readFileSync(new URL("../src/FeSessionView.jsx", import.meta.url), "utf8");
  const enhancementCss = fs.readFileSync(new URL("../src/fe-session-enhancements.css", import.meta.url), "utf8");

  assert.match(sessionSource, /function DetailedExplanation/);
  assert.match(sessionSource, /正答の根拠/);
  assert.match(sessionSource, /選択肢ごとの判断/);
  assert.match(sessionSource, /関連知識/);
  assert.match(sessionSource, /<DetailedExplanation question=\{question\} headingId="fe-explanation-heading"/);
  assert.match(sessionSource, /headingId=\{`result-explanation-/);
  assert.match(sessionSource, /id="question-number-input"/);
  assert.match(sessionSource, /type="number"/);
  assert.match(sessionSource, /scrollIntoView/);
  assert.match(enhancementCss, /\.question-number-grid\s*\{[^}]*overflow-y:\s*auto/s);
});
