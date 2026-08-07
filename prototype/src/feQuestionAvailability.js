export function isFeQuestionAvailableForSetup(question, sessionType) {
  if (sessionType !== "topic") return true;
  return !((question.subject || "A") === "A" && question.periodId === "2022-sample");
}
