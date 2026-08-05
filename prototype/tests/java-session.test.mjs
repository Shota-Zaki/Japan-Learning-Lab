import assert from "node:assert/strict";
import test from "node:test";
import { javaCatalogTotals, javaBronzeMocks, javaBronzeUnits } from "../src/data/javaCatalog.js";
import {
  answerJavaSessionQuestion,
  buildJavaReviewQuestionIds,
  calculateJavaSessionSummary,
  completeJavaSession,
  createJavaSession,
  filterJavaPracticeQuestions,
  normalizeJavaSession,
  pauseJavaSession,
  resumeJavaSession,
  toggleJavaSessionReview,
  updateJavaSessionDraft,
} from "../src/javaSession.js";

const questions = [
  { id: "q1", courseId: "bronze", unitId: "bronze-p1", choices: [{ id: "a" }, { id: "b" }], correctChoiceIds: ["a"] },
  { id: "q2", courseId: "bronze", unitId: "bronze-p1", choices: [{ id: "a" }, { id: "b" }, { id: "c" }], correctChoiceIds: ["a", "c"] },
  { id: "q3", courseId: "bronze", unitId: "bronze-p3", choices: [{ id: "a" }, { id: "b" }], correctChoiceIds: ["b"] },
];

function createSession() {
  return createJavaSession({
    id: "java-test-session",
    now: "2026-08-06T00:00:00.000Z",
    config: { type: "topic", courseId: "bronze", unitId: "bronze-p1", scope: "all", count: 2 },
    questions: questions.slice(0, 2),
  });
}

test("Bronze catalog counts remain source-compatible", () => {
  assert.equal(javaBronzeUnits.length, 4);
  assert.equal(javaBronzeMocks.length, 2);
  assert.deepEqual(javaCatalogTotals(), { bronzePractice: 107, bronzeMock: 120 });
});

test("creates a Java-only session schema", () => {
  const session = createSession();
  assert.equal(session.lab, "java");
  assert.equal(session.status, "in_progress");
  assert.deepEqual(session.questionIds, ["q1", "q2"]);
});

test("supports immutable single-choice answers", () => {
  const session = createSession();
  const answered = answerJavaSessionQuestion(session, questions[0], ["a"], "2026-08-06T00:01:00.000Z");
  const overwritten = answerJavaSessionQuestion(answered, questions[0], ["b"], "2026-08-06T00:02:00.000Z");
  assert.equal(answered.answers.q1.correct, true);
  assert.deepEqual(overwritten, answered);
});

test("supports exact-set multiple-choice answers", () => {
  const session = createSession();
  const correct = answerJavaSessionQuestion(session, questions[1], ["c", "a"]);
  const incorrect = answerJavaSessionQuestion(session, questions[1], ["a"]);
  assert.equal(correct.answers.q2.correct, true);
  assert.equal(incorrect.answers.q2.correct, false);
});

test("draft, review, pause and resume are recoverable", () => {
  const session = createSession();
  const drafted = updateJavaSessionDraft(session, questions[0], ["b"]);
  const reviewed = toggleJavaSessionReview(drafted, "q1");
  const paused = pauseJavaSession(reviewed);
  const resumed = resumeJavaSession(paused);
  assert.deepEqual(resumed.drafts.q1, ["b"]);
  assert.deepEqual(resumed.reviewQuestionIds, ["q1"]);
  assert.equal(resumed.status, "in_progress");
});

test("calculates completed result including unanswered questions", () => {
  let session = createSession();
  session = answerJavaSessionQuestion(session, questions[0], ["b"]);
  session = completeJavaSession(session, "2026-08-06T00:05:00.000Z");
  assert.deepEqual(calculateJavaSessionSummary(session), { total: 2, answered: 1, correct: 0, incorrect: 1, unanswered: 1, score: 0 });
});

test("builds incorrect, unanswered and review scopes", () => {
  let session = createSession();
  session = answerJavaSessionQuestion(session, questions[0], ["b"]);
  session = toggleJavaSessionReview(session, "q2");
  session = completeJavaSession(session);
  assert.deepEqual(buildJavaReviewQuestionIds([session], "incorrect"), ["q1"]);
  assert.deepEqual(buildJavaReviewQuestionIds([session], "unanswered"), ["q2"]);
  assert.deepEqual(buildJavaReviewQuestionIds([session], "review"), ["q2"]);
});

test("filters a Bronze unit and review scope", () => {
  let session = createSession();
  session = answerJavaSessionQuestion(session, questions[0], ["b"]);
  session = completeJavaSession(session);
  const filtered = filterJavaPracticeQuestions(questions, { type: "topic", courseId: "bronze", unitId: "bronze-p1", scope: "incorrect" }, [session]);
  assert.deepEqual(filtered.map((question) => question.id), ["q1"]);
});

test("normalization rejects FE or unknown-question payloads and repairs answer truth", () => {
  const session = createSession();
  assert.equal(normalizeJavaSession({ ...session, lab: "fe" }, questions), null);
  assert.equal(normalizeJavaSession({ ...session, questionIds: ["missing"] }, questions), null);
  const answered = answerJavaSessionQuestion(session, questions[0], ["a"]);
  const normalized = normalizeJavaSession({ ...answered, answers: { q1: { ...answered.answers.q1, correct: false } } }, questions);
  assert.equal(normalized.answers.q1.correct, true);
});
