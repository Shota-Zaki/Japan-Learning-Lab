import { correctAnswerIds, selectedAnswerIds } from "./feSession.js";

export function sessionHistoryDescription(session) {
  const config = session?.config || {};
  if (config.type !== "mock") {
    const scopes = config.reviewScopes ?? config.scope;
    const normalized = Array.isArray(scopes) ? scopes : scopes ? [scopes] : [];
    const labels = { correct: "正解した問題", incorrect: "間違えた問題", unanswered: "未回答問題", review: "見直し対象" };
    const label = normalized.filter((scope) => scope && scope !== "all").map((scope) => labels[scope]).filter(Boolean).join("・");
    return label || "通常演習";
  }
  if (config.mockMode === "official-sample") {
    return config.sampleSetLabel || "公式サンプル模擬試験";
  }
  return "ランダム模擬試験";
}

export function buildSessionReviewItems(session, questionBank) {
  const questionMap = new Map((questionBank || []).map((question) => [question.id, question]));
  return (session?.questionIds || []).map((questionId, index) => {
    const question = questionMap.get(questionId) || null;
    const answer = session?.answers?.[questionId] || null;
    return {
      questionId,
      index,
      question,
      answer,
      selectedIds: selectedAnswerIds(answer?.selectedIds || answer?.selected),
      correctIds: question ? correctAnswerIds(question) : [],
      status: !answer ? "unanswered" : answer.correct ? "correct" : "incorrect",
    };
  });
}

export function choiceLabels(question, ids, emptyLabel = "未回答") {
  if (!question || !ids?.length) return emptyLabel;
  const selected = new Set(ids.map(String));
  const labels = question.choices
    .filter((choice) => selected.has(String(choice.id)))
    .map((choice) => choice.label || choice.id);
  return labels.length ? labels.join("、") : emptyLabel;
}
