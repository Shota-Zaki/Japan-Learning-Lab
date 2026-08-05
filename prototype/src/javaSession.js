export const JAVA_SESSION_SCHEMA_VERSION = 1;
export const JAVA_SESSION_STATUSES = new Set(["in_progress", "paused", "completed", "abandoned"]);
export const JAVA_PRACTICE_SCOPES = new Set(["all", "incorrect", "unanswered", "review"]);

function unique(values) {
  return [...new Set(values)];
}

function nowIso(now) {
  return typeof now === "string" ? now : (now || new Date()).toISOString();
}

function createId() {
  if (globalThis.crypto?.randomUUID) return `java-${globalThis.crypto.randomUUID()}`;
  return `java-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function normalizedSelection(selectedChoiceIds) {
  const values = Array.isArray(selectedChoiceIds) ? selectedChoiceIds : [selectedChoiceIds];
  return unique(values.filter((value) => typeof value === "string" && value.length > 0));
}

function correctChoiceIds(question) {
  if (Array.isArray(question.correctChoiceIds)) return unique(question.correctChoiceIds);
  if (typeof question.correctAnswer === "string") return [question.correctAnswer];
  return [];
}

function sameChoiceSet(left, right) {
  const a = [...left].sort();
  const b = [...right].sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function validSelection(question, selectedChoiceIds) {
  const selected = normalizedSelection(selectedChoiceIds);
  const choiceIds = new Set((question.choices || []).map((choice) => choice.id));
  return selected.length > 0 && selected.every((choiceId) => choiceIds.has(choiceId));
}

export function buildJavaReviewQuestionIds(sessions, scope) {
  if (!JAVA_PRACTICE_SCOPES.has(scope) || scope === "all") return [];
  const ids = [];
  for (const session of [...sessions].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))) {
    if (scope === "review") {
      ids.push(...session.reviewQuestionIds);
      continue;
    }
    for (const questionId of session.questionIds) {
      const answer = session.answers[questionId];
      if (scope === "incorrect" && answer && !answer.correct) ids.push(questionId);
      if (scope === "unanswered" && session.status === "completed" && !answer) ids.push(questionId);
    }
  }
  return unique(ids);
}

export function filterJavaPracticeQuestions(questionBank, config, sessions = []) {
  const scope = JAVA_PRACTICE_SCOPES.has(config.scope) ? config.scope : "all";
  const reviewIds = new Set(buildJavaReviewQuestionIds(sessions, scope));
  return questionBank.filter((question) => (
    question.courseId === config.courseId
    && (config.type === "mock" ? question.mockId === config.mockId : question.unitId === config.unitId)
    && (scope === "all" || reviewIds.has(question.id))
  ));
}

export function selectJavaPracticeQuestions(config, questionBank, sessions = [], random = Math.random) {
  const candidates = filterJavaPracticeQuestions(questionBank, config, sessions);
  const requestedCount = config.count === "all" ? candidates.length : Number(config.count || candidates.length);
  return shuffled(candidates, random).slice(0, Math.min(requestedCount, candidates.length));
}

export function createJavaSession({ config, questions, id = createId(), now = new Date() }) {
  const timestamp = nowIso(now);
  return {
    schemaVersion: JAVA_SESSION_SCHEMA_VERSION,
    lab: "java",
    id,
    status: "in_progress",
    config: {
      type: config.type === "mock" ? "mock" : "topic",
      courseId: config.courseId,
      unitId: config.type === "mock" ? null : config.unitId,
      mockId: config.type === "mock" ? config.mockId : null,
      scope: JAVA_PRACTICE_SCOPES.has(config.scope) ? config.scope : "all",
      count: config.count === "all" ? "all" : Number(config.count || questions.length),
    },
    questionIds: questions.map((question) => question.id),
    answers: {},
    drafts: {},
    reviewQuestionIds: [],
    currentIndex: 0,
    startedAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
  };
}

function withUpdatedAt(session, now) {
  return { ...session, updatedAt: nowIso(now) };
}

export function updateJavaSessionDraft(session, question, selectedChoiceIds, now = new Date()) {
  if (session.status !== "in_progress" || session.answers[question.id]) return session;
  if (!validSelection(question, selectedChoiceIds)) return session;
  return withUpdatedAt({
    ...session,
    drafts: { ...session.drafts, [question.id]: normalizedSelection(selectedChoiceIds) },
  }, now);
}

export function answerJavaSessionQuestion(session, question, selectedChoiceIds, now = new Date()) {
  if (session.status !== "in_progress" || session.answers[question.id]) return session;
  if (!validSelection(question, selectedChoiceIds)) return session;
  const selected = normalizedSelection(selectedChoiceIds);
  const expected = correctChoiceIds(question);
  if (expected.length === 0) return session;
  const timestamp = nowIso(now);
  const drafts = { ...session.drafts };
  delete drafts[question.id];
  return {
    ...session,
    answers: {
      ...session.answers,
      [question.id]: {
        selectedChoiceIds: selected,
        correct: sameChoiceSet(selected, expected),
        answeredAt: timestamp,
      },
    },
    drafts,
    updatedAt: timestamp,
  };
}

export function moveJavaSession(session, index, now = new Date()) {
  if (session.status !== "in_progress" || session.questionIds.length === 0) return session;
  const currentIndex = Math.max(0, Math.min(Number(index) || 0, session.questionIds.length - 1));
  return withUpdatedAt({ ...session, currentIndex }, now);
}

export function toggleJavaSessionReview(session, questionId, now = new Date()) {
  if (!session.questionIds.includes(questionId) || session.status === "abandoned") return session;
  const marked = new Set(session.reviewQuestionIds);
  if (marked.has(questionId)) marked.delete(questionId);
  else marked.add(questionId);
  return withUpdatedAt({ ...session, reviewQuestionIds: [...marked] }, now);
}

export function pauseJavaSession(session, now = new Date()) {
  if (session.status !== "in_progress") return session;
  return withUpdatedAt({ ...session, status: "paused" }, now);
}

export function resumeJavaSession(session, now = new Date()) {
  if (session.status !== "paused") return session;
  return withUpdatedAt({ ...session, status: "in_progress" }, now);
}

export function abandonJavaSession(session, now = new Date()) {
  if (!["in_progress", "paused"].includes(session.status)) return session;
  return withUpdatedAt({ ...session, status: "abandoned" }, now);
}

export function completeJavaSession(session, now = new Date()) {
  if (session.status !== "in_progress") return session;
  const timestamp = nowIso(now);
  return { ...session, status: "completed", completedAt: timestamp, updatedAt: timestamp };
}

export function calculateJavaSessionSummary(session) {
  const total = session.questionIds.length;
  const answered = session.questionIds.filter((questionId) => Boolean(session.answers[questionId])).length;
  const correct = session.questionIds.filter((questionId) => session.answers[questionId]?.correct).length;
  return {
    total,
    answered,
    correct,
    incorrect: answered - correct,
    unanswered: total - answered,
    score: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

export function normalizeJavaSession(value, questionBank) {
  if (!value || typeof value !== "object" || value.schemaVersion !== JAVA_SESSION_SCHEMA_VERSION || value.lab !== "java") return null;
  if (typeof value.id !== "string" || !JAVA_SESSION_STATUSES.has(value.status)) return null;
  if (!Array.isArray(value.questionIds) || value.questionIds.length === 0 || value.questionIds.length > 2000) return null;
  if (unique(value.questionIds).length !== value.questionIds.length) return null;
  const questionMap = new Map(questionBank.map((question) => [question.id, question]));
  if (value.questionIds.some((questionId) => !questionMap.has(questionId))) return null;

  const config = value.config || {};
  if (!["topic", "mock"].includes(config.type) || typeof config.courseId !== "string") return null;
  if (!JAVA_PRACTICE_SCOPES.has(config.scope || "all")) return null;

  const answers = {};
  for (const [questionId, answer] of Object.entries(value.answers || {})) {
    const question = questionMap.get(questionId);
    const selected = normalizedSelection(answer?.selectedChoiceIds || []);
    if (!question || !validSelection(question, selected)) continue;
    answers[questionId] = {
      selectedChoiceIds: selected,
      correct: sameChoiceSet(selected, correctChoiceIds(question)),
      answeredAt: typeof answer.answeredAt === "string" ? answer.answeredAt : value.updatedAt,
    };
  }

  const drafts = {};
  for (const [questionId, selectedChoiceIds] of Object.entries(value.drafts || {})) {
    const question = questionMap.get(questionId);
    if (!answers[questionId] && question && validSelection(question, selectedChoiceIds)) {
      drafts[questionId] = normalizedSelection(selectedChoiceIds);
    }
  }

  return {
    schemaVersion: JAVA_SESSION_SCHEMA_VERSION,
    lab: "java",
    id: value.id,
    status: value.status,
    config: {
      type: config.type,
      courseId: config.courseId,
      unitId: config.type === "topic" ? config.unitId || null : null,
      mockId: config.type === "mock" ? config.mockId || null : null,
      scope: config.scope || "all",
      count: config.count === "all" ? "all" : Number(config.count || value.questionIds.length),
    },
    questionIds: [...value.questionIds],
    answers,
    drafts,
    reviewQuestionIds: unique(value.reviewQuestionIds || []).filter((questionId) => value.questionIds.includes(questionId)),
    currentIndex: Math.max(0, Math.min(Number(value.currentIndex) || 0, value.questionIds.length - 1)),
    startedAt: typeof value.startedAt === "string" ? value.startedAt : value.updatedAt,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date(0).toISOString(),
    completedAt: value.status === "completed" && typeof value.completedAt === "string" ? value.completedAt : null,
  };
}

export function javaScopeLabel(scope) {
  return {
    all: "通常演習",
    incorrect: "間違えた問題",
    unanswered: "未回答問題",
    review: "見直し対象",
  }[scope] || "通常演習";
}
