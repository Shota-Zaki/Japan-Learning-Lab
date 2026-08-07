function correctAnswerIds(question) {
  return [...new Set(question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : []))].map(String).sort();
}

function normalizeReasonEntry(entry) {
  if (typeof entry === "string") return { text: entry, blocks: null };
  if (!entry || typeof entry !== "object") return { text: "", blocks: null };
  return {
    text: entry.text || entry.reason || entry.explanation || "",
    blocks: entry.blocks || entry.contentBlocks || entry.explanationBlocks || null,
  };
}

function explicitReasonFor(question, choice) {
  const choiceEntry = normalizeReasonEntry({
    text: choice.explanation || choice.reason || "",
    blocks: choice.explanationBlocks || choice.reasonBlocks || null,
  });
  if (choiceEntry.text || choiceEntry.blocks) return choiceEntry;

  const source = question.choiceExplanations || question.choiceReasons;
  if (!source) return { text: "", blocks: null };

  if (Array.isArray(source)) {
    const entry = source.find((item) => String(item?.choiceId ?? item?.id ?? "") === String(choice.id));
    return normalizeReasonEntry(entry);
  }

  return normalizeReasonEntry(source[String(choice.id)] ?? source[choice.id]);
}

function choiceLabel(question, choiceId) {
  const choice = (question.choices || []).find((item) => String(item.id) === String(choiceId));
  return choice?.label || choice?.id || choiceId;
}

export function correctAnswerLabel(question) {
  return correctAnswerIds(question).map((choiceId) => choiceLabel(question, choiceId)).join("、");
}

export function buildChoiceJudgments(question) {
  const correctIds = new Set(correctAnswerIds(question));
  const correctLabel = correctAnswerLabel(question) || "正答情報なし";

  return (question.choices || []).map((choice) => {
    const choiceId = String(choice.id);
    const isCorrect = correctIds.has(choiceId);
    const explicit = explicitReasonFor(question, choice);
    const fallback = isCorrect
      ? "個別の補足解説は未登録です。上記の正答根拠に対応する選択肢です。"
      : `個別の補足解説は未登録です。正答は「${correctLabel}」です。上記の正答根拠とこの選択肢の記述を照合し、不一致点を確認してください。`;

    return {
      choice,
      choiceId,
      isCorrect,
      reasonText: explicit.text || fallback,
      reasonBlocks: explicit.blocks,
      isExplicit: Boolean(explicit.text || explicit.blocks),
    };
  });
}

export function relatedKnowledgeLabels(question, limit = 5) {
  const candidates = [
    question.unitId,
    ...(Array.isArray(question.keywords) ? question.keywords : []),
    ...(Array.isArray(question.tags) ? question.tags : []),
  ];
  const unique = [];
  const seen = new Set();

  for (const candidate of candidates) {
    const label = String(candidate ?? "").trim();
    if (!label || label === "未分類" || seen.has(label)) continue;
    seen.add(label);
    unique.push(label);
    if (unique.length >= limit) break;
  }

  return unique;
}
