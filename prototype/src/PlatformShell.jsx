import { ArrowRight, ArrowUpRight, BookOpen, ChartBar, Code, Coffee, Compass, Exam, House, Monitor, SquaresFour } from "@phosphor-icons/react";

export function PlatformHeader({ screen, tab, navigate }) {
  const brand = screen === "fe" ? "FE Learning Lab" : screen === "engineer" ? "Engineer Learning Lab" : "Japan Learning Lab";
  const items = screen === "fe"
    ? [["レッスン", BookOpen, "fe", "lesson"], ["演習・模試", Exam, "fe", "practice"], ["学習履歴", ChartBar, "fe", "history"], ["Engineer Lab", Compass, "engineer", "home"]]
    : screen === "engineer"
      ? [["ホーム", House, "engineer", "home"], ["FE", Monitor, "fe", "lesson"], ["Japan Lab", SquaresFour, "japan", "home"]]
      : [["ホーム", House, "japan", "home"], ["Engineer Lab", Code, "engineer", "home"]];
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate(screen === "fe" ? "fe" : screen, screen === "fe" ? "lesson" : "home")}>{brand}</button>
        <nav className="global-nav" aria-label="グローバルナビゲーション">
          {items.map(([label, Icon, target, targetTab]) => {
            const active = target === screen && (target !== "fe" || targetTab === tab);
            return <button className={`nav-item ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} key={label} onClick={() => navigate(target, targetTab)}><Icon size={19} /><span>{label}</span></button>;
          })}
        </nav>
      </div>
    </header>
  );
}

export function JapanHome({ navigate }) {
  return (
    <main className="platform-main">
      <section className="platform-hero">
        <div className="platform-hero-inner">
          <div className="platform-copy"><p className="eyebrow">A platform for continuous learning</p><h1>学びたい分野から、<br />自分の道をつくる。</h1><p className="lead">興味や目標に合う分野を見つけて、今日から学習を始められます。</p><button className="button button-primary platform-cta" onClick={() => navigate("engineer")}>Engineer Learning Labへ <ArrowRight size={19} /></button></div>
          <aside className="structure-panel"><div className="structure-heading"><span>学習の始め方</span><Compass size={24} /></div><div className="structure-list"><div className="structure-row"><span className="structure-index">01</span><span className="structure-icon"><SquaresFour size={22} /></span><span><small>Step 1</small><strong>学びたい分野を選ぶ</strong></span></div><div className="structure-row"><span className="structure-index">02</span><span className="structure-icon"><Compass size={22} /></span><span><small>Step 2</small><strong>コースを見つける</strong></span></div><div className="structure-row"><span className="structure-index">03</span><span className="structure-icon"><BookOpen size={22} /></span><span><small>Step 3</small><strong>学習を始める</strong></span></div></div></aside>
        </div>
      </section>
      <section className="page lab-directory"><div className="section-intro"><span className="section-number">01</span><div><p className="section-kicker">Learning Labs</p><h2>専門分野の入口</h2></div><p>身につけたい知識やスキルから、学習分野を選んでください。</p></div><div className="lab-grid"><button className="lab-tile lab-tile-primary" onClick={() => navigate("engineer")}><span className="lab-tile-top"><span className="lab-icon"><Code size={30} /></span><span className="lab-state">Open</span></span><span className="lab-copy"><strong>Engineer Learning Lab</strong><small>エンジニア資格・プログラミング</small></span><span className="lab-action">サイトを開く <ArrowUpRight size={18} /></span></button></div></section>
    </main>
  );
}

export function EngineerHome({ navigate }) {
  return (
    <main className="platform-main">
      <section className="engineer-masthead"><div className="page masthead-grid"><div className="engineer-copy"><p className="eyebrow">Engineer Learning Lab</p><h1>エンジニアの学びを、<br />次の実力へ。</h1><p className="lead">資格取得と開発スキルの向上に向けて、自分に合うコースを選べます。</p></div><aside className="engineer-index"><p className="section-kicker">Course index</p><div className="index-stat"><strong>2</strong><span>コース</span></div><div className="index-divider" /><div className="index-methods"><span><Monitor size={20} /> 資格試験</span><span><Coffee size={20} /> Java</span></div></aside></div></section>
      <section className="page course-directory"><div className="section-intro"><span className="section-number">01</span><div><p className="section-kicker">Course sites</p><h2>学習サイトを選ぶ</h2></div><p>目標に合うコースを選んで、学習を始めましょう。</p></div><div className="course-site-grid"><article className="course-site-card exam-card"><div className="course-site-head"><span className="course-site-icon"><Monitor size={36} /></span><span>資格試験</span></div><h3>FE Learning Lab</h3><p>科目A・科目Bを、レッスンと複数条件の公式問題演習で学習します。</p><div className="course-method-list"><span><BookOpen size={18} /> レッスン</span><span><Exam size={18} /> 演習・模試</span></div><button className="button course-site-link" onClick={() => navigate("fe", "lesson")}>サイトを開く <ArrowRight size={19} /></button></article><article className="course-site-card java-card is-paused"><div className="course-site-head"><span className="course-site-icon java-coffee-icon"><Coffee size={36} weight="fill" /></span><span>作業停止中</span></div><h3>Java Learning Lab</h3><p>FE Learning Labの完成確認が終わるまで、設計・実装を停止しています。</p><button className="button button-tertiary" disabled>現在は開始しない</button></article></div></section>
    </main>
  );
}
