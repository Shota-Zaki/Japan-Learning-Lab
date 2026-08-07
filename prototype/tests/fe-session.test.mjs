import assert from "node:assert/strict";
import fs from "node:fs";
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
  toggleSessionDraftChoice,
  toggleSessionReview,
  updateSessionDraft,
} from "../src/feSession.js";

const fullBank = JSON.parse(fs.readFileSync(new URL("../public/data/fe-official-past-questions.json", import.meta.url), "utf8"));

const config = {
  type: "topic",
  domain: "technology",
  periodId: "all",
  periodLabel: "すべての開催回",
  scope: "all",
  count: 10,
};

const mixedBank = [
  {
    id: "a-tech-1",
    subject: "A",
    domain: "technology",
    unitId: "algorithm",
    periodId: "2025-sample",
    choices: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
    correctAnswer: "a",
    correctAnswers: ["a"],
  },
  {
    id: "a-management-1",
    subject: "A",
    domain: "management",
    unitId: "project",
    periodId: "2025-sample",
    choices: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
    correctAnswer: "b",
    correctAnswers: ["b"],
  },
  {
    id: "b-algorithm-1",
    subject: "B",
    domain: "algorithm",
    unitId: "pseudocode",
    periodId: "2022-sample",
    choices: [{ id: "a" }, { id: "b" }, { id: "c" }],
    correctAnswer: "c",
    correctAnswers: ["c"],
  },
  {
    id: "b-security-multiple",
    subject: "B",
    domain: "security",
    unitId: "security-control",
    periodId: "2022-sample",
    answerMode: "multiple",
    choices: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
    correctAnswer: "a",
    correctAnswers: ["a", "c"],
  },
];

test("creates a bounded official-question session from conditions", () => {
  const selected = selectPracticeQuestions({ ...config, type: "mock" }, fullBank.questions, [], () => 0.5);
  assert.equal(selected.length, Math.min(10, fullBank.questions.length));

  const session = createFeSession({ config: { ...config, type: "mock" }, questions: selected, id: "fe-test-session", now: "2026-08-05T00:00:00.000Z" });
  assert.equal(session.status, "in_progress");
  assert.equal(session.questionIds.length, selected.length);
  assert.deepEqual(calculateSessionSummary(session), {
    total: selected.length,
    answered: 0,
    unanswered: selected.length,
    correct: 0,
    incorrect: 0,
    score: 0,
  });
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

test("multiple condition groups use OR inside a group and AND between groups", () => {
  const result = filterPracticeQuestions(mixedBank, {
    type: "topic",
    subjects: ["A", "B"],
    domains: ["technology", "algorithm"],
    unitIds: ["algorithm", "pseudocode"],
    periodIds: ["2022-sample", "2025-sample"],
    scope: "all",
  });
  assert.deepEqual(result.map(({ id }) => id), ["a-tech-1", "b-algorithm-1"]);

  const subjectBOnly = filterPracticeQuestions(mixedBank, { subjects: ["B"], domains: ["algorithm", "security"], periodIds: ["2022-sample"], scope: "all" });
  assert.deepEqual(subjectBOnly.map(({ id }) => id), ["b-algorithm-1", "b-security-multiple"]);
});

test("subject B multiple-answer questions require the exact answer set", () => {
  const question = mixedBank[3];
  let session = createFeSession({ config: { ...config, subjects: ["B"], domains: ["security"] }, questions: [question], id: "fe-b-multiple", now: "2026-08-05T00:00:00.000Z" });
  session = toggleSessionDraftChoice(session, question, "a", "2026-08-05T00:01:00.000Z");
  session = toggleSessionDraftChoice(session, question, "c", "2026-08-05T00:02:00.000Z");
  assert.deepEqual(session.drafts[question.id], ["a", "c"]);
  session = answerSessionQuestion(session, question, session.drafts[question.id], "2026-08-05T00:03:00.000Z");
  assert.equal(session.answers[question.id].correct, true);

  let incomplete = createFeSession({ config, questions: [question], id: "fe-b-incomplete" });
  incomplete = answerSessionQuestion(incomplete, question, ["a"]);
  assert.equal(incomplete.answers[question.id].correct, false);
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

test("version 1 sessions migrate without losing legacy filter values", () => {
  const question = feQuestions[0];
  const legacy = {
    schemaVersion: 1,
    id: "fe-legacy-session",
    status: "paused",
    config: { ...config },
    questionIds: [question.id],
    answers: {},
    drafts: {},
    reviewQuestionIds: [],
    currentIndex: 0,
    startedAt: "2026-08-05T00:00:00.000Z",
    updatedAt: "2026-08-05T00:01:00.000Z",
    completedAt: null,
  };
  const migrated = normalizeFeSession(legacy, feQuestions);
  assert.equal(migrated.schemaVersion, 2);
  assert.deepEqual(migrated.config.domains, ["technology"]);
  assert.deepEqual(migrated.config.periodIds, []);
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
