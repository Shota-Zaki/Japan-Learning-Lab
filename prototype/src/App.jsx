import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CaretRight,
  Certificate,
  ChartBar,
  CheckCircle,
  Code,
  Compass,
  Coffee,
  Database,
  Exam,
  Globe,
  House,
  ListChecks,
  LockKey,
  MagnifyingGlass,
  MapTrifold,
  Medal,
  Monitor,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  SquaresFour,
  Stack,
  Trophy,
  UserCircle,
} from "@phosphor-icons/react";
import { FE_DATASET_META, feDomains, feQuestions, feUnitLabels } from "./data/feQuestions.js";

const labs = [
  { name: "Engineer Learning Lab", description: "エンジニア資格・プログラミング", icon: Code, route: "engineer", primary: true },
  { name: "Business Learning Lab", description: "ビジネススキル・マネジメント", icon: Briefcase },
  { name: "Security Learning Lab", description: "セキュリティ・ITガバナンス", icon: ShieldCheck },
  { name: "Data Learning Lab", description: "データサイエンス・AI", icon: ChartBar },
];

const weakAreas = [
  { name: "ネットワーク", value: 56, icon: Globe },
  { name: "データベース", value: 63, icon: Database },
  { name: "情報セキュリティ", value: 71, icon: LockKey },
];

const routePaths = {
  japan: "/",
  engineer: "/engineer/",
  exam: {
    lesson: "/engineer/it-exam/lessons/",
    practice: "/engineer/it-exam/practice/",
    session: "/engineer/it-exam/practice/session/",
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

  const path = window.location.pathname;
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
  return typeof entry === "string" ? entry : entry[mode];
}

function siteMeta(route) {
  if (route === "exam") return { brand: "FE Learning Lab", home: "exam", accent: "exam" };
  if (route === "java") return { brand: "Java Learning Lab", home: "java", accent: "java" };
  if (route === "engineer") return { brand: "Engineer Learning Lab", home: "engineer", accent: "engineer" };
  return { brand: "Japan Learning Lab", home: "japan", accent: "japan" };
}

function Header({ route, mode, go, notify }) {
  const meta = siteMeta(route);
  const courseSite = route === "exam" || route === "java";
  const items = courseSite
    ? [
        { label: "レッスン", icon: BookOpen, route, mode: "lesson" },
        { label: "演習・模試", icon: Exam, route, mode: "practice" },
        { label: "Engineer Lab", icon: Compass, route: "engineer" },
        { label: "学習履歴", icon: ChartBar, action: () => notify("学習履歴はプロトタイプではプレビュー表示です。") },
      ]
    : route === "engineer"
      ? [
          { label: "ホーム", icon: House, route: "engineer", active: true },
          { label: "資格試験", icon: Certificate, route: "exam" },
          { label: "Java", icon: Coffee, route: "java" },
          { label: "学習履歴", icon: ChartBar, action: () => notify("学習履歴はプロトタイプではプレビュー表示です。") },
        ]
      : [
          { label: "ホーム", icon: House, route: "japan", active: true },
          { label: "Learning Labs", icon: SquaresFour, route: "japan" },
          { label: "学習履歴", icon: ChartBar, action: () => notify("学習履歴はプロトタイプではプレビュー表示です。") },
        ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => go(meta.home, "lesson")}>{meta.brand}</button>
        <nav className="global-nav" aria-label="グローバルナビゲーション">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.active === true || (item.mode && item.route === route && item.mode === mode);
            return (
              <button
                className={`nav-item ${active ? "is-active" : ""}`}
                key={item.label}
                onClick={() => item.action ? item.action() : go(item.route, item.mode || "lesson")}
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
            <h1 tabIndex="-1">学びたい分野から、<br />自分の道をつくる。</h1>
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
            <h1 tabIndex="-1">エンジニアの学びを、<br />次の実力へ。</h1>
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

function ProgressSummary() {
  return (
    <div className="progress-summary" aria-label="レッスン進捗68パーセント">
      <div className="progress-number"><strong>68</strong><span>%</span></div>
      <span>レッスン進捗</span>
      <progress value="68" max="100">68%</progress>
    </div>
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
          <p className="eyebrow">前回の続き</p>
          <h1 tabIndex="-1">基本情報技術者試験</h1>
          <p className="course-category">アルゴリズムとデータ構造</p>
          <div className="lesson-line"><BookOpen size={22} /><strong>Lesson 3</strong><span>探索アルゴリズム</span></div>
          <div className="course-actions single-action">
            <button className="button button-primary" onClick={() => setLessonOpen(true)}><Play size={19} weight="fill" /> 学習を続ける</button>
          </div>
        </div>
        <ProgressSummary />
      </section>
      <div className="dashboard-grid">
        <section className="content-section weak-section" aria-labelledby="weak-heading">
          <div className="section-heading-row compact"><div><p className="section-kicker">Focus</p><h2 id="weak-heading">苦手分野</h2></div><button className="text-link" onClick={() => notify("苦手分野の詳細を開きました。") }>詳しく見る <CaretRight size={16} /></button></div>
          <div className="table-wrap"><table><thead><tr><th>分野</th><th>正答率</th></tr></thead><tbody>
            {weakAreas.map((area) => { const Icon = area.icon; return <tr key={area.name}><td><span className="topic-icon"><Icon size={19} /></span>{area.name}</td><td><strong>{area.value}%</strong></td></tr>; })}
          </tbody></table></div>
        </section>
        <section className="content-section review-section" aria-labelledby="review-heading">
          <p className="section-kicker">Review</p><h2 id="review-heading">復習待ち</h2><div className="review-count"><strong>8</strong><span>問</span></div>
          <p>間違えた問題を解き直します。</p>
          <button className="button button-secondary" onClick={() => notify("8問の復習セッションを開始しました。") }>復習を始める</button>
        </section>
      </div>
      <section className="history-section" aria-labelledby="history-heading">
        <div className="section-heading-row compact"><div><p className="section-kicker">Recent activity</p><h2 id="history-heading">学習履歴</h2></div></div>
        <div className="history-list">
          <div className="history-row"><span className="history-icon"><Globe size={20} /></span><span><small>2026/08/03</small><strong>ネットワーク講義</strong><span>IPアドレスとサブネット</span></span></div>
          <div className="history-row"><span className="history-icon"><Database size={20} /></span><span><small>2026/08/02</small><strong>データベース演習 15問</strong><span>正規化と関係モデル</span></span></div>
        </div>
      </section>
    </>
  );
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildPracticeQuestions(config) {
  const candidates = config.type === "mock"
    ? feQuestions
    : feQuestions.filter((question) => question.domain === config.domain);
  return shuffled(candidates).slice(0, config.type === "mock" ? 10 : 5);
}

function ExamPractice({ startSession }) {
  const [sessionType, setSessionType] = useState("topic");
  const [domain, setDomain] = useState("technology");
  const domainQuestionCount = feQuestions.filter((question) => question.domain === domain).length;

  return (
    <section className="practice-surface">
      <div className="practice-heading">
        <p className="eyebrow">Official past questions</p>
        <h1 tabIndex="-1">公式過去問で実力を確かめる</h1>
        <p className="lead">分野別の演習と、3分野を横断する模擬セッションを選べます。</p>
      </div>

      <div className="official-source-note">
        <span className="source-note-icon"><ShieldCheck size={24} weight="fill" /></span>
        <span><strong>収録問題は公式過去問のみ</strong><small>出典を問題ごとに表示し、IPAの問題冊子と解答へ移動できます。</small></span>
        <span className="source-count">{feQuestions.length}<small>問収録</small></span>
      </div>

      <div className="practice-builder">
        <section className="builder-panel" aria-labelledby="practice-type-heading">
          <div className="builder-heading"><span>01</span><div><p className="section-kicker">Session type</p><h2 id="practice-type-heading">取り組み方を選ぶ</h2></div></div>
          <div className="session-type-grid">
            <button className={sessionType === "topic" ? "is-selected" : ""} onClick={() => setSessionType("topic")}>
              <span className="practice-icon"><ListChecks size={26} /></span>
              <span><strong>分野別演習</strong><small>選んだ分野から5問</small></span>
              <CheckCircle size={21} weight={sessionType === "topic" ? "fill" : "regular"} />
            </button>
            <button className={sessionType === "mock" ? "is-selected" : ""} onClick={() => setSessionType("mock")}>
              <span className="practice-icon"><Trophy size={26} /></span>
              <span><strong>模擬セッション</strong><small>3分野を横断して10問</small></span>
              <CheckCircle size={21} weight={sessionType === "mock" ? "fill" : "regular"} />
            </button>
          </div>
        </section>

        <section className={`builder-panel ${sessionType === "mock" ? "is-muted" : ""}`} aria-labelledby="practice-domain-heading">
          <div className="builder-heading"><span>02</span><div><p className="section-kicker">Exam domain</p><h2 id="practice-domain-heading">出題分野を選ぶ</h2></div></div>
          <div className="domain-option-list">
            {Object.entries(feDomains).map(([key, value]) => {
              const count = feQuestions.filter((question) => question.domain === key).length;
              return (
                <button key={key} className={domain === key ? "is-selected" : ""} disabled={sessionType === "mock"} onClick={() => setDomain(key)}>
                  <span><strong>{value.label}</strong><small>{value.description}</small></span>
                  <span className="domain-count">{count}問</span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="session-summary" aria-label="出題設定">
          <div><SlidersHorizontal size={22} /><span><small>出題設定</small><strong>{sessionType === "mock" ? "模擬セッション" : feDomains[domain].label}</strong></span></div>
          <dl>
            <div><dt>問題数</dt><dd>{sessionType === "mock" ? 10 : Math.min(5, domainQuestionCount)}問</dd></div>
            <div><dt>問題形式</dt><dd>四肢択一</dd></div>
            <div><dt>出典</dt><dd>IPA公式過去問</dd></div>
          </dl>
          <button className="button button-primary" onClick={() => startSession({ type: sessionType === "mock" ? "mock" : "topic", domain })}>
            演習を開始する <ArrowRight size={19} />
          </button>
        </aside>
      </div>

      <p className="dataset-credit">Question data: <a href={FE_DATASET_META.sourceRepository} target="_blank" rel="noreferrer">Engineer-License-Lab <ArrowUpRight size={14} /></a></p>
    </section>
  );
}

function ExamResult({ questions, answers, restart, exitSession }) {
  const correctCount = answers.filter((answer) => answer.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const missed = answers.filter((answer) => !answer.correct);

  return (
    <section className="exam-result" aria-labelledby="result-heading">
      <div className="result-summary">
        <span className="result-icon"><Trophy size={34} weight="fill" /></span>
        <p className="eyebrow">Session complete</p>
        <h1 id="result-heading">演習結果</h1>
        <div className="result-score"><strong>{score}</strong><span>%</span></div>
        <p>{questions.length}問中 {correctCount}問正解</p>
      </div>
      <div className="result-detail">
        <div className="section-heading-row compact"><div><p className="section-kicker">Review</p><h2>振り返り</h2></div></div>
        {missed.length === 0 ? (
          <div className="perfect-result"><CheckCircle size={26} weight="fill" /><span><strong>全問正解です</strong><small>この調子で次の分野へ進みましょう。</small></span></div>
        ) : (
          <div className="missed-list">
            {missed.map((answer) => {
              const question = questions.find((item) => item.id === answer.questionId);
              return <div key={answer.questionId}><span>{feUnitLabels[question.unitId]}</span><strong>{question.title}</strong><small>正答 {question.correctAnswer}</small></div>;
            })}
          </div>
        )}
        <div className="result-actions">
          <button className="button button-primary" onClick={restart}>もう一度取り組む</button>
          <button className="button button-tertiary" onClick={exitSession}>出題設定へ戻る</button>
        </div>
      </div>
    </section>
  );
}

function ExamSession({ questions, restart, exitSession }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const question = questions[currentIndex];

  if (finished) return <ExamResult questions={questions} answers={answers} restart={restart} exitSession={exitSession} />;

  const submitAnswer = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    setAnswers((current) => [...current, { questionId: question.id, selected, correct: selected === question.correctAnswer }]);
  };

  const goNext = () => {
    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelected("");
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="exam-session" aria-labelledby="question-heading">
      <div className="session-topbar">
        <button className="back-link" onClick={exitSession}><ArrowLeft size={18} /> 出題設定へ戻る</button>
        <span>問題 {currentIndex + 1} / {questions.length}</span>
      </div>
      <div className="session-progress" aria-label={`${questions.length}問中${currentIndex + 1}問目`}><span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>

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
              const isCorrect = submitted && choice.id === question.correctAnswer;
              const isWrong = submitted && isSelected && choice.id !== question.correctAnswer;
              return (
                <button
                  key={choice.id}
                  role="radio"
                  aria-checked={isSelected}
                  className={`${isSelected ? "is-selected" : ""} ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`}
                  disabled={submitted}
                  onClick={() => setSelected(choice.id)}
                >
                  <span>{choice.label}</span><strong>{choice.text}</strong>
                </button>
              );
            })}
          </div>

          {!submitted ? (
            <button className="button button-primary answer-submit" disabled={!selected} onClick={submitAnswer}>回答する</button>
          ) : (
            <div className={`answer-feedback ${selected === question.correctAnswer ? "is-correct" : "is-wrong"}`} role="status">
              <div className="feedback-title"><CheckCircle size={24} weight="fill" /><strong>{selected === question.correctAnswer ? "正解です" : `正答は「${question.correctAnswer}」です`}</strong></div>
              <p>{question.explanation}</p>
              <div className="source-links">
                <a href={question.sourceQuestionUrl} target="_blank" rel="noreferrer">IPA問題冊子 <ArrowUpRight size={15} /></a>
                <a href={question.sourceAnswerUrl} target="_blank" rel="noreferrer">IPA解答 <ArrowUpRight size={15} /></a>
              </div>
              <button className="button button-primary" onClick={goNext}>{currentIndex === questions.length - 1 ? "結果を見る" : "次の問題へ"} <ArrowRight size={18} /></button>
            </div>
          )}
        </article>

        <aside className="question-sidebar">
          <p className="section-kicker">Source</p>
          <h2>出典情報</h2>
          <dl><div><dt>試験</dt><dd>基本情報技術者試験</dd></div><div><dt>区分</dt><dd>科目A</dd></div><div><dt>問題</dt><dd>{question.sourceRef}</dd></div></dl>
          <span className="official-badge"><ShieldCheck size={18} weight="fill" /> IPA公式資料</span>
        </aside>
      </div>
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

function ExamHome({ mode, view, go, notify, startSession, sessionQuestions, restartSession, sessionId }) {
  return (
    <main className="page page-dashboard course-site-page">
      <CourseSiteIntro go={go} title="FE Learning Lab" eyebrow="Fundamental Information Technology Engineer" description="試験範囲を体系的に学び、知識の定着を確認できます。" />
      <StudyModeNav route="exam" mode={mode} go={go} />
      {mode === "lesson" && <ExamLesson notify={notify} />}
      {mode === "practice" && view !== "session" && <ExamPractice startSession={startSession} />}
      {mode === "practice" && view === "session" && (
        <ExamSession
          key={sessionId}
          questions={sessionQuestions}
          restart={restartSession}
          exitSession={() => go("exam", "practice", "home")}
        />
      )}
    </main>
  );
}

function JavaLesson({ notify }) {
  return (
    <section className="java-course-list" aria-labelledby="java-heading">
      <div className="java-intro"><p className="eyebrow">Programming lessons</p><h1 tabIndex="-1">Javaをレッスンで学ぶ</h1><p className="lead">基本文法から資格範囲まで、順番にステップアップできます。</p></div>
      <div className="section-heading-row"><h2 id="java-heading">Javaコース</h2><p>現在のレベルに合うコースから始めましょう。</p></div>
      <article className="java-course java-course-current"><span className="course-icon bronze"><Medal size={31} weight="fill" /></span><div className="java-course-copy"><span className="path-kicker">学習中のコース</span><h3>Java Bronze</h3><p><strong>次のレッスン</strong>　Lesson 1　Javaの基本</p></div><button className="button button-primary" onClick={() => notify("Java Bronze「Javaの基本」を開きました。") }><Play size={19} weight="fill" /> 学習を始める</button></article>
      <article className="java-course"><span className="course-icon silver"><Medal size={31} weight="fill" /></span><div className="java-course-copy"><span className="path-kicker">次のステップ</span><h3>Java Silver</h3><p>オブジェクト指向と標準APIを実践的に学びます。</p></div><button className="button button-tertiary" onClick={() => notify("Java Silverのコース概要を開きました。") }>コースを見る <ArrowUpRight size={18} /></button></article>
    </section>
  );
}

function JavaPractice({ notify }) {
  return (
    <section className="practice-surface">
      <div className="practice-heading"><p className="eyebrow">Java certification practice</p><h1 tabIndex="-1">資格試験の演習・模試</h1><p className="lead">BronzeとSilverの出題範囲を、分野別演習と模試で確認します。</p></div>
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
  const initial = readLocation();
  const [route, setRoute] = useState(initial.route);
  const [mode, setMode] = useState(initial.mode);
  const [view, setView] = useState(initial.view);
  const [notice, setNotice] = useState("");
  const initialSessionConfig = { type: "mock", domain: "technology" };
  const [sessionConfig, setSessionConfig] = useState(initialSessionConfig);
  const [sessionQuestions, setSessionQuestions] = useState(() => initial.view === "session" ? buildPracticeQuestions(initialSessionConfig) : []);
  const [sessionId, setSessionId] = useState(0);
  const noticeTimer = useRef(null);
  const isQaCapture = new URLSearchParams(window.location.search).get("qaCapture") === "1";

  const go = (nextRoute, nextMode = "lesson", nextView = "home") => {
    setRoute(nextRoute);
    setMode(nextMode);
    setView(nextView);
    setNotice("");
    window.history.pushState({}, "", pathFor(nextRoute, nextMode, nextView));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startSession = (config) => {
    setSessionConfig(config);
    setSessionQuestions(buildPracticeQuestions(config));
    setSessionId((current) => current + 1);
    go("exam", "practice", "session");
  };

  const restartSession = () => {
    setSessionQuestions(buildPracticeQuestions(sessionConfig));
    setSessionId((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notify = (message) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className={`app-shell theme-${siteMeta(route).accent} ${isQaCapture ? "qa-capture" : ""}`}>
      <Header route={route} mode={mode} go={go} notify={notify} />
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
          sessionQuestions={sessionQuestions}
          restartSession={restartSession}
          sessionId={sessionId}
        />
      )}
      {route === "java" && <JavaHome mode={mode} go={go} notify={notify} />}
      <SiteFooter route={route} go={go} />
    </div>
  );
}
