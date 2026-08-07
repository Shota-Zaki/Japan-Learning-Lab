export const FE_UNIT_LABELS = {
  "algorithm-design": { label: "アルゴリズム設計", parts: ["アルゴリズム", "設計"] },
  "algorithm-programming-basics": { label: "アルゴリズム・プログラミング基礎", parts: ["アルゴリズム・", "プログラミング基礎"] },
  arrays: { label: "配列", parts: ["配列"] },
  "basic-theory": { label: "基礎理論", parts: ["基礎理論"] },
  "business-industry": { label: "ビジネスインダストリ", parts: ["ビジネス", "インダストリ"] },
  "business-strategy": { label: "経営戦略", parts: ["経営戦略"] },
  complexity: { label: "計算量", parts: ["計算量"] },
  "computer-components": { label: "コンピュータ構成要素", parts: ["コンピュータ", "構成要素"] },
  conditionals: { label: "条件分岐", parts: ["条件分岐"] },
  "corporate-activity": { label: "企業活動", parts: ["企業活動"] },
  database: { label: "データベース", parts: ["データベース"] },
  "functions-procedures": { label: "関数・手続", parts: ["関数・", "手続"] },
  hardware: { label: "ハードウェア", parts: ["ハードウェア"] },
  "human-interface": { label: "ヒューマンインタフェース", parts: ["ヒューマン", "インタフェース"] },
  "information-security": { label: "情報セキュリティ", parts: ["情報", "セキュリティ"] },
  law: { label: "法務", parts: ["法務"] },
  lists: { label: "リスト", parts: ["リスト"] },
  loops: { label: "繰返し", parts: ["繰返し"] },
  multimedia: { label: "マルチメディア", parts: ["マルチメディア"] },
  network: { label: "ネットワーク", parts: ["ネットワーク"] },
  "program-trace": { label: "プログラムトレース", parts: ["プログラム", "トレース"] },
  "project-management": { label: "プロジェクトマネジメント", parts: ["プロジェクト", "マネジメント"] },
  queue: { label: "キュー", parts: ["キュー"] },
  recursion: { label: "再帰", parts: ["再帰"] },
  search: { label: "探索", parts: ["探索"] },
  security: { label: "セキュリティ", parts: ["セキュリティ"] },
  "service-management": { label: "サービスマネジメント", parts: ["サービス", "マネジメント"] },
  software: { label: "ソフトウェア", parts: ["ソフトウェア"] },
  "software-development-management": { label: "ソフトウェア開発管理", parts: ["ソフトウェア", "開発管理"] },
  sorting: { label: "整列", parts: ["整列"] },
  stack: { label: "スタック", parts: ["スタック"] },
  "string-processing": { label: "文字列処理", parts: ["文字列", "処理"] },
  "system-audit": { label: "システム監査", parts: ["システム", "監査"] },
  "system-components": { label: "システム構成要素", parts: ["システム", "構成要素"] },
  "system-development": { label: "システム開発", parts: ["システム", "開発"] },
  "system-planning": { label: "システム企画", parts: ["システム", "企画"] },
  "system-strategy": { label: "システム戦略", parts: ["システム", "戦略"] },
  "technology-strategy": { label: "技術戦略マネジメント", parts: ["技術戦略", "マネジメント"] },
  trees: { label: "木構造", parts: ["木構造"] },
  "two-dimensional-arrays": { label: "二次元配列", parts: ["二次元", "配列"] },
  "variables-data-types": { label: "変数・データ型", parts: ["変数・", "データ型"] },
};

const UNKNOWN_UNIT_LABEL = "単元名未登録";

export function getFeUnitLabel(unitId) {
  return FE_UNIT_LABELS[unitId]?.label || UNKNOWN_UNIT_LABEL;
}

export function getFeUnitLabelParts(unitId) {
  return FE_UNIT_LABELS[unitId]?.parts || [UNKNOWN_UNIT_LABEL];
}
