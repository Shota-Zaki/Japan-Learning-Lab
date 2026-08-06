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

export function normalizedFingerprint(question) {
  const sourceIdentity = [
    question.subject || "A",
    question.sourceCategory,
    question.periodId,
    question.sourceQuestionNumber,
  ]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .join("|");
  if (sourceIdentity) return `source:${sourceIdentity}`;
  return [
    question.subject,
    question.question,
    ...(question.choices || []).map((choice) => choice.text),
    ...(question.correctAnswers || []),
  ].join("|").normalize("NFKC").replace(/\s+/gu, "").toLowerCase();
}

export function mergeQuestionBanks(primaryQuestions, supplementalQuestions) {
  const seenIds = new Set();
  const seenFingerprints = new Set();
  const merged = [];
  for (const source of [...supplementalQuestions, ...primaryQuestions]) {
    const question = normalizeQuestion(source);
    if (!validQuestion(question)) continue;
    const fingerprint = normalizedFingerprint(question);
    if (seenIds.has(question.id) || seenFingerprints.has(fingerprint)) continue;
    seenIds.add(question.id);
    seenFingerprints.add(fingerprint);
    merged.push(question);
  }
  return merged;
}
