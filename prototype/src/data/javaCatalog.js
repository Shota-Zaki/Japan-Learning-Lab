export const JAVA_CATALOG_SCHEMA_VERSION = 1;

export const JAVA_SOURCE_SNAPSHOT = Object.freeze({
  repository: "Shota-Zaki/Engineer-License-Lab",
  ref: "main",
  path: "docs/java/data/questions.js",
  sourceVersion: "v173-java-bronze-explanation-quality",
  auditedAt: "2026-08-06",
});

export const javaCourses = Object.freeze({
  bronze: Object.freeze({
    id: "bronze",
    label: "Java Bronze",
    status: "implementation_ready",
    accent: "orange",
    practiceQuestionCount: 107,
    mockQuestionCount: 120,
  }),
  silver17: Object.freeze({
    id: "silver17",
    label: "Java Silver SE 17",
    status: "data_audit_in_progress",
    accent: "silver",
    practiceQuestionCount: null,
    mockQuestionCount: null,
  }),
});

export const javaBronzeUnits = Object.freeze([
  Object.freeze({ id: "bronze-p1", title: "基本文法", questionCount: 34, description: "Javaの実行、main、変数、型、条件分岐" }),
  Object.freeze({ id: "bronze-p3", title: "条件分岐・配列", questionCount: 22, description: "if、switch、for、配列、Stringの基本" }),
  Object.freeze({ id: "bronze-p5", title: "クラスとメソッド", questionCount: 20, description: "クラス定義、フィールド、メソッド、this、static" }),
  Object.freeze({ id: "bronze-p2", title: "オブジェクト基礎", questionCount: 31, description: "配列、クラス、フィールド、メソッド、基本API" }),
]);

export const javaBronzeMocks = Object.freeze([
  Object.freeze({ id: "bronze-exam-a", title: "模試A", questionCount: 60 }),
  Object.freeze({ id: "bronze-exam-b", title: "模試B", questionCount: 60 }),
]);

export function javaCatalogTotals() {
  return {
    bronzePractice: javaBronzeUnits.reduce((sum, unit) => sum + unit.questionCount, 0),
    bronzeMock: javaBronzeMocks.reduce((sum, mock) => sum + mock.questionCount, 0),
  };
}

export function getJavaCourse(courseId) {
  return javaCourses[courseId] || null;
}

export function getJavaBronzeUnit(unitId) {
  return javaBronzeUnits.find((unit) => unit.id === unitId) || null;
}
