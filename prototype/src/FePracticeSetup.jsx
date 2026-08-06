import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle, Exam, ListChecks, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { filterPracticeQuestions, scopeLabel } from "./feSession.js";

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
const mockSpecs = {
  A: { count: 60, durationMinutes: 90, label: "科目A 模擬試験" },
  B: { count: 20, durationMinutes: 100, label: "科目B 模擬試験" },
};

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function MultiChoiceGroup({ title, description = "", values, options, onChange, emptyLabel = "" }) {
  return (
    <fieldset className="fe-filter-group">
      <legend>{title}</legend>
      {description && <p>{description}</p>}
      <div className="fe-check-grid">
        {options.map((option) => {
          const selected = values.includes(option.value);
          return (
            <label className={selected ? "is-selected" : ""} key={option.value}>
              <input type="checkbox" checked={selected} onChange={() => onChange(toggleValue(values, option.value))} />
              <span><strong>{option.label}</strong>{option.count !== undefined && <small>{option.count}問</small>}</span>
              <CheckCircle size={19} weight={selected ? "fill" : "regular"} />
            </label>
          );
        })}
      </div>
      {options.length === 0 && <div className="fe-filter-empty">{emptyLabel || "選択できる項目がありません。"}</div>}
    </fieldset>
  );
}

function SingleSubjectGroup({ value, options, onChange }) {
  return (
    <fieldset className="fe-filter-group">
      <legend>受験科目</legend>
      <p>本番と同じ問題数・制限時間で、科目ごとに実施します。</p>
      <div className="fe-radio-grid">
        {options.map((option) => (
          <label className={value === option.value ? "is-selected" : ""} key={option.value}>
            <input type="radio" name="mock-subject" value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
            <span>{option.label}（{option.count}問収録）</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function selectedLabel(value) {
  return subjectLabels[value] || domainLabels[value] || unitLabels[value] || value;
}

export function FePracticeSetup({ questionBank, sessions, activeSession, bankStatus, startSession, resumeSession, retryBank }) {
  const [sessionType, setSessionType] = useState("topic");
  const [subjects, setSubjects] = useState(["A"]);
  const [mockSubject, setMockSubject] = useState("A");
  const [domains, setDomains] = useState([]);
  const [unitIds, setUnitIds] = useState([]);
  const [periodIds, setPeriodIds] = useState([]);
  const [reviewScopes, setReviewScopes] = useState([]);
  const [count, setCount] = useState(/** @type {number | "all"} */ (10));

  const subjectOptions = useMemo(() => ["A", "B"].map((value) => ({
    value,
    label: subjectLabels[value],
    count: questionBank.filter((question) => (question.subject || "A") === value).length,
  })), [questionBank]);

  const relevantBySubject = useMemo(() => questionBank.filter((question) => subjects.length === 0 || subjects.includes(question.subject || "A")), [questionBank, subjects]);
  const domainOptions = useMemo(() => [...new Set(relevantBySubject.map((question) => question.domain).filter(Boolean))].map((value) => ({
    value,
    label: domainLabels[value] || value,
    count: relevantBySubject.filter((question) => question.domain === value).length,
  })), [relevantBySubject]);
  const relevantByDomain = useMemo(() => relevantBySubject.filter((question) => domains.length === 0 || domains.includes(question.domain)), [relevantBySubject, domains]);
  const unitOptions = useMemo(() => [...new Set(relevantByDomain.map((question) => question.unitId).filter(Boolean))].sort().map((value) => ({
    value,
    label: unitLabels[value] || value,
    count: relevantByDomain.filter((question) => question.unitId === value).length,
  })), [relevantByDomain]);
  const relevantByUnit = useMemo(() => relevantByDomain.filter((question) => unitIds.length === 0 || unitIds.includes(question.unitId)), [relevantByDomain, unitIds]);
  const periodOptions = useMemo(() => [...new Map(relevantByUnit.map((question) => [question.periodId, question.periodLabel])).entries()].map(([value, label]) => ({
    value,
    label,
    count: relevantByUnit.filter((question) => question.periodId === value).length,
  })), [relevantByUnit]);
  const reviewScopeOptions = ["correct", "incorrect", "unanswered", "review"].map((value) => ({ value, label: scopeLabel(value) }));

  const topicConfig = {
    type: "topic",
    subjects,
    domains,
    unitIds,
    periodIds,
    reviewScopes,
    scope: reviewScopes.length === 1 ? reviewScopes[0] : "all",
    count,
  };
  const mockSpec = mockSpecs[mockSubject];
  const mockConfig = {
    type: "mock",
    subjects: [mockSubject],
    domains: [],
    unitIds: [],
    periodIds: [],
    reviewScopes: [],
    scope: "all",
    count: mockSpec.count,
    durationMinutes: mockSpec.durationMinutes,
    officialQuestionCount: mockSpec.count,
  };
  const config = sessionType === "mock" ? mockConfig : topicConfig;
  const available = filterPracticeQuestions(questionBank, config, sessions);
  const requestedCount = sessionType === "mock" ? mockSpec.count : count === "all" ? available.length : Number(count);
  const actualCount = Math.min(requestedCount, available.length);
  const shortage = available.length > 0 && available.length < requestedCount;
  const resumable = [activeSession, ...sessions].find((session) => session && ["in_progress", "paused"].includes(session.status));
  const chips = [
    ...subjects.map((value) => ({ group: "subjects", value, label: selectedLabel(value) })),
    ...domains.map((value) => ({ group: "domains", value, label: selectedLabel(value) })),
    ...unitIds.map((value) => ({ group: "unitIds", value, label: selectedLabel(value) })),
    ...periodIds.map((value) => ({ group: "periodIds", value, label: periodOptions.find((option) => option.value === value)?.label || value })),
    ...reviewScopes.map((value) => ({ group: "reviewScopes", value, label: scopeLabel(value) })),
  ];

  const removeChip = (chip) => {
    if (chip.group === "subjects") setSubjects((current) => current.filter((value) => value !== chip.value));
    if (chip.group === "domains") setDomains((current) => current.filter((value) => value !== chip.value));
    if (chip.group === "unitIds") setUnitIds((current) => current.filter((value) => value !== chip.value));
    if (chip.group === "periodIds") setPeriodIds((current) => current.filter((value) => value !== chip.value));
    if (chip.group === "reviewScopes") setReviewScopes((current) => current.filter((value) => value !== chip.value));
  };

  const clearFilters = () => {
    setSubjects([]);
    setDomains([]);
    setUnitIds([]);
    setPeriodIds([]);
    setReviewScopes([]);
  };

  const changeSessionType = (nextType) => {
    setSessionType(nextType);
    if (nextType === "mock") {
      setDomains([]);
      setUnitIds([]);
      setPeriodIds([]);
      setReviewScopes([]);
    }
  };

  const start = () => {
    if (actualCount === 0) return;
    startSession({ ...config, count: actualCount });
  };

  return (
    <section className="fe-setup" aria-labelledby="fe-practice-heading">
      <header className="fe-page-heading">
        <p className="eyebrow">Practice &amp; mock exam</p>
        <h1 id="fe-practice-heading">演習・模擬試験</h1>
        <p>日本語の単元名から絞り込む演習と、本番の問題数・制限時間に合わせた模擬試験を選べます。</p>
      </header>

      <div className="official-source-note">
        <span className="source-note-icon"><ShieldCheck size={24} weight="fill" /></span>
        <span><strong>公開問題・演習用問題を収録</strong><small>問題の出典情報は保持し、外部の問題冊子・解答PDFリンクは表示しません。</small></span>
        <span className={`source-count ${bankStatus === "loading" ? "is-loading" : ""}`}>{bankStatus === "loading" ? "—" : questionBank.length}<small>問収録</small></span>
      </div>

      {bankStatus === "error" && (
        <div className="state-banner is-warning" role="alert">
          <WarningCircle size={24} weight="fill" />
          <span><strong>最新の問題データを読み込めませんでした</strong><small>端末内の収録済み問題で続行できます。</small></span>
          <button className="button button-tertiary" onClick={retryBank}>再読み込み</button>
        </div>
      )}

      {resumable && (
        <div className="resume-card">
          <span><strong>{resumable.status === "paused" ? "一時停止中の演習" : "進行中の演習"}</strong><small>{Object.keys(resumable.answers).length}/{resumable.questionIds.length}問回答</small></span>
          <button className="button button-secondary" onClick={() => resumeSession(resumable)}>再開する <ArrowRight size={18} /></button>
        </div>
      )}

      <div className="fe-session-type" role="group" aria-label="演習形式">
        <button className={sessionType === "topic" ? "is-selected" : ""} onClick={() => changeSessionType("topic")}><ListChecks size={24} /><span><strong>単元別演習</strong><small>科目・分野・単元などを複数選択</small></span></button>
        <button className={sessionType === "mock" ? "is-selected" : ""} onClick={() => changeSessionType("mock")}><Exam size={24} /><span><strong>模擬試験</strong><small>科目A 60問90分／科目B 20問100分</small></span></button>
      </div>

      {sessionType === "topic" ? (
        <>
          <div className="fe-filter-stack">
            <MultiChoiceGroup title="1. 科目" description="未選択の場合は両方が対象です。" values={subjects} options={subjectOptions} onChange={(next) => { setSubjects(next); setDomains([]); setUnitIds([]); setPeriodIds([]); }} />
            <MultiChoiceGroup title="2. 分野" description="同じ条件群ではOR、他の条件群とはANDで絞り込みます。" values={domains} options={domainOptions} onChange={(next) => { setDomains(next); setUnitIds([]); setPeriodIds([]); }} />
            <MultiChoiceGroup title="3. 単元" values={unitIds} options={unitOptions} onChange={(next) => { setUnitIds(next); setPeriodIds([]); }} />
            <MultiChoiceGroup title="4. 開催回・公開区分" values={periodIds} options={periodOptions} onChange={setPeriodIds} />
            <MultiChoiceGroup title="5. 回答・復習状態" description="複数選択はORです。未選択の場合は回答履歴で絞り込みません。" values={reviewScopes} options={reviewScopeOptions} onChange={setReviewScopes} />
          </div>

          <div className="fe-selected-filters">
            <div><strong>選択中の条件</strong><small>{chips.length === 0 ? "すべての問題" : `${chips.length}条件`}</small></div>
            <div className="fe-filter-chips">
              {chips.map((chip) => <button key={`${chip.group}-${chip.value}`} onClick={() => removeChip(chip)}>{chip.label}<span aria-hidden="true">×</span></button>)}
              {chips.length > 0 && <button className="is-clear" onClick={clearFilters}>全解除</button>}
            </div>
          </div>
        </>
      ) : (
        <div className="fe-filter-stack">
          <SingleSubjectGroup value={mockSubject} options={subjectOptions} onChange={setMockSubject} />
          <div className="fe-filter-group" role="status">
            <strong>{mockSpec.label}</strong>
            <p>{mockSpec.count}問・{mockSpec.durationMinutes}分。正誤と解説は試験終了後にまとめて確認します。</p>
            {shortage && <div className="fe-filter-empty">現在の収録数は{available.length}問です。暫定的に{actualCount}問で開始しますが、本番同数版ではありません。</div>}
          </div>
        </div>
      )}

      <section className="fe-start-panel" aria-labelledby="fe-count-heading">
        <div><p className="section-kicker">Question count</p><h2 id="fe-count-heading">{sessionType === "mock" ? "試験条件" : "問題数"}</h2></div>
        {sessionType === "topic" ? (
          <div className="fe-count-options">
            {[10, 20, 30, "all"].map((value) => <button className={count === value ? "is-selected" : ""} key={value} onClick={() => setCount(/** @type {number | "all"} */ (value))}>{value === "all" ? "全問" : `${value}問`}</button>)}
          </div>
        ) : (
          <div className="fe-count-options"><button className="is-selected" type="button">{actualCount}問・{mockSpec.durationMinutes}分</button></div>
        )}
        <div className={`fe-match-result ${available.length === 0 ? "is-empty" : ""}`} role="status">
          <strong>{available.length}問が対象</strong>
          {available.length === 0 && <span>対象科目の問題が収録されていません。</span>}
          {sessionType === "topic" && shortage && <span>指定数に満たないため、{actualCount}問で開始します。</span>}
          {sessionType === "mock" && !shortage && <span>本番と同じ問題数で開始できます。</span>}
        </div>
        <button className="button button-primary fe-start-button" disabled={available.length === 0 || actualCount === 0} onClick={start}>{sessionType === "mock" ? "模擬試験を開始" : "この条件で演習を開始"} <ArrowRight size={19} /></button>
      </section>
    </section>
  );
}
