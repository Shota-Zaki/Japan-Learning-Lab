import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookmarkSimple, CheckCircle, Pause, Play, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { FeRichContent } from "./FeRichContent.jsx";
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

function answerLabel(question) {
  const expected = new Set(correctAnswerIds(question));
  return question.choices.filter((choice) => expected.has(String(choice.id))).map((choice) => choice.label || choice.id).join("、");
}

export function FeSessionView({ session, questionBank, persistSession, pauseSession, completeSession, retrySession, reviewSession, exitSession }) {
  const [confirmFinish, setConfirmFinish] = useState(false);
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
        <button className="back-link" onClick={() => pauseSession(session)}><Pause size={18} /> 一時停止して戻る</button>
        <span>問題 {session.currentIndex + 1} / {session.questionIds.length}</span>
      </div>
      <div className="session-progress" aria-label={`${session.questionIds.length}問中${session.currentIndex + 1}問目`}><span style={{ width: `${((session.currentIndex + 1) / session.questionIds.length) * 100}%` }} /></div>

      <div className="question-layout">
        <article className="question-card fe-question-card">
          <div className="question-meta">
            <span>{subjectLabels[question.subject || "A"]}</span>
            <span>{domainLabels[question.domain] || question.domain}</span>
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
              const isCorrect = Boolean(answer) && correctAnswerIds(question).includes(choiceId);
              const isWrong = Boolean(answer) && isSelected && !isCorrect;
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
            <button className="button button-primary answer-submit" disabled={selectedIds.length === 0} onClick={() => persistSession(answerSessionQuestion(session, question, selectedIds))}>回答を確定する</button>
          ) : (
            <section className={`answer-feedback ${answer.correct ? "is-correct" : "is-wrong"}`} aria-labelledby="fe-explanation-heading" role="status">
              <div className="feedback-title"><CheckCircle size={24} weight="fill" /><strong>{answer.correct ? "正解です" : `正答は「${answerLabel(question)}」です`}</strong></div>
              <h2 id="fe-explanation-heading">解説</h2>
              <FeRichContent blocks={question.explanationBlocks} fallback={question.explanation} className="fe-explanation-content" />
              <div className="source-links">
                {question.sourceQuestionUrl && <a href={question.sourceQuestionUrl} target="_blank" rel="noreferrer">公式問題冊子 <ArrowUpRight size={15} /></a>}
                {question.sourceAnswerUrl && <a href={question.sourceAnswerUrl} target="_blank" rel="noreferrer">公式解答 <ArrowUpRight size={15} /></a>}
              </div>
            </section>
          )}

          <div className="session-actions">
            <button className="button button-tertiary" disabled={session.currentIndex === 0} onClick={() => moveTo(session.currentIndex - 1)}><ArrowLeft size={18} /> 前の問題</button>
            <button className={`button review-toggle ${session.reviewQuestionIds.includes(question.id) ? "is-selected" : ""}`} aria-pressed={session.reviewQuestionIds.includes(question.id)} onClick={() => persistSession(toggleSessionReview(session, question.id))}><BookmarkSimple size={19} weight={session.reviewQuestionIds.includes(question.id) ? "fill" : "regular"} /> 見直し</button>
            {session.currentIndex < session.questionIds.length - 1
              ? <button className="button button-secondary" onClick={() => moveTo(session.currentIndex + 1)}>次の問題 <ArrowRight size={18} /></button>
              : <button className="button button-secondary" onClick={finish}>演習を終了する</button>}
          </div>
          {confirmFinish && <div className="finish-confirm" role="alert"><strong>未回答が{summary.unanswered}問あります</strong><span>未回答のまま結果を保存できます。</span><div><button className="button button-tertiary" onClick={() => setConfirmFinish(false)}>続ける</button><button className="button button-primary" onClick={finish}>この内容で終了</button></div></div>}
        </article>

        <aside className="question-sidebar">
          <p className="section-kicker">Source</p>
          <h2>出典情報</h2>
          <dl>
            <div><dt>試験</dt><dd>基本情報技術者試験</dd></div>
            <div><dt>科目</dt><dd>{subjectLabels[question.subject || "A"]}</dd></div>
            <div><dt>問題</dt><dd>{question.sourceRef || question.sourceQuestionNumber || "公式公開問題"}</dd></div>
          </dl>
          <span className="official-badge"><ShieldCheck size={18} weight="fill" /> 公式公開資料</span>
          <div className="question-navigator">
            <div><strong>問題一覧</strong><small>{summary.answered} / {summary.total}問回答</small></div>
            <div className="question-number-grid">
              {session.questionIds.map((questionId, index) => (
                <button key={questionId} className={`${index === session.currentIndex ? "is-current" : ""} ${session.answers[questionId] ? "is-answered" : ""} ${session.reviewQuestionIds.includes(questionId) ? "is-review" : ""}`} aria-label={`問題${index + 1}、${session.answers[questionId] ? "回答済み" : "未回答"}${session.reviewQuestionIds.includes(questionId) ? "、見直し対象" : ""}`} aria-current={index === session.currentIndex ? "step" : undefined} onClick={() => moveTo(index)}>{index + 1}</button>
              ))}
            </div>
            {nextUnanswered >= 0 && <button className="text-link" onClick={() => moveTo(nextUnanswered)}>次の未回答へ <ArrowRight size={16} /></button>}
            <button className="button button-tertiary finish-button" onClick={finish}>演習を終了する</button>
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
  const questionMap = new Map(questionBank.map((question) => [question.id, question]));
  return (
    <section className="fe-result" aria-labelledby="fe-result-heading">
      <p className="eyebrow">Session result</p>
      <h1 id="fe-result-heading">演習結果</h1>
      <div className="result-score"><strong>{summary.score}%</strong><span>{summary.correct}/{summary.total}問正解</span></div>
      <div className="result-metrics"><span><small>正解</small><strong>{summary.correct}</strong></span><span><small>不正解</small><strong>{summary.incorrect}</strong></span><span><small>未回答</small><strong>{summary.unanswered}</strong></span><span><small>見直し</small><strong>{reviewIds.length}</strong></span></div>
      <div className="result-question-list">
        {session.questionIds.map((questionId, index) => {
          const question = questionMap.get(questionId);
          const answer = session.answers[questionId];
          return <div key={questionId}><span>{index + 1}</span><strong>{subjectLabels[question?.subject || "A"]}・{question?.title || questionId}</strong><small>{!answer ? "未回答" : answer.correct ? "正解" : "不正解"}</small></div>;
        })}
      </div>
      <div className="result-actions">
        {incorrectIds.length > 0 && <button className="button button-primary" onClick={() => reviewSession(session, incorrectIds)}>間違えた問題を復習</button>}
        {reviewIds.length > 0 && <button className="button button-secondary" onClick={() => reviewSession(session, reviewIds)}>見直し問題を演習</button>}
        <button className="button button-tertiary" onClick={() => retrySession(session)}>同じ問題に再挑戦</button>
        <button className="back-link" onClick={exitSession}><ArrowLeft size={18} /> 出題設定へ戻る</button>
      </div>
    </section>
  );
}
