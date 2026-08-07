#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(scriptDir, "..");
const candidatePath = path.join(prototypeRoot, "data", "source", "fe", "question-extraction-candidates.json");
const riskHintPath = path.join(prototypeRoot, "data", "source", "fe", "question-extraction-risk-hints.json");
const payload = JSON.parse(await readFile(candidatePath, "utf8"));
const reviewPath = path.join(prototypeRoot, payload.reviewManifest ?? "");
const review = JSON.parse(await readFile(reviewPath, "utf8"));
const riskHints = JSON.parse(await readFile(riskHintPath, "utf8"));
const sources = Array.isArray(payload.sources) ? payload.sources : [];
const reviewSources = Array.isArray(review.sources) ? review.sources : [];
const riskSources = Array.isArray(riskHints.sources) ? riskHints.sources : [];

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

ensure(payload.schemaVersion === "fe-question-extraction-candidates-v1", "Unexpected FE extraction candidate schema");
ensure(review.schemaVersion === "fe-question-extraction-review-v1", "Unexpected FE extraction review schema");
ensure(riskHints.schemaVersion === "fe-question-extraction-risk-hints-v1", "Unexpected FE extraction risk-hint schema");
ensure(riskHints.policy === "heuristic_hints_only_never_auto_import", "Risk hints must never authorize automatic import");
ensure(payload.extractionPolicy?.ocrAllowed === false, "OCR must remain disabled for FE bulk extraction candidates");
ensure(payload.reviewManifest === "data/source/fe/question-extraction-review.json", "Unexpected FE extraction review manifest path");
ensure(sources.length > 0, "FE extraction candidate list is empty");
ensure(new Set(sources.map((source) => source.sourceId)).size === sources.length, "FE extraction candidate source IDs must be unique");
ensure(new Set(reviewSources.map((source) => source.sourceId)).size === reviewSources.length, "FE extraction review source IDs must be unique");
ensure(new Set(riskSources.map((source) => source.sourceId)).size === riskSources.length, "FE extraction risk source IDs must be unique");
ensure(reviewSources.length === sources.length, "FE extraction review source count is inconsistent");
ensure(riskSources.length === sources.length, "FE extraction risk source count is inconsistent");

for (const source of sources) {
  ensure(source.sourceType === "official-exemption-exam", `Unexpected extraction source type: ${source.sourceId}`);
  ensure(Number.isInteger(source.questionCount) && source.questionCount > 0, `Invalid candidate question count: ${source.sourceId}`);
  ensure(source.structuredQuestionCount === source.questionCount, `Source is not fully structured: ${source.sourceId}`);
  ensure(source.officialAnswerVerifiedCount === source.questionCount, `Official answers are not fully verified: ${source.sourceId}`);
  ensure(source.repositoryReadyCount === 0, `Unreviewed extraction source must not be counted as repository-ready: ${source.sourceId}`);
  ensure(source.availability === "verified", `Extraction source availability is not verified: ${source.sourceId}`);
  ensure(source.answerMapping === "per_question_verified", `Official answer mapping is not verified per question: ${source.sourceId}`);
  ensure(source.questionTextLayer === "text_extractable_verified", `Text layer has not been verified: ${source.sourceId}`);
  ensure(source.extractionAudit === "sequential_question_numbers_1_to_80_verified", `Sequential question audit missing: ${source.sourceId}`);
  ensure(source.contentStatus === "structured_pending_content_review", `Extraction source must remain pending content review: ${source.sourceId}`);
  ensure(source.thirdPartyMaterialReview === "required_before_import", `Copyright screening flag missing: ${source.sourceId}`);
  for (const url of [source.questionUrl, source.answerUrl]) {
    const parsed = new URL(url);
    ensure(parsed.protocol === "https:", `Non-HTTPS extraction source: ${source.sourceId}`);
    ensure(parsed.hostname === "www.ipa.go.jp", `Unexpected extraction source host: ${source.sourceId}`);
    ensure(parsed.pathname.endsWith(".pdf"), `Expected extraction source PDF: ${source.sourceId}`);
  }

  const reviewSource = reviewSources.find((item) => item.sourceId === source.sourceId);
  ensure(reviewSource, `Missing extraction review source: ${source.sourceId}`);
  ensure(reviewSource.reviewState === "structured_pending_content_review", `Unexpected review state: ${source.sourceId}`);
  ensure(Array.isArray(reviewSource.questions), `Missing review questions: ${source.sourceId}`);
  ensure(reviewSource.questions.length === source.questionCount, `Review question count mismatch: ${source.sourceId}`);
  ensure(new Set(reviewSource.questions.map((question) => question.questionNumber)).size === source.questionCount, `Duplicate review question number: ${source.sourceId}`);

  const expectedNumbers = Array.from({ length: source.questionCount }, (_, index) => index + 1);
  ensure(expectedNumbers.every((number) => reviewSource.questions.some((question) => question.questionNumber === number)), `Review question sequence is incomplete: ${source.sourceId}`);

  for (const question of reviewSource.questions) {
    ensure(["ア", "イ", "ウ", "エ"].includes(question.officialAnswer), `Invalid official answer: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.officialAnswerVerified === true, `Official answer is not verified: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.importDecision === "hold", `Unreviewed question must remain on hold: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.questionTextVerified === false, `Question text must remain pending until content review: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.fourChoicesVerified === false, `Choices must remain pending until content review: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.figureOrTableDependency === "pending_review", `Figure/table review must remain pending: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.thirdPartyMaterialReview === "pending_review", `Third-party material review must remain pending: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.domainAndUnitVerified === false, `Domain/unit must remain pending: ${source.sourceId} Q${question.questionNumber}`);
    ensure(question.explanationQualityVerified === false, `Explanation quality must remain pending: ${source.sourceId} Q${question.questionNumber}`);
  }

  const riskSource = riskSources.find((item) => item.sourceId === source.sourceId);
  ensure(riskSource, `Missing extraction risk hints: ${source.sourceId}`);
  ensure(Array.isArray(riskSource.visualDependencyHints), `Missing visual dependency hints: ${source.sourceId}`);
  ensure(new Set(riskSource.visualDependencyHints.map((item) => item.questionNumber)).size === riskSource.visualDependencyHints.length, `Duplicate visual dependency hint: ${source.sourceId}`);
  for (const hint of riskSource.visualDependencyHints) {
    ensure(Number.isInteger(hint.questionNumber) && hint.questionNumber >= 1 && hint.questionNumber <= source.questionCount, `Invalid visual dependency question: ${source.sourceId}`);
    ensure(Array.isArray(hint.dependencyHints) && hint.dependencyHints.length > 0, `Missing dependency hint types: ${source.sourceId} Q${hint.questionNumber}`);
    ensure(hint.dependencyHints.every((type) => ["figure", "table"].includes(type)), `Unexpected dependency hint type: ${source.sourceId} Q${hint.questionNumber}`);
    const question = reviewSource.questions.find((item) => item.questionNumber === hint.questionNumber);
    ensure(question?.importDecision === "hold", `Visual-risk question must remain on hold: ${source.sourceId} Q${hint.questionNumber}`);
    ensure(question?.figureOrTableDependency === "pending_review", `Visual-risk question must require manual dependency review: ${source.sourceId} Q${hint.questionNumber}`);
  }
}

const candidateQuestionCount = sources.reduce((sum, source) => sum + source.questionCount, 0);
const structuredQuestionCount = sources.reduce((sum, source) => sum + source.structuredQuestionCount, 0);
const officialAnswerVerifiedCount = sources.reduce((sum, source) => sum + source.officialAnswerVerifiedCount, 0);
const repositoryReadyCount = sources.reduce((sum, source) => sum + source.repositoryReadyCount, 0);
const reviewQuestionCount = reviewSources.reduce((sum, source) => sum + source.questions.length, 0);
const reviewAnswerVerifiedCount = reviewSources.reduce((sum, source) => sum + source.questions.filter((question) => question.officialAnswerVerified).length, 0);
const visualRiskHintCount = riskSources.reduce((sum, source) => sum + source.visualDependencyHints.length, 0);

ensure(candidateQuestionCount === payload.candidateQuestionCount, "Extraction candidate question count metadata is inconsistent");
ensure(structuredQuestionCount === payload.structuredQuestionCount, "Extraction structured question count metadata is inconsistent");
ensure(officialAnswerVerifiedCount === payload.officialAnswerVerifiedCount, "Extraction official-answer count metadata is inconsistent");
ensure(repositoryReadyCount === payload.repositoryReadyCount, "Extraction repository-ready count metadata is inconsistent");
ensure(reviewQuestionCount === review.structuredQuestionCount, "Review structured question count metadata is inconsistent");
ensure(reviewAnswerVerifiedCount === review.officialAnswerVerifiedCount, "Review official-answer count metadata is inconsistent");
ensure(review.repositoryReadyCount === 0, "Review manifest must not mark unreviewed questions repository-ready");
ensure(reviewQuestionCount === candidateQuestionCount, "Candidate and review question counts differ");
ensure(reviewAnswerVerifiedCount === officialAnswerVerifiedCount, "Candidate and review answer-verification counts differ");

console.log(JSON.stringify({
  sourceCount: sources.length,
  candidateQuestionCount,
  structuredQuestionCount,
  officialAnswerVerifiedCount,
  repositoryReadyCount,
  pendingContentReviewCount: candidateQuestionCount - repositoryReadyCount,
  visualRiskHintCount,
  ocrAllowed: payload.extractionPolicy.ocrAllowed,
}, null, 2));
