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

function subjectFor(question) {
  const courseId = String(question.courseId || question.placement?.courseId || "").toLowerCase();
  const sourceSubject = String(question.subject || question.extensions?.exam?.subject || "").normalize("NFKC").toUpperCase();
  return courseId === "subject-b" || sourceSubject === "B" || sourceSubject.includes("科目B") ? "B" : "A";
}

function domainFor(question, subject) {
  if (subject === "B") {
    const source = `${question.unitId || ""} ${question.title || ""} ${question.sourceRef || ""}`.normalize("NFKC").toLowerCase();
    return /security|セキュリティ|暗号|攻撃|脆弱|認証|マルウェア/u.test(source) ? "security" : "algorithm";
  }
  return Object.entries(domainUnits).find(([, units]) => units.has(question.unitId))?.[0] || null;
}

function periodLabelFor(question, subject) {
  const title = String(question.title || "");
  const match = title.match(/^(.*?)(?: 午前| 午後| 科目)/);
  if (match?.[1]) return match[1];
  if (subject === "B" && /sample|サンプル/u.test(`${question.season || ""} ${title}`)) return `${question.year || 2022}年 科目Bサンプル`;
  return `${question.year || "公開"}年度`;
}

function stripTags(value) {
  return String(value || "")
    .replace(/<br\s*\/?\s*>/giu, "\n")
    .replace(/<\/(?:p|div|li|tr|h[1-6])>/giu, "\n")
    .replace(/<li[^>]*>/giu, "・")
    .replace(/<[^>]+>/gu, "")
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

function blocksFor(question, kind) {
  const explicit = question[`${kind}Blocks`] || question.contentBlocks?.[kind];
  if (Array.isArray(explicit) && explicit.length > 0) return explicit;
  const html = question[`${kind}Html`];
  const raw = question[kind];
  return html ? htmlBlocks(html) : textBlocks(raw);
}

function normalizedAsset(asset) {
  const sourcePathValue = typeof asset === "string" ? asset : asset?.path || asset?.src || "";
  if (!sourcePathValue) return null;
  const src = /^https?:\/\//u.test(sourcePathValue)
    ? sourcePathValue
    : `https://raw.githubusercontent.com/${sourceRepository}/${sourceCommit}/${sourcePathValue.replace(/^\/+/, "")}`;
  return {
    type: asset?.type || "image",
    src,
    alt: asset?.alt || asset?.description || "問題資料",
    caption: asset?.caption || "",
  };
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
const questions = sourceBank.questions
  .filter((question) => question.sourceType === "official-past-question")
  .flatMap((question) => {
    const subject = subjectFor(question);
    const domain = domainFor(question, subject);
    const correctAnswers = [...new Set(question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : []))];
    const choices = Array.isArray(question.choices) ? question.choices : [];
    if (!domain || choices.length < 2 || correctAnswers.length < 1) return [];
    if (correctAnswers.some((answerId) => !choices.some((choice) => choice.id === answerId))) return [];
    if (subject === "A" && (choices.length !== 4 || correctAnswers.length !== 1 || (question.assets || []).length > 0)) return [];

    const assets = (question.assets || question.prompt?.assets || []).map(normalizedAsset).filter(Boolean);
    const questionBlocks = blocksFor(question, "question");
    if (assets.length > 0) questionBlocks.push(...assets.map((asset) => ({ ...asset, type: "image" })));
    const explanationBlocks = blocksFor(question, "explanation");
    return [{
      id: question.id,
      subject,
      domain,
      unitId: question.unitId || "unclassified",
      year: question.year || 2022,
      season: question.season || (subject === "B" ? "sample" : "unknown"),
      periodId: `${question.year || 2022}-${question.season || (subject === "B" ? "sample" : "unknown")}`,
      periodLabel: periodLabelFor(question, subject),
      title: question.title,
      question: normalizeText(question.question),
      questionBlocks,
      choices: choices.map((choice) => ({
        ...choice,
        text: normalizeText(choice.text),
        contentBlocks: htmlBlocks(choice.html).length > 0 ? htmlBlocks(choice.html) : textBlocks(choice.text),
      })),
      correctAnswer: correctAnswers[0],
      correctAnswers,
      answerMode: correctAnswers.length > 1 ? "multiple" : "single",
      explanation: normalizeText(question.explanation),
      explanationBlocks,
      sourceType: question.sourceType,
      sourceRef: question.sourceRef,
      sourceUrl: question.sourceUrl,
      sourceQuestionUrl: question.sourceQuestionUrl || question.sourceUrl,
      sourceAnswerUrl: question.sourceAnswerUrl,
      sourceQuestionNumber: question.questionNumber || question.officialQuestionNumber || question.extensions?.exam?.officialQuestionNumber || null,
      questionGroupId: question.sourceQuestionId || question.questionGroupId || question.extensions?.exam?.questionGroupId || null,
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
  },
  filter: {
    sourceType: "official-past-question",
    subjects: ["A", "B"],
    subjectA: { assets: "none", choices: 4, correctAnswers: 1 },
    subjectB: { structuredContent: true },
  },
  questionCount: questions.length,
  countsBySubject,
  canonicalSha256,
  questions,
};

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Synced ${questions.length} official FE questions (A: ${countsBySubject.A}, B: ${countsBySubject.B}) to ${outputFile}`);
