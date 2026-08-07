import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CaretRight,
  CheckCircle,
  Exam,
  ListChecks,
  Play,
} from "@phosphor-icons/react";
import { FeRichContent } from "./FeRichContent.jsx";
import { getFeLessonById } from "./data/feLessons.js";

const lesson = getFeLessonById("subject-b-trace-basics");

function LessonModeNav({ navigate }) {
  return (
    <nav className="study-mode-nav fe-mode-nav" aria-label="FE Learning Labの機能">
      <button className="is-active" aria-current="page" onClick={() => navigate("lesson", "home")}>
        <span className="mode-icon"><BookOpen size={24} /></span>
        <span><small>Learn</small><strong>レッスン</strong></span>
      </button>
      <button onClick={() => navigate("practice", "home")}>
        <span className="mode-icon"><Exam size={24} /></span>
        <span><small>Practice</small><strong>演習・模試</strong></span>
      </button>
      <button onClick={() => navigate("history", "home")}>
        <span className="mode-icon"><ListChecks size={24} /></span>
        <span><small>History</small><strong>学習履歴</strong></span>
      </button>
    </nav>
  );
}

function LessonOverview({ openLesson }) {
  return (
    <section className="fe-lesson-home" aria-labelledby="fe-lesson-heading">
      <div className="fe-page-heading">
        <p className="eyebrow">FE lessons</p>
        <h1 id="fe-lesson-heading">最初のレッスン：擬似言語の変数を追う</h1>
        <p>科目Bのプログラム問題を読む土台として、代入・繰返し・変数の変化を順番に整理します。</p>
      </div>

      <div className="fe-lesson-overview-grid">
        <article className="fe-lesson-feature">
          <div className="fe-lesson-meta">
            <span>Lesson {lesson.number}</span>
            <span>科目{lesson.subject}</span>
            <span>{lesson.domain}</span>
          </div>
          <h2>{lesson.title}</h2>
          <p>{lesson.summary}</p>

          <section className="fe-lesson-objectives" aria-labelledby="lesson-objectives-heading">
            <h3 id="lesson-objectives-heading">このレッスンの到達目標</h3>
            <ul>
              {lesson.objectives.map((objective) => <li key={objective}><CheckCircle size={19} weight="fill" /><span>{objective}</span></li>)}
            </ul>
          </section>

          <button className="button button-primary fe-lesson-start" onClick={openLesson}>
            <Play size={19} weight="fill" /> レッスンを始める
          </button>
        </article>

        <aside className="fe-lesson-outline" aria-labelledby="lesson-outline-heading">
          <div className="fe-lesson-outline-heading"><ListChecks size={22} /><h2 id="lesson-outline-heading">学習の順序</h2></div>
          <ol>
            {lesson.outline.map((step, index) => (
              <li key={step.id}>
                <span className="fe-lesson-step-number">{String(index + 1).padStart(2, "0")}</span>
                <span><strong>{step.label}</strong><small>{step.description}</small></span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function LessonReader({ closeLesson }) {
  const [answer, setAnswer] = useState("");
  const submitted = Boolean(answer);
  const correct = answer === lesson.check.correctChoiceId;

  return (
    <section className="fe-lesson-reader" aria-labelledby="fe-lesson-reader-heading">
      <button className="back-link fe-lesson-reader-back" onClick={closeLesson}><ArrowLeft size={18} /> レッスン概要へ戻る</button>

      <header className="fe-lesson-reader-head">
        <div className="fe-lesson-meta">
          <span>Lesson {lesson.number}</span>
          <span>科目{lesson.subject}</span>
          <span>{lesson.domain}</span>
        </div>
        <h1 id="fe-lesson-reader-heading">{lesson.title}</h1>
        <p>{lesson.summary}</p>
        <div className="fe-lesson-reader-goals" aria-label="到達目標">
          {lesson.objectives.map((objective) => <span key={objective}><CheckCircle size={17} weight="fill" />{objective}</span>)}
        </div>
      </header>

      <div className="fe-lesson-reader-layout">
        <article className="fe-lesson-reader-body">
          {lesson.sections.map((section) => (
            <section className="fe-lesson-section" id={`lesson-${section.id}`} key={section.id} aria-labelledby={`lesson-${section.id}-heading`}>
              <p className="section-kicker">{section.kicker}</p>
              <h2 id={`lesson-${section.id}-heading`}>{section.title}</h2>
              <FeRichContent blocks={section.blocks} />
            </section>
          ))}

          <section className="fe-lesson-check" aria-labelledby="fe-lesson-check-heading">
            <p className="section-kicker">Knowledge check</p>
            <h2 id="fe-lesson-check-heading">確認問題</h2>
            <p className="fe-lesson-check-prompt">{lesson.check.prompt}</p>
            <div className="fe-lesson-check-options">
              {lesson.check.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  type="button"
                  className={answer === choice.id ? "is-selected" : ""}
                  aria-pressed={answer === choice.id}
                  disabled={submitted}
                  onClick={() => setAnswer(choice.id)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <strong>{choice.label}</strong>
                </button>
              ))}
            </div>

            {submitted && (
              <div className={`fe-lesson-check-result ${correct ? "is-correct" : "is-wrong"}`} role="status">
                <CheckCircle size={24} weight="fill" />
                <div>
                  <strong>{correct ? "正解です" : "もう一度、2回目までの値を追ってみましょう"}</strong>
                  <p>{lesson.check.explanation}</p>
                </div>
              </div>
            )}

            {submitted && (
              <div className="fe-lesson-check-actions">
                <button className="button button-tertiary" onClick={() => setAnswer("")}>もう一度確認する</button>
                <button className="button button-primary" onClick={closeLesson}>レッスン概要へ戻る <ArrowRight size={18} /></button>
              </div>
            )}
          </section>
        </article>

        <nav className="fe-lesson-section-nav" aria-label="レッスン内ナビゲーション">
          <strong>このレッスン</strong>
          {lesson.outline.map((step, index) => (
            <a href={`#lesson-${step.id}`} key={step.id}><span>{index + 1}</span>{step.label}<CaretRight size={15} /></a>
          ))}
          <a href="#fe-lesson-check-heading"><span>{lesson.outline.length + 1}</span>確認問題<CaretRight size={15} /></a>
        </nav>
      </div>
    </section>
  );
}

export function FeLessonApp({ navigate, goEngineer }) {
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <main className="page course-site-page fe-v5 fe-lesson-app">
      <div className="course-site-intro">
        <nav className="breadcrumbs" aria-label="パンくずリスト"><button onClick={goEngineer}>Engineer Learning Lab</button><span>›</span><span aria-current="page">FE Learning Lab</span></nav>
        <div className="course-site-title">
          <span>Fundamental Information Technology Engineer</span>
          <strong>FE Learning Lab</strong>
          <p>科目A・科目Bの知識をレッスンで整理し、演習・模試で理解を確認できます。</p>
        </div>
      </div>

      <LessonModeNav navigate={navigate} />
      {readerOpen
        ? <LessonReader closeLesson={() => { setReaderOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        : <LessonOverview openLesson={() => { setReaderOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}

      <button className="back-link fe-back-engineer" onClick={goEngineer}><ArrowLeft size={18} /> Engineer Learning Labへ戻る</button>
    </main>
  );
}
