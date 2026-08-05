export const FE_SESSION_SCHEMA_VERSION = 1;
export const FE_SESSION_STATUSES = new Set(["in_progress", "paused", "completed", "abandoned"]);
export const FE_PRACTICE_SCOPES = new Set(["all", "incorrect", "unanswered", "review"]);
export const FE_QUESTION_COUNTS = new Set([10, 20, 30, "all"]);

function unique(values) {
  return [...new Set(values)];
}

function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function nowIso(now) {
  return typeof now === "string" ? now : (now || new Date()).toISOString();
}

function createId() {
  if (globalThis.crypto?.randomUUID) return `fe-${globalThis.crypto.randomUUID()}`;
  return `fe-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function buildReviewQuestionIds(sessions, scope) {
  if (!FE_PRACTICE_SCOPES.has(scope) || scope === "all") return [];
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

export function filterPracticeQuestions(questionBank, config, sessions = []) {
  const reviewIds = new Set(buildReviewQuestionIds(sessions, config.scope || "all"));
  return questionBank.filter((question) => (
    (config.type === "mock" || question.domain === config.domain)
    && (config.periodId === "all" || question.periodId === config.periodId)
    && ((config.scope || "all") === "all" || reviewIds.has(question.id))
  ));
}

export function selectPracticeQuestions(config, questionBank, sessions = [], random = Math.random) {
  const candidates = filterPracticeQuestions(questionBank, config, sessions);
  const requestedCount = config.count === "all" ? candidates.length : Number(config.count || 10);
  return shuffled(candidates, random).slice(0, Math.min(requestedCount, candidates.length));
}

export function createFeSession({ config, questions, id = createId(), now = new Date() }) {
  const timestamp = nowIso(now);
  return {
    schemaVersion: FE_SESSION_SCHEMA_VERSION,
    id,
    status: "in_progress",
    config: {
      type: config.type === "mock" ? "mock" : "topic",
      domain: config.domain,
      periodId: config.periodId || "all",
      periodLabel: config.periodLabel || "すべての開催回",
      scope: FE_PRACTICE_SCOPES.has(config.scope) ? config.scope : "all",
      count: config.count === "all" ? "all" : Number(config.count || 10),
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

export function updateSessionDraft(session, question, selected, now = new Date()) {
  if (session.status !== "in_progress" || session.answers[question.id]) return session;
  if (!question.choices.some((choice) => choice.id === selected)) return session;
  return withUpdatedAt({ ...session, drafts: { ...session.drafts, [question.id]: selected } }, now);
}

export function answerSessionQuestion(session, question, selected, now = new Date()) {
  if (session.status !== "in_progress" || session.answers[question.id]) return session;
  if (!question.choices.some((choice) => choice.id === selected)) return session;
  const timestamp = nowIso(now);
  const drafts = { ...session.drafts };
  delete drafts[question.id];
  return {
    ...session,
    answers: {
      ...session.answers,
      [question.id]: {
        selected,
        correct: selected === question.correctAnswer,
        answeredAt: timestamp,
      },
    },
    drafts,
    updatedAt: timestamp,
  };
}

export function moveSession(session, index, now = new Date()) {
  if (session.status !== "in_progress" || session.questionIds.length === 0) return session;
  const currentIndex = Math.max(0, Math.min(Number(index) || 0, session.questionIds.length - 1));
  return withUpdatedAt({ ...session, currentIndex }, now);
}

export function toggleSessionReview(session, questionId, now = new Date()) {
  if (!session.questionIds.includes(questionId) || session.status === "abandoned") return session;
  const marked = new Set(session.reviewQuestionIds);
  if (marked.has(questionId)) marked.delete(questionId);
  else marked.add(questionId);
  return withUpdatedAt({ ...session, reviewQuestionIds: [...marked] }, now);
}

export function pauseFeSession(session, now = new Date()) {
  if (session.status !== "in_progress") return session;
  return withUpdatedAt({ ...session, status: "paused" }, now);
}

export function resumeFeSession(session, now = new Date()) {
  if (session.status !== "paused") return session;
  return withUpdatedAt({ ...session, status: "in_progress" }, now);
}

export function abandonFeSession(session, now = new Date()) {
  if (!["in_progress", "paused"].includes(session.status)) return session;
  return withUpdatedAt({ ...session, status: "abandoned" }, now);
}

export function completeFeSession(session, now = new Date()) {
  if (session.status !== "in_progress") return session;
  const timestamp = nowIso(now);
  return { ...session, status: "completed", completedAt: timestamp, updatedAt: timestamp };
}

export function calculateSessionSummary(session) {
  const total = session.questionIds.length;
  const answered = session.questionIds.filter((questionId) => Boolean(session.answers[questionId])).length;
  const correct = session.questionIds.filter((questionId) => session.answers[questionId]?.correct).length;
  const incorrect = answered - correct;
  const unanswered = total - answered;
  return {
    total,
    answered,
    unanswered,
    correct,
    incorrect,
    score: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

export function normalizeFeSession(value, questionBank) {
  if (!value || typeof value !== "object" || value.schemaVersion !== FE_SESSION_SCHEMA_VERSION) return null;
  if (typeof value.id !== "string" || !FE_SESSION_STATUSES.has(value.status)) return null;
  if (!Array.isArray(value.questionIds) || value.questionIds.length === 0 || value.questionIds.length > 2000) return null;
  if (unique(value.questionIds).length !== value.questionIds.length) return null;
  const questionMap = new Map(questionBank.map((question) => [question.id, question]));
  if (value.questionIds.some((questionId) => !questionMap.has(questionId))) return null;

  const answers = {};
  for (const [questionId, answer] of Object.entries(value.answers || {})) {
    const question = questionMap.get(questionId);
    if (!question || !answer || !question.choices.some((choice) => choice.id === answer.selected)) continue;
    answers[questionId] = {
      selected: answer.selected,
      correct: answer.selected === question.correctAnswer,
      answeredAt: typeof answer.answeredAt === "string" ? answer.answeredAt : value.updatedAt,
    };
  }

  const drafts = {};
  for (const [questionId, selected] of Object.entries(value.drafts || {})) {
    const question = questionMap.get(questionId);
    if (!answers[questionId] && question?.choices.some((choice) => choice.id === selected)) drafts[questionId] = selected;
  }

  const currentIndex = Math.max(0, Math.min(Number(value.currentIndex) || 0, value.questionIds.length - 1));
  const config = value.config || {};
  if (!["topic", "mock"].includes(config.type) || !FE_PRACTICE_SCOPES.has(config.scope || "all")) return null;

  return {
    schemaVersion: FE_SESSION_SCHEMA_VERSION,
    id: value.id,
    status: value.status,
    config: {
      type: config.type,
      domain: config.domain,
      periodId: config.periodId || "all",
      periodLabel: config.periodLabel || "すべての開催回",
      scope: config.scope || "all",
      count: config.count === "all" ? "all" : Number(config.count || 10),
    },
    questionIds: [...value.questionIds],
    answers,
    drafts,
    reviewQuestionIds: unique(value.reviewQuestionIds || []).filter((questionId) => value.questionIds.includes(questionId)),
    currentIndex,
    startedAt: typeof value.startedAt === "string" ? value.startedAt : value.updatedAt,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date(0).toISOString(),
    completedAt: value.status === "completed" && typeof value.completedAt === "string" ? value.completedAt : null,
  };
}

export function scopeLabel(scope) {
  return {
    all: "通常演習",
    incorrect: "間違えた問題",
    unanswered: "未回答問題",
    review: "見直し対象",
  }[scope] || "通常演習";
}
