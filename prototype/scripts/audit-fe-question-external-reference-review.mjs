#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(scriptDir, "..");
const candidatePath = path.join(prototypeRoot, "data", "source", "fe", "question-extraction-candidates.json");

const candidate = JSON.parse(await readFile(candidatePath, "utf8"));
const holdPath = path.join(prototypeRoot, candidate.contentHoldManifest ?? "");
const externalReviewPath = path.join(prototypeRoot, candidate.externalReferenceReviewManifest ?? "");
const holds = JSON.parse(await readFile(holdPath, "utf8"));
const externalReview = JSON.parse(await readFile(externalReviewPath, "utf8"));

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

ensure(candidate.schemaVersion === "fe-question-extraction-candidates-v1", "Unexpected candidate schema");
ensure(candidate.externalReferenceReviewManifest === "data/source/fe/question-extraction-external-reference-review.json", "Unexpected external-reference manifest path");
ensure(externalReview.schemaVersion === "fe-question-extraction-external-reference-review-v1", "Unexpected external-reference review schema");
ensure(externalReview.reviewScope === "explicit_external_standard_or_framework_reference_identification", "Unexpected external-reference review scope");
ensure(externalReview.policy?.mayAuthorizeImport === false, "External-reference identification must not authorize import");
ensure(externalReview.policy?.referenceIdentificationDoesNotCompleteThirdPartyReview === true, "Reference identification must not complete third-party review");
ensure(externalReview.policy?.referenceIdentificationDoesNotCompleteQuestionContentReview === true, "Reference identification must not complete question content review");
ensure(externalReview.policy?.historicalQuestionMeaningMustUseTheReferencedEditionOrContemporaneousDefinition === true, "Historical edition review must remain required");
ensure(externalReview.policy?.currentReferencePagesAreEvidenceOfPublisherOrMaintainerOnly === true, "Current reference pages must not be treated as historical-edition proof");

const holdSources = Array.isArray(holds.sources) ? holds.sources : [];
const reviewSources = Array.isArray(externalReview.sources) ? externalReview.sources : [];
const candidateSources = Array.isArray(candidate.sources) ? candidate.sources : [];
const allowedCategories = new Set([
  "government_standard",
  "official_agency_framework",
  "industry_framework",
  "industrial_standard",
]);

ensure(reviewSources.length === candidateSources.length, "External-reference source count mismatch");
ensure(new Set(reviewSources.map((source) => source.sourceId)).size === reviewSources.length, "Duplicate external-reference source ID");

let reviewedCount = 0;
let governmentStandardCount = 0;
let officialAgencyFrameworkCount = 0;
let industryFrameworkCount = 0;
let industrialStandardCount = 0;

for (const source of candidateSources) {
  const holdSource = holdSources.find((item) => item.sourceId === source.sourceId);
  const reviewSource = reviewSources.find((item) => item.sourceId === source.sourceId);
  ensure(holdSource, `Missing hold source: ${source.sourceId}`);
  ensure(reviewSource, `Missing external-reference source: ${source.sourceId}`);
  ensure(Array.isArray(reviewSource.reviews), `Missing external-reference records: ${source.sourceId}`);

  const externalHolds = holdSource.holds.filter((item) => item.reasonCode === "external_standard_or_framework_reference_requires_review");
  ensure(reviewSource.reviews.length === externalHolds.length, `External-reference record count mismatch: ${source.sourceId}`);
  ensure(reviewSource.reviewedReferenceQuestionCount === reviewSource.reviews.length, `External-reference source summary mismatch: ${source.sourceId}`);
  ensure(source.externalReferenceReviewedCount === reviewSource.reviews.length, `Candidate external-reference reviewed count mismatch: ${source.sourceId}`);
  ensure(source.externalReferenceHistoricalEditionPendingCount === reviewSource.reviews.length, `Historical-edition pending count mismatch: ${source.sourceId}`);
  ensure(new Set(reviewSource.reviews.map((item) => item.questionNumber)).size === reviewSource.reviews.length, `Duplicate external-reference question: ${source.sourceId}`);

  for (const item of reviewSource.reviews) {
    const hold = externalHolds.find((candidateHold) => candidateHold.questionNumber === item.questionNumber);
    ensure(hold, `External-reference review has no matching hold: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.pdfPage === hold.pdfPage, `External-reference PDF page mismatch: ${source.sourceId} Q${item.questionNumber}`);
    ensure(typeof item.referenceLabel === "string" && item.referenceLabel.length > 0, `Missing reference label: ${source.sourceId} Q${item.questionNumber}`);
    ensure(allowedCategories.has(item.referenceCategory), `Unexpected reference category: ${source.sourceId} Q${item.questionNumber}`);
    ensure(typeof item.referenceMaintainer === "string" && item.referenceMaintainer.length > 0, `Missing reference maintainer: ${source.sourceId} Q${item.questionNumber}`);
    const evidenceUrl = new URL(item.evidenceUrl);
    ensure(evidenceUrl.protocol === "https:", `External-reference evidence must use HTTPS: ${source.sourceId} Q${item.questionNumber}`);
    ensure(typeof item.evidenceStatus === "string" && item.evidenceStatus.length > 0, `Missing evidence status: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.historicalEditionReview === "required_before_import", `Historical edition review must remain pending: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.thirdPartyMaterialReview === "pending_review", `Third-party review must remain pending: ${source.sourceId} Q${item.questionNumber}`);
    ensure(item.importDecision === "hold", `External-reference review must remain on hold: ${source.sourceId} Q${item.questionNumber}`);

    reviewedCount += 1;
    governmentStandardCount += Number(item.referenceCategory === "government_standard");
    officialAgencyFrameworkCount += Number(item.referenceCategory === "official_agency_framework");
    industryFrameworkCount += Number(item.referenceCategory === "industry_framework");
    industrialStandardCount += Number(item.referenceCategory === "industrial_standard");
  }
}

ensure(reviewedCount === candidate.externalReferenceReviewedCount, "Candidate external-reference reviewed total mismatch");
ensure(reviewedCount === candidate.externalReferenceHistoricalEditionPendingCount, "Candidate historical-edition pending total mismatch");
ensure(reviewedCount === externalReview.summary?.reviewedReferenceQuestionCount, "External-reference summary total mismatch");
ensure(governmentStandardCount === externalReview.summary?.governmentStandardReferenceCount, "Government-standard summary mismatch");
ensure(officialAgencyFrameworkCount === externalReview.summary?.officialAgencyFrameworkReferenceCount, "Official-agency-framework summary mismatch");
ensure(industryFrameworkCount === externalReview.summary?.industryFrameworkReferenceCount, "Industry-framework summary mismatch");
ensure(industrialStandardCount === externalReview.summary?.industrialStandardReferenceCount, "Industrial-standard summary mismatch");
ensure(externalReview.summary?.importAuthorizedCount === 0, "External-reference review must not authorize import");

console.log(JSON.stringify({
  reviewedReferenceQuestionCount: reviewedCount,
  governmentStandardReferenceCount: governmentStandardCount,
  officialAgencyFrameworkReferenceCount: officialAgencyFrameworkCount,
  industryFrameworkReferenceCount: industryFrameworkCount,
  industrialStandardReferenceCount: industrialStandardCount,
  historicalEditionPendingCount: candidate.externalReferenceHistoricalEditionPendingCount,
  importAuthorizedCount: externalReview.summary.importAuthorizedCount,
}, null, 2));
