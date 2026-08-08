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
const contentHoldPath = path.join(prototypeRoot, candidate.contentHoldManifest ?? "");
const baseReview = JSON.parse(await readFile(reviewPath, "utf8"));
const contentReview = JSON.parse(await readFile(contentReviewPath, "utf8"));
const contentHolds = JSON.parse(await readFile(contentHoldPath, "utf8"));

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

const candidateSources = Array.isArray(candidate.sources) ? candidate.sources : [];
const riskSources = Array.isArray(riskHints.sources) ? riskHints.sources : [];
const baseReviewSources = Array.isArray(baseReview.sources) ? baseReview.sources : [];
const contentReviewSources = Array.isArray(contentReview.sources) ? contentReview.sources : [];
const contentHoldSources = Array.isArray(contentHolds.sources) ? contentHolds.sources : [];
const assertions = contentReview.recordAssertions ?? {};
const allowedHoldReasons = new Set([
  "text_layer_formula_or_symbol_formatting_ambiguous",
  "external_standard_or_framework_reference_requires_review",
]);

ensure(candidate.schemaVersion === "fe-question-extraction-candidates-v1", "Unexpected candidate schema");
ensure(baseReview.schemaVersion === "fe-question-extraction-review-v1", "Unexpected base review schema");
ensure(riskHints.schemaVersion === "fe-question-extraction-risk-hints-v1", "Unexpected risk-hint schema");
ensure(contentReview.schemaVersion === "fe-question-extraction-content-review-v2", "Unexpected content-review schema");
ensure(contentHolds.schemaVersion === "fe-question-extraction-content-holds-v1", "Unexpected content-hold schema");
ensure(candidate.contentReviewManifest === "data/source/fe/question-extraction-content-review.json", "Unexpected content-review manifest path");
ensure(candidate.contentHoldManifest === "data/source/fe/question-extraction-content-holds.json", "Unexpected content-hold manifest path");
ensure(contentReview.reviewScope === "official_pdf_text_layer_question_and_choice_cross_check", "Unexpected content-review scope");
ensure(contentHolds.reviewScope === "non_visual_text_layer_hold_classification", "Unexpected content-hold scope");
ensure(contentReview.policy?.officialQuestionPdfOnly === true, "Content review must use only official question PDFs");
ensure(contentReview.policy?.mayAuthorizeImport === false, "Content review must not authorize import");
ensure(contentReview.policy?.visualRiskQuestionsExcludedFromThisBatch === true, "This content-review batch must exclude visual-risk questions");
ensure(contentReview.policy?.textLayerReviewDoesNotCompleteVisualReview === true, "Text-layer review must not complete visual review");
ensure(contentReview.policy?.textLayerReviewDoesNotCompleteThirdPartyReview === true, "Text-layer review must not complete third-party review");
ensure(contentReview.policy?.visualRenderVerified === false, "Visual render must remain unverified after screenshot cache miss");
ensure(contentReview.policy?.visualRenderVerificationStatus === "screenshot_tool_cache_miss", "Unexpected visual-render verification status");
ensure(contentHolds.policy?.officialQuestionPdfOnly === true, "Content holds must use only official question PDFs");
ensure(contentHolds.policy?.mayAuthorizeImport === false, "Content holds must not authorize import");
ensure(contentHolds.policy?.holdsRemainPendingFinalContentReview === true, "Content holds must remain pending final content review");
ensure(contentHolds.policy?.externalReferenceRequiresSeparateReview === true, "External references must require separate review");
ensure(contentHolds.policy?.formattingAmbiguityRequiresSaferReconstruction === true, "Formatting ambiguity must require safer reconstruction");
ensure(assertions.questionTextTextLayerVerified === true, "Every content-review record must assert text-layer question verification");
ensure(assertions.fourChoicesTextLayerVerified === true, "Every content-review record must assert four-choice text-layer verification");
ensure(assertions.choiceBoundaryStatus === "unambiguous", "Every content-review record must assert unambiguous choice boundaries");
ensure(assertions.explicitExternalMaterialReferenceDetected === false, "This content-review batch must exclude explicit external-material references");
ensure(assertions.visualRenderVerified === false, "Content review assertions must not claim visual render verification");
ensure(assertions.importDecision === "hold", "Content review assertions must remain on hold");
ensure(contentReviewSources.length === candidateSources.length, "Content-review source count mismatch");
ensure(contentHoldSources.length === candidateSources.length, "Content-hold source count mismatch");
ensure(new Set(contentReviewSources.map((source) => source.sourceId)).size === contentReviewSources.length, "Duplicate content-review source ID");
ensure(new Set(contentHoldSources.map((source) => source.sourceId)).size === contentHoldSources.length, "Duplicate content-hold source ID");

let reviewedQuestionCount = 0;
let holdQuestionCount = 0;
let formattingHoldCount = 0;
let externalReferenceHoldCount = 0;
let classifiedQuestionCount = 0;

for (const source of candidateSources) {
  const contentSource = contentReviewSources.find((item) => item.sourceId === source.sourceId);
  const holdSource = contentHoldSources.find((item) => item.sourceId === source.sourceId);
  const riskSource = riskSources.find((item) => item.sourceId === source.sourceId);
  const baseSource = baseReviewSources.find((item) => item.sourceId === source.sourceId);

  ensure(contentSource, `Missing content-review source: ${source.sourceId}`);
  ensure(holdSource, `Missing content-hold source: ${source.sourceId}`);
  ensure(riskSource, `Missing risk-hint source: ${source.sourceId}`);
  ensure(baseSource, `Missing base review source: ${source.sourceId}`);
  ensure(Array.isArray(contentSource.reviews), `Missing content-review records: ${source.sourceId}`);
  ensure(Array.isArray(holdSource.holds), `Missing content-hold records: ${source.sourceId}`);
  ensure(contentSource.reviews.length === contentSource.reviewedQuestionCount, `Content-review count mismatch: ${source.sourceId}`);
  ensure(holdSource.holds.length === holdSource.holdQuestionCount, `Content-hold count mismatch: ${source.sourceId}`);
  ensure(contentSource.reviewedQuestionCount === source.textLayerContentReviewedCount, `Candidate source content-review count mismatch: ${source.sourceId}`);
  ensure(holdSource.holdQuestionCount === source.nonVisualContentHoldCount, `Candidate source non-visual hold count mismatch: ${source.sourceId}`);
  ensure(source.textLayerContentPendingCount === source.questionCount - source.textLayerContentReviewedCount, `Candidate source pending content-review count mismatch: ${source.sourceId}`);
  ensure(source.contentTriageClassifiedCount === source.questionCount, `Candidate source content-triage classification must cover all questions: ${source.sourceId}`);
  ensure(new Set(contentSource.reviews.map((item) => item.questionNumber)).size === contentSource.reviews.length, `Duplicate content-review question: ${source.sourceId}`);
  ensure(new Set(holdSource.holds.map((item) => item.questionNumber)).size === holdSource.holds.length, `Duplicate content-hold question: ${source.sourceId}`);

  const riskQuestionNumbers = new Set(riskSource.visualDependencyHints.map((item) => item.questionNumber));
  const reviewedQuestionNumbers = new Set(contentSource.reviews.map((item) => item.questionNumber));
  const holdQuestionNumbers = new Set(holdSource.holds.map((item) => item.questionNumber));

  for (const item of contentSource.reviews) {
    ensure(Object.keys(item).every((key) => key === "questionNumber" || key === "pdfPage"), `Unexpected per-question content-review field: ${source.sourceId} Q${item.questionNumber}`);
    ensure(Number.isInteger(item.questionNumber) && item.questionNumber >= 1 && item.questionNumber <= source.questionCount, `Invalid content-review question: ${source.sourceId}`);
    ensure(Number.isInteger(item.pdfPage) && item.pdfPage > 0, `Invalid content-review PDF page: ${source.sourceId} Q${item.questionNumber}`);
    ensure(!riskQuestionNumbers.has(item.questionNumber), `Visual-risk question must not enter this text-layer-only batch: ${source.sourceId} Q${item.questionNumber}`);
    ensure(!holdQuestionNumbers.has(item.questionNumber), `Content-review and content-hold records must not overlap: ${source.sourceId} Q${item.questionNumber}`);

    const baseQuestion = baseSource.questions.find((question) => question.questionNumber === item.questionNumber);
    ensure(baseQuestion, `Missing base review question: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.importDecision === "hold", `Base review question must remain on hold: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.questionTextVerified === false, `Text-layer batch must not finalize base question-text review: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.fourChoicesVerified === false, `Text-layer batch must not finalize base four-choice review: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.figureOrTableDependency === "pending_review", `Figure/table review must remain pending: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.thirdPartyMaterialReview === "pending_review", `Third-party review must remain pending: ${source.sourceId} Q${item.questionNumber}`);

    reviewedQuestionCount += 1;
  }

  for (const item of holdSource.holds) {
    ensure(Number.isInteger(item.questionNumber) && item.questionNumber >= 1 && item.questionNumber <= source.questionCount, `Invalid content-hold question: ${source.sourceId}`);
    ensure(Number.isInteger(item.pdfPage) && item.pdfPage > 0, `Invalid content-hold PDF page: ${source.sourceId} Q${item.questionNumber}`);
    ensure(allowedHoldReasons.has(item.reasonCode), `Unexpected content-hold reason: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.importDecision === "hold", `Content-hold item must remain on hold: ${source.sourceId} Q${item.questionNumber}`);
    ensure(!riskQuestionNumbers.has(item.questionNumber), `Visual-risk question must not be duplicated in non-visual holds: ${source.sourceId} Q${item.questionNumber}`);
    ensure(!reviewedQuestionNumbers.has(item.questionNumber), `Content-hold and content-review records must not overlap: ${source.sourceId} Q${item.questionNumber}`);

    const baseQuestion = baseSource.questions.find((question) => question.questionNumber === item.questionNumber);
    ensure(baseQuestion, `Missing base review hold question: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.importDecision === "hold", `Base review hold question must remain on hold: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.questionTextVerified === false, `Content hold must not finalize question text: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.fourChoicesVerified === false, `Content hold must not finalize four choices: ${source.sourceId} Q${item.questionNumber}`);
    ensure(baseQuestion.thirdPartyMaterialReview === "pending_review", `Content hold must not finalize third-party review: ${source.sourceId} Q${item.questionNumber}`);

    holdQuestionCount += 1;
    formattingHoldCount += Number(item.reasonCode === "text_layer_formula_or_symbol_formatting_ambiguous");
    externalReferenceHoldCount += Number(item.reasonCode === "external_standard_or_framework_reference_requires_review");
  }

  const classifiedQuestionNumbers = new Set([
    ...reviewedQuestionNumbers,
    ...holdQuestionNumbers,
    ...riskQuestionNumbers,
  ]);
  ensure(classifiedQuestionNumbers.size === source.questionCount, `Content-triage partition does not cover every question: ${source.sourceId}`);
  ensure(reviewedQuestionNumbers.size + holdQuestionNumbers.size + riskQuestionNumbers.size === source.questionCount, `Content-triage lanes overlap: ${source.sourceId}`);
  classifiedQuestionCount += classifiedQuestionNumbers.size;
}

ensure(reviewedQuestionCount === candidate.textLayerContentReviewedCount, "Candidate content-review total is inconsistent");
ensure(holdQuestionCount === candidate.nonVisualContentHoldCount, "Candidate non-visual content-hold total is inconsistent");
ensure(classifiedQuestionCount === candidate.contentTriageClassifiedCount, "Candidate content-triage classified total is inconsistent");
ensure(candidate.contentTriageClassifiedCount === candidate.candidateQuestionCount, "Every candidate must have a content-triage lane");
ensure(candidate.contentTriageUnclassifiedCount === 0, "No candidate may remain unclassified after content triage");
ensure(candidate.textLayerContentPendingCount === candidate.candidateQuestionCount - reviewedQuestionCount, "Candidate pending content-review total is inconsistent");
ensure(reviewedQuestionCount === contentReview.summary?.reviewedQuestionCount, "Content-review summary count is inconsistent");
ensure(contentReview.summary?.questionTextTextLayerVerifiedCount === reviewedQuestionCount, "Question-text verification summary is inconsistent");
ensure(contentReview.summary?.fourChoicesTextLayerVerifiedCount === reviewedQuestionCount, "Four-choice verification summary is inconsistent");
ensure(contentReview.summary?.unambiguousChoiceBoundaryCount === reviewedQuestionCount, "Choice-boundary summary is inconsistent");
ensure(contentReview.summary?.explicitExternalMaterialReferenceDetectedCount === 0, "External-material summary must remain zero for this batch");
ensure(contentReview.summary?.visualRenderVerifiedCount === 0, "Visual-render summary must remain zero for this batch");
ensure(holdQuestionCount === contentHolds.summary?.holdQuestionCount, "Content-hold summary count is inconsistent");
ensure(formattingHoldCount === contentHolds.summary?.textLayerFormattingAmbiguityCount, "Formatting-hold summary is inconsistent");
ensure(externalReferenceHoldCount === contentHolds.summary?.externalReferenceReviewRequiredCount, "External-reference hold summary is inconsistent");

console.log(JSON.stringify({
  sourceCount: contentReviewSources.length,
  candidateQuestionCount: candidate.candidateQuestionCount,
  reviewedQuestionCount,
  pendingTextLayerContentReviewCount: candidate.textLayerContentPendingCount,
  nonVisualContentHoldCount: holdQuestionCount,
  visualRiskQuestionCount: candidate.visualRiskHintCount,
  contentTriageClassifiedCount: classifiedQuestionCount,
  contentTriageUnclassifiedCount: candidate.contentTriageUnclassifiedCount,
  formattingHoldCount,
  externalReferenceHoldCount,
  visualRenderVerifiedCount: 0,
  mayAuthorizeImport: contentReview.policy.mayAuthorizeImport,
}, null, 2));
