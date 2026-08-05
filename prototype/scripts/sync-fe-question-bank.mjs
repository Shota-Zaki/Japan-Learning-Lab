#!/usr/bin/env node
import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prototypeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultEngineerLabRoot = path.resolve(prototypeRoot, "..", "..", "Engineer-License-Lab");
const engineerLabRoot = path.resolve(process.argv[2] || defaultEngineerLabRoot);
const sourceFile = path.join(engineerLabRoot, "docs", "labs", "fe", "data", "question-bank.json");
const outputFile = path.join(prototypeRoot, "public", "data", "fe-official-past-questions.json");

const domainUnits = {
  technology: new Set([
    "basic-theory", "algorithm-programming", "computer-components", "system-components", "software", "hardware",
    "human-interface", "multimedia", "database", "network", "security", "system-development", "software-development-management",
  ]),
  management: new Set(["project-management", "service-management", "system-audit"]),
  strategy: new Set(["system-strategy", "system-planning", "business-strategy", "technology-strategy", "business-industry", "corporate-activity", "law"]),
};

function domainFor(unitId) {
  return Object.entries(domainUnits).find(([, units]) => units.has(unitId))?.[0] || null;
}

function periodLabelFor(question) {
  const match = question.title.match(/^(.*?)(?: 午前| 午後| 科目)/);
  return match?.[1] || `${question.year}年度`;
}

const sourceBank = JSON.parse(await readFile(sourceFile, "utf8"));
const questions = sourceBank.questions
  .filter((question) => (
    question.sourceType === "official-past-question"
    && question.courseId === "subject-a"
    && (!question.assets || question.assets.length === 0)
    && question.choices?.length === 4
    && question.correctAnswers?.length === 1
    && question.choices.some((choice) => choice.id === question.correctAnswers[0])
    && domainFor(question.unitId)
  ))
  .map((question) => ({
    id: question.id,
    domain: domainFor(question.unitId),
    unitId: question.unitId,
    year: question.year,
    season: question.season,
    periodId: `${question.year}-${question.season}`,
    periodLabel: periodLabelFor(question),
    title: question.title,
    question: question.question,
    choices: question.choices,
    correctAnswer: question.correctAnswers[0],
    explanation: question.explanation,
    sourceType: question.sourceType,
    sourceRef: question.sourceRef,
    sourceUrl: question.sourceUrl,
    sourceQuestionUrl: question.sourceQuestionUrl || question.sourceUrl,
    sourceAnswerUrl: question.sourceAnswerUrl,
    qaStatus: question.qaStatus,
    explanationQaStatus: question.explanationQaStatus,
  }))
  .sort((left, right) => right.year - left.year || right.season.localeCompare(left.season) || left.id.localeCompare(right.id));

const canonical = questions.map(({ id, question, choices, correctAnswer }) => ({ id, question, choices, correctAnswer }));
const canonicalSha256 = crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
const payload = {
  schemaVersion: "fe-official-past-question-bank-v1",
  generatedFrom: {
    repository: "https://github.com/Shota-Zaki/Engineer-License-Lab",
    commit: "1402da68e2e74945bc8fa4add829458220917512",
    blob: "82e64654a22d706a168563883752add70e70ad71",
    file: "docs/labs/fe/data/question-bank.json",
    updatedAt: sourceBank.updatedAt,
  },
  filter: {
    sourceType: "official-past-question",
    courseId: "subject-a",
    assets: "none",
    choices: 4,
    correctAnswers: 1,
  },
  questionCount: questions.length,
  canonicalSha256,
  questions,
};

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Synced ${questions.length} official FE past questions to ${outputFile}`);
