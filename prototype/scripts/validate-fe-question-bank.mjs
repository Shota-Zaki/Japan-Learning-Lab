#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prototypeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(prototypeRoot, "public", "data", "fe-official-past-questions.json");
const payload = JSON.parse(await readFile(bankPath, "utf8"));
const questions = Array.isArray(payload.questions) ? payload.questions : [];

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function validBlock(block) {
  if (!block || typeof block !== "object") return false;
  if (block.type === "paragraph" || block.type === "note" || block.type === "code") return typeof block.text === "string" && block.text.trim().length > 0;
  if (block.type === "table") return Array.isArray(block.headers) && Array.isArray(block.rows) && block.rows.length > 0;
  if (block.type === "list") return Array.isArray(block.items) && block.items.length > 0;
  if (block.type === "image") return typeof block.src === "string" && block.src.length > 0 && typeof block.alt === "string" && block.alt.length > 0;
  return false;
}

ensure(payload.schemaVersion === "fe-official-question-bank-v2", "FE question bank schema must be v2");
ensure(questions.length > 0, "FE question bank is empty");
ensure(new Set(questions.map((question) => question.id)).size === questions.length, "FE question IDs must be unique");

const bySubject = {
  A: questions.filter((question) => question.subject === "A"),
  B: questions.filter((question) => question.subject === "B"),
};
ensure(bySubject.A.length > 0, "FE Subject A questions are missing");
ensure(bySubject.B.length > 0, "FE Subject B questions are missing");
ensure(payload.countsBySubject?.A === bySubject.A.length, "FE Subject A count metadata is inconsistent");
ensure(payload.countsBySubject?.B === bySubject.B.length, "FE Subject B count metadata is inconsistent");

for (const question of questions) {
  ensure(Array.isArray(question.choices) && question.choices.length >= 2, `Choices are missing: ${question.id}`);
  ensure(Array.isArray(question.correctAnswers) && question.correctAnswers.length >= 1, `Correct answers are missing: ${question.id}`);
  ensure(question.correctAnswers.every((answerId) => question.choices.some((choice) => String(choice.id) === String(answerId))), `Correct answer is outside choices: ${question.id}`);
  ensure(Array.isArray(question.questionBlocks) && question.questionBlocks.length > 0, `Question blocks are missing: ${question.id}`);
  ensure(question.questionBlocks.every(validBlock), `Question block is invalid: ${question.id}`);
  ensure(Array.isArray(question.explanationBlocks) && question.explanationBlocks.length > 0, `Explanation blocks are missing: ${question.id}`);
  ensure(question.explanationBlocks.every(validBlock), `Explanation block is invalid: ${question.id}`);
}

const subjectBDomains = new Set(bySubject.B.map((question) => question.domain));
ensure(subjectBDomains.has("algorithm"), "FE Subject B algorithm questions are missing");
ensure(subjectBDomains.has("security"), "FE Subject B security questions are missing");
ensure(bySubject.B.some((question) => question.questionBlocks.some((block) => ["code", "table", "image"].includes(block.type))), "FE Subject B has no structured code, table, or image content");

console.log(JSON.stringify({
  questionCount: questions.length,
  countsBySubject: { A: bySubject.A.length, B: bySubject.B.length },
  subjectBDomains: [...subjectBDomains].sort(),
  structuredSubjectBQuestions: bySubject.B.filter((question) => question.questionBlocks.some((block) => ["code", "table", "image"].includes(block.type))).length,
}, null, 2));
