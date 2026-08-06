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
              <CheckCircle size={18} weight={selected ? "fill" : "regular"} />
            </label>
          );
        })}
      </div>
      {options.length === 0 && <div className="fe-filter-empty">{emptyLabel || "選択できる項目がありません。"}</div>}
    </div>
  );
}

function MultiChoiceGroup({ title, description = "", values, options, onChange, emptyLabel = "", variant, defaultOpen = false }) {
  if (variant === "accordion") {
    return (
      <details className="fe-filter-disclosure" open={defaultOpen || undefined}>
        <summary><span>{title}</span><small>{values.length}/{options.length}件</small></summary>
        <ChoicePanelBody title={title} description={description} values={values} options={options} onChange={onChange} emptyLabel={emptyLabel} />
      </details>
    );
  }

  return (
    <fieldset className="fe-filter-group fe-filter-group-compact">
      <legend>{title}</legend>
      <ChoicePanelBody title={title} description={description} values={values} options={options} onChange={onChange} emptyLabel={emptyLabel} />
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
  const [filterVariant, setFilterVariant] = useState("accordion");
  const [subjects, setSubjects] = useState(null);
  const [mockSubject, setMockSubject] = useState("A");
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
  const selectedSubjects = resolveSelection(subjects, subjectOptions);

  const relevantBySubject = useMemo(() => questionBank.filter((question) => selectedSubjects.includes(question.subject || "A")), [questionBank, selectedSubjects]);
  const domainOptions = useMemo(() => [...new Set(relevantBySubject.map((question) => question.domain).filter(Boolean))].map((value) => ({
    value,
    label: domainLabels[value] || value,
    count: relevantBySubject.filter((question) => question.domain === value).length,
  })), [relevantBySubject]);
  const selectedDomains = resolveSelection(domains, domainOptions);

  const relevantByDomain = useMemo(() => relevantBySubject.filter((question) => selectedDomains.includes(question.domain)), [relevantBySubject, selectedDomains]);
  const unitOptions = useMemo(() => [...new Set(relevantByDomain.map((question) => question.unitId).filter(Boolean))].sort((left, right) => String(left).localeCompare(String(right), "ja")).map((value) => ({
    value,
    label: unitLabels[value] || value,
    count: relevantByDomain.filter((question) => question.unitId === value).length,
  })), [relevantByDomain]);
  const selectedUnitIds = resolveSelection(unitIds, unitOptions);

  const relevantByUnit = useMemo(() => relevantByDomain.filter((question) => selectedUnitIds.includes(question.unitId)), [relevantByDomain, selectedUnitIds]);
  const periodOptions = useMemo(() => [...new Map(relevantByUnit.map((question) => [question.periodId, question.periodLabel])).entries()].filter(([value]) => Boolean(value)).map(([value, label]) => ({
    value,
    label: label || value,
    count: relevantByUnit.filter((question) => question.periodId === value).length,
  })), [relevantByUnit]);
  const selectedPeriodIds = resolveSelection(periodIds, periodOptions);
  const reviewScopeOptions = useMemo(() => ["correct", "incorrect", "unanswered", "review"].map((value) => ({ value, label: scopeLabel(value) })), []);

  const requiredGroupEmpty = selectedSubjects.length === 0 || selectedDomains.length === 0 || selectedUnitIds.length === 0 || selectedPeriodIds.length === 0;
  const topicConfig = {
    type: "topic",
    subjects: selectedSubjects,
    domains: selectedDomains,
    unitIds: selectedUnitIds,
    periodIds: selectedPeriodIds,
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
  const available = sessionType === "topic" && requiredGroupEmpty ? [] : filterPracticeQuestions(questionBank, config, sessions);
  const requestedCount = sessionType === "mock" ? mockSpec.count : count === "all" ? available.length : Number(count);
  const actualCount = Math.min(requestedCount, available.length);
  const shortage = available.length > 0 && available.length < requestedCount;
  const resumable = [activeSession, ...sessions].find((session) => session && ["in_progress", "paused"].includes(session.status));
  const chips = [
    ...createGroupChips("subjects", "科目", selectedSubjects, subjectOptions),
    ...createGroupChips("domains", "分野", selectedDomains, domainOptions),
    ...createGroupChips("unitIds", "単元", selectedUnitIds, unitOptions),
    ...createGroupChips("periodIds", "開催回", selectedPeriodIds, periodOptions),
    ...reviewScopes.map((value) => ({ group: "reviewScopes", value, label: `回答状態: ${scopeLabel(value)}` })),
  ];

  const setGroupSelection = (group, values) => {
    if (group === "subjects") {
      setSubjects(values);
      setDomains(null);
      setUnitIds(null);
      setPeriodIds(null);
    }
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

  const removeChip = (chip) => {
    if (chip.value === "__all__") return setGroupSelection(chip.group, []);
    const current = {
      subjects: selectedSubjects,
      domains: selectedDomains,
      unitIds: selectedUnitIds,
      periodIds: selectedPeriodIds,
      reviewScopes,
    }[chip.group];
    setGroupSelection(chip.group, current.filter((value) => value !== chip.value));
  };

  const selectAllFilters = () => {
    setSubjects(null);
    setDomains(null);
    setUnitIds(null);
    setPeriodIds(null);
    setReviewScopes([]);
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
    if (nextType === "mock") setReviewScopes([]);
  };

  const start = () => {
    if (actualCount === 0) return;
    startSession({ ...config, count: actualCount });
  };

  const filterGroups = [
    { key: "subjects", title: "1. 科目", description: "対象にする科目を選択します。", values: selectedSubjects, options: subjectOptions, onChange: (next) => setGroupSelection("subjects", next) },
    { key: "domains", title: "2. 分野", description: "同じ条件群ではOR、他の条件群とはANDで絞り込みます。", values: selectedDomains, options: domainOptions, onChange: (next) => setGroupSelection("domains", next) },
    { key: "unitIds", title: "3. 単元", description: "日本語の単元名から複数選択できます。", values: selectedUnitIds, options: unitOptions, onChange: (next) => setGroupSelection("unitIds", next) },
    { key: "periodIds", title: "4. 開催回・公開区分", values: selectedPeriodIds, options: periodOptions, onChange: (next) => setGroupSelection("periodIds", next) },
    { key: "reviewScopes", title: "5. 回答・復習状態", description: "未選択の場合は回答履歴で絞り込みません。", values: reviewScopes, options: reviewScopeOptions, onChange: (next) => setGroupSelection("reviewScopes", next) },
  ];

  return (
    <section className="fe-setup" aria-labelledby="fe-practice-heading">
      <header className="fe-page-heading">
        <p className="eyebrow">Practice &amp; mock exam</p>
        <h1 id="fe-practice-heading">演習・模擬試験</h1>
        <p>日本語の単元名から絞り込む演習と、本番の問題数・制限時間に合わせた模擬試験を選べます。</p>
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
        <button className={sessionType === "topic" ? "is-selected" : ""} onClick={() => changeSessionType("topic")}><ListChecks size={24} /><span><strong>単元別演習</strong><small>科目・分野・単元などを複数選択</small></span></button>
        <button className={sessionType === "mock" ? "is-selected" : ""} onClick={() => changeSessionType("mock")}><Exam size={24} /><span><strong>模擬試験</strong><small>科目A 60問90分／科目B 20問100分</small></span></button>
      </div>

      {sessionType === "topic" ? (
        <>
          <div className="fe-selected-filters fe-selected-filters-top">
            <div><strong>選択中の条件</strong><small>{requiredGroupEmpty ? "未選択の条件があります" : `${available.length}問が対象`}</small></div>
            <div className="fe-filter-chips">
              {chips.map((chip) => <button type="button" key={`${chip.group}-${chip.value}`} onClick={() => removeChip(chip)}>{chip.label}<span aria-hidden="true">×</span></button>)}
              <button type="button" className="is-clear" onClick={clearFilters}>すべて解除</button>
              <button type="button" className="is-select-all" onClick={selectAllFilters}>すべて選択</button>
            </div>
          </div>

          <div className="fe-filter-view-switch" role="group" aria-label="絞り込み表示形式">
            <span><strong>表示形式</strong><small>選択状態を保持したまま比較できます</small></span>
            <div>
              <button type="button" aria-pressed={filterVariant === "accordion"} className={filterVariant === "accordion" ? "is-selected" : ""} onClick={() => setFilterVariant("accordion")}>パターンA：折りたたみ</button>
              <button type="button" aria-pressed={filterVariant === "grid"} className={filterVariant === "grid" ? "is-selected" : ""} onClick={() => setFilterVariant("grid")}>パターンB：コンパクト配置</button>
            </div>
          </div>

          <div className={filterVariant === "grid" ? "fe-filter-variant-grid" : "fe-filter-variant-accordion"}>
            {filterGroups.map((group, index) => (
              <MultiChoiceGroup key={group.key} {...group} variant={filterVariant} defaultOpen={index === 0} />
            ))}
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
          {sessionType === "topic" && requiredGroupEmpty && <span>全解除された条件があります。各条件で1件以上を選択してください。</span>}
          {available.length === 0 && !requiredGroupEmpty && <span>現在の組合せに一致する問題がありません。</span>}
          {sessionType === "topic" && shortage && <span>指定数に満たないため、{actualCount}問で開始します。</span>}
          {sessionType === "mock" && !shortage && <span>本番と同じ問題数で開始できます。</span>}
        </div>
        <button className="button button-primary fe-start-button" disabled={available.length === 0 || actualCount === 0} onClick={start}>{sessionType === "mock" ? "模擬試験を開始" : "この条件で演習を開始"} <ArrowRight size={19} /></button>
      </section>
    </section>
  );
}
