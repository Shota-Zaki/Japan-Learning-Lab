import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, ChartBar, CheckCircle, Exam } from "@phosphor-icons/react";
import { feQuestions } from "./data/feQuestions.js";
import {
  abandonFeSession,
  completeFeSession,
  createFeSession,
  pauseFeSession,
  resumeFeSession,
  selectPracticeQuestions,
} from "./feSession.js";
import { mergeQuestionBanks, normalizeQuestion } from "./feQuestionBank.js";
import { createFeSessionStore } from "./feStorage.js";
import { FePracticeSetup } from "./FePracticeSetup.jsx";
import { FeSessionView } from "./FeSessionView.jsx";
import { FeHistoryView } from "./FeHistoryView.jsx";
import { FeRichContent } from "./FeRichContent.jsx";

async function readQuestionPayload(url, signal, optional = false) {
  const response = await fetch(url, { signal });
  if (optional && response.status === 404) return { questions: [] };
  if (!response.ok) throw new Error(`FE question bank request failed: ${response.status}`);
  return response.json();
}

function mockDurationMinutes(session) {
  if (Number(session?.config?.durationMinutes) > 0) return Number(session.config.durationMinutes);
  const subject = session?.config?.subjects?.[0] || session?.config?.subject;
  return subject === "B" ? 100 : 90;
}

function calculateMockRemainingSeconds(session, nowMs) {
  if (!session || session.config?.type !== "mock" || session.status !== "in_progress") return null;
  const durationMs = mockDurationMinutes(session) * 60 * 1000;
  const startedAtMs = Date.parse(session.startedAt);
  const deadlineMs = Number.isFinite(startedAtMs) ? startedAtMs + durationMs : nowMs + durationMs;
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}

function formatMockRemaining(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function FeLessonHome() {
  const lessonBlocks = [
    { type: "paragraph", text: "科目Bでは、問題文の条件を先に整理し、擬似言語を処理のまとまりごとに追跡します。通常本文とコードを分けて読むことで、変数の更新や分岐条件を見落としにくくなります。" },
    { type: "list", items: ["入力・戻り値・配列の開始番号を確認する", "繰返しごとに変化する変数を表にする", "空欄へ入る式を、処理の目的から逆算する"] },
    { type: "code", language: "pseudocode", text: "整数型: total ← 0\nfor (i を 1 から dataの要素数 まで 1 ずつ増やす)\n  total ← total ＋ data[i]\nendfor\nreturn total" },
    { type: "table", caption: "変数の追跡例", headers: ["i", "data[i]", "total"], rows: [["1", "3", "3"], ["2", "5", "8"], ["3", "2", "10"]] },
  ];
  return (
    <section className="fe-lesson-home" aria-labelledby="fe-lesson-heading">
      <div className="fe-page-heading"><p className="eyebrow">FE lessons</p><h1 id="fe-lesson-heading">問題文・コード・表を分けて読む</h1><p>科目Aの知識整理と、科目Bの擬似言語・表の読み方を段階的に学びます。</p></div>
      <article className="fe-lesson-card"><span>科目B 読解基礎</span><h2>擬似言語を処理単位で追跡する</h2><FeRichContent blocks={lessonBlocks} /></article>
    </section>
  );
}

export function FeLearningApp({ tab, view, navigate, goEngineer, setHeaderStatus }) {
  const fallbackQuestions = useMemo(() => feQuestions.map(normalizeQuestion), []);
  const [questionBank, setQuestionBank] = useState(fallbackQuestions);
  const [bankStatus, setBankStatus] = useState("loading");
  const [bankReload, setBankReload] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [storageStatus, setStorageStatus] = useState({ source: "device", recovered: false, ready: false });
  const [notice, setNotice] = useState("");
  const [headerClockMs, setHeaderClockMs] = useState(() => Date.now());
  const [sessionStore] = useState(createFeSessionStore);
  const loadedStoreFor = useRef("");
  const noticeTimer = useRef(null);
  const activeSession = sessions.find((session) => session.id === activeSessionId) || null;
  const activeMockSessionId = view === "session" && activeSession?.config?.type === "mock" && activeSession.status === "in_progress"
    ? activeSession.id
    : null;
  const remainingMockSeconds = activeMockSessionId ? calculateMockRemainingSeconds(activeSession, headerClockMs) : null;

  const notify = (message) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
  };

  const persistSession = (session, baseSessions = sessions) => {
    const saved = sessionStore.save(session, baseSessions);
    setSessions(saved.sessions);
    setActiveSessionId(session.id);
    return session;
  };

  const abandonActiveSessions = (baseSessions = sessions) => {
    let nextSessions = baseSessions;
    for (const session of baseSessions.filter((item) => ["in_progress", "paused"].includes(item.status))) {
      nextSessions = sessionStore.save(abandonFeSession(session), nextSessions).sessions;
    }
    return nextSessions;
  };

  const startSession = (config) => {
    const questions = selectPracticeQuestions(config, questionBank, sessions);
    if (questions.length === 0) return;
    const baseSessions = abandonActiveSessions();
    const session = createFeSession({ config, questions });
    persistSession(session, baseSessions);
    navigate("practice", "session");
  };

  const resumeSession = (session) => {
    persistSession(session.status === "paused" ? resumeFeSession(session) : session);
    navigate("practice", "session");
  };

  const pauseSession = (session) => {
    persistSession(pauseFeSession(session));
    navigate("practice", "home");
  };

  const completeSession = (session) => persistSession(completeFeSession(session));

  const retrySession = (sourceSession) => {
    const questionMap = new Map(questionBank.map((question) => [question.id, question]));
    const questions = sourceSession.questionIds.map((questionId) => questionMap.get(questionId)).filter(Boolean);
    const baseSessions = abandonActiveSessions();
    const session = createFeSession({ config: { ...sourceSession.config, count: questions.length }, questions });
    persistSession(session, baseSessions);
    navigate("practice", "session");
  };

  const reviewSession = (sourceSession, questionIds) => {
    const requested = new Set(questionIds);
    const questions = sourceSession.questionIds.map((questionId) => questionBank.find((question) => question.id === questionId)).filter((question) => question && requested.has(question.id));
    if (questions.length === 0) return;
    const baseSessions = abandonActiveSessions();
    const session = createFeSession({ config: { ...sourceSession.config, type: "topic", scope: "incorrect", count: questions.length }, questions });
    persistSession(session, baseSessions);
    navigate("practice", "session");
  };

  const openSession = (session) => {
    setActiveSessionId(session.id);
    navigate("practice", "session");
  };

  const clearHistory = async () => {
    try {
      await sessionStore.clear();
      setSessions([]);
      setActiveSessionId(null);
      setStorageStatus((current) => ({ ...current, source: "device", error: false }));
      notify("学習履歴を削除しました。");
    } catch {
      setStorageStatus((current) => ({ ...current, error: true }));
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const dataBaseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const primaryUrl = new URL("data/fe-official-past-questions.json", dataBaseUrl).toString();
    const supplementalUrl = new URL("data/fe-official-supplemental-questions.json", dataBaseUrl).toString();
    Promise.all([
      readQuestionPayload(primaryUrl, controller.signal),
      readQuestionPayload(supplementalUrl, controller.signal, true),
    ])
      .then(([primaryPayload, supplementalPayload]) => {
        const questions = mergeQuestionBanks(primaryPayload?.questions || [], supplementalPayload?.questions || []);
        if (questions.length === 0) throw new Error("FE question bank validation failed");
        setQuestionBank(questions);
        setBankStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setBankStatus("error");
      });
    return () => controller.abort();
  }, [bankReload]);

  useEffect(() => {
    if (!["ready", "error"].includes(bankStatus)) return;
    const signature = `${bankStatus}:${questionBank.length}`;
    if (loadedStoreFor.current === signature) return;
    loadedStoreFor.current = signature;
    sessionStore.list(questionBank).then((result) => {
      setSessions(result.sessions);
      setStorageStatus({ source: result.source, recovered: result.recovered, ready: true });
      const recoverable = result.sessions.find((session) => ["in_progress", "paused"].includes(session.status));
      const completed = view === "session" ? result.sessions.find((session) => session.status === "completed") : null;
      if (recoverable || completed) setActiveSessionId((recoverable || completed).id);
    });
  }, [bankStatus, questionBank, sessionStore, view]);

  useEffect(() => {
    if (!activeMockSessionId) return undefined;
    setHeaderClockMs(Date.now());
    const timerId = window.setInterval(() => setHeaderClockMs(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [activeMockSessionId]);

  useEffect(() => {
    if (!setHeaderStatus) return;
    setHeaderStatus(remainingMockSeconds === null ? null : `残り ${formatMockRemaining(remainingMockSeconds)}`);
  }, [remainingMockSeconds, setHeaderStatus]);

  useEffect(() => () => setHeaderStatus?.(null), [setHeaderStatus]);
  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  return (
    <main className={`page course-site-page fe-v5 ${view === "session" ? "is-session-view" : ""}`}>
      {view !== "session" && (
        <div className="course-site-intro">
          <nav className="breadcrumbs" aria-label="パンくずリスト"><button onClick={goEngineer}>Engineer Learning Lab</button><span>›</span><span aria-current="page">FE Learning Lab</span></nav>
          <div className="course-site-title"><span>Fundamental Information Technology Engineer</span><strong>FE Learning Lab</strong><p>科目A・科目Bの公開問題と演習用問題を、単元別演習または模擬試験で学習できます。</p></div>
        </div>
      )}

      {notice && <div className="notice" role="status"><CheckCircle size={21} weight="fill" /><span>{notice}</span></div>}

      {view === "home" && (
        <nav className="study-mode-nav fe-mode-nav" aria-label="FE Learning Labの機能">
          <button className={tab === "lesson" ? "is-active" : ""} onClick={() => navigate("lesson", "home")}><span className="mode-icon"><BookOpen size={24} /></span><span><small>Learn</small><strong>レッスン</strong></span></button>
          <button className={tab === "practice" ? "is-active" : ""} onClick={() => navigate("practice", "home")}><span className="mode-icon"><Exam size={24} /></span><span><small>Practice</small><strong>演習・模試</strong></span></button>
          <button className={tab === "history" ? "is-active" : ""} onClick={() => navigate("history", "home")}><span className="mode-icon"><ChartBar size={24} /></span><span><small>History</small><strong>学習履歴</strong></span></button>
        </nav>
      )}

      {view === "home" && tab === "lesson" && <FeLessonHome />}
      {view === "home" && tab === "practice" && <FePracticeSetup questionBank={questionBank} sessions={sessions} activeSession={activeSession} bankStatus={bankStatus} startSession={startSession} resumeSession={resumeSession} retryBank={() => { setBankStatus("loading"); setBankReload((value) => value + 1); }} />}
      {view === "home" && tab === "history" && <FeHistoryView sessions={sessions} resumeSession={resumeSession} openSession={openSession} retrySession={retrySession} goPractice={() => navigate("practice", "home")} storageStatus={storageStatus} clearHistory={clearHistory} />}
      {view === "session" && <FeSessionView key={activeSession?.id || "missing"} session={activeSession} questionBank={questionBank} persistSession={persistSession} pauseSession={pauseSession} completeSession={completeSession} retrySession={retrySession} reviewSession={reviewSession} exitSession={() => navigate("practice", "home")} />}

      {view !== "session" && <button className="back-link fe-back-engineer" onClick={goEngineer}><ArrowLeft size={18} /> Engineer Learning Labへ戻る</button>}
    </main>
  );
}
