#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(scriptDir, "..");
const candidatePath = path.join(prototypeRoot, "data", "source", "fe", "question-extraction-candidates.json");
const riskHintPath = path.join(prototypeRoot, "data", "source", "fe", "question-extraction-risk-hints.json");

const candidate = JSON.parse(await readFile(candidatePath, "utf8"));
const riskHints = JSON.parse(await readFile(riskHintPath, "utf8"));
const reviewPath = path.join(prototypeRoot, candidate.reviewManifest ?? "");
const contentReviewPath = path.join(prototypeRoot, candidate.contentReviewManifest ?? "");
const baseReview = JSON.parse(await readFile(reviewPath, "utf8"));
const contentReview = JSON.parse(await readFile(contentReviewPath, "utf8"));

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

const candidateSources = Array.isArray(candidate.sources) ? candidate.sources : [];
const riskSources = Array.isArray(riskHints.sources) ? riskHints.sources : [];
const baseReviewSources = Array.isArray(baseReview.sources) ? baseReview.sources : [];
const contentReviewSources = Array.isArray(contentReview.sources) ? contentReview.sources : [];

ensure(candidate.schemaVersion === "fe-question-extraction-candidates-v1", "Unexpected candidate schema");
ensure(baseReview.schemaVersion === "fe-question-extraction-review-v1", "Unexpected base review schema");
ensure(riskHints.schemaVersion === "fe-question-extraction-risk-hints-v1", "Unexpected risk-hint schema");
ensure(contentReview.schemaVersion === "fe-question-extraction-content-review-v1", "Unexpected content-review schema");
ensure(candidate.contentReviewManifest === "data/source/fe/question-extraction-content-review.json", "Unexpected content-review manifest path");
ensure(contentReview.reviewScope === "official_pdf_text_layer_question_and_choice_cross_check", "Unexpected content-review scope");
ensure(contentReview.policy?.officialQuestionPdfOnly === true, "Content review must use only official question PDFs");
ensure(contentReview.policy?.mayAuthorizeImport === false, "Content review must not authorize import");
ensure(contentReview.policy?.visualRiskQuestionsExcludedFromThisBatch === true, "This content-review batch must exclude visual-risk questions");
ensure(contentReview.policy?.textLayerReviewDoesNotCompleteVisualReview === true, "Text-layer review must not complete visual review");
ensure(contentReview.policy?.textLayerReviewDoesNotCompleteThirdPartyReview === true, "Text-layer review must not complete third-party review");
ensure(contentReview.policy?.visualRenderVerified === false, "Visual render must remain unverified after screenshot cache miss");
ensure(contentReview.policy?.visualRenderVerificationStatus === "screenshot_tool_cache_miss", "Unexpected visual-render verification status");
ensure(contentReviewSources.length === candidateSources.length, "Content-review source count mismatch");
ensure(new Set(contentReviewSources.map((source) => source.sourceId)).size === contentReviewSources.length, "Duplicate content-review source ID");

let reviewedQuestionCount = 0;
let questionTextTextLayerVerifiedCount = 0;
let fourChoicesTextLayerVerifiedCount = 0;
let unambiguousChoiceBoundaryCount = 0;
let explicitExternalMaterialReferenceDetectedCount = 0;
let visualRenderVerifiedCount = 0;

for (const source of candidateSources) {
  const contentSource = contentReviewSources.find((item) => item.sourceId === source.sourceId);
  const riskSource = riskSources.find((item) => item.sourceId === source.sourceId);
  const baseSource = baseReviewSources.find((item) => item.sourceId === source.sourceId);

  ensure(contentSource, `Missing content-review source: ${source.sourceId}`);
  ensure(riskSource, `Missing risk-hint source: ${source.sourceId}`);
  ensure(baseSource, `Missing base review source: ${source.sourceId}`);
  ensure(Array.isArray(contentSource.reviews), `Missing content-review records: ${source.sourceId}`);
  ensure(contentSource.reviews.length === contentSource.reviewedQuestionCount, `Content-review count mismatch: ${source.sourceId}`);
  ensure(contentSource.reviewedQuestionCount === source.textLayerContentReviewedCount, `Candidate source content-review count mismatch: ${source.sourceId}`);
  ensure(source.textLayerContentPendingCount === source.questionCount - source.textLayerContentReviewedCount, `Candidate source pending content-review count mismatch: ${source.sourceId}`);
  ensure(new Set(contentSource.reviews.map((item) => item.questionNumber)).size === contentSource.reviews.length, `Duplicate content-review question: ${source.sourceId}`);

  const riskQuestionNumbers = new Set(riskSource.visualDependencyHints.map((item) => item.questionNumber));

  for (const item of contentSource.reviews) {
    ensure(Number.isInteger(item.questionNumber) && item.questionNumber >= 1 && item.questionNumber <= source.questionCount, `Invalid content-review question: ${source.sourceId}`);
    ensure(Number.isInteger(item.pdfPage) && item.pdfPage > 0, `Invalid content-review PDF page: ${source.sourceId} Q${item.questionNumber}`);
    ensure(!riskQuestionNumbers.has(item.questionNumber), `Visual-risk question must not enter this text-layer-only batch: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.questionTextTextLayerVerified === true, `Question text was not text-layer verified: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.fourChoicesTextLayerVerified === true, `Four choices were not text-layer verified: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.choiceBoundaryStatus === "unambiguous", `Choice boundary is not unambiguous: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.explicitExternalMaterialReferenceDetected === false, `Explicit external-material reference requires separate review: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.visualRenderVerified === false, `Text-layer batch must not claim visual render verification: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.importDecision === "hold", `Content-review item must remain on hold: ${source.sourceId} Q${item.questionNumber}`);

    const baseQuestion = baseSource.questions.find((question) => question.questionNumber === item.questionNumber);
    ensure(baseQuestion, `Missing base review question: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.importDecision === "hold", `Base review question must remain on hold: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.questionTextVerified === false, `Text-layer batch must not finalize base question-text review: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.fourChoicesVerified === false, `Text-layer batch must not finalize base four-choice review: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.figureOrTableDependency === "pending_review", `Figure/table review must remain pending: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.thirdPartyMaterialReview === "pending_review", `Third-party review must remain pending: ${source.sourceId} Q${item.questionNumber}`);

    reviewedQuestionCount += 1;
    questionTextTextLayerVerifiedCount += Number(item.questionTextTextLayerVerified === true);
    fourChoicesTextLayerVerifiedCount += Number(item.fourChoicesTextLayerVerified === true);
    unambiguousChoiceBoundaryCount += Number(item.choiceBoundaryStatus === "unambiguous");
    explicitExternalMaterialReferenceDetectedCount += Number(item.explicitExternalMaterialReferenceDetected === true);
    visualRenderVerifiedCount += Number(item.visualRenderVerified === true);
  }
}

ensure(reviewedQuestionCount === candidate.textLayerContentReviewedCount, "Candidate content-review total is inconsistent");
ensure(candidate.textLayerContentPendingCount === candidate.candidateQuestionCount - reviewedQuestionCount, "Candidate pending content-review total is inconsistent");
ensure(reviewedQuestionCount === contentReview.summary?.reviewedQuestionCount, "Content-review summary count is inconsistent");
ensure(questionTextTextLayerVerifiedCount === contentReview.summary?.questionTextTextLayerVerifiedCount, "Question-text verification summary is inconsistent");
ensure(fourChoicesTextLayerVerifiedCount === contentReview.summary?.fourChoicesTextLayerVerifiedCount, "Four-choice verification summary is inconsistent");
ensure(unambiguousChoiceBoundaryCount === contentReview.summary?.unambiguousChoiceBoundaryCount, "Choice-boundary summary is inconsistent");
ensure(explicitExternalMaterialReferenceDetectedCount === contentReview.summary?.explicitExternalMaterialReferenceDetectedCount, "External-material summary is inconsistent");
ensure(visualRenderVerifiedCount === contentReview.summary?.visualRenderVerifiedCount, "Visual-render summary is inconsistent");
ensure(visualRenderVerifiedCount === 0, "Visual render verification must remain zero in this batch");

console.log(JSON.stringify({
  sourceCount: contentReviewSources.length,
  reviewedQuestionCount,
  pendingTextLayerContentReviewCount: candidate.textLayerContentPendingCount,
  questionTextTextLayerVerifiedCount,
  fourChoicesTextLayerVerifiedCount,
  unambiguousChoiceBoundaryCount,
  explicitExternalMaterialReferenceDetectedCount,
  visualRenderVerifiedCount,
  mayAuthorizeImport: contentReview.policy.mayAuthorizeImport,
}, null, 2));
