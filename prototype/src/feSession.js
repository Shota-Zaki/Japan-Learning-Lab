export const FE_SESSION_SCHEMA_VERSION = 2;
export const FE_SESSION_STATUSES = new Set(["in_progress", "paused", "completed", "abandoned"]);
export const FE_PRACTICE_SCOPES = new Set(["all", "correct", "incorrect", "unanswered", "review"]);
export const FE_QUESTION_COUNTS = new Set([10, 20, 30, "all"]);

function unique(values) {
  return [...new Set((values || []).filter((value) => value !== null && value !== undefined && value !== ""))];
}

function normalizedList(value, fallback = []) {
  if (Array.isArray(value)) return unique(value.map(String));
  if (value === null || value === undefined || value === "" || value === "all") return [...fallback];
  return [String(value)];
}

function normalizedReviewScopes(value) {
  return normalizedList(value).filter((scope) => FE_PRACTICE_SCOPES.has(scope) && scope !== "all");
}

function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function officialOrder(items) {
  return [...items].sort((left, right) => {
    const leftNumber = Number(left.sourceQuestionNumber);
    const rightNumber = Number(right.sourceQuestionNumber);
    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber !== rightNumber) return leftNumber - rightNumber;
    if (Number.isFinite(leftNumber) && !Number.isFinite(rightNumber)) return -1;
    if (!Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) return 1;
    return String(left.id).localeCompare(String(right.id));
  });
}

function nowIso(now) {
  return typeof now === "string" ? now : (now || new Date()).toISOString();
}

function createId() {
  if (globalThis.crypto?.randomUUID) return `fe-${globalThis.crypto.randomUUID()}`;
  return `fe-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function correctAnswerIds(question) {
  return unique(question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : [])).map(String).sort();
}

export function selectedAnswerIds(value) {
  const selected = Array.isArray(value) ? value : value === null || value === undefined || value === "" ? [] : [value];
  return unique(selected).map(String).sort();
}

export function isCorrectAnswer(question, selected) {
  const expected = correctAnswerIds(question);
  const actual = selectedAnswerIds(selected);
  return expected.length > 0 && expected.length === actual.length && expected.every((value, index) => value === actual[index]);
}

function validSelection(question, selected) {
  const selectedIds = selectedAnswerIds(selected);
  if (selectedIds.length === 0) return false;
  if (question.answerMode !== "multiple" && correctAnswerIds(question).length <= 1 && selectedIds.length !== 1) return false;
  return selectedIds.every((selectedId) => question.choices.some((choice) => String(choice.id) === selectedId));
}

export function buildReviewQuestionIds(sessions, scopes) {
  const selectedScopes = normalizedReviewScopes(scopes);
  if (selectedScopes.length === 0) return [];
  const ids = [];

  for (const session of [...sessions].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))) {
    if (selectedScopes.includes("review")) ids.push(...session.reviewQuestionIds);

    for (const questionId of session.questionIds) {
      const answer = session.answers[questionId];
      if (selectedScopes.includes("correct") && answer?.correct) ids.push(questionId);
      if (selectedScopes.includes("incorrect") && answer && !answer.correct) ids.push(questionId);
      if (selectedScopes.includes("unanswered") && session.status === "completed" && !answer) ids.push(questionId);
    }
  }

  return unique(ids);
}

function configFilters(config) {
  return {
    subjects: normalizedList(config.subjects ?? config.sections ?? config.subject),
    domains: normalizedList(config.domains ?? config.domain),
    unitIds: normalizedList(config.unitIds ?? config.unitId),
    periodIds: normalizedList(config.periodIds ?? config.periodId),
  };
}

function matchesSelected(value, selected) {
  return selected.length === 0 || selected.includes(String(value));
}

export function filterPracticeQuestions(questionBank, config, sessions = []) {
  const reviewScopes = normalizedReviewScopes(config.reviewScopes ?? config.scopes ?? config.scope);
  const reviewIds = new Set(buildReviewQuestionIds(sessions, reviewScopes));
  const filters = configFilters(config);
  return questionBank.filter((question) => (
    matchesSelected(question.subject || "A", filters.subjects)
    && matchesSelected(question.domain, filters.domains)
    && matchesSelected(question.unitId, filters.unitIds)
    && matchesSelected(question.periodId, filters.periodIds)
    && (reviewScopes.length === 0 || reviewIds.has(question.id))
  ));
}

export function selectPracticeQuestions(config, questionBank, sessions = [], random = Math.random) {
  const candidates = filterPracticeQuestions(questionBank, config, sessions);
  const requestedCount = config.count === "all" ? candidates.length : Number(config.count || 10);
  const ordered = config.preserveOrder ? officialOrder(candidates) : shuffled(candidates, random);
  return ordered.slice(0, Math.min(requestedCount, ordered.length));
}

function normalizeConfig(config = {}) {
  const filters = configFilters(config);
  const reviewScopes = normalizedReviewScopes(config.reviewScopes ?? config.scopes ?? config.scope);
  const mockMode = config.type === "mock" && config.mockMode === "official-sample" ? "official-sample" : "random";
  return {
    type: config.type === "mock" ? "mock" : "topic",
    mockMode,
    subjects: filters.subjects,
    domains: filters.domains,
    unitIds: filters.unitIds,
    periodIds: filters.periodIds,
    subject: filters.subjects.length === 1 ? filters.subjects[0] : "all",
    domain: filters.domains.length === 1 ? filters.domains[0] : "all",
    periodId: filters.periodIds.length === 1 ? filters.periodIds[0] : "all",
    periodLabel: config.periodLabel || (filters.periodIds.length > 1 ? `${filters.periodIds.length}開催回` : "すべての開催回"),
    reviewScopes,
    scope: reviewScopes.length === 1 ? reviewScopes[0] : "all",
    count: config.count === "all" ? "all" : Number(config.count || 10),
    durationMinutes: Number(config.durationMinutes) || null,
    officialQuestionCount: Number(config.officialQuestionCount) || null,
    preserveOrder: Boolean(config.preserveOrder),
    sampleSetId: typeof config.sampleSetId === "string" ? config.sampleSetId : null,
    sampleSetLabel: typeof config.sampleSetLabel === "string" ? config.sampleSetLabel : null,
  };
}

export function createFeSession({ config, questions, id = createId(), now = new Date() }) {
  const timestamp = nowIso(now);
  return {
    schemaVersion: FE_SESSION_SCHEMA_VERSION,
    id,
    status: "in_progress",
    config: normalizeConfig(config),
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
  if (session.status !== "in_progress" || session.answers[question.id] || !validSelection(question, selected)) return session;
  const selectedIds = selectedAnswerIds(selected);
  const draft = selectedIds.length === 1 && question.answerMode !== "multiple" ? selectedIds[0] : selectedIds;
  return withUpdatedAt({ ...session, drafts: { ...session.drafts, [question.id]: draft } }, now);
}

export function toggleSessionDraftChoice(session, question, choiceId, now = new Date()) {
  if (session.status !== "in_progress" || session.answers[question.id]) return session;
  if (!question.choices.some((choice) => String(choice.id) === String(choiceId))) return session;
  if (question.answerMode !== "multiple" && correctAnswerIds(question).length <= 1) return updateSessionDraft(session, question, String(choiceId), now);
  const selected = new Set(selectedAnswerIds(session.drafts[question.id]));
  if (selected.has(String(choiceId))) selected.delete(String(choiceId));
  else selected.add(String(choiceId));
  const drafts = { ...session.drafts };
  if (selected.size === 0) delete drafts[question.id];
  else drafts[question.id] = [...selected];
  return withUpdatedAt({ ...session, drafts }, now);
}

export function answerSessionQuestion(session, question, selected, now = new Date()) {
  if (session.status !== "in_progress" || session.answers[question.id] || !validSelection(question, selected)) return session;
  const timestamp = nowIso(now);
  const selectedIds = selectedAnswerIds(selected);
  const drafts = { ...session.drafts };
  delete drafts[question.id];
  return {
    ...session,
    answers: {
      ...session.answers,
      [question.id]: {
        selected: selectedIds.length === 1 ? selectedIds[0] : selectedIds,
        selectedIds,
        correct: isCorrectAnswer(question, selectedIds),
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
  return { total, answered, unanswered, correct, incorrect, score: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

export function normalizeFeSession(value, questionBank) {
  if (!value || typeof value !== "object" || ![1, FE_SESSION_SCHEMA_VERSION].includes(value.schemaVersion)) return null;
  if (typeof value.id !== "string" || !FE_SESSION_STATUSES.has(value.status)) return null;
  if (!Array.isArray(value.questionIds) || value.questionIds.length === 0 || value.questionIds.length > 2000) return null;
  if (unique(value.questionIds).length !== value.questionIds.length) return null;
  const questionMap = new Map(questionBank.map((question) => [question.id, question]));
  if (value.questionIds.some((questionId) => !questionMap.has(questionId))) return null;

  const answers = {};
  for (const [questionId, answer] of Object.entries(value.answers || {})) {
    const question = questionMap.get(questionId);
    const selectedIds = selectedAnswerIds(answer?.selectedIds || answer?.selected);
    if (!question || !answer || !validSelection(question, selectedIds)) continue;
    answers[questionId] = {
      selected: selectedIds.length === 1 ? selectedIds[0] : selectedIds,
      selectedIds,
      correct: isCorrectAnswer(question, selectedIds),
      answeredAt: typeof answer.answeredAt === "string" ? answer.answeredAt : value.updatedAt,
    };
  }

  const drafts = {};
  for (const [questionId, selected] of Object.entries(value.drafts || {})) {
    const question = questionMap.get(questionId);
    if (!answers[questionId] && question && validSelection(question, selected)) {
      const selectedIds = selectedAnswerIds(selected);
      drafts[questionId] = selectedIds.length === 1 && question.answerMode !== "multiple" ? selectedIds[0] : selectedIds;
    }
  }

  const currentIndex = Math.max(0, Math.min(Number(value.currentIndex) || 0, value.questionIds.length - 1));
  const config = normalizeConfig(value.config || {});
  if (!["topic", "mock"].includes(config.type)) return null;

  return {
    schemaVersion: FE_SESSION_SCHEMA_VERSION,
    id: value.id,
    status: value.status,
    config,
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
  const labels = { correct: "正解した問題", incorrect: "間違えた問題", unanswered: "未回答問題", review: "見直し対象" };
  const scopes = normalizedReviewScopes(scope);
  return scopes.length === 0 ? "通常演習" : scopes.map((value) => labels[value]).filter(Boolean).join("・");
}