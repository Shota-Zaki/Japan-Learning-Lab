import { useState } from "react";
import { ArrowRight, ChartBar, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { calculateSessionSummary } from "./feSession.js";
import { sessionHistoryDescription } from "./fePresentation.js";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function sessionLabel(session) {
  const subjects = session.config.subjects?.length ? session.config.subjects.map((subject) => `科目${subject}`).join("・") : "科目A・B";
  const mode = session.config.type === "mock" ? "模擬セッション" : "条件別演習";
  return `${subjects} ${mode}`;
}

export function FeHistoryView({ sessions, resumeSession, openSession, retrySession, goPractice, storageStatus, clearHistory }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const visible = sessions.filter((session) => session.status !== "abandoned");
  return (
    <section className="history-page" aria-labelledby="fe-history-heading">
      <div className="history-page-head"><p className="eyebrow">Learning history</p><h1 id="fe-history-heading">学習履歴</h1><p>科目A・科目Bの演習結果、途中経過、見直し対象を確認できます。</p></div>
      {storageStatus.recovered && <div className="state-banner is-warning" role="status"><WarningCircle size={22} weight="fill" /><span><strong>保存データを復旧しました</strong><small>読み取れないデータを除外して表示しています。</small></span></div>}
      {storageStatus.error && <div className="state-banner is-warning" role="alert"><WarningCircle size={22} weight="fill" /><span><strong>履歴を削除できませんでした</strong><small>接続を確認して、もう一度お試しください。</small></span></div>}
      <div className="storage-note"><ShieldCheck size={18} weight="fill" /><span>{storageStatus.source === "cloud" ? "この端末とクラウドに保存済み" : "この端末に保存済み（接続時に同期）"}</span></div>
      {visible.length === 0 ? (
        <div className="empty-history"><ChartBar size={38} /><h2>まだ演習履歴はありません</h2><p>公式問題の演習を完了すると、結果と復習対象がここに保存されます。</p><button className="button button-primary" onClick={goPractice}>演習を始める <ArrowRight size={18} /></button></div>
      ) : (
        <div className="session-history-list">
          {visible.map((session) => {
            const summary = calculateSessionSummary(session);
            return (
              <article key={session.id} className="session-history-card">
                <div className="history-card-top"><span className={`status-pill is-${session.status}`}>{session.status === "completed" ? "完了" : session.status === "paused" ? "一時停止" : "進行中"}</span><time dateTime={session.updatedAt}>{formatDate(session.completedAt || session.updatedAt)}</time></div>
                <h2>{sessionLabel(session)}</h2>
                <p>{sessionHistoryDescription(session)}・{session.questionIds.length}問</p>
                <div className="history-card-metrics"><span><small>正解</small><strong>{summary.correct}</strong></span><span><small>不正解</small><strong>{summary.incorrect}</strong></span><span><small>未回答</small><strong>{summary.unanswered}</strong></span>{session.status === "completed" && <span className="score"><small>得点</small><strong>{summary.score}%</strong></span>}</div>
                <div className="history-card-actions">{session.status === "completed" ? <><button className="button button-secondary" onClick={() => openSession(session)}>結果を見る</button><button className="button button-tertiary" onClick={() => retrySession(session)}>再挑戦</button></> : <button className="button button-primary" onClick={() => resumeSession(session)}>再開する</button>}</div>
              </article>
            );
          })}
        </div>
      )}
      {visible.length > 0 && !confirmClear && <button className="history-reset" onClick={() => setConfirmClear(true)}>学習履歴を削除する</button>}
      {confirmClear && <div className="history-clear-confirm" role="alert"><strong>すべての学習履歴を削除しますか？</strong><span>この操作は取り消せません。</span><div><button className="button button-tertiary" onClick={() => setConfirmClear(false)}>キャンセル</button><button className="button button-primary" onClick={() => { clearHistory(); setConfirmClear(false); }}>削除する</button></div></div>}
    </section>
  );
}
