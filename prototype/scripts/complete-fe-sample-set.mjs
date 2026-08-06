#!/usr/bin/env node
import crypto from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prototypeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(prototypeRoot, "public", "data", "fe-official-past-questions.json");
const sourceRepository = "Shota-Zaki/Engineer-License-Lab";
const sourceCommit = "1402da68e2e74945bc8fa4add829458220917512";
const sourcePath = "docs/labs/fe/data/question-bank.json";
const sourceUrl = `https://raw.githubusercontent.com/${sourceRepository}/${sourceCommit}/${sourcePath}`;
const requiredIds = new Set([
  "fe-ipa-2022sample-a-005",
  "fe-ipa-2022sample-a-006",
  "fe-ipa-2022sample-a-007",
  "fe-ipa-2022sample-a-009",
]);

const domainUnits = {
  technology: new Set([
    "basic-theory", "algorithm-programming", "computer-components", "system-components", "software", "hardware",
    "human-interface", "multimedia", "database", "network", "security", "system-development", "software-development-management",
  ]),
  management: new Set(["project-management", "service-management", "system-audit"]),
  strategy: new Set(["system-strategy", "system-planning", "business-strategy", "technology-strategy", "business-industry", "corporate-activity", "law"]),
};

function firstText(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

function stripTags(value) {
  return String(value || "")
    .replace(/<br\s*\/?\s*>/giu, "\n")
    .replace(/<\/(?:p|div|li|tr|h[1-6])>/giu, "\n")
    .replace(/<li[^>]*>/giu, "・")
    .replace(/<[^>]+>/gu, "")
    .replace(/&nbsp;/gu, " ")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&amp;/gu, "&")
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'")
    .replace(/\r\n?/gu, "\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

function objectText(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return firstText(value.stem, value.text, value.question, value.content, value.passage, value.material);
}

function findRequired(value, found = new Map()) {
  if (!value || typeof value !== "object") return found;
  if (!Array.isArray(value) && requiredIds.has(value.id)) found.set(value.id, value);
  for (const child of Object.values(value)) findRequired(child, found);
  return found;
}

function normalizeAsset(asset) {
  const source = typeof asset === "string" ? asset : asset?.path || asset?.src || asset?.url || "";
  if (!source) return null;
  return {
    type: "image",
    src: /^https?:\/\//u.test(source) ? source : `https://raw.githubusercontent.com/${sourceRepository}/${sourceCommit}/${source.replace(/^\/+/, "")}`,
    alt: asset?.alt || asset?.description || asset?.label || "問題図表",
    caption: asset?.caption || "",
  };
}

function assetsFor(question) {
  const assets = [question.assets, question.sourceAssets, question.prompt?.assets, question.extensions?.exam?.assets]
    .filter(Array.isArray)
    .flat()
    .map(normalizeAsset)
    .filter(Boolean);
  return [...new Map(assets.map((asset) => [asset.src, asset])).values()];
}

function paragraphBlocks(text) {
  const normalized = stripTags(text);
  return normalized ? normalized.split(/\n{2,}/u).filter(Boolean).map((part) => ({ type: "paragraph", text: part })) : [];
}

function choicesFor(question) {
  const choices = Array.isArray(question.choices) ? question.choices : Array.isArray(question.options) ? question.options : [];
  return choices.map((choice, index) => {
    const text = firstText(choice?.text, choice?.label, choice?.content, typeof choice === "string" ? choice : "");
    return {
      ...(choice && typeof choice === "object" ? choice : {}),
      id: String(choice?.id ?? choice?.key ?? index + 1),
      text: stripTags(text),
      contentBlocks: Array.isArray(choice?.contentBlocks) && choice.contentBlocks.length > 0 ? choice.contentBlocks : paragraphBlocks(text),
    };
  });
}

function correctAnswersFor(question) {
  const value = question.correctAnswers
    || question.correctChoiceIds
    || question.answer?.correctChoiceIds
    || question.answer?.correctAnswers
    || question.solution?.correctChoiceIds
    || (question.correctAnswer !== undefined ? [question.correctAnswer] : null)
    || (question.answer?.correctAnswer !== undefined ? [question.answer.correctAnswer] : []);
  return [...new Set((Array.isArray(value) ? value : [value]).filter((answer) => answer !== null && answer !== undefined).map(String))];
}

function convert(question) {
  const unitId = String(question.unitId || question.placement?.unitId || question.extensions?.exam?.unitId || "unclassified");
  const domain = Object.entries(domainUnits).find(([, units]) => units.has(unitId))?.[0];
  const shared = objectText(question.sharedMaterial || question.passage || question.prompt?.sharedMaterial || question.prompt?.passage);
  const direct = firstText(question.question, question.questionText, question.text, objectText(question.prompt));
  const questionText = [...new Set([shared, direct].filter(Boolean))].join("\n\n");
  const explanationText = firstText(question.explanation, question.explanationText, objectText(question.solution), objectText(question.answer?.explanation), objectText(question.answer));
  const choices = choicesFor(question);
  const correctAnswers = correctAnswersFor(question);
  const assets = assetsFor(question);
  const questionBlocks = Array.isArray(question.questionBlocks) && question.questionBlocks.length > 0
    ? question.questionBlocks.map((block) => block?.type === "image" ? (normalizeAsset(block) || block) : block)
    : paragraphBlocks(questionText);
  const knownImageSources = new Set(questionBlocks.filter((block) => block?.type === "image").map((block) => block.src));
  questionBlocks.push(...assets.filter((asset) => !knownImageSources.has(asset.src)));
  const hasFigure = questionBlocks.some((block) => block?.type === "image");
  const explanationBlocks = Array.isArray(question.explanationBlocks) && question.explanationBlocks.length > 0
    ? question.explanationBlocks
    : paragraphBlocks(explanationText || `公式解答の正答は${correctAnswers.join("、")}です。`);

  if (!domain || choices.length !== 4 || correctAnswers.length !== 1 || !hasFigure) {
    throw new Error(`2022 sample question is incomplete: ${question.id}`);
  }

  return {
    id: question.id,
    subject: "A",
    domain,
    unitId,
    year: 2022,
    season: "sample",
    periodId: "2022-sample",
    periodLabel: "2022年12月公開 科目Aサンプル",
    title: firstText(question.title, question.name, `科目A サンプル60問 問${question.questionNumber || ""}`),
    question: stripTags(questionText),
    questionBlocks,
    choices,
    correctAnswer: correctAnswers[0],
    correctAnswers,
    answerMode: "single",
    explanation: stripTags(explanationText),
    explanationBlocks,
    sourceType: question.sourceType || "official-past-question",
    sourceRef: question.sourceRef || question.extensions?.exam?.sourceRef || "2022年12月公開 科目Aサンプル問題",
    sourceUrl: question.sourceUrl || question.extensions?.exam?.sourceUrl || "",
    sourceQuestionUrl: question.sourceQuestionUrl || question.sourceUrl || question.extensions?.exam?.sourceQuestionUrl || "",
    sourceAnswerUrl: question.sourceAnswerUrl || question.extensions?.exam?.sourceAnswerUrl || "",
    sourceQuestionNumber: Number(question.questionNumber || question.officialQuestionNumber || question.extensions?.exam?.officialQuestionNumber),
    questionGroupId: question.sourceQuestionId || question.questionGroupId || question.extensions?.exam?.questionGroupId || question.prompt?.sharedMaterialId || null,
    qaStatus: question.qaStatus,
    explanationQaStatus: question.explanationQaStatus,
  };
}

const payload = JSON.parse(await readFile(bankPath, "utf8"));
const response = await fetch(sourceUrl, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error(`FE sample source download failed: ${response.status}`);
const sourceBank = await response.json();
const found = findRequired(sourceBank);
if (found.size !== requiredIds.size) {
  const missing = [...requiredIds].filter((id) => !found.has(id));
  throw new Error(`Missing 2022 sample questions: ${missing.join(", ")}`);
}

const byId = new Map(payload.questions.map((question) => [question.id, question]));
for (const id of requiredIds) byId.set(id, convert(found.get(id)));
const questions = [...byId.values()].sort((left, right) => (
  left.subject.localeCompare(right.subject)
  || right.year - left.year
  || String(right.season).localeCompare(String(left.season))
  || left.id.localeCompare(right.id)
));

const sampleCounts = Object.fromEntries(["A", "B"].map((subject) => [subject, questions.filter((question) => question.subject === subject && question.periodId === "2022-sample").length]));
if (sampleCounts.A !== 60 || sampleCounts.B !== 20) throw new Error(`2022 official sample set is incomplete: A=${sampleCounts.A}, B=${sampleCounts.B}`);

const canonical = questions.map(({ id, subject, question, questionBlocks, choices, correctAnswers }) => ({ id, subject, question, questionBlocks, choices, correctAnswers }));
payload.questions = questions;
payload.questionCount = questions.length;
payload.countsBySubject = Object.fromEntries(["A", "B"].map((subject) => [subject, questions.filter((question) => question.subject === subject).length]));
payload.canonicalSha256 = crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
payload.filter.subjectA = { assets: "none except complete official sample set", choices: 4, correctAnswers: 1 };
payload.officialSampleSets = { "2022-12": { periodId: "2022-sample", countsBySubject: sampleCounts, preserveOrderBy: "sourceQuestionNumber" } };

await writeFile(bankPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Completed 2022 official sample set (A: ${sampleCounts.A}, B: ${sampleCounts.B}); total ${questions.length} questions`);
