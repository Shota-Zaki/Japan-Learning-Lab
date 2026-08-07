const unitLabels = {
  "basic-theory": "基礎理論",
  "algorithm-programming": "アルゴリズムとプログラミング",
  "computer-components": "コンピュータ構成要素",
  "system-components": "システム構成要素",
  software: "ソフトウェア",
  hardware: "ハードウェア",
  "human-interface": "ヒューマンインタフェース",
  multimedia: "マルチメディア",
  database: "データベース",
  network: "ネットワーク",
  security: "情報セキュリティ",
  "system-development": "システム開発技術",
  "software-development-management": "ソフトウェア開発管理技術",
  "project-management": "プロジェクトマネジメント",
  "service-management": "サービスマネジメント",
  "system-audit": "システム監査",
  "system-strategy": "システム戦略",
  "system-planning": "システム企画",
  "business-strategy": "経営戦略",
  "technology-strategy": "技術戦略マネジメント",
  "business-industry": "ビジネスインダストリ",
  "corporate-activity": "企業活動",
  law: "法務",
  algorithm: "アルゴリズムとプログラミング",
  "computer-system": "コンピュータシステム",
  "corporate-legal": "企業と法務",
  unclassified: "未分類",
};

function normalizeIdentityValue(value) {
  const serialized = value && typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
  return serialized.normalize("NFKC").replace(/\s+/gu, "").toLowerCase();
}

function normalizedCorrectAnswers(question) {
  return [...new Set(question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : []))]
    .map((answer) => String(answer))
    .sort();
}

export function normalizeQuestion(question) {
  const correctAnswers = [...new Set(question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : []))];
  const sourceUnitId = question.unitId || "unclassified";
  return {
    ...question,
    subject: question.subject || "A",
    sourceUnitId,
    unitId: unitLabels[sourceUnitId] || sourceUnitId,
    correctAnswers,
    correctAnswer: question.correctAnswer || correctAnswers[0],
    answerMode: question.answerMode || (correctAnswers.length > 1 ? "multiple" : "single"),
    questionBlocks: question.questionBlocks || [{ type: "paragraph", text: question.question }],
    explanationBlocks: question.explanationBlocks || [{ type: "paragraph", text: question.explanation }],
    choices: (question.choices || []).map((choice) => ({
      ...choice,
      contentBlocks: choice.contentBlocks || [{ type: "paragraph", text: choice.text }],
    })),
  };
}

export function validQuestion(question) {
  const correctAnswers = question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : []);
  return Boolean(
    question
    && typeof question.id === "string"
    && ["A", "B"].includes(question.subject || "A")
    && Array.isArray(question.choices)
    && question.choices.length >= 2
    && correctAnswers.length >= 1
    && correctAnswers.every((answerId) => question.choices.some((choice) => String(choice.id) === String(answerId)))
  );
}

export function normalizedSourceFingerprint(question) {
  return [
    question.sourceCategory,
    question.periodId,
    question.sourceQuestionNumber,
  ].map(normalizeIdentityValue).join("|");
}

export function normalizedFingerprint(question) {
  return [
    question.subject || "A",
    question.question,
    question.questionBlocks,
    ...(question.choices || []).flatMap((choice) => [choice.id, choice.text, choice.contentBlocks]),
    ...normalizedCorrectAnswers(question),
  ].map(normalizeIdentityValue).join("|");
}

function sourceOccurrenceFromQuestion(question) {
  const occurrence = {
    sourceCategory: question.sourceCategory,
    sourceType: question.sourceType,
    periodId: question.periodId,
    periodLabel: question.periodLabel,
    sourceQuestionNumber: question.sourceQuestionNumber,
    sourceRef: question.sourceRef,
    year: question.year,
    season: question.season,
  };
  const hasIdentity = [occurrence.sourceCategory, occurrence.periodId, occurrence.sourceQuestionNumber]
    .some((value) => value !== null && value !== undefined && value !== "");
  return hasIdentity ? occurrence : null;
}

function mergeSourceOccurrences(canonical, duplicate) {
  const occurrences = [
    ...(Array.isArray(canonical.sourceOccurrences) ? canonical.sourceOccurrences : []),
    sourceOccurrenceFromQuestion(canonical),
    ...(Array.isArray(duplicate.sourceOccurrences) ? duplicate.sourceOccurrences : []),
    sourceOccurrenceFromQuestion(duplicate),
  ].filter(Boolean);
  const seen = new Set();
  const unique = occurrences.filter((occurrence) => {
    const fingerprint = normalizedSourceFingerprint(occurrence);
    if (fingerprint === "||" || seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
  return unique.length > 0 ? { ...canonical, sourceOccurrences: unique } : canonical;
}

export function mergeQuestionBanks(primaryQuestions, supplementalQuestions) {
  const canonicalIndexById = new Map();
  const canonicalIndexBySource = new Map();
  const canonicalIndexByContent = new Map();
  const merged = [];
  for (const source of [...primaryQuestions, ...supplementalQuestions]) {
    const question = normalizeQuestion(source);
    if (!validQuestion(question)) continue;
    const sourceFingerprint = normalizedSourceFingerprint(question);
    const contentFingerprint = normalizedFingerprint(question);
    const duplicateIndex = canonicalIndexById.get(question.id)
      ?? (sourceFingerprint !== "||" ? canonicalIndexBySource.get(sourceFingerprint) : undefined)
      ?? canonicalIndexByContent.get(contentFingerprint);
    if (duplicateIndex !== undefined) {
      merged[duplicateIndex] = mergeSourceOccurrences(merged[duplicateIndex], question);
      continue;
    }
    const index = merged.length;
    const canonical = mergeSourceOccurrences(question, question);
    merged.push(canonical);
    canonicalIndexById.set(question.id, index);
    if (sourceFingerprint !== "||") canonicalIndexBySource.set(sourceFingerprint, index);
    canonicalIndexByContent.set(contentFingerprint, index);
  }
  return merged;
}
