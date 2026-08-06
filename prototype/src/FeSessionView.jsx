import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookmarkSimple, CheckCircle, Pause, Play, ShieldCheck, Timer, WarningCircle } from "@phosphor-icons/react";
import { FeRichContent } from "./FeRichContent.jsx";
import { buildSessionReviewItems, choiceLabels } from "./fePresentation.js";
import {
  answerSessionQuestion,
  calculateSessionSummary,
  correctAnswerIds,
  moveSession,
  resumeFeSession,
  selectedAnswerIds,
  toggleSessionDraftChoice,
  toggleSessionReview,
} from "./feSession.js";

const subjectLabels = { A: "科目A", B: "科目B" };
const domainLabels = {
  technology: "テクノロジ系",
  management: "マネジメント系",
  strategy: "ストラテジ系",
  algorithm: "アルゴリズムとプログラミング",
  security: "情報セキュリティ",
};
const unitLabels = {
  security: "情報セキュリティ",
  network: "ネットワーク",
  database: "データベース",
  algorithm: "アルゴリズムとプログラミング",
  "computer-system": "コンピュータシステム",
  software: "ソフトウェア",
  "project-management": "プロジェクトマネジメント",
  "service-management": "サービスマネジメント",
  "system-strategy": "システム戦略",
  "business-strategy": "経営戦略",
  "corporate-legal": "企業と法務",
  "system-audit": "システム監査",
};

function answerLabel(question) {
  const expected = new Set(correctAnswerIds(question));
  return question.choices.filter((choice) => expected.has(String(choice.id))).map((choice) => choice.label || choice.id).join("、");
}

function mockDurationMinutes(session) {
  if (Number(session?.config?.durationMinutes) > 0) return Number(session.config.durationMinutes);
  const subject = session?.config?.subjects?.[0] || session?.config?.subject;
  return subject === "B" ? 100 : 90;
}

function calculateRemainingSeconds(session, nowMs) {
  if (!session || session.config?.type !== "mock" || session.status !== "in_progress") return null;
  const durationMs = mockDurationMinutes(session) * 60 * 1000;
  const startedAtMs = Date.parse(session.startedAt);
  const deadlineMs = Number.isFinite(startedAtMs) ? startedAtMs + durationMs : nowMs + durationMs;
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}

function formatRemaining(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FeSessionView({ session, questionBank, persistSession, pauseSession, completeSession, retrySession, reviewSession, exitSession }) {
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [clockMs, setClockMs] = useState(() => Date.now());
  const isMock = session?.config?.type === "mock";
  const remainingSeconds = calculateRemainingSeconds(session, clockMs);

  useEffect(() => {
    if (!session || session.status !== "in_progress" || !isMock) return undefined;
    const timerId = window.setInterval(() => setClockMs(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [session?.id, session?.status, isMock]);

  useEffect(() => {
    if (session && session.status === "in_progress" && isMock && remainingSeconds === 0) completeSession(session);
  }, [session, isMock, remainingSeconds, completeSession]);

  if (!session) return <MissingSession exitSession={exitSession} />;
  if (session.status === "completed") return <FeResultView session={session} questionBank={questionBank} retrySession={retrySession} reviewSession={reviewSession} exitSession={exitSession} />;
  if (session.status === "paused") return <PausedSession session={session} persistSession={persistSession} exitSession={exitSession} />;

  const questionMap = new Map(questionBank.map((item) => [item.id, item]));
  const question = questionMap.get(session.questionIds[session.currentIndex]);
  if (!question) return <MissingSession exitSession={exitSession} />;
  const answer = session.answers[question.id];
  const selectedIds = selectedAnswerIds(answer?.selectedIds || answer?.selected || session.drafts[question.id]);
  const summary = calculateSessionSummary(session);
  const multiple = question.answerMode === "multiple" || correctAnswerIds(question).length > 1;
  const nextUnanswered = session.questionIds.findIndex((questionId, index) => index > session.currentIndex && !session.answers[questionId]);
  const moveTo = (index) => {
    persistSession(moveSession(session, index));
    setConfirmFinish(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const finish = () => {
    if (summary.unanswered > 0 && !confirmFinish) {
      setConfirmFinish(true);
      return;
    }
    completeSession(session);
  };

  return (
    <section className="fe-exam-session" aria-labelledby="fe-question-heading">
      <div className="session-topbar">
        {isMock
          ? <button className="back-link" onClick={finish}><Timer size={18} /> 模擬試験を終了する</button>
          : <button className="back-link" onClick={() => pauseSession(session)}><Pause size={18} /> 一時停止して戻る</button>}
        <span>{isMock && remainingSeconds !== null && <strong aria-label={`残り時間${formatRemaining(remainingSeconds)}`}>残り {formatRemaining(remainingSeconds)}　</strong>}問題 {session.currentIndex + 1} / {session.questionIds.length}</span>
      </div>
      <div className="session-progress" aria-label={`${session.questionIds.length}問中${session.currentIndex + 1}問目`}><span style={{ width: `${((session.currentIndex + 1) / session.questionIds.length) * 100}%` }} /></div>

      <div className="question-layout">
        <article className="question-card fe-question-card">
          <div className="question-meta">
            <span>{subjectLabels[question.subject || "A"]}</span>
            <span>{domainLabels[question.domain] || question.domain}</span>
            {question.unitId && <span>{unitLabels[question.unitId] || question.unitId}</span>}
            <span>{question.periodLabel}</span>
          </div>
          <p className="question-source-title">{question.title || question.sourceRef}</p>
          <h1 id="fe-question-heading">問題文</h1>
          <FeRichContent blocks={question.questionBlocks} fallback={question.question} className="fe-question-content" />

          {multiple && !answer && <p className="fe-multiple-note">複数選択問題です。該当する選択肢を全て選んでください。</p>}
          <div className="answer-options fe-answer-options" role={multiple ? "group" : "radiogroup"} aria-label="選択肢">
            {question.choices.map((choice) => {
              const choiceId = String(choice.id);
              const isSelected = selectedIds.includes(choiceId);
              const isCorrect = Boolean(answer) && !isMock && correctAnswerIds(question).includes(choiceId);
              const isWrong = Boolean(answer) && !isMock && isSelected && !isCorrect;
              return (
                <button
                  key={choiceId}
                  role={multiple ? "checkbox" : "radio"}
                  aria-checked={isSelected}
                  className={`${isSelected ? "is-selected" : ""} ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`}
                  disabled={Boolean(answer)}
                  onClick={() => persistSession(toggleSessionDraftChoice(session, question, choiceId))}
                >
                  <span className="choice-label">{choice.label || choice.id}</span>
                  <FeRichContent blocks={choice.contentBlocks} fallback={choice.text} compact className="choice-content" />
                </button>
              );
            })}
          </div>

          {!answer ? (
            <button className="button button-primary answer-submit" disabled={selectedIds.length === 0} onClick={() => persistSession(answerSessionQuestion(session, question, selectedIds))}>{isMock ? "回答を記録する" : "回答を確定する"}</button>
          ) : isMock ? (
            <section className="answer-feedback" role="status">
              <div className="feedback-title"><CheckCircle size={24} weight="fill" /><strong>回答を記録しました</strong></div>
              <p>模擬試験では、正誤と解説を試験終了後に表示します。</p>
            </section>
          ) : (
            <section className={`answer-feedback ${answer.correct ? "is-correct" : "is-wrong"}`} aria-labelledby="fe-explanation-heading" role="status">
              <div className="feedback-title"><CheckCircle size={24} weight="fill" /><strong>{answer.correct ? "正解です" : `正答は「${answerLabel(question)}」です`}</strong></div>
              <h2 id="fe-explanation-heading">解説</h2>
              <FeRichContent blocks={question.explanationBlocks} fallback={question.explanation} className="fe-explanation-content" />
            </section>
          )}

          <div className="session-actions">
            <button className="button button-tertiary" disabled={session.currentIndex === 0} onClick={() => moveTo(session.currentIndex - 1)}><ArrowLeft size={18} /> 前の問題</button>
            <button className={`button review-toggle ${session.reviewQuestionIds.includes(question.id) ? "is-selected" : ""}`} aria-pressed={session.reviewQuestionIds.includes(question.id)} onClick={() => persistSession(toggleSessionReview(session, question.id))}><BookmarkSimple size={19} weight={session.reviewQuestionIds.includes(question.id) ? "fill" : "regular"} /> 見直し</button>
            {session.currentIndex < session.questionIds.length - 1
              ? <button className="button button-secondary" onClick={() => moveTo(session.currentIndex + 1)}>次の問題 <ArrowRight size={18} /></button>
              : <button className="button button-secondary" onClick={finish}>{isMock ? "模擬試験を終了する" : "演習を終了する"}</button>}
          </div>
          {confirmFinish && <div className="finish-confirm" role="alert"><strong>未回答が{summary.unanswered}問あります</strong><span>未回答のまま結果を保存できます。</span><div><button className="button button-tertiary" onClick={() => setConfirmFinish(false)}>続ける</button><button className="button button-primary" onClick={finish}>この内容で終了</button></div></div>}
        </article>

        <aside className="question-sidebar">
          <p className="section-kicker">Question</p>
          <h2>問題情報</h2>
          <dl>
            <div><dt>試験</dt><dd>基本情報技術者試験</dd></div>
            <div><dt>科目</dt><dd>{subjectLabels[question.subject || "A"]}</dd></div>
            <div><dt>単元</dt><dd>{unitLabels[question.unitId] || question.unitId || "未分類"}</dd></div>
            <div><dt>識別</dt><dd>{question.sourceRef || question.sourceQuestionNumber || question.id}</dd></div>
          </dl>
          <span className="official-badge"><ShieldCheck size={18} weight="fill" /> 出典情報を記録</span>
          <div className="question-navigator">
            <div><strong>問題一覧</strong><small>{summary.answered} / {summary.total}問回答</small></div>
            <div className="question-number-grid">
              {session.questionIds.map((questionId, index) => (
                <button key={questionId} className={`${index === session.currentIndex ? "is-current" : ""} ${session.answers[questionId] ? "is-answered" : ""} ${session.reviewQuestionIds.includes(questionId) ? "is-review" : ""}`} aria-label={`問題${index + 1}、${session.answers[questionId] ? "回答済み" : "未回答"}${session.reviewQuestionIds.includes(questionId) ? "、見直し対象" : ""}`} aria-current={index === session.currentIndex ? "step" : undefined} onClick={() => moveTo(index)}>{index + 1}</button>
              ))}
            </div>
            {nextUnanswered >= 0 && <button className="text-link" onClick={() => moveTo(nextUnanswered)}>次の未回答へ <ArrowRight size={16} /></button>}
            <button className="button button-tertiary finish-button" onClick={finish}>{isMock ? "模擬試験を終了する" : "演習を終了する"}</button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PausedSession({ session, persistSession, exitSession }) {
  return <section className="session-state" aria-labelledby="paused-heading"><Pause size={36} weight="fill" /><p className="eyebrow">Session paused</p><h1 id="paused-heading">演習を一時停止しました</h1><p>{Object.keys(session.answers).length}/{session.questionIds.length}問まで保存されています。</p><div><button className="button button-primary" onClick={() => persistSession(resumeFeSession(session))}><Play size={18} weight="fill" /> 演習を再開する</button><button className="button button-tertiary" onClick={exitSession}>出題設定へ戻る</button></div></section>;
}

function MissingSession({ exitSession }) {
  return <section className="session-state" role="alert"><WarningCircle size={36} weight="fill" /><p className="eyebrow">Recovery</p><h1>再開できる演習が見つかりません</h1><p>出題設定から新しい演習を開始してください。</p><button className="button button-primary" onClick={exitSession}>出題設定へ</button></section>;
}

export function FeResultView({ session, questionBank, retrySession, reviewSession, exitSession }) {
  const summary = calculateSessionSummary(session);
  const incorrectIds = session.questionIds.filter((questionId) => session.answers[questionId] && !session.answers[questionId].correct);
  const reviewIds = session.reviewQuestionIds;
  const reviewItems = buildSessionReviewItems(session, questionBank);
  const isMock = session.config.type === "mock";
  return (
    <section className="fe-result" aria-labelledby="fe-result-heading">
      <p className="eyebrow">{isMock ? "Mock exam result" : "Session result"}</p>
      <h1 id="fe-result-heading">{isMock ? "模擬試験結果" : "演習結果"}</h1>
      <div className="result-score"><strong>{summary.score}%</strong><span>{summary.correct}/{summary.total}問正解</span></div>
      <div className="result-metrics"><span><small>正解</small><strong>{summary.correct}</strong></span><span><small>不正解</small><strong>{summary.incorrect}</strong></span><span><small>未回答</small><strong>{summary.unanswered}</strong></span><span><small>見直し</small><strong>{reviewIds.length}</strong></span></div>
      <section className="result-review-section" aria-labelledby="result-review-heading">
        <div className="result-review-heading">
          <h2 id="result-review-heading">問題別レビュー</h2>
          <p>各問題を開くと、問題文、回答、正答、正誤、解説を確認できます。</p>
        </div>
        <div className="result-question-list">
          {reviewItems.map(({ questionId, index, question, selectedIds, correctIds, status }) => {
            const statusLabel = status === "correct" ? "正解" : status === "incorrect" ? "不正解" : "未回答";
            return (
              <details key={questionId} className={`result-question-review is-${status}`}>
                <summary>
                  <span>{index + 1}</span>
                  <strong>{subjectLabels[question?.subject || "A"]}・{question?.title || questionId}</strong>
                  <small>{statusLabel}</small>
                </summary>
                {question ? (
                  <div className="result-question-detail">
                    <div className="question-meta">
                      <span>{subjectLabels[question.subject || "A"]}</span>
                      {question.domain && <span>{domainLabels[question.domain] || question.domain}</span>}
                      {question.unitId && <span>{unitLabels[question.unitId] || question.unitId}</span>}
                      {question.periodLabel && <span>{question.periodLabel}</span>}
                    </div>
                    <h3>問題文</h3>
                    <FeRichContent blocks={question.questionBlocks} fallback={question.question} className="fe-question-content" />
                    <div className={`result-answer-summary is-${status}`} role="status">
                      <div><small>判定</small><strong>{statusLabel}</strong></div>
                      <div><small>あなたの回答</small><strong>{choiceLabels(question, selectedIds)}</strong></div>
                      <div><small>正答</small><strong>{choiceLabels(question, correctIds, "正答情報なし")}</strong></div>
                    </div>
                    <h3>選択肢</h3>
                    <div className="result-choice-list">
                      {question.choices.map((choice) => {
                        const choiceId = String(choice.id);
                        const selected = selectedIds.includes(choiceId);
                        const correct = correctIds.includes(choiceId);
                        return (
                          <div key={choiceId} className={`result-choice ${selected ? "is-selected" : ""} ${correct ? "is-correct" : ""}`}>
                            <span className="choice-label">{choice.label || choice.id}</span>
                            <FeRichContent blocks={choice.contentBlocks} fallback={choice.text} compact className="choice-content" />
                            <small>{correct ? "正答" : selected ? "選択" : ""}</small>
                          </div>
                        );
                      })}
                    </div>
                    <h3>解説</h3>
                    <FeRichContent blocks={question.explanationBlocks} fallback={question.explanation} className="fe-explanation-content" />
                  </div>
                ) : (
                  <div className="result-question-detail" role="alert">問題データを読み込めませんでした。</div>
                )}
              </details>
            );
          })}
        </div>
      </section>
      <div className="result-actions">
        {incorrectIds.length > 0 && <button className="button button-primary" onClick={() => reviewSession(session, incorrectIds)}>間違えた問題を復習</button>}
        {reviewIds.length > 0 && <button className="button button-secondary" onClick={() => reviewSession(session, reviewIds)}>見直し問題を演習</button>}
        <button className="button button-tertiary" onClick={() => retrySession(session)}>同じ問題に再挑戦</button>
        <button className="back-link" onClick={exitSession}><ArrowLeft size={18} /> 出題設定へ戻る</button>
      </div>
    </section>
  );
}
