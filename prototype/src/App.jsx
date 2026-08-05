import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookmarkSimple,
  Briefcase,
  CaretRight,
  Certificate,
  ChartBar,
  CheckCircle,
  Code,
  Compass,
  Coffee,
  Exam,
  House,
  ListChecks,
  MagnifyingGlass,
  MapTrifold,
  Medal,
  Monitor,
  Pause,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  SquaresFour,
  Stack,
  Trophy,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { FE_DATASET_META, feDomains, feQuestions, feUnitLabels } from "./data/feQuestions.js";
import {
  abandonFeSession,
  answerSessionQuestion,
  calculateSessionSummary,
  completeFeSession,
  createFeSession,
  filterPracticeQuestions,
  moveSession,
  pauseFeSession,
  resumeFeSession,
  scopeLabel,
  selectPracticeQuestions,
  toggleSessionReview,
  updateSessionDraft,
} from "./feSession.js";
import { createFeSessionStore } from "./feStorage.js";

const labs = [
  { name: "Engineer Learning Lab", description: "エンジニア資格・プログラミング", icon: Code, route: "engineer", primary: true },
  { name: "Business Learning Lab", description: "ビジネススキル・マネジメント", icon: Briefcase },
  { name: "Security Learning Lab", description: "セキュリティ・ITガバナンス", icon: ShieldCheck },
  { name: "Data Learning Lab", description: "データサイエンス・AI", icon: ChartBar },
];

const routePaths = {
  japan: "/",
  engineer: "/engineer/",
  exam: {
    lesson: "/engineer/it-exam/lessons/",
    practice: "/engineer/it-exam/practice/",
    session: "/engineer/it-exam/practice/session/",
    history: "/engineer/it-exam/history/",
  },
  java: {
    lesson: "/engineer/java/lessons/",
    practice: "/engineer/java/practice/",
  },
};

function readLocation() {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen");
  const requestedMode = params.get("mode") === "practice" ? "practice" : "lesson";
  if (["japan", "engineer", "exam", "java"].includes(screen)) {
    return { route: screen, mode: requestedMode, view: "home" };
  }

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const hashPath = hashParams.get("jll");
  const path = hashPath?.startsWith("/") ? hashPath : window.location.pathname;
  if (path.startsWith("/engineer/it-exam/history")) return { route: "exam", mode: "practice", view: "history" };
  if (path.startsWith("/engineer/it-exam/practice/session")) return { route: "exam", mode: "practice", view: "session" };
  if (path.startsWith("/engineer/it-exam/practice")) return { route: "exam", mode: "practice", view: "home" };
  if (path.startsWith("/engineer/it-exam")) return { route: "exam", mode: "lesson", view: "home" };
  if (path.startsWith("/engineer/java/practice")) return { route: "java", mode: "practice", view: "home" };
  if (path.startsWith("/engineer/java")) return { route: "java", mode: "lesson", view: "home" };
  if (path.startsWith("/engineer")) return { route: "engineer", mode: "lesson", view: "home" };
  return { route: "japan", mode: "lesson", view: "home" };
}

function pathFor(route, mode = "lesson", view = "home") {
  const entry = routePaths[route];
  if (route === "exam" && mode === "practice" && view === "session") return entry.session;
  if (route === "exam" && view === "history") return entry.history;
  return typeof entry === "string" ? entry : entry[mode];
}

function resilientUrl(path) {
  return `${path}#${new URLSearchParams({ jll: path }).toString()}`;
}

function siteMeta(route) {
  if (route === "exam") return { brand: "FE Learning Lab", home: "exam", accent: "exam" };
  if (route === "java") return { brand: "Java Learning Lab", home: "java", accent: "java" };
  if (route === "engineer") return { brand: "Engineer Learning Lab", home: "engineer", accent: "engineer" };
  return { brand: "Japan Learning Lab", home: "japan", accent: "japan" };
}

function Header({ route, mode, view, go, notify }) {
  const meta = siteMeta(route);
  const courseSite = route === "exam" || route === "java";
  const items = courseSite
    ? [
        { label: "レッスン", icon: BookOpen, route, mode: "lesson" },
        { label: "演習・模試", icon: Exam, route, mode: "practice" },
        { label: "Engineer Lab", icon: Compass, route: "engineer" },
        { label: "学習履歴", icon: ChartBar, route: "exam", mode: "practice", view: "history" },
      ]
    : route === "engineer"
      ? [
          { label: "ホーム", icon: House, route: "engineer", active: true },
          { label: "資格試験", icon: Certificate, route: "exam" },
          { label: "Java", icon: Coffee, route: "java" },
          { label: "学習履歴", icon: ChartBar, route: "exam", mode: "practice", view: "history" },
        ]
      : [
          { label: "ホーム", icon: House, route: "japan", active: true },
          { label: "Learning Labs", icon: SquaresFour, route: "japan" },
          { label: "学習履歴", icon: ChartBar, route: "exam", mode: "practice", view: "history" },
        ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => go(meta.home, "lesson")}>{meta.brand}</button>
        <nav className="global-nav" aria-label="グローバルナビゲーション">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.active === true || (item.route === route && item.view === view) || (item.mode && !item.view && item.route === route && item.mode === mode && view !== "history");
            return (
              <button
                className={`nav-item ${active ? "is-active" : ""}`}
                key={item.label}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                onClick={() => item.action ? item.action() : go(item.route, item.mode || "lesson", item.view || "home")}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="header-actions">
          <button className="icon-action search-action" aria-label="検索" onClick={() => notify("このサイト内の検索を開きました。") }><MagnifyingGlass size={22} /><span>検索</span></button>
          <button className="icon-action" aria-label="アカウント" onClick={() => notify("アカウントメニューを開きました。") }><UserCircle size={30} weight="fill" /></button>
        </div>
      </div>
    </header>
  );
}

function Breadcrumbs({ items, go }) {
  return (
    <nav className="breadcrumbs" aria-label="パンくずリスト">
      {items.map((item, index) => (
        <span className="breadcrumb-part" key={item.label}>
          {index > 0 && <CaretRight size={14} aria-hidden="true" />}
          {item.route ? <button onClick={() => go(item.route, item.mode || "lesson")}>{item.label}</button> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

function PlatformStructure() {
  const levels = [
    { label: "Step 1", value: "学びたい分野を選ぶ", icon: SquaresFour },
    { label: "Step 2", value: "コースを見つける", icon: Compass },
    { label: "Step 3", value: "学習を始める", icon: Stack },
  ];
  return (
    <aside className="structure-panel" aria-label="学習の始め方">
      <div className="structure-heading"><span>学習の始め方</span><MapTrifold size={24} /></div>
      <div className="structure-list">
        {levels.map((level, index) => {
          const Icon = level.icon;
          return (
            <div className="structure-row" key={level.label}>
              <span className="structure-index">0{index + 1}</span>
              <span className="structure-icon"><Icon size={22} /></span>
              <span><small>{level.label}</small><strong>{level.value}</strong></span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function JapanHome({ go, notify }) {
  return (
    <main className="platform-main">
      <section className="platform-hero">
        <div className="platform-hero-inner">
          <div className="platform-copy">
            <p className="eyebrow">A platform for continuous learning</p>
            <h1 tabIndex={-1}>学びたい分野から、<br />自分の道をつくる。</h1>
            <p className="lead">興味や目標に合う分野を見つけて、今日から学習を始められます。</p>
            <button className="button button-primary platform-cta" onClick={() => go("engineer")}>
              Engineer Learning Labへ <ArrowRight size={19} />
            </button>
          </div>
          <PlatformStructure />
        </div>
      </section>

      <section className="page lab-directory" aria-labelledby="lab-heading">
        <div className="section-intro">
          <span className="section-number">01</span>
          <div><p className="section-kicker">Learning Labs</p><h2 id="lab-heading">専門分野の入口</h2></div>
          <p>身につけたい知識やスキルから、学習分野を選んでください。</p>
        </div>
        <div className="lab-grid">
          {labs.map((lab) => {
            const Icon = lab.icon;
            return (
              <button className={`lab-tile ${lab.primary ? "lab-tile-primary" : ""}`} key={lab.name} onClick={() => lab.route ? go(lab.route) : notify(`${lab.name} は現在準備中です。`)}>
                <span className="lab-tile-top"><span className="lab-icon"><Icon size={30} /></span><span className="lab-state">{lab.primary ? "Open" : "Coming soon"}</span></span>
                <span className="lab-copy"><strong>{lab.name}</strong><small>{lab.description}</small></span>
                <span className="lab-action">サイトを開く <ArrowUpRight size={18} /></span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function EngineerHome({ go }) {
  return (
    <main className="platform-main">
      <section className="engineer-masthead">
        <div className="page masthead-grid">
          <div className="engineer-copy">
            <Breadcrumbs items={[{ label: "Japan Learning Lab", route: "japan" }, { label: "Engineer Learning Lab" }]} go={go} />
            <p className="eyebrow">Engineer Learning Lab</p>
            <h1 tabIndex={-1}>エンジニアの学びを、<br />次の実力へ。</h1>
            <p className="lead">資格取得と開発スキルの向上に向けて、自分に合うコースを選べます。</p>
          </div>
          <aside className="engineer-index" aria-label="Engineer Learning Labの学習領域">
            <p className="section-kicker">Course index</p>
            <div className="index-stat"><strong>2</strong><span>コース</span></div>
            <div className="index-divider" />
            <div className="index-methods">
              <span><Certificate size={20} /> 資格試験</span>
              <span><Coffee size={20} /> Java</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="page course-directory" aria-labelledby="path-heading">
        <div className="section-intro">
          <span className="section-number">01</span>
          <div><p className="section-kicker">Course sites</p><h2 id="path-heading">学習サイトを選ぶ</h2></div>
          <p>目標に合うコースを選んで、学習を始めましょう。</p>
        </div>
        <div className="course-site-grid">
          <article className="course-site-card exam-card">
            <div className="course-site-head"><span className="course-site-icon"><Monitor size={36} /></span><span>資格試験</span></div>
            <h3>FE Learning Lab</h3>
            <p>基本情報技術者試験の知識をレッスンで学び、演習と模試で定着を確認します。</p>
            <div className="course-method-list"><span><BookOpen size={18} /> レッスン</span><span><Exam size={18} /> 演習・模試</span></div>
            <button className="button course-site-link" onClick={() => go("exam", "lesson")}>サイトを開く <ArrowRight size={19} /></button>
          </article>
          <article className="course-site-card java-card">
            <div className="course-site-head"><span className="course-site-icon java-coffee-icon"><Coffee size={36} weight="fill" /></span><span>プログラミング</span></div>
            <h3>Java</h3>
            <p>基本文法から資格対策までをレッスンで学び、Bronze・Silverの演習と模試に挑戦します。</p>
            <div className="course-method-list"><span><BookOpen size={18} /> レッスン</span><span><Exam size={18} /> 演習・模試</span></div>
            <button className="button course-site-link" onClick={() => go("java", "lesson")}>サイトを開く <ArrowRight size={19} /></button>
          </article>
        </div>
      </section>
    </main>
  );
}

function StudyModeNav({ route, mode, go }) {
  return (
    <nav className="study-mode-nav" aria-label="学習方法">
      <button className={mode === "lesson" ? "is-active" : ""} onClick={() => go(route, "lesson")}>
        <span className="mode-icon"><BookOpen size={24} /></span>
        <span><small>Learn</small><strong>レッスンで学ぶ</strong></span>
        <CaretRight size={18} />
      </button>
      <button className={mode === "practice" ? "is-active" : ""} onClick={() => go(route, "practice")}>
        <span className="mode-icon"><Exam size={24} /></span>
        <span><small>Practice & Mock exam</small><strong>演習・模試で試す</strong></span>
        <CaretRight size={18} />
      </button>
    </nav>
  );
}

function ExamLesson({ notify }) {
  const [lessonOpen, setLessonOpen] = useState(false);
  const [checkAnswer, setCheckAnswer] = useState("");

  if (lessonOpen) {
    const checkSubmitted = checkAnswer !== "";
    const checkCorrect = checkAnswer === "binary";
    return (
      <section className="lesson-reader" aria-labelledby="lesson-reader-heading">
        <button className="back-link" onClick={() => { setLessonOpen(false); setCheckAnswer(""); }}><ArrowLeft size={18} /> レッスン一覧へ戻る</button>
        <div className="lesson-reader-head">
          <span className="lesson-number">Lesson 3</span>
          <p className="eyebrow">Algorithm & data structure</p>
          <h1 id="lesson-reader-heading">探索アルゴリズム</h1>
          <p>データの並び方に合わせて、線形探索と二分探索を使い分けられるようになります。</p>
        </div>
        <div className="lesson-content-grid">
          <article className="lesson-concept">
            <span>01</span><div><h2>線形探索</h2><p>先頭から順番に目的の値と比較します。データが未整列でも使えますが、最悪の場合は全要素を確認します。</p><strong>計算量 O(n)</strong></div>
          </article>
          <article className="lesson-concept">
            <span>02</span><div><h2>二分探索</h2><p>整列済みデータの中央と比較し、探索範囲を半分ずつ狭めます。データが整列されていることが前提です。</p><strong>計算量 O(log n)</strong></div>
          </article>
          <article className="lesson-concept lesson-concept-wide">
            <span>03</span><div><h2>選び方</h2><p>未整列の小さなデータには線形探索、整列済みで件数が多いデータには二分探索が向いています。探索前の整列コストも含めて判断します。</p></div>
          </article>
        </div>
        <section className="lesson-check" aria-labelledby="lesson-check-heading">
          <p className="section-kicker">Knowledge check</p>
          <h2 id="lesson-check-heading">確認問題</h2>
          <p>整列済みの1,024件のデータから、比較回数を抑えて値を探す方法として最も適切なのはどれですか。</p>
          <div className="lesson-check-options">
            <button className={checkAnswer === "linear" ? "is-selected" : ""} disabled={checkSubmitted} onClick={() => setCheckAnswer("linear")}>線形探索</button>
            <button className={checkAnswer === "binary" ? "is-selected" : ""} disabled={checkSubmitted} onClick={() => setCheckAnswer("binary")}>二分探索</button>
          </div>
          {checkSubmitted && <div className={`lesson-check-result ${checkCorrect ? "is-correct" : "is-wrong"}`} role="status"><CheckCircle size={22} weight="fill" /><span><strong>{checkCorrect ? "正解です" : "二分探索が適切です"}</strong><small>探索範囲を半分ずつ狭められるため、比較回数を大きく抑えられます。</small></span></div>}
          {checkSubmitted && <button className="button button-primary" onClick={() => notify("Lesson 3「探索アルゴリズム」を完了しました。")}>レッスンを完了する</button>}
        </section>
      </section>
    );
  }

  return (
    <>
      <section className="course-hero">
        <div className="course-main">
          <p className="eyebrow">Featured lesson</p>
          <h1 tabIndex={-1}>試験範囲をレッスンで学ぶ</h1>
          <p className="course-category">アルゴリズムとデータ構造</p>
          <div className="lesson-line"><BookOpen size={22} /><strong>Lesson 3</strong><span>探索アルゴリズム</span></div>
          <div className="course-actions single-action">
            <button className="button button-primary" onClick={() => setLessonOpen(true)}><Play size={19} weight="fill" /> レッスンを始める</button>
          </div>
        </div>
      </section>
    </>
  );
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function ExamPractice({ startSession, resumeSession, activeSession, sessions, questionBank, bankStatus, retryBank }) {
  const [sessionType, setSessionType] = useState("topic");
  const [domain, setDomain] = useState("technology");
  const [periodId, setPeriodId] = useState("all");
  const [questionCount, setQuestionCount] = useState(/** @type {number | "all"} */ (10));
  const [scope, setScope] = useState("all");
  const periodOptions = [...new Map(questionBank.map((question) => [question.periodId, question.periodLabel])).entries()];
  const periodLabel = periodId === "all" ? "すべての開催回" : periodOptions.find(([id]) => id === periodId)?.[1] || "選択した開催回";
  const config = { type: sessionType === "mock" ? "mock" : "topic", domain, periodId, periodLabel, count: questionCount, scope };
  const availableQuestions = filterPracticeQuestions(questionBank, config, sessions);
  const requestedCount = questionCount === "all" ? availableQuestions.length : questionCount;
  const actualQuestionCount = Math.min(requestedCount, availableQuestions.length);
  const isLoading = bankStatus === "idle" || bankStatus === "loading";
  const shortage = questionCount !== "all" && availableQuestions.length > 0 && availableQuestions.length < questionCount;
  const resumableSession = activeSession || sessions.find((session) => ["in_progress", "paused"].includes(session.status));

  return (
    <section className="practice-surface">
      <div className="practice-heading">
        <p className="eyebrow">Official past questions</p>
        <h1 tabIndex={-1}>公式過去問で実力を確かめる</h1>
        <p className="lead">分野別の演習と、3分野を横断する模擬セッションを選べます。</p>
      </div>

      <div className="official-source-note">
        <span className="source-note-icon"><ShieldCheck size={24} weight="fill" /></span>
        <span><strong>収録問題は公式過去問のみ</strong><small>出典を問題ごとに表示し、IPAの問題冊子と解答へ移動できます。</small></span>
        <span className={`source-count ${isLoading ? "is-loading" : ""}`}>
          {isLoading ? "—" : questionBank.length}<small>{isLoading ? "読込中" : "問収録"}</small>
        </span>
      </div>

      {bankStatus === "error" && (
        <div className="state-banner is-warning" role="alert">
          <WarningCircle size={24} weight="fill" />
          <span><strong>問題データを更新できませんでした</strong><small>収録済みの公式過去問で続行できます。</small></span>
          <button className="button button-tertiary" onClick={retryBank}>再読み込み</button>
        </div>
      )}

      {resumableSession && (
        <div className="resume-card">
          <span><strong>{resumableSession.status === "paused" ? "一時停止中の演習" : "進行中の演習"}</strong><small>{scopeLabel(resumableSession.config.scope)}・{Object.keys(resumableSession.answers).length}/{resumableSession.questionIds.length}問回答</small></span>
          <button className="button button-secondary" onClick={() => resumeSession(resumableSession)}>演習を再開する <ArrowRight size={18} /></button>
        </div>
      )}

      <div className="practice-builder">
        <section className="builder-panel" aria-labelledby="practice-type-heading">
          <div className="builder-heading"><span>01</span><div><p className="section-kicker">Session type</p><h2 id="practice-type-heading">取り組み方を選ぶ</h2></div></div>
          <div className="session-type-grid">
            <button aria-pressed={sessionType === "topic"} className={sessionType === "topic" ? "is-selected" : ""} onClick={() => setSessionType("topic")}>
              <span className="practice-icon"><ListChecks size={26} /></span>
              <span><strong>分野別演習</strong><small>選んだ分野を集中して演習</small></span>
              <CheckCircle size={21} weight={sessionType === "topic" ? "fill" : "regular"} />
            </button>
            <button aria-pressed={sessionType === "mock"} className={sessionType === "mock" ? "is-selected" : ""} onClick={() => setSessionType("mock")}>
              <span className="practice-icon"><Trophy size={26} /></span>
              <span><strong>模擬セッション</strong><small>3分野を横断して出題</small></span>
              <CheckCircle size={21} weight={sessionType === "mock" ? "fill" : "regular"} />
            </button>
          </div>
        </section>

        <section className={`builder-panel ${sessionType === "mock" ? "is-muted" : ""}`} aria-labelledby="practice-domain-heading">
          <div className="builder-heading"><span>02</span><div><p className="section-kicker">Exam domain</p><h2 id="practice-domain-heading">出題分野を選ぶ</h2></div></div>
          <div className="domain-option-list">
            {Object.entries(feDomains).map(([key, value]) => {
              const count = questionBank.filter((question) => question.domain === key && (periodId === "all" || question.periodId === periodId)).length;
              return (
                <button key={key} aria-pressed={domain === key} className={domain === key ? "is-selected" : ""} disabled={sessionType === "mock"} onClick={() => setDomain(key)}>
                  <span><strong>{value.label}</strong><small>{value.description}</small></span>
                  <span className="domain-count">{count}問</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="builder-panel scope-panel" aria-labelledby="practice-scope-heading">
          <div className="builder-heading"><span>03</span><div><p className="section-kicker">Question scope</p><h2 id="practice-scope-heading">問題の範囲を選ぶ</h2></div></div>
          <div className="scope-option-list">
            {[
              ["all", "通常演習", "条件に合う公式過去問"],
              ["incorrect", "間違えた問題", "過去の不正解を解き直す"],
              ["unanswered", "未回答問題", "完了時に残した問題"],
              ["review", "見直し対象", "自分で印を付けた問題"],
            ].map(([value, label, description]) => (
              <button key={value} aria-pressed={scope === value} className={scope === value ? "is-selected" : ""} onClick={() => setScope(value)}>
                <span><strong>{label}</strong><small>{description}</small></span><CheckCircle size={19} weight={scope === value ? "fill" : "regular"} />
              </button>
            ))}
          </div>
        </section>

        <aside className="session-summary" aria-label="出題設定">
          <div><SlidersHorizontal size={22} /><span><small>出題設定</small><strong>{sessionType === "mock" ? "模擬セッション" : feDomains[domain].label}</strong></span></div>
          <label className="session-field">
            <span>開催回</span>
            <select value={periodId} onChange={(event) => setPeriodId(event.target.value)} disabled={isLoading}>
              <option value="all">すべての開催回</option>
              {periodOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
          <fieldset className="question-count-field">
            <legend>問題数</legend>
            <div>
              {/** @type {Array<number | "all">} */ ([10, 20, 30, "all"]).map((count) => (
                <button key={count} type="button" aria-pressed={questionCount === count} className={questionCount === count ? "is-selected" : ""} onClick={() => setQuestionCount(count)}>{count === "all" ? "全問" : `${count}問`}</button>
              ))}
            </div>
          </fieldset>
          <dl>
            <div><dt>出題範囲</dt><dd>{periodLabel}</dd></div>
            <div><dt>出題可能</dt><dd>{availableQuestions.length}問</dd></div>
            <div><dt>今回の問題数</dt><dd>{actualQuestionCount}問</dd></div>
            <div><dt>問題の範囲</dt><dd>{scopeLabel(scope)}</dd></div>
            <div><dt>出典</dt><dd>IPA公式過去問</dd></div>
          </dl>
          {availableQuestions.length === 0 && (
            <div className="empty-inline" role="status"><strong>条件に合う問題がありません</strong><span>{scope === "all" ? "開催回や分野を変更してください。" : "通常演習に戻すか、先に演習履歴を作成してください。"}</span>{scope !== "all" && <button onClick={() => setScope("all")}>通常演習に戻す</button>}</div>
          )}
          {shortage && <p className="shortage-note" role="status">指定した{questionCount}問に満たないため、出題可能な{availableQuestions.length}問で開始します。</p>}
          <button
            className="button button-primary"
            disabled={isLoading || actualQuestionCount === 0}
            onClick={() => startSession(config)}
          >
            {isLoading ? "問題を読み込んでいます" : "演習を開始する"} {!isLoading && <ArrowRight size={19} />}
          </button>
        </aside>
      </div>

      <p className="dataset-credit">Question data: <a href={FE_DATASET_META.sourceRepository} target="_blank" rel="noreferrer">Engineer-License-Lab <ArrowUpRight size={14} /></a></p>
    </section>
  );
}

function ExamResult({ session, questionBank, retrySession, reviewSession, exitSession }) {
  const summary = calculateSessionSummary(session);
  const questionMap = new Map(questionBank.map((question) => [question.id, question]));
  const missed = session.questionIds.filter((questionId) => session.answers[questionId] && !session.answers[questionId].correct);

  return (
    <section className="exam-result" aria-labelledby="result-heading">
      <div className="result-summary">
        <span className="result-icon"><Trophy size={34} weight="fill" /></span>
        <p className="eyebrow">Session complete</p>
        <h1 id="result-heading">演習結果</h1>
        <div className="result-score"><strong>{summary.score}</strong><span>%</span></div>
        <p>{summary.total}問中 {summary.correct}問正解</p>
        <div className="result-metrics" aria-label="結果の内訳">
          <span><small>回答</small><strong>{summary.answered}</strong></span>
          <span><small>未回答</small><strong>{summary.unanswered}</strong></span>
          <span><small>不正解</small><strong>{summary.incorrect}</strong></span>
        </div>
      </div>
      <div className="result-detail">
        <div className="section-heading-row compact"><div><p className="section-kicker">Review</p><h2>振り返り</h2></div></div>
        {summary.correct === summary.total ? (
          <div className="perfect-result"><CheckCircle size={26} weight="fill" /><span><strong>全問正解です</strong><small>この調子で次の分野へ進みましょう。</small></span></div>
        ) : missed.length === 0 ? (
          <div className="perfect-result is-unanswered"><WarningCircle size={26} weight="fill" /><span><strong>未回答の問題があります</strong><small>{summary.unanswered}問を未回答のまま終了しました。履歴から同じ問題に再挑戦できます。</small></span></div>
        ) : (
          <div className="missed-list">
            {missed.map((questionId) => {
              const question = questionMap.get(questionId);
              return <div key={questionId}><span>{feUnitLabels[question.unitId]}</span><strong>{question.title}</strong><small>正答 {question.correctAnswer}</small></div>;
            })}
          </div>
        )}
        <div className="result-actions">
          {missed.length > 0 && <button className="button button-primary" onClick={() => reviewSession(session, missed)}>間違えた問題を復習</button>}
          <button className="button button-secondary" onClick={() => retrySession(session)}>同じ問題でもう一度</button>
          <button className="button button-tertiary" onClick={exitSession}>出題設定へ戻る</button>
        </div>
        <dl className="result-conditions">
          <div><dt>形式</dt><dd>{session.config.type === "mock" ? "模擬セッション" : feDomains[session.config.domain]?.label}</dd></div>
          <div><dt>範囲</dt><dd>{session.config.periodLabel}・{scopeLabel(session.config.scope)}</dd></div>
          <div><dt>完了日時</dt><dd>{formatDate(session.completedAt)}</dd></div>
        </dl>
      </div>
    </section>
  );
}

function ExamSession({ session, questionBank, persistSession, pauseSession, completeSession, retrySession, reviewSession, exitSession }) {
  const [confirmFinish, setConfirmFinish] = useState(false);
  if (!session) return <MissingSession exitSession={exitSession} />;
  if (session.status === "completed") return <ExamResult session={session} questionBank={questionBank} retrySession={retrySession} reviewSession={reviewSession} exitSession={exitSession} />;
  if (session.status === "paused") return <PausedSession session={session} persistSession={persistSession} exitSession={exitSession} />;
  const questionMap = new Map(questionBank.map((item) => [item.id, item]));
  const question = questionMap.get(session.questionIds[session.currentIndex]);
  if (!question) return <MissingSession exitSession={exitSession} />;
  const answer = session.answers[question.id];
  const selected = answer?.selected || session.drafts[question.id] || "";
  const summary = calculateSessionSummary(session);
  const moveTo = (index) => { persistSession(moveSession(session, index)); setConfirmFinish(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const nextUnanswered = session.questionIds.findIndex((questionId, index) => index > session.currentIndex && !session.answers[questionId]);
  const finish = () => {
    if (summary.unanswered > 0 && !confirmFinish) { setConfirmFinish(true); return; }
    completeSession(session);
  };

  return (
    <section className="exam-session" aria-labelledby="question-heading">
      <div className="session-topbar">
        <button className="back-link" onClick={() => pauseSession(session)}><Pause size={18} /> 一時停止して戻る</button>
        <span>問題 {session.currentIndex + 1} / {session.questionIds.length}</span>
      </div>
      <div className="session-progress" aria-label={`${session.questionIds.length}問中${session.currentIndex + 1}問目`}><span style={{ width: `${((session.currentIndex + 1) / session.questionIds.length) * 100}%` }} /></div>

      <div className="question-layout">
        <article className="question-card">
          <div className="question-meta">
            <span>{feDomains[question.domain].shortLabel}</span>
            <span>{feUnitLabels[question.unitId]}</span>
            <span>公式過去問</span>
          </div>
          <p className="question-source-title">{question.title}</p>
          <h1 id="question-heading">{question.question}</h1>
          <div className="answer-options" role="radiogroup" aria-label="選択肢">
            {question.choices.map((choice) => {
              const isSelected = selected === choice.id;
              const isCorrect = answer && choice.id === question.correctAnswer;
              const isWrong = answer && isSelected && choice.id !== question.correctAnswer;
              return (
                <button
                  key={choice.id}
                  role="radio"
                  aria-checked={isSelected}
                  className={`${isSelected ? "is-selected" : ""} ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`}
                  disabled={Boolean(answer)}
                  onClick={() => persistSession(updateSessionDraft(session, question, choice.id))}
                >
                  <span>{choice.label}</span><strong>{choice.text}</strong>
                </button>
              );
            })}
          </div>

          {!answer ? (
            <button className="button button-primary answer-submit" disabled={!selected} onClick={() => persistSession(answerSessionQuestion(session, question, selected))}>回答を確定する</button>
          ) : (
            <div className={`answer-feedback ${answer.correct ? "is-correct" : "is-wrong"}`} role="status">
              <div className="feedback-title"><CheckCircle size={24} weight="fill" /><strong>{answer.correct ? "正解です" : `正答は「${question.correctAnswer}」です`}</strong></div>
              <p>{question.explanation}</p>
              <div className="source-links">
                <a href={question.sourceQuestionUrl} target="_blank" rel="noreferrer">IPA問題冊子 <ArrowUpRight size={15} /></a>
                <a href={question.sourceAnswerUrl} target="_blank" rel="noreferrer">IPA解答 <ArrowUpRight size={15} /></a>
              </div>
            </div>
          )}
          <div className="session-actions">
            <button className="button button-tertiary" disabled={session.currentIndex === 0} onClick={() => moveTo(session.currentIndex - 1)}><ArrowLeft size={18} /> 前の問題</button>
            <button className={`button review-toggle ${session.reviewQuestionIds.includes(question.id) ? "is-selected" : ""}`} aria-pressed={session.reviewQuestionIds.includes(question.id)} onClick={() => persistSession(toggleSessionReview(session, question.id))}><BookmarkSimple size={19} weight={session.reviewQuestionIds.includes(question.id) ? "fill" : "regular"} /> 見直し</button>
            {session.currentIndex < session.questionIds.length - 1 ? <button className="button button-secondary" onClick={() => moveTo(session.currentIndex + 1)}>次の問題 <ArrowRight size={18} /></button> : <button className="button button-secondary" onClick={finish}>演習を終了する</button>}
          </div>
          {confirmFinish && <div className="finish-confirm" role="alert"><strong>未回答が{summary.unanswered}問あります</strong><span>未回答のまま結果を保存できます。</span><div><button className="button button-tertiary" onClick={() => setConfirmFinish(false)}>続ける</button><button className="button button-primary" onClick={finish}>この内容で終了</button></div></div>}
        </article>

        <aside className="question-sidebar">
          <p className="section-kicker">Source</p>
          <h2>出典情報</h2>
          <dl><div><dt>試験</dt><dd>基本情報技術者試験</dd></div><div><dt>区分</dt><dd>科目A</dd></div><div><dt>問題</dt><dd>{question.sourceRef}</dd></div></dl>
          <span className="official-badge"><ShieldCheck size={18} weight="fill" /> IPA公式資料</span>
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
  return <section className="session-state" aria-labelledby="paused-heading"><Pause size={36} weight="fill" /><p className="eyebrow">Session paused</p><h1 id="paused-heading">演習を一時停止しました</h1><p>{Object.keys(session.answers).length}/{session.questionIds.length}問まで保存されています。</p><div><button className="button button-primary" onClick={() => persistSession(resumeFeSession(session))}>演習を再開する</button><button className="button button-tertiary" onClick={exitSession}>出題設定へ戻る</button></div></section>;
}

function MissingSession({ exitSession }) {
  return <section className="session-state" role="alert"><WarningCircle size={36} weight="fill" /><p className="eyebrow">Recovery</p><h1>再開できる演習が見つかりません</h1><p>出題設定から新しい演習を開始してください。</p><button className="button button-primary" onClick={exitSession}>出題設定へ</button></section>;
}

function ExamHistory({ sessions, resumeSession, openSession, retrySession, go, storageStatus, clearHistory }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const visible = sessions.filter((session) => session.status !== "abandoned");
  return (
    <section className="history-page" aria-labelledby="fe-history-heading">
      <div className="history-page-head"><p className="eyebrow">Learning history</p><h1 id="fe-history-heading">学習履歴</h1><p>演習の結果、途中経過、見直し対象を確認できます。</p></div>
      {storageStatus.recovered && <div className="state-banner is-warning" role="status"><WarningCircle size={22} weight="fill" /><span><strong>保存データを復旧しました</strong><small>読み取れないデータを除外して表示しています。</small></span></div>}
      {storageStatus.error && <div className="state-banner is-warning" role="alert"><WarningCircle size={22} weight="fill" /><span><strong>履歴を削除できませんでした</strong><small>接続を確認して、もう一度お試しください。</small></span></div>}
      <div className="storage-note"><ShieldCheck size={18} weight="fill" /><span>{storageStatus.source === "cloud" ? "この端末とクラウドに保存済み" : "この端末に保存済み（接続時に同期）"}</span></div>
      {visible.length === 0 ? (
        <div className="empty-history"><ChartBar size={38} /><h2>まだ演習履歴はありません</h2><p>公式過去問の演習を完了すると、結果と復習対象がここに保存されます。</p><button className="button button-primary" onClick={() => go("exam", "practice")}>演習を始める <ArrowRight size={18} /></button></div>
      ) : (
        <div className="session-history-list">
          {visible.map((session) => {
            const summary = calculateSessionSummary(session);
            return <article key={session.id} className="session-history-card"><div className="history-card-top"><span className={`status-pill is-${session.status}`}>{session.status === "completed" ? "完了" : session.status === "paused" ? "一時停止" : "進行中"}</span><time dateTime={session.updatedAt}>{formatDate(session.completedAt || session.updatedAt)}</time></div><h2>{session.config.type === "mock" ? "模擬セッション" : feDomains[session.config.domain]?.label}</h2><p>{session.config.periodLabel}・{scopeLabel(session.config.scope)}・{session.questionIds.length}問</p><div className="history-card-metrics"><span><small>正解</small><strong>{summary.correct}</strong></span><span><small>不正解</small><strong>{summary.incorrect}</strong></span><span><small>未回答</small><strong>{summary.unanswered}</strong></span>{session.status === "completed" && <span className="score"><small>得点</small><strong>{summary.score}%</strong></span>}</div><div className="history-card-actions">{session.status === "completed" ? <><button className="button button-secondary" onClick={() => openSession(session)}>結果を見る</button><button className="button button-tertiary" onClick={() => retrySession(session)}>再挑戦</button></> : <button className="button button-primary" onClick={() => resumeSession(session)}>再開する</button>}</div></article>;
          })}
        </div>
      )}
      {visible.length > 0 && !confirmClear && <button className="history-reset" onClick={() => setConfirmClear(true)}>学習履歴を削除する</button>}
      {confirmClear && <div className="history-clear-confirm" role="alert"><strong>すべての学習履歴を削除しますか？</strong><span>この操作は取り消せません。</span><div><button className="button button-tertiary" onClick={() => setConfirmClear(false)}>キャンセル</button><button className="button button-primary" onClick={clearHistory}>削除する</button></div></div>}
    </section>
  );
}

function CourseSiteIntro({ go, title, eyebrow, description }) {
  return (
    <div className="course-site-intro">
      <Breadcrumbs items={[{ label: "Japan Learning Lab", route: "japan" }, { label: "Engineer Learning Lab", route: "engineer" }, { label: title }]} go={go} />
      <div className="course-site-title"><span>{eyebrow}</span><strong>{title}</strong><p>{description}</p></div>
    </div>
  );
}

function ExamHome({ mode, view, go, notify, startSession, activeSession, sessions, resumeSession, persistSession, pauseSession, completeSession, retrySession, reviewSession, openSession, clearHistory, questionBank, bankStatus, retryBank, storageStatus }) {
  return (
    <main className="page page-dashboard course-site-page">
      {view !== "session" && <CourseSiteIntro go={go} title="FE Learning Lab" eyebrow="Fundamental Information Technology Engineer" description="試験範囲を体系的に学び、知識の定着を確認できます。" />}
      {view === "home" && <StudyModeNav route="exam" mode={mode} go={go} />}
      {mode === "lesson" && <ExamLesson notify={notify} />}
      {mode === "practice" && view === "home" && <ExamPractice startSession={startSession} resumeSession={resumeSession} activeSession={activeSession} sessions={sessions} questionBank={questionBank} bankStatus={bankStatus} retryBank={retryBank} />}
      {view === "history" && <ExamHistory sessions={sessions} resumeSession={resumeSession} openSession={openSession} retrySession={retrySession} go={go} storageStatus={storageStatus} clearHistory={clearHistory} />}
      {mode === "practice" && view === "session" && (
        <ExamSession
          key={activeSession?.id || "missing"}
          session={activeSession}
          questionBank={questionBank}
          persistSession={persistSession}
          pauseSession={pauseSession}
          completeSession={completeSession}
          retrySession={retrySession}
          reviewSession={reviewSession}
          exitSession={() => go("exam", "practice", "home")}
        />
      )}
    </main>
  );
}

function JavaLesson({ notify }) {
  return (
    <section className="java-course-list" aria-labelledby="java-heading">
      <div className="java-intro"><p className="eyebrow">Programming lessons</p><h1 tabIndex={-1}>Javaをレッスンで学ぶ</h1><p className="lead">基本文法から資格範囲まで、順番にステップアップできます。</p></div>
      <div className="section-heading-row"><h2 id="java-heading">Javaコース</h2><p>現在のレベルに合うコースから始めましょう。</p></div>
      <article className="java-course java-course-current"><span className="course-icon bronze"><Medal size={31} weight="fill" /></span><div className="java-course-copy"><span className="path-kicker">学習中のコース</span><h3>Java Bronze</h3><p><strong>次のレッスン</strong>　Lesson 1　Javaの基本</p></div><button className="button button-primary" onClick={() => notify("Java Bronze「Javaの基本」を開きました。") }><Play size={19} weight="fill" /> 学習を始める</button></article>
      <article className="java-course"><span className="course-icon silver"><Medal size={31} weight="fill" /></span><div className="java-course-copy"><span className="path-kicker">次のステップ</span><h3>Java Silver</h3><p>オブジェクト指向と標準APIを実践的に学びます。</p></div><button className="button button-tertiary" onClick={() => notify("Java Silverのコース概要を開きました。") }>コースを見る <ArrowUpRight size={18} /></button></article>
    </section>
  );
}

function JavaPractice({ notify }) {
  return (
    <section className="practice-surface">
      <div className="practice-heading"><p className="eyebrow">Java certification practice</p><h1 tabIndex={-1}>資格試験の演習・模試</h1><p className="lead">BronzeとSilverの出題範囲を、分野別演習と模試で確認します。</p></div>
      <div className="certification-groups">
        <section className="certification-group bronze-group">
          <div className="certification-title"><Medal size={30} weight="fill" /><div><span>Oracle Java Certification</span><h2>Java Bronze</h2></div></div>
          <div className="certification-actions"><button onClick={() => notify("Java Bronze 分野別演習を開始しました。")}><ListChecks size={22} /><span><strong>分野別演習</strong><small>文法・型・クラス</small></span><CaretRight size={18} /></button><button onClick={() => notify("Java Bronze 模擬試験を開始しました。")}><Exam size={22} /><span><strong>模擬試験</strong><small>全60問</small></span><CaretRight size={18} /></button></div>
        </section>
        <section className="certification-group silver-group">
          <div className="certification-title"><Medal size={30} weight="fill" /><div><span>Oracle Java Certification</span><h2>Java Silver</h2></div></div>
          <div className="certification-actions"><button onClick={() => notify("Java Silver 分野別演習を開始しました。")}><ListChecks size={22} /><span><strong>分野別演習</strong><small>API・継承・例外</small></span><CaretRight size={18} /></button><button onClick={() => notify("Java Silver 模擬試験を開始しました。")}><Exam size={22} /><span><strong>模擬試験</strong><small>全80問</small></span><CaretRight size={18} /></button></div>
        </section>
      </div>
    </section>
  );
}

function JavaHome({ mode, go, notify }) {
  return (
    <main className="page course-site-page">
      <CourseSiteIntro go={go} title="Java Learning Lab" eyebrow="Java programming" description="基本文法から資格範囲まで、段階的に学べます。" />
      <StudyModeNav route="java" mode={mode} go={go} />
      {mode === "lesson" ? <JavaLesson notify={notify} /> : <JavaPractice notify={notify} />}
      <button className="back-link" onClick={() => go("engineer")}><ArrowLeft size={18} /> Engineer Learning Labへ戻る</button>
    </main>
  );
}

function SiteFooter({ route, go }) {
  const meta = siteMeta(route);
  return (
    <footer className="site-footer">
      <span>{meta.brand}</span>
      <button onClick={() => go("japan")}><span>Japan Learning Lab Network</span><ArrowUpRight size={17} /></button>
    </footer>
  );
}

export function App() {
  const [initial] = useState(readLocation);
  const [route, setRoute] = useState(initial.route);
  const [mode, setMode] = useState(initial.mode);
  const [view, setView] = useState(initial.view);
  const [notice, setNotice] = useState("");
  const [feQuestionBank, setFeQuestionBank] = useState(feQuestions);
  const [feBankStatus, setFeBankStatus] = useState("loading");
  const [bankReload, setBankReload] = useState(0);
  const [feSessions, setFeSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [storageStatus, setStorageStatus] = useState({ source: "device", recovered: false, ready: false });
  const noticeTimer = useRef(null);
  const [sessionStore] = useState(createFeSessionStore);
  const loadedStoreFor = useRef("");
  const isQaCapture = new URLSearchParams(window.location.search).get("qaCapture") === "1";
  const activeSession = feSessions.find((session) => session.id === activeSessionId) || null;

  const go = (nextRoute, nextMode = "lesson", nextView = "home") => {
    setRoute(nextRoute);
    setMode(nextMode);
    setView(nextView);
    setNotice("");
    window.history.pushState({}, "", resilientUrl(pathFor(nextRoute, nextMode, nextView)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const persistSession = (session, baseSessions = feSessions) => {
    const saved = sessionStore.save(session, baseSessions);
    setFeSessions(saved.sessions);
    setActiveSessionId(session.id);
    return session;
  };

  const abandonActiveSessions = (baseSessions = feSessions) => {
    let nextSessions = baseSessions;
    for (const session of baseSessions.filter((item) => ["in_progress", "paused"].includes(item.status))) {
      nextSessions = sessionStore.save(abandonFeSession(session), nextSessions).sessions;
    }
    return nextSessions;
  };

  const startSession = (config) => {
    const questions = selectPracticeQuestions(config, feQuestionBank, feSessions);
    if (questions.length === 0) return;
    const baseSessions = abandonActiveSessions();
    const session = createFeSession({ config, questions });
    persistSession(session, baseSessions);
    go("exam", "practice", "session");
  };

  const resumeSession = (session) => {
    persistSession(session.status === "paused" ? resumeFeSession(session) : session);
    go("exam", "practice", "session");
  };

  const pauseSession = (session) => {
    persistSession(pauseFeSession(session));
    go("exam", "practice", "home");
  };

  const completeSession = (session) => persistSession(completeFeSession(session));

  const retrySession = (sourceSession) => {
    const questionMap = new Map(feQuestionBank.map((question) => [question.id, question]));
    const questions = sourceSession.questionIds.map((questionId) => questionMap.get(questionId)).filter(Boolean);
    const baseSessions = abandonActiveSessions();
    const session = createFeSession({ config: { ...sourceSession.config, count: questions.length }, questions });
    persistSession(session, baseSessions);
    go("exam", "practice", "session");
  };

  const reviewSession = (sourceSession, questionIds) => {
    const requested = new Set(questionIds);
    const questions = feQuestionBank.filter((question) => requested.has(question.id));
    const baseSessions = abandonActiveSessions();
    const session = createFeSession({ config: { ...sourceSession.config, scope: "incorrect", count: questions.length }, questions });
    persistSession(session, baseSessions);
    go("exam", "practice", "session");
  };

  const openSession = (session) => {
    setActiveSessionId(session.id);
    go("exam", "practice", "session");
  };

  const clearHistory = async () => {
    try {
      await sessionStore.clear();
      setFeSessions([]);
      setActiveSessionId(null);
      setStorageStatus((current) => ({ ...current, source: "device", error: false }));
    } catch {
      setStorageStatus((current) => ({ ...current, error: true }));
    }
  };

  const notify = (message) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
  };

  useEffect(() => {
    const currentPath = pathFor(initial.route, initial.mode, initial.view);
    window.history.replaceState({}, "", resilientUrl(currentPath));
    const onPopState = () => {
      const current = readLocation();
      setRoute(current.route);
      setMode(current.mode);
      setView(current.view);
      setNotice("");
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.clearTimeout(noticeTimer.current);
    };
  }, [initial.mode, initial.route, initial.view]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/fe-official-past-questions.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`FE question bank request failed: ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        const questions = payload?.questions;
        const isValid = Array.isArray(questions) && questions.length > 0 && questions.every((question) => (
          question.sourceType === "official-past-question"
          && question.choices?.length === 4
          && question.choices.some((choice) => choice.id === question.correctAnswer)
        ));
        if (!isValid) throw new Error("FE question bank validation failed");
        setFeQuestionBank(questions);
        setFeBankStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setFeBankStatus("error");
      });
    return () => controller.abort();
  }, [bankReload]);

  useEffect(() => {
    if (!["ready", "error"].includes(feBankStatus)) return;
    const signature = `${feBankStatus}:${feQuestionBank.length}`;
    if (loadedStoreFor.current === signature) return;
    loadedStoreFor.current = signature;
    sessionStore.list(feQuestionBank).then((result) => {
      setFeSessions(result.sessions);
      setStorageStatus({ source: result.source, recovered: result.recovered, ready: true });
      const routeState = readLocation();
      const recoverable = result.sessions.find((session) => ["in_progress", "paused"].includes(session.status));
      const completed = routeState.view === "session" ? result.sessions.find((session) => session.status === "completed") : null;
      if (recoverable || completed) setActiveSessionId((recoverable || completed).id);
    });
  }, [feBankStatus, feQuestionBank, sessionStore]);

  return (
    <div className={`app-shell theme-${siteMeta(route).accent} ${view === "session" ? "is-session" : ""} ${isQaCapture ? "qa-capture" : ""}`}>
      <Header route={route} mode={mode} view={view} go={go} notify={notify} />
      {notice && <div className="notice" role="status"><CheckCircle size={21} weight="fill" /><span>{notice}</span></div>}
      {route === "japan" && <JapanHome go={go} notify={notify} />}
      {route === "engineer" && <EngineerHome go={go} />}
      {route === "exam" && (
        <ExamHome
          mode={mode}
          view={view}
          go={go}
          notify={notify}
          startSession={startSession}
          activeSession={activeSession}
          sessions={feSessions}
          resumeSession={resumeSession}
          persistSession={persistSession}
          pauseSession={pauseSession}
          completeSession={completeSession}
          retrySession={retrySession}
          reviewSession={reviewSession}
          openSession={openSession}
          clearHistory={clearHistory}
          questionBank={feQuestionBank}
          bankStatus={feBankStatus}
          retryBank={() => { setFeBankStatus("loading"); setBankReload((value) => value + 1); }}
          storageStatus={storageStatus}
        />
      )}
      {route === "java" && <JavaHome mode={mode} go={go} notify={notify} />}
      <SiteFooter route={route} go={go} />
    </div>
  );
}
