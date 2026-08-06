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

function selectedLabel(value) {
  return subjectLabels[value] || domainLabels[value] || value;
}

export function FePracticeSetup({ questionBank, sessions, activeSession, bankStatus, startSession, resumeSession, retryBank }) {
  const [sessionType, setSessionType] = useState("topic");
  const [subjects, setSubjects] = useState(["A"]);
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
    label: value,
    count: relevantByDomain.filter((question) => question.unitId === value).length,
  })), [relevantByDomain]);
  const relevantByUnit = useMemo(() => relevantByDomain.filter((question) => unitIds.length === 0 || unitIds.includes(question.unitId)), [relevantByDomain, unitIds]);
  const periodOptions = useMemo(() => [...new Map(relevantByUnit.map((question) => [question.periodId, question.periodLabel])).entries()].map(([value, label]) => ({
    value,
    label,
    count: relevantByUnit.filter((question) => question.periodId === value).length,
  })), [relevantByUnit]);
  const reviewScopeOptions = ["correct", "incorrect", "unanswered", "review"].map((value) => ({ value, label: scopeLabel(value) }));

  const config = {
    type: sessionType,
    subjects,
    domains,
    unitIds,
    periodIds,
    reviewScopes,
    scope: reviewScopes.length === 1 ? reviewScopes[0] : "all",
    count,
  };
  const available = filterPracticeQuestions(questionBank, config, sessions);
  const requestedCount = count === "all" ? available.length : Number(count);
  const actualCount = Math.min(requestedCount, available.length);
  const shortage = count !== "all" && available.length > 0 && available.length < Number(count);
  const resumable = [activeSession, ...sessions].find((session) => session && ["in_progress", "paused"].includes(session.status));
  const chips = [
    ...subjects.map((value) => ({ group: "subjects", value, label: selectedLabel(value) })),
    ...domains.map((value) => ({ group: "domains", value, label: selectedLabel(value) })),
    ...unitIds.map((value) => ({ group: "unitIds", value, label: value })),
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

  return (
    <section className="fe-setup" aria-labelledby="fe-practice-heading">
      <header className="fe-page-heading">
        <p className="eyebrow">Official question practice</p>
        <h1 id="fe-practice-heading">公式問題で演習する</h1>
        <p>科目・分野・単元・開催回・回答状態を組み合わせて、必要な問題だけを問題セットにできます。</p>
      </header>

      <div className="official-source-note">
        <span className="source-note-icon"><ShieldCheck size={24} weight="fill" /></span>
        <span><strong>科目A・科目Bの公式公開問題</strong><small>問題ごとに公式問題冊子と解答へのリンクを表示します。</small></span>
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
          <button className="button button-secondary" onClick={() => resumeSession(resumable)}>演習を再開する <ArrowRight size={18} /></button>
        </div>
      )}

      <div className="fe-session-type" role="group" aria-label="演習形式">
        <button className={sessionType === "topic" ? "is-selected" : ""} onClick={() => setSessionType("topic")}><ListChecks size={24} /><span><strong>条件別演習</strong><small>複数条件を組み合わせる</small></span></button>
        <button className={sessionType === "mock" ? "is-selected" : ""} onClick={() => setSessionType("mock")}><Exam size={24} /><span><strong>模擬セッション</strong><small>選択範囲から横断出題</small></span></button>
      </div>

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

      <section className="fe-start-panel" aria-labelledby="fe-count-heading">
        <div><p className="section-kicker">Question count</p><h2 id="fe-count-heading">問題数</h2></div>
        <div className="fe-count-options">
          {[10, 20, 30, "all"].map((value) => <button className={count === value ? "is-selected" : ""} key={value} onClick={() => setCount(/** @type {number | "all"} */ (value))}>{value === "all" ? "全問" : `${value}問`}</button>)}
        </div>
        <div className={`fe-match-result ${available.length === 0 ? "is-empty" : ""}`} role="status">
          <strong>{available.length}問が条件に一致</strong>
          {available.length === 0 && <span>条件を減らすか、回答・復習状態を解除してください。</span>}
          {shortage && <span>指定数に満たないため、{actualCount}問で開始します。</span>}
        </div>
        <button className="button button-primary fe-start-button" disabled={available.length === 0 || actualCount === 0} onClick={() => startSession({ ...config, count: count === "all" ? "all" : actualCount })}>この条件で演習を開始 <ArrowRight size={19} /></button>
      </section>
    </section>
  );
}
