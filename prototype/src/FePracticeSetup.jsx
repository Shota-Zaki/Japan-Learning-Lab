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
const officialSample = {
  id: "2022-12",
  periodId: "2022-sample",
  label: "2022年12月公開サンプル問題",
};

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function optionValues(options) {
  return options.map((option) => option.value);
}

function resolveSelection(selection, options) {
  const available = new Set(optionValues(options));
  if (selection === null) return optionValues(options);
  return selection.filter((value) => available.has(value));
}

function ChoicePanelBody({ title, description, values, options, onChange, emptyLabel }) {
  const allSelected = options.length > 0 && values.length === options.length;
  return (
    <div className="fe-filter-panel-body" role="group" aria-label={title}>
      <div className="fe-filter-panel-actions">
        <span>{values.length}/{options.length}件選択</span>
        <div>
          <button type="button" disabled={options.length === 0 || allSelected} onClick={() => onChange(optionValues(options))}>全選択</button>
          <button type="button" disabled={values.length === 0} onClick={() => onChange([])}>全解除</button>
        </div>
      </div>
      {description && <p>{description}</p>}
      <div className="fe-check-grid fe-check-grid-compact">
        {options.map((option) => {
          const selected = values.includes(option.value);
          return (
            <label className={selected ? "is-selected" : ""} key={option.value}>
              <input type="checkbox" checked={selected} onChange={() => onChange(toggleValue(values, option.value))} />
              <span><strong>{option.label}</strong>{option.count !== undefined && <small>{option.count}問</small>}</span>
              <CheckCircle size={16} weight={selected ? "fill" : "regular"} />
            </label>
          );
        })}
      </div>
      {options.length === 0 && <div className="fe-filter-empty">{emptyLabel || "選択できる項目がありません。"}</div>}
    </div>
  );
}

function MultiChoiceGroup({ title, description = "", values, options, onChange, emptyLabel = "" }) {
  return (
    <fieldset className="fe-filter-group fe-filter-group-compact">
      <legend>{title}</legend>
      <ChoicePanelBody title={title} description={description} values={values} options={options} onChange={onChange} emptyLabel={emptyLabel} />
    </fieldset>
  );
}

function SubjectSelector({ value, options, onChange }) {
  return (
    <section className="fe-subject-selector" aria-labelledby="fe-subject-heading">
      <div><strong id="fe-subject-heading">受験科目</strong><small>科目Aと科目Bは別々に出題します</small></div>
      <div role="radiogroup" aria-label="受験科目">
        {options.map((option) => (
          <button type="button" role="radio" aria-checked={value === option.value} className={value === option.value ? "is-selected" : ""} key={option.value} onClick={() => onChange(option.value)}>
            <strong>{option.label}</strong><small>{option.count}問収録</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function selectedLabel(value) {
  return domainLabels[value] || unitLabels[value] || value;
}

function createGroupChips(group, title, values, options) {
  if (options.length > 0 && values.length === options.length) {
    return [{ group, value: "__all__", label: `${title}: すべて` }];
  }
  return values.map((value) => ({
    group,
    value,
    label: `${title}: ${options.find((option) => option.value === value)?.label || selectedLabel(value)}`,
  }));
}

export function FePracticeSetup({ questionBank, sessions, activeSession, bankStatus, startSession, resumeSession, retryBank }) {
  const [sessionType, setSessionType] = useState("topic");
  const [subject, setSubject] = useState("A");
  const [mockMode, setMockMode] = useState("random");
  const [domains, setDomains] = useState(null);
  const [unitIds, setUnitIds] = useState(null);
  const [periodIds, setPeriodIds] = useState(null);
  const [reviewScopes, setReviewScopes] = useState([]);
  const [count, setCount] = useState(/** @type {number | "all"} */ (10));

  const subjectOptions = useMemo(() => ["A", "B"].map((value) => ({
    value,
    label: subjectLabels[value],
    count: questionBank.filter((question) => (question.subject || "A") === value).length,
  })), [questionBank]);

  const relevantBySubject = useMemo(
    () => questionBank.filter((question) => (question.subject || "A") === subject),
    [questionBank, subject],
  );
  const domainOptions = useMemo(() => [...new Set(relevantBySubject.map((question) => question.domain).filter(Boolean))].map((value) => ({
    value,
    label: domainLabels[value] || value,
    count: relevantBySubject.filter((question) => question.domain === value).length,
  })), [relevantBySubject]);
  const selectedDomains = resolveSelection(domains, domainOptions);

  const relevantByDomain = useMemo(
    () => relevantBySubject.filter((question) => selectedDomains.includes(question.domain)),
    [relevantBySubject, selectedDomains],
  );
  const unitOptions = useMemo(() => [...new Set(relevantByDomain.map((question) => question.unitId).filter(Boolean))]
    .sort((left, right) => String(left).localeCompare(String(right), "ja"))
    .map((value) => ({
      value,
      label: unitLabels[value] || value,
      count: relevantByDomain.filter((question) => question.unitId === value).length,
    })), [relevantByDomain]);
  const selectedUnitIds = resolveSelection(unitIds, unitOptions);

  const relevantByUnit = useMemo(
    () => relevantByDomain.filter((question) => selectedUnitIds.includes(question.unitId)),
    [relevantByDomain, selectedUnitIds],
  );
  const periodOptions = useMemo(() => [...new Map(relevantByUnit.map((question) => [question.periodId, question.periodLabel])).entries()]
    .filter(([value]) => Boolean(value))
    .map(([value, label]) => ({
      value,
      label: label || value,
      count: relevantByUnit.filter((question) => question.periodId === value).length,
    })), [relevantByUnit]);
  const selectedPeriodIds = resolveSelection(periodIds, periodOptions);
  const reviewScopeOptions = useMemo(
    () => ["correct", "incorrect", "unanswered", "review"].map((value) => ({ value, label: scopeLabel(value) })),
    [],
  );

  const requiredGroupEmpty = selectedDomains.length === 0 || selectedUnitIds.length === 0 || selectedPeriodIds.length === 0;
  const topicConfig = {
    type: "topic",
    subjects: [subject],
    domains: selectedDomains,
    unitIds: selectedUnitIds,
    periodIds: selectedPeriodIds,
    reviewScopes,
    scope: reviewScopes.length === 1 ? reviewScopes[0] : "all",
    count,
  };

  const mockSpec = mockSpecs[subject];
  const sampleMode = mockMode === "official-sample";
  const mockConfig = {
    type: "mock",
    mockMode,
    subjects: [subject],
    domains: [],
    unitIds: [],
    periodIds: sampleMode ? [officialSample.periodId] : [],
    reviewScopes: [],
    scope: "all",
    count: mockSpec.count,
    durationMinutes: mockSpec.durationMinutes,
    officialQuestionCount: mockSpec.count,
    preserveOrder: sampleMode,
    sampleSetId: sampleMode ? officialSample.id : null,
    sampleSetLabel: sampleMode ? officialSample.label : null,
  };
  const config = sessionType === "mock" ? mockConfig : topicConfig;
  const available = sessionType === "topic" && requiredGroupEmpty ? [] : filterPracticeQuestions(questionBank, config, sessions);
  const requestedCount = sessionType === "mock" ? mockSpec.count : count === "all" ? available.length : Number(count);
  const actualCount = Math.min(requestedCount, available.length);
  const shortage = available.length > 0 && available.length < requestedCount;
  const resumable = [activeSession, ...sessions].find((session) => session && ["in_progress", "paused"].includes(session.status));
  const chips = [
    { group: "subject", value: subject, label: subjectLabels[subject] },
    ...createGroupChips("domains", "分野", selectedDomains, domainOptions),
    ...createGroupChips("unitIds", "単元", selectedUnitIds, unitOptions),
    ...createGroupChips("periodIds", "開催回", selectedPeriodIds, periodOptions),
    ...reviewScopes.map((value) => ({ group: "reviewScopes", value, label: `回答状態: ${scopeLabel(value)}` })),
  ];

  const setGroupSelection = (group, values) => {
    if (group === "domains") {
      setDomains(values);
      setUnitIds(null);
      setPeriodIds(null);
    }
    if (group === "unitIds") {
      setUnitIds(values);
      setPeriodIds(null);
    }
    if (group === "periodIds") setPeriodIds(values);
    if (group === "reviewScopes") setReviewScopes(values);
  };

  const changeSubject = (nextSubject) => {
    setSubject(nextSubject);
    setDomains(null);
    setUnitIds(null);
    setPeriodIds(null);
    setReviewScopes([]);
  };

  const removeChip = (chip) => {
    if (chip.group === "subject") return;
    if (chip.value === "__all__") {
      setGroupSelection(chip.group, []);
      return;
    }
    const current = { domains: selectedDomains, unitIds: selectedUnitIds, periodIds: selectedPeriodIds, reviewScopes }[chip.group];
    setGroupSelection(chip.group, current.filter((value) => value !== chip.value));
  };

  const selectAllFilters = () => {
    setDomains(null);
    setUnitIds(null);
    setPeriodIds(null);
    setReviewScopes([]);
  };

  const clearFilters = () => {
    setDomains([]);
    setUnitIds([]);
    setPeriodIds([]);
    setReviewScopes([]);
  };

  const changeSessionType = (nextType) => {
    setSessionType(nextType);
    if (nextType === "mock") setReviewScopes([]);
  };

  const start = () => {
    if (actualCount === 0) return;
    startSession({ ...config, count: actualCount });
  };

  const filterGroups = [
    { key: "domains", title: "1. 分野", description: "同じ条件群ではOR、他の条件群とはANDで絞り込みます。", values: selectedDomains, options: domainOptions, onChange: (next) => setGroupSelection("domains", next) },
    { key: "unitIds", title: "2. 単元", description: "日本語の単元名から複数選択できます。", values: selectedUnitIds, options: unitOptions, onChange: (next) => setGroupSelection("unitIds", next) },
    { key: "periodIds", title: "3. 開催回・公開区分", values: selectedPeriodIds, options: periodOptions, onChange: (next) => setGroupSelection("periodIds", next) },
    { key: "reviewScopes", title: "4. 回答・復習状態", description: "未選択の場合は回答履歴で絞り込みません。", values: reviewScopes, options: reviewScopeOptions, onChange: (next) => setGroupSelection("reviewScopes", next) },
  ];

  return (
    <section className="fe-setup" aria-labelledby="fe-practice-heading">
      <header className="fe-page-heading">
        <p className="eyebrow">Practice &amp; mock exam</p>
        <h1 id="fe-practice-heading">演習・模擬試験</h1>
        <p>科目Aまたは科目Bを選び、単元別演習・ランダム模試・公式サンプル問題に取り組めます。</p>
      </header>

      <div className="official-source-note">
        <span className="source-note-icon"><ShieldCheck size={24} weight="fill" /></span>
        <span><strong>公開問題・演習用問題を収録</strong><small>問題の出典情報は保持し、外部の問題冊子・解答資料へのリンクは表示しません。</small></span>
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
        <button className={sessionType === "topic" ? "is-selected" : ""} onClick={() => changeSessionType("topic")}><ListChecks size={24} /><span><strong>単元別演習</strong><small>選択した1科目の中で絞り込み</small></span></button>
        <button className={sessionType === "mock" ? "is-selected" : ""} onClick={() => changeSessionType("mock")}><Exam size={24} /><span><strong>模擬試験</strong><small>ランダム模試／2022年12月公開サンプル</small></span></button>
      </div>

      <SubjectSelector value={subject} options={subjectOptions} onChange={changeSubject} />

      {sessionType === "topic" ? (
        <>
          <div className="fe-selected-filters fe-selected-filters-top">
            <div><strong>選択中の条件</strong><small>{requiredGroupEmpty ? "未選択の条件があります" : `${available.length}問が対象`}</small></div>
            <div className="fe-filter-chips">
              {chips.map((chip) => <button type="button" disabled={chip.group === "subject"} key={`${chip.group}-${chip.value}`} onClick={() => removeChip(chip)}>{chip.label}{chip.group !== "subject" && <span aria-hidden="true">×</span>}</button>)}
              <button type="button" className="is-clear" onClick={clearFilters}>すべて解除</button>
              <button type="button" className="is-select-all" onClick={selectAllFilters}>すべて選択</button>
            </div>
          </div>

          <p className="fe-filter-layout-note">絞り込み項目はコンパクト配置で全件表示します。項目数に応じて各ブロックの高さが変わります。</p>
          <div className="fe-filter-variant-grid">
            {filterGroups.map((group) => <MultiChoiceGroup key={group.key} {...group} />)}
          </div>
        </>
      ) : (
        <div className="fe-mock-options">
          <button type="button" className={mockMode === "random" ? "is-selected" : ""} onClick={() => setMockMode("random")}>
            <strong>ランダム模擬試験</strong><small>選択科目から本番と同じ問題数をランダム出題</small>
          </button>
          <button type="button" className={sampleMode ? "is-selected" : ""} onClick={() => setMockMode("official-sample")}>
            <strong>{officialSample.label}</strong><small>公式の問題順を維持して、そのまま解く</small>
          </button>
          <div className="fe-filter-group fe-mock-summary" role="status">
            <strong>{sampleMode ? `${officialSample.label}・${subjectLabels[subject]}` : mockSpec.label}</strong>
            <p>{mockSpec.count}問・{mockSpec.durationMinutes}分。正誤と解説は試験終了後にまとめて確認します。</p>
            {sampleMode && <p>公開セットの問番号順を維持し、ランダム化しません。</p>}
            {shortage && <div className="fe-filter-empty">現在の収録数は{available.length}問です。{mockSpec.count}問すべて揃うまで開始できません。</div>}
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
        <div className={`fe-match-result ${available.length === 0 || (sampleMode && shortage) ? "is-empty" : ""}`} role="status">
          <strong>{available.length}問が対象</strong>
          {sessionType === "topic" && requiredGroupEmpty && <span>全解除された条件があります。各条件で1件以上を選択してください。</span>}
          {available.length === 0 && !requiredGroupEmpty && <span>現在の組合せに一致する問題がありません。</span>}
          {sessionType === "topic" && shortage && <span>指定数に満たないため、{actualCount}問で開始します。</span>}
          {sessionType === "mock" && !shortage && <span>{sampleMode ? "公式サンプルを問題順のまま開始できます。" : "本番と同じ問題数で開始できます。"}</span>}
        </div>
        <button className="button button-primary fe-start-button" disabled={available.length === 0 || actualCount === 0 || (sampleMode && shortage)} onClick={start}>
          {sessionType === "mock" ? (sampleMode ? "公式サンプル問題を開始" : "模擬試験を開始") : "この条件で演習を開始"} <ArrowRight size={19} />
        </button>
      </section>
    </section>
  );
}
