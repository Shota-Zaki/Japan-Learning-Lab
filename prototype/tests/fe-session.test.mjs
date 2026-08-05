import assert from "node:assert/strict";
import test from "node:test";
import { feQuestions } from "../src/data/feQuestions.js";
import {
  answerSessionQuestion,
  calculateSessionSummary,
  completeFeSession,
  createFeSession,
  filterPracticeQuestions,
  moveSession,
  normalizeFeSession,
  pauseFeSession,
  resumeFeSession,
  selectPracticeQuestions,
  toggleSessionReview,
  updateSessionDraft,
} from "../src/feSession.js";

const config = {
  type: "topic",
  domain: "technology",
  periodId: "all",
  periodLabel: "すべての開催回",
  scope: "all",
  count: 10,
};

test("creates a bounded official-question session from conditions", () => {
  const selected = selectPracticeQuestions({ ...config, type: "mock" }, feQuestions, [], () => 0.5);
  assert.equal(selected.length, 10);

  const session = createFeSession({ config: { ...config, type: "mock" }, questions: selected, id: "fe-test-session", now: "2026-08-05T00:00:00.000Z" });
  assert.equal(session.status, "in_progress");
  assert.equal(session.questionIds.length, 10);
  assert.deepEqual(calculateSessionSummary(session), { total: 10, answered: 0, unanswered: 10, correct: 0, incorrect: 0, score: 0 });
});

test("submitted answers are immutable and double submission is idempotent", () => {
  const question = feQuestions[0];
  let session = createFeSession({ config, questions: [question], id: "fe-answer-test", now: "2026-08-05T00:00:00.000Z" });
  session = updateSessionDraft(session, question, question.correctAnswer, "2026-08-05T00:01:00.000Z");
  session = answerSessionQuestion(session, question, question.correctAnswer, "2026-08-05T00:02:00.000Z");
  const submitted = session;

  session = answerSessionQuestion(session, question, question.choices.find((choice) => choice.id !== question.correctAnswer).id, "2026-08-05T00:03:00.000Z");
  assert.strictEqual(session, submitted);
  assert.deepEqual(calculateSessionSummary(session), { total: 1, answered: 1, unanswered: 0, correct: 1, incorrect: 0, score: 100 });
});

test("navigation, review, pause, restore, resume, and completion preserve state", () => {
  const questions = feQuestions.slice(0, 3);
  let session = createFeSession({ config, questions, id: "fe-lifecycle-test", now: "2026-08-05T00:00:00.000Z" });
  session = moveSession(session, 2, "2026-08-05T00:01:00.000Z");
  session = toggleSessionReview(session, questions[2].id, "2026-08-05T00:02:00.000Z");
  session = pauseFeSession(session, "2026-08-05T00:03:00.000Z");

  const restored = normalizeFeSession(JSON.parse(JSON.stringify(session)), feQuestions);
  assert.equal(restored.currentIndex, 2);
  assert.deepEqual(restored.reviewQuestionIds, [questions[2].id]);
  assert.equal(restored.status, "paused");

  const resumed = resumeFeSession(restored, "2026-08-05T00:04:00.000Z");
  const completed = completeFeSession(resumed, "2026-08-05T00:05:00.000Z");
  assert.equal(completed.status, "completed");
  assert.equal(completed.completedAt, "2026-08-05T00:05:00.000Z");
});

test("incorrect, unanswered, and review scopes come only from saved history", () => {
  const questions = feQuestions.slice(0, 3);
  let session = createFeSession({ config, questions, id: "fe-scope-test", now: "2026-08-05T00:00:00.000Z" });
  const wrongChoice = questions[0].choices.find((choice) => choice.id !== questions[0].correctAnswer).id;
  session = answerSessionQuestion(session, questions[0], wrongChoice, "2026-08-05T00:01:00.000Z");
  session = toggleSessionReview(session, questions[1].id, "2026-08-05T00:02:00.000Z");
  session = completeFeSession(session, "2026-08-05T00:03:00.000Z");

  assert.deepEqual(filterPracticeQuestions(feQuestions, { ...config, scope: "incorrect" }, [session]).map(({ id }) => id), [questions[0].id]);
  assert.deepEqual(filterPracticeQuestions(feQuestions, { ...config, scope: "review" }, [session]).map(({ id }) => id), [questions[1].id]);
  assert.deepEqual(filterPracticeQuestions(feQuestions, { ...config, scope: "unanswered" }, [session]).map(({ id }) => id), [questions[1].id, questions[2].id]);
});

test("invalid or incompatible saved sessions are rejected", () => {
  assert.equal(normalizeFeSession({ schemaVersion: 99 }, feQuestions), null);
  const session = createFeSession({ config, questions: [feQuestions[0]], id: "fe-invalid-test" });
  assert.equal(normalizeFeSession({ ...session, questionIds: ["missing-question"] }, feQuestions), null);
});
