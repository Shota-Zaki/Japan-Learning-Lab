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
const localFigureAssets = new Map([
  ["fe-ipa-2022sample-a-005", [{
    src: "assets/fe/a-2022-005-figure.svg",
    alt: "選択肢アからエの二分木図",
    caption: "",
  }]],
]);

const domainUnits = {
  technology: new Set([
    "unclassified", "basic-theory", "algorithm-programming", "computer-components", "system-components", "software", "hardware",
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
  return firstText(value.stem, value.text, value.question, value.content, value.passage, value.material, value.html);
}

function meaningful(value) {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function mergeRecord(left, right) {
  if (!meaningful(left)) return right;
  if (!meaningful(right)) return left;
  if (Array.isArray(left) && Array.isArray(right)) return right.length > left.length ? right : left;
  if (typeof left === "object" && typeof right === "object" && !Array.isArray(left) && !Array.isArray(right)) {
    const merged = { ...left };
    for (const [key, value] of Object.entries(right)) merged[key] = key in merged ? mergeRecord(merged[key], value) : value;
    return merged;
  }
  return left;
}

function findRequired(value, found = new Map()) {
  if (!value || typeof value !== "object") return found;
  if (!Array.isArray(value) && requiredIds.has(value.id)) found.set(value.id, mergeRecord(found.get(value.id), value));
  for (const child of Object.values(value)) findRequired(child, found);
  return found;
}

function assetSource(asset) {
  return typeof asset === "string"
    ? asset
    : asset?.path || asset?.src || asset?.url || asset?.href || asset?.file || "";
}

function normalizeAsset(asset) {
  const source = assetSource(asset);
  if (!source) return null;
  const isPortableSource = /^(?:https?:|data:|blob:)/u.test(source)
    || source.startsWith("/")
    || source.startsWith("assets/");
  return {
    type: "image",
    src: isPortableSource ? source : `https://raw.githubusercontent.com/${sourceRepository}/${sourceCommit}/${source.replace(/^\/+/, "")}`,
    alt: asset?.alt || asset?.description || asset?.label || "問題図表",
    caption: asset?.caption || asset?.title || "",
  };
}

function htmlAttribute(tag, name) {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "iu");
  const match = tag.match(pattern);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
}

function htmlAssets(...values) {
  const assets = [];
  for (const value of values) {
    for (const match of String(value || "").matchAll(/<img\b[^>]*>/giu)) {
      const tag = match[0];
      const asset = normalizeAsset({
        src: htmlAttribute(tag, "src"),
        alt: htmlAttribute(tag, "alt"),
        title: htmlAttribute(tag, "title"),
      });
      if (asset) assets.push(asset);
    }
  }
  return assets;
}

function referencedAssets(question) {
  return [question.refs?.images, question.prompt?.refs?.images, question.extensions?.exam?.refs?.images]
    .filter(Array.isArray)
    .flat();
}

function referencedAssetIds(choice) {
  const values = [
    choice?.imageId,
    choice?.imageRef,
    choice?.assetId,
    ...(Array.isArray(choice?.refs?.images) ? choice.refs.images : []),
  ];
  return values
    .map((value) => typeof value === "object" ? value?.id : value)
    .filter((value) => value !== null && value !== undefined && String(value).trim())
    .map(String);
}

function directAssetsFor(value) {
  return [value?.assets, value?.sourceAssets, value?.images]
    .filter(Array.isArray)
    .flat();
}

function paragraphBlocks(text) {
  const normalized = stripTags(text);
  return normalized ? normalized.split(/\n{2,}/u).filter(Boolean).map((part) => ({ type: "paragraph", text: part })) : [];
}

function choicesFor(question, imageLookup) {
  const choices = Array.isArray(question.choices) ? question.choices : Array.isArray(question.options) ? question.options : [];
  return choices.map((choice, index) => {
    const text = firstText(choice?.text, choice?.label, choice?.content, choice?.html, typeof choice === "string" ? choice : "");
    const contentBlocks = Array.isArray(choice?.contentBlocks) && choice.contentBlocks.length > 0
      ? choice.contentBlocks.map((block) => block?.type === "image" ? (normalizeAsset(block) || block) : block)
      : paragraphBlocks(text);
    const images = [
      ...directAssetsFor(choice),
      choice?.image,
      ...referencedAssetIds(choice).map((id) => imageLookup.get(id)),
      ...htmlAssets(choice?.html, choice?.contentHtml),
    ].map(normalizeAsset).filter(Boolean);
    const knownSources = new Set(contentBlocks.filter((block) => block?.type === "image").map((block) => block.src));
    contentBlocks.push(...images.filter((asset) => !knownSources.has(asset.src)));

    return {
      ...(choice && typeof choice === "object" ? choice : {}),
      id: String(choice?.id ?? choice?.key ?? index + 1),
      text: stripTags(text),
      contentBlocks,
    };
  });
}

function questionAssetsFor(question, choiceImageIds) {
  const directAssets = [
    ...directAssetsFor(question),
    ...(Array.isArray(question.prompt?.assets) ? question.prompt.assets : []),
    ...(Array.isArray(question.extensions?.exam?.assets) ? question.extensions.exam.assets : []),
    ...(localFigureAssets.get(question.id) || []),
  ];
  const unassignedReferences = referencedAssets(question).filter((asset) => {
    const id = asset && typeof asset === "object" ? asset.id : null;
    return !id || !choiceImageIds.has(String(id));
  });
  const assets = [
    ...directAssets,
    ...unassignedReferences,
    ...htmlAssets(question.questionHtml, question.html, question.prompt?.html, question.prompt?.questionHtml),
  ].map(normalizeAsset).filter(Boolean);
  return [...new Map(assets.map((asset) => [asset.src, asset])).values()];
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

function hasRichImage(questionBlocks, choices) {
  return questionBlocks.some((block) => block?.type === "image" && block.src)
    || choices.some((choice) => choice.contentBlocks?.some((block) => block?.type === "image" && block.src));
}

function convert(question) {
  const unitId = String(question.unitId || question.placement?.unitId || question.extensions?.exam?.unitId || "unclassified");
  const domain = Object.entries(domainUnits).find(([, units]) => units.has(unitId))?.[0] || "technology";
  const shared = objectText(question.sharedMaterial || question.passage || question.prompt?.sharedMaterial || question.prompt?.passage);
  const direct = firstText(
    question.question,
    question.questionText,
    question.text,
    stripTags(question.questionHtml),
    stripTags(question.html),
    objectText(question.prompt),
  );
  const questionText = [...new Set([shared, direct].filter(Boolean))].join("\n\n");
  const explanationText = firstText(question.explanation, question.explanationText, objectText(question.solution), objectText(question.answer?.explanation), objectText(question.answer));
  const references = referencedAssets(question);
  const imageLookup = new Map(references
    .filter((asset) => asset && typeof asset === "object" && asset.id !== null && asset.id !== undefined)
    .map((asset) => [String(asset.id), asset]));
  const choiceImageIds = new Set((Array.isArray(question.choices) ? question.choices : Array.isArray(question.options) ? question.options : [])
    .flatMap(referencedAssetIds));
  const choices = choicesFor(question, imageLookup);
  const correctAnswers = correctAnswersFor(question);
  const assets = questionAssetsFor(question, choiceImageIds);
  const questionBlocks = Array.isArray(question.questionBlocks) && question.questionBlocks.length > 0
    ? question.questionBlocks.map((block) => block?.type === "image" ? (normalizeAsset(block) || block) : block)
    : paragraphBlocks(questionText);
  const knownImageSources = new Set(questionBlocks.filter((block) => block?.type === "image").map((block) => block.src));
  questionBlocks.push(...assets.filter((asset) => !knownImageSources.has(asset.src)));
  const explanationBlocks = Array.isArray(question.explanationBlocks) && question.explanationBlocks.length > 0
    ? question.explanationBlocks
    : paragraphBlocks(explanationText || `公式解答の正答は${correctAnswers.join("、")}です。`);

  if (choices.length !== 4 || correctAnswers.length !== 1 || questionBlocks.length === 0) {
    throw new Error(`2022 sample question is incomplete: ${question.id} (choices=${choices.length}, answers=${correctAnswers.length}, blocks=${questionBlocks.length})`);
  }
  if (requiredIds.has(question.id) && !hasRichImage(questionBlocks, choices)) {
    throw new Error(`2022 sample figure is missing after normalization: ${question.id}`);
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
payload.filter.subjectA = { assets: "official sample set keeps question and choice figures", choices: 4, correctAnswers: 1 };
payload.officialSampleSets = { "2022-12": { periodId: "2022-sample", countsBySubject: sampleCounts, preserveOrderBy: "sourceQuestionNumber" } };

await writeFile(bankPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Completed 2022 official sample set (A: ${sampleCounts.A}, B: ${sampleCounts.B}); total ${questions.length} questions`);
