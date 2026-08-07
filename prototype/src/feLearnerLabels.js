const periodLabels = {
  "2026-exemption-07": "令和8年度 免除試験",
};

export function fePeriodLabel(periodId, fallback = "") {
  return periodLabels[periodId] || fallback || periodId || "";
}

function normalizedQuestionNumber(question) {
  const value = Number(question?.sourceQuestionNumber);
  return Number.isFinite(value) ? value : null;
}

export function feQuestionTitle(question) {
  if (!question) return "";
  const mappedPeriod = periodLabels[question.periodId];
  if (mappedPeriod) {
    const questionNumber = normalizedQuestionNumber(question);
    return questionNumber === null ? mappedPeriod : `${mappedPeriod} 問${questionNumber}`;
  }
  return question.title || question.sourceRef || question.id || "";
}

export function feSourceDisplayLabel(question) {
  if (!question) return "";
  const mappedPeriod = periodLabels[question.periodId];
  if (mappedPeriod) {
    const questionNumber = normalizedQuestionNumber(question);
    return questionNumber === null ? mappedPeriod : `${mappedPeriod} 問${questionNumber}`;
  }
  return question.sourceRef || question.sourceQuestionNumber || question.id || "";
}
