#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(scriptDir, "..");
const candidatePath = path.join(prototypeRoot, "data", "source", "fe", "question-extraction-candidates.json");
const payload = JSON.parse(await readFile(candidatePath, "utf8"));
const sources = Array.isArray(payload.sources) ? payload.sources : [];

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

ensure(payload.schemaVersion === "fe-question-extraction-candidates-v1", "Unexpected FE extraction candidate schema");
ensure(payload.extractionPolicy?.ocrAllowed === false, "OCR must remain disabled for FE bulk extraction candidates");
ensure(sources.length > 0, "FE extraction candidate list is empty");
ensure(new Set(sources.map((source) => source.sourceId)).size === sources.length, "FE extraction candidate source IDs must be unique");

for (const source of sources) {
  ensure(source.sourceType === "official-exemption-exam", `Unexpected extraction source type: ${source.sourceId}`);
  ensure(Number.isInteger(source.questionCount) && source.questionCount > 0, `Invalid candidate question count: ${source.sourceId}`);
  ensure(source.repositoryReadyCount === 0, `Unreviewed extraction source must not be counted as repository-ready: ${source.sourceId}`);
  ensure(source.availability === "verified", `Extraction source availability is not verified: ${source.sourceId}`);
  ensure(source.answerMapping === "source_url_verified", `Official answer mapping is not verified: ${source.sourceId}`);
  ensure(source.questionTextLayer === "text_extractable_verified", `Text layer has not been verified: ${source.sourceId}`);
  ensure(source.extractionAudit === "sequential_question_numbers_1_to_80_verified", `Sequential question audit missing: ${source.sourceId}`);
  ensure(source.contentStatus === "candidate_only", `Extraction source must remain candidate-only until content review: ${source.sourceId}`);
  ensure(source.thirdPartyMaterialReview === "required_before_import", `Copyright screening flag missing: ${source.sourceId}`);
  for (const url of [source.questionUrl, source.answerUrl]) {
    const parsed = new URL(url);
    ensure(parsed.protocol === "https:", `Non-HTTPS extraction source: ${source.sourceId}`);
    ensure(parsed.hostname === "www.ipa.go.jp", `Unexpected extraction source host: ${source.sourceId}`);
    ensure(parsed.pathname.endsWith(".pdf"), `Expected extraction source PDF: ${source.sourceId}`);
  }
}

const candidateQuestionCount = sources.reduce((sum, source) => sum + source.questionCount, 0);
const repositoryReadyCount = sources.reduce((sum, source) => sum + source.repositoryReadyCount, 0);
ensure(candidateQuestionCount === payload.candidateQuestionCount, "Extraction candidate question count metadata is inconsistent");
ensure(repositoryReadyCount === payload.repositoryReadyCount, "Extraction repository-ready count metadata is inconsistent");

console.log(JSON.stringify({
  sourceCount: sources.length,
  candidateQuestionCount,
  repositoryReadyCount,
  pendingStructuredReviewCount: candidateQuestionCount - repositoryReadyCount,
  ocrAllowed: payload.extractionPolicy.ocrAllowed,
}, null, 2));
