#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  mergeQuestionBanks,
  normalizedFingerprint,
  normalizedSourceFingerprint,
  normalizeQuestion,
  validQuestion,
} from "../src/feQuestionBank.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(scriptDir, "..");
const primaryPath = path.join(prototypeRoot, "public", "data", "fe-official-past-questions.json");
const supplementalPath = path.join(prototypeRoot, "public", "data", "fe-official-supplemental-questions.json");
const inventoryPath = path.join(prototypeRoot, "data", "source", "fe", "question-source-inventory.json");
const extractionCandidatesPath = path.join(prototypeRoot, "data", "source", "fe", "question-extraction-candidates.json");

const [primaryPayload, supplementalPayload, inventory, extractionCandidates] = await Promise.all([
  readFile(primaryPath, "utf8").then(JSON.parse),
  readFile(supplementalPath, "utf8").then(JSON.parse),
  readFile(inventoryPath, "utf8").then(JSON.parse),
  readFile(extractionCandidatesPath, "utf8").then(JSON.parse),
]);

const primaryQuestions = Array.isArray(primaryPayload.questions) ? primaryPayload.questions : [];
const supplementalQuestions = Array.isArray(supplementalPayload.questions) ? supplementalPayload.questions : [];
const merged = mergeQuestionBanks(primaryQuestions, supplementalQuestions);

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function duplicateGroupCount(questions, fingerprintFor, emptyFingerprint = null) {
  const counts = new Map();
  for (const source of questions) {
    const question = normalizeQuestion(source);
    if (!validQuestion(question)) continue;
    const fingerprint = fingerprintFor(question);
    if (!fingerprint || fingerprint === emptyFingerprint) continue;
    counts.set(fingerprint, (counts.get(fingerprint) || 0) + 1);
  }
  return [...counts.values()].filter((count) => count > 1).length;
}

ensure(primaryQuestions.length > 0, "Primary FE question bank is empty");
ensure(supplementalQuestions.length === supplementalPayload.questionCount, "Supplemental FE question count metadata is inconsistent");
ensure(supplementalQuestions.every(validQuestion), "Supplemental FE question bank contains an invalid question");
ensure(merged.length >= primaryQuestions.length, "Canonical merge unexpectedly removed a primary FE question");
ensure(merged.length <= primaryQuestions.length + supplementalQuestions.length, "Canonical merge unexpectedly added FE questions");
ensure(merged.every(validQuestion), "Canonical FE question bank contains an invalid question");
ensure(inventory.contentReadyCount === supplementalQuestions.length, "Source inventory content-ready count must match the supplemental repository bank");
ensure(extractionCandidates.repositoryReadyCount === 0, "Unreviewed extraction candidates must not be counted as repository-ready");

const countsBySubject = Object.fromEntries(
  ["A", "B"].map((subject) => [subject, merged.filter((question) => question.subject === subject).length]),
);
const sourceOccurrenceCount = merged.reduce(
  (sum, question) => sum + Math.max(1, Array.isArray(question.sourceOccurrences) ? question.sourceOccurrences.length : 0),
  0,
);
const repeatedOccurrenceCount = primaryQuestions.length + supplementalQuestions.length - merged.length;
const primaryDuplicateContentGroups = duplicateGroupCount(primaryQuestions, normalizedFingerprint);
const primaryDuplicateSourceGroups = duplicateGroupCount(primaryQuestions, normalizedSourceFingerprint, "||");
const candidateUniverseQuestionCount = inventory.candidateQuestionCount + extractionCandidates.candidateQuestionCount;
const repositoryReadyCandidateCount = inventory.contentReadyCount + extractionCandidates.repositoryReadyCount;

console.log(JSON.stringify({
  primaryQuestionCount: primaryQuestions.length,
  supplementalQuestionCount: supplementalQuestions.length,
  canonicalQuestionCount: merged.length,
  countsBySubject,
  repeatedOccurrenceCount,
  sourceOccurrenceCount,
  primaryDuplicateContentGroups,
  primaryDuplicateSourceGroups,
  stagedCandidateQuestionCount: inventory.candidateQuestionCount,
  stagedContentReadyCount: inventory.contentReadyCount,
  stagedPendingContentCount: inventory.candidateQuestionCount - inventory.contentReadyCount,
  extractionCandidateQuestionCount: extractionCandidates.candidateQuestionCount,
  extractionCandidateReadyCount: extractionCandidates.repositoryReadyCount,
  candidateUniverseQuestionCount,
  repositoryReadyCandidateCount,
  candidateUniversePendingReviewCount: candidateUniverseQuestionCount - repositoryReadyCandidateCount,
}, null, 2));
