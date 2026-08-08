#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(scriptDir, "..");
const inventoryPath = path.join(prototypeRoot, "data", "source", "fe", "question-source-inventory.json");
const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const sources = Array.isArray(inventory.sources) ? inventory.sources : [];

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

ensure(inventory.schemaVersion === "fe-question-source-inventory-v1", "Unexpected FE source inventory schema");
ensure(sources.length > 0, "FE source inventory is empty");
ensure(new Set(sources.map((source) => source.sourceId)).size === sources.length, "FE source IDs must be unique");
ensure(new Set(sources.map((source) => source.questionUrl)).size === sources.length, "FE source question URLs must be unique");
ensure(new Set(sources.map((source) => source.answerUrl)).size === sources.length, "FE source answer URLs must be unique");

for (const source of sources) {
  ensure(["official-public-question", "official-exemption-exam"].includes(source.sourceType), `Unexpected source type: ${source.sourceId}`);
  ensure(Number.isInteger(source.questionCount) && source.questionCount > 0, `Invalid question count: ${source.sourceId}`);
  ensure(Number.isInteger(source.repositoryReadyCount) && source.repositoryReadyCount >= 0 && source.repositoryReadyCount <= source.questionCount, `Invalid repository ready count: ${source.sourceId}`);
  ensure(source.availability === "verified", `Unverified source availability: ${source.sourceId}`);
  ensure(source.answerMapping === "source_url_verified", `Unverified answer mapping source: ${source.sourceId}`);
  ensure(source.thirdPartyMaterialReview === "required_before_import", `Missing copyright screening flag: ${source.sourceId}`);
  for (const url of [source.questionUrl, source.answerUrl]) {
    const parsed = new URL(url);
    ensure(parsed.protocol === "https:", `Non-HTTPS source URL: ${source.sourceId}`);
    ensure(parsed.hostname === "www.ipa.go.jp", `Unexpected source host: ${source.sourceId}`);
    ensure(parsed.pathname.endsWith(".pdf"), `Expected PDF source URL: ${source.sourceId}`);
  }
}

const candidateQuestionCount = sources.reduce((sum, source) => sum + source.questionCount, 0);
const contentReadyCount = sources.reduce((sum, source) => sum + source.repositoryReadyCount, 0);
ensure(candidateQuestionCount === inventory.candidateQuestionCount, "Candidate question count metadata is inconsistent");
ensure(contentReadyCount === inventory.contentReadyCount, "Content-ready question count metadata is inconsistent");

const countsByType = Object.fromEntries(
  [...new Set(sources.map((source) => source.sourceType))]
    .sort()
    .map((sourceType) => [sourceType, sources.filter((source) => source.sourceType === sourceType).reduce((sum, source) => sum + source.questionCount, 0)]),
);

console.log(JSON.stringify({
  sourceCount: sources.length,
  candidateQuestionCount,
  contentReadyCount,
  pendingContentCount: candidateQuestionCount - contentReadyCount,
  countsByType,
}, null, 2));
