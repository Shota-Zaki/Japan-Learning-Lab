#!/usr/bin/env node
import crypto from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prototypeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultEngineerLabRoot = path.resolve(prototypeRoot, "..", "..", "Engineer-License-Lab");
const engineerLabRoot = path.resolve(process.argv[2] || defaultEngineerLabRoot);
const sourceFile = path.join(engineerLabRoot, "docs", "labs", "fe", "data", "question-bank.json");
const outputFile = path.join(prototypeRoot, "public", "data", "fe-official-past-questions.json");
const sourceCommit = "1402da68e2e74945bc8fa4add829458220917512";
const sourceBlob = "82e64654a22d706a168563883752add70e70ad71";
const sourceRepository = "Shota-Zaki/Engineer-License-Lab";
const sourcePath = "docs/labs/fe/data/question-bank.json";
const remoteSourceUrl = `https://raw.githubusercontent.com/${sourceRepository}/${sourceCommit}/${sourcePath}`;

const domainUnits = {
  technology: new Set([
    "basic-theory", "algorithm-programming", "computer-components", "system-components", "software", "hardware",
    "human-interface", "multimedia", "database", "network", "security", "system-development", "software-development-management",
  ]),
  management: new Set(["project-management", "service-management", "system-audit"]),
  strategy: new Set(["system-strategy", "system-planning", "business-strategy", "technology-strategy", "business-industry", "corporate-activity", "law"]),
};

function firstText(...values) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0) || "";
}

function subjectFor(question) {
  const courseId = String(question.courseId || question.placement?.courseId || "").normalize("NFKC").toLowerCase();
  const sourceSubject = String(question.subject || question.extensions?.exam?.subject || "").normalize("NFKC").toUpperCase();
  return courseId === "subject-b" || sourceSubject === "B" || sourceSubject.includes("科目B") ? "B" : "A";
}

function unitIdFor(question) {
  return String(question.unitId || question.placement?.unitId || question.extensions?.exam?.unitId || "unclassified");
}

function yearFor(question) {
  const value = question.year || question.extensions?.exam?.year || question.metadata?.year;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2022;
}

function seasonFor(question, subject) {
  return String(question.season || question.extensions?.exam?.season || question.metadata?.season || (subject === "B" ? "sample" : "unknown"));
}

function domainFor(question, subject) {
  if (subject === "B") {
    const source = [
      unitIdFor(question),
      question.title,
      question.sourceRef,
      question.question,
      question.questionText,
      question.prompt?.stem,
    ].join(" ").normalize("NFKC").toLowerCase();
    return /security|セキュリティ|暗号|攻撃|脆弱|認証|マルウェア|インシデント/u.test(source) ? "security" : "algorithm";
  }
  return Object.entries(domainUnits).find(([, units]) => units.has(unitIdFor(question)))?.[0] || null;
}

function periodLabelFor(question, subject) {
  const title = String(question.title || "");
  const match = title.match(/^(.*?)(?: 午前| 午後| 科目)/u);
  if (match?.[1]) return match[1];
  const year = yearFor(question);
  const season = seasonFor(question, subject);
  if (subject === "B" && /sample|サンプル/u.test(`${season} ${title}`)) return `${year}年 科目Bサンプル`;
  return `${year}年度`;
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
    .replace(/&#39;/gu, "'");
}

function normalizeText(value) {
  return stripTags(value)
    .replace(/\r\n?/gu, "\n")
    .replace(/[ \t]+\n/gu, "\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

function parseHtmlTable(html) {
  const rows = [...String(html || "").matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/giu)].map((rowMatch) => (
    [...rowMatch[1].matchAll(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/giu)].map((cell) => normalizeText(cell[2]))
  )).filter((row) => row.length > 0);
  if (rows.length < 2) return null;
  return { type: "table", headers: rows[0], rows: rows.slice(1) };
}

function looksLikeCode(text) {
  const lines = text.split("\n").filter(Boolean);
  if (lines.length < 2) return false;
  const markers = lines.filter((line) => (
    /^\s*(?:○|if\b|elseif\b|else\b|endif\b|for\b|endfor\b|while\b|endwhile\b|return\b|大域:|[\p{L}\p{N}_]+\s*←)/iu.test(line)
    || /(?:←|\bmod\b|\/\*|\*\/|\[[^\]]+\]|\([^)]*\))/u.test(line)
  )).length;
  return markers >= Math.max(2, Math.ceil(lines.length * 0.35));
}

function tableFromText(text) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 3 || !lines.every((line) => line.includes("|") || /\s{2,}/u.test(line))) return null;
  const rows = lines.map((line) => line.split(line.includes("|") ? "|" : /\s{2,}/u).map((cell) => cell.trim()).filter(Boolean));
  const width = rows[0].length;
  if (width < 2 || rows.some((row) => row.length !== width)) return null;
  return { type: "table", headers: rows[0], rows: rows.slice(1) };
}

function plainTextBlocks(value) {
  const sections = normalizeText(value).split(/\n{2,}/u).map((part) => part.trim()).filter(Boolean);
  const blocks = [];
  for (const section of sections) {
    const programMatch = section.match(/^(.*?)(?:〔プログラム〕|\[プログラム\])\s*([\s\S]+)$/u);
    if (programMatch) {
      if (programMatch[1].trim()) blocks.push({ type: "paragraph", text: programMatch[1].trim() });
      blocks.push({ type: "code", language: "pseudocode", text: programMatch[2].trim() });
      continue;
    }
    const table = tableFromText(section);
    if (table) {
      blocks.push(table);
      continue;
    }
    if (looksLikeCode(section)) {
      blocks.push({ type: "code", language: "pseudocode", text: section });
      continue;
    }
    if (/^(?:注記|注意|前提)/u.test(section)) {
      blocks.push({ type: "note", text: section });
      continue;
    }
    blocks.push({ type: "paragraph", text: section });
  }
  return blocks;
}

function textBlocks(value) {
  const text = normalizeText(value);
  if (!text) return [];
  const blocks = [];
  const fenced = /```([\w-]*)\n([\s\S]*?)```/gu;
  let cursor = 0;
  for (const match of text.matchAll(fenced)) {
    if (match.index > cursor) blocks.push(...plainTextBlocks(text.slice(cursor, match.index)));
    blocks.push({ type: "code", language: match[1] || "text", text: match[2].trimEnd() });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) blocks.push(...plainTextBlocks(text.slice(cursor)));
  return blocks;
}

function htmlBlocks(value) {
  const html = String(value || "");
  if (!html) return [];
  const blocks = [];
  const tokenPattern = /<(pre|table)[^>]*>[\s\S]*?<\/\1>/giu;
  let cursor = 0;
  for (const match of html.matchAll(tokenPattern)) {
    if (match.index > cursor) blocks.push(...textBlocks(html.slice(cursor, match.index)));
    if (match[1].toLowerCase() === "pre") {
      blocks.push({ type: "code", language: "pseudocode", text: normalizeText(match[0]) });
    } else {
      const table = parseHtmlTable(match[0]);
      if (table) blocks.push(table);
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < html.length) blocks.push(...textBlocks(html.slice(cursor)));
  return blocks;
}

function objectText(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return firstText(value.stem, value.text, value.question, value.content, value.passage, value.material);
}

function questionTextFor(question) {
  const shared = objectText(question.sharedMaterial || question.passage || question.prompt?.sharedMaterial || question.prompt?.passage);
  const direct = firstText(
    question.question,
    question.questionText,
    question.text,
    objectText(question.prompt),
  );
  return [...new Set([shared, direct].filter(Boolean))].join("\n\n");
}

function explanationTextFor(question) {
  return firstText(
    question.explanation,
    question.explanationText,
    objectText(question.solution),
    objectText(question.answer?.explanation),
    objectText(question.answer),
  );
}

function blocksFor(question, kind) {
  const explicit = question[`${kind}Blocks`] || question.contentBlocks?.[kind];
  if (Array.isArray(explicit) && explicit.length > 0) return explicit;
  const html = firstText(
    question[`${kind}Html`],
    kind === "question" ? question.prompt?.html : question.answer?.explanationHtml,
  );
  const raw = kind === "question" ? questionTextFor(question) : explanationTextFor(question);
  const blocks = html ? htmlBlocks(html) : textBlocks(raw);
  const code = kind === "question" ? firstText(question.code, question.prompt?.code) : "";
  if (code && !blocks.some((block) => block.type === "code" && block.text === normalizeText(code))) {
    blocks.push({ type: "code", language: "pseudocode", text: normalizeText(code) });
  }
  return blocks;
}

function normalizedAsset(asset) {
  const sourcePathValue = typeof asset === "string" ? asset : asset?.path || asset?.src || asset?.url || "";
  if (!sourcePathValue) return null;
  const src = /^https?:\/\//u.test(sourcePathValue)
    ? sourcePathValue
    : `https://raw.githubusercontent.com/${sourceRepository}/${sourceCommit}/${sourcePathValue.replace(/^\/+/, "")}`;
  return {
    type: "image",
    src,
    alt: asset?.alt || asset?.description || asset?.label || "問題資料",
    caption: asset?.caption || "",
  };
}

function allAssetsFor(question) {
  const values = [question.assets, question.sourceAssets, question.prompt?.assets, question.extensions?.exam?.assets]
    .filter(Array.isArray)
    .flat();
  const seen = new Set();
  return values.map(normalizedAsset).filter((asset) => {
    if (!asset || seen.has(asset.src)) return false;
    seen.add(asset.src);
    return true;
  });
}

function choicesFor(question) {
  const choices = Array.isArray(question.choices) ? question.choices : Array.isArray(question.options) ? question.options : [];
  return choices.map((choice, index) => {
    const text = firstText(choice?.text, choice?.label, choice?.content, typeof choice === "string" ? choice : "");
    const html = firstText(choice?.html, choice?.contentHtml);
    return {
      ...(choice && typeof choice === "object" ? choice : {}),
      id: String(choice?.id ?? choice?.key ?? index + 1),
      text: normalizeText(text),
      contentBlocks: html ? htmlBlocks(html) : textBlocks(text),
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

function candidateScore(question) {
  return [
    question.question,
    question.questionHtml,
    question.questionText,
    question.explanation,
    question.explanationHtml,
    question.correctAnswers,
    question.correctChoiceIds,
    question.answer,
    question.prompt,
    question.assets,
    question.sourceAssets,
    question.extensions,
    question.placement,
  ].reduce((score, value) => score + (value ? 1 : 0), 0);
}

function collectSourceQuestions(value, sourceLocation = "root", found = new Map()) {
  if (!value || typeof value !== "object") return found;
  if (!Array.isArray(value) && typeof value.id === "string" && (Array.isArray(value.choices) || Array.isArray(value.options))) {
    const existing = found.get(value.id);
    const candidate = { question: value, sourceLocation, score: candidateScore(value) };
    if (!existing || candidate.score > existing.score) found.set(value.id, candidate);
    return found;
  }
  for (const [key, child] of Object.entries(value)) {
    collectSourceQuestions(child, Array.isArray(value) ? `${sourceLocation}[${key}]` : `${sourceLocation}.${key}`, found);
  }
  return found;
}

function isOfficialQuestion(question) {
  const sourceType = String(question.sourceType || question.extensions?.exam?.sourceType || "").toLowerCase();
  const sourceRef = String(question.sourceRef || question.sourceUrl || question.extensions?.exam?.sourceKind || "").toLowerCase();
  return sourceType === "official-past-question" || /^fe-ipa-/u.test(String(question.id)) || /\bipa\b|official/u.test(sourceRef);
}

async function readSourceBank() {
  try {
    await access(sourceFile);
    return JSON.parse(await readFile(sourceFile, "utf8"));
  } catch {
    const response = await fetch(remoteSourceUrl, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`FE source download failed: ${response.status}`);
    return response.json();
  }
}

const sourceBank = await readSourceBank();
const sourceQuestions = [...collectSourceQuestions(sourceBank).values()].map(({ question }) => question);
const questions = sourceQuestions
  .filter(isOfficialQuestion)
  .flatMap((question) => {
    const subject = subjectFor(question);
    const domain = domainFor(question, subject);
    const choices = choicesFor(question);
    const correctAnswers = correctAnswersFor(question);
    const assets = allAssetsFor(question);
    if (!domain || choices.length < 2 || correctAnswers.length < 1) return [];
    if (correctAnswers.some((answerId) => !choices.some((choice) => choice.id === answerId))) return [];
    if (subject === "A" && (choices.length !== 4 || correctAnswers.length !== 1 || assets.length > 0)) return [];

    const questionBlocks = blocksFor(question, "question");
    if (assets.length > 0) questionBlocks.push(...assets);
    const explanationBlocks = blocksFor(question, "explanation");
    const year = yearFor(question);
    const season = seasonFor(question, subject);
    const questionText = questionTextFor(question);
    const explanationText = explanationTextFor(question);
    return [{
      id: question.id,
      subject,
      domain,
      unitId: unitIdFor(question),
      year,
      season,
      periodId: `${year}-${season}`,
      periodLabel: periodLabelFor(question, subject),
      title: firstText(question.title, question.name, `${subject === "B" ? "科目B" : "科目A"} ${question.id}`),
      question: normalizeText(questionText),
      questionBlocks,
      choices,
      correctAnswer: correctAnswers[0],
      correctAnswers,
      answerMode: correctAnswers.length > 1 ? "multiple" : "single",
      explanation: normalizeText(explanationText),
      explanationBlocks,
      sourceType: question.sourceType || "official-past-question",
      sourceRef: question.sourceRef || question.extensions?.exam?.sourceRef || "",
      sourceUrl: question.sourceUrl || question.extensions?.exam?.sourceUrl || "",
      sourceQuestionUrl: question.sourceQuestionUrl || question.sourceUrl || question.extensions?.exam?.sourceQuestionUrl || "",
      sourceAnswerUrl: question.sourceAnswerUrl || question.extensions?.exam?.sourceAnswerUrl || "",
      sourceQuestionNumber: question.questionNumber || question.officialQuestionNumber || question.extensions?.exam?.officialQuestionNumber || null,
      questionGroupId: question.sourceQuestionId || question.questionGroupId || question.extensions?.exam?.questionGroupId || question.prompt?.sharedMaterialId || null,
      qaStatus: question.qaStatus,
      explanationQaStatus: question.explanationQaStatus,
    }];
  })
  .sort((left, right) => (
    left.subject.localeCompare(right.subject)
    || right.year - left.year
    || right.season.localeCompare(left.season)
    || left.id.localeCompare(right.id)
  ));

const canonical = questions.map(({ id, subject, question, questionBlocks, choices, correctAnswers }) => ({
  id, subject, question, questionBlocks, choices, correctAnswers,
}));
const canonicalSha256 = crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
const countsBySubject = Object.fromEntries(["A", "B"].map((subject) => [subject, questions.filter((question) => question.subject === subject).length]));
const payload = {
  schemaVersion: "fe-official-question-bank-v2",
  generatedFrom: {
    repository: `https://github.com/${sourceRepository}`,
    commit: sourceCommit,
    blob: sourceBlob,
    file: sourcePath,
    updatedAt: sourceBank.updatedAt,
    discoveredQuestionCandidates: sourceQuestions.length,
  },
  filter: {
    sourceType: "official-past-question",
    subjects: ["A", "B"],
    subjectA: { assets: "none", choices: 4, correctAnswers: 1 },
    subjectB: { recursiveSourceDiscovery: true, structuredContent: true },
  },
  questionCount: questions.length,
  countsBySubject,
  canonicalSha256,
  questions,
};

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Synced ${questions.length} official FE questions from ${sourceQuestions.length} candidates (A: ${countsBySubject.A}, B: ${countsBySubject.B}) to ${outputFile}`);
