import assert from "node:assert/strict";
import test from "node:test";
import { createFeSession, filterPracticeQuestions, normalizeFeSession, scopeLabel } from "../src/feSession.js";

const choices = [{ id: "a" }, { id: "b" }];
const questionBank = [
  { id: "a-correct", subject: "A", domain: "technology", unitId: "unit-a", periodId: "period-1", choices, correctAnswer: "a", correctAnswers: ["a"] },
  { id: "a-incorrect", subject: "A", domain: "technology", unitId: "unit-a", periodId: "period-1", choices, correctAnswer: "a", correctAnswers: ["a"] },
  { id: "b-unanswered", subject: "B", domain: "security", unitId: "unit-b", periodId: "period-2", choices, correctAnswer: "a", correctAnswers: ["a"] },
  { id: "b-correct", subject: "B", domain: "security", unitId: "unit-b", periodId: "period-2", choices, correctAnswer: "a", correctAnswers: ["a"] },
];

const completedSession = {
  schemaVersion: 2,
  id: "history-session",
  status: "completed",
  config: { type: "topic", subjects: [], domains: [], unitIds: [], periodIds: [], reviewScopes: [], scope: "all", count: 4 },
  questionIds: questionBank.map(({ id }) => id),
  answers: {
    "a-correct": { correct: true },
    "a-incorrect": { correct: false },
    "b-correct": { correct: true },
  },
  drafts: {},
  reviewQuestionIds: ["b-unanswered"],
  currentIndex: 0,
  startedAt: "2026-08-06T00:00:00.000Z",
  updatedAt: "2026-08-06T00:10:00.000Z",
  completedAt: "2026-08-06T00:10:00.000Z",
};

test("answer-state selections use OR inside the group and AND with subject and domain", () => {
  const result = filterPracticeQuestions(questionBank, {
    subjects: ["B"],
    domains: ["security"],
    reviewScopes: ["correct", "unanswered"],
  }, [completedSession]);

  assert.deepEqual(result.map(({ id }) => id), ["b-unanswered", "b-correct"]);
});

test("incorrect and review selections are combined without duplicates", () => {
  const result = filterPracticeQuestions(questionBank, {
    reviewScopes: ["incorrect", "review"],
  }, [completedSession]);

  assert.deepEqual(result.map(({ id }) => id), ["a-incorrect", "b-unanswered"]);
  assert.equal(scopeLabel(["incorrect", "review"]), "間違えた問題・見直し対象");
});

test("legacy single scope remains compatible and new sessions preserve multiple scopes", () => {
  assert.deepEqual(
    filterPracticeQuestions(questionBank, { scope: "incorrect" }, [completedSession]).map(({ id }) => id),
    ["a-incorrect"],
  );

  const session = createFeSession({
    config: { type: "topic", subjects: ["A"], reviewScopes: ["incorrect", "review"], count: 2 },
    questions: questionBank.slice(0, 2),
    id: "multi-scope-session",
    now: "2026-08-06T00:20:00.000Z",
  });
  assert.deepEqual(session.config.reviewScopes, ["incorrect", "review"]);
  assert.equal(session.config.scope, "all");

  const restored = normalizeFeSession(JSON.parse(JSON.stringify(session)), questionBank);
  assert.deepEqual(restored.config.reviewScopes, ["incorrect", "review"]);
});
