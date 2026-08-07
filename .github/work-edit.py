from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def write(path, content):
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def replace_exact(text, old, new, label):
    if old not in text:
        raise RuntimeError(f"Expected text not found: {label}")
    return text.replace(old, new, 1)


def replace_section(text, start_heading, end_heading, replacement, label):
    pattern = re.compile(rf"{re.escape(start_heading)}\n.*?(?={re.escape(end_heading)}\n)", re.S)
    updated, count = pattern.subn(replacement.rstrip() + "\n\n", text, count=1)
    if count != 1:
        raise RuntimeError(f"Expected section not found: {label}")
    return updated


# Register the new FE correction task while retaining Java as planned.
task_list = read("task-list.md")
current_and_planned = '''## Current task

### Task ID

`JLL-FE-003`

### Title

FE絞り込みの不要な余白を減らし、単元名を完全な日本語で自然に表示する

### Status

`in_progress`

### Purpose

採用済みのパターンBを通常表示の既定にし、内容量の異なるカードを無理に同じ高さへ揃えず、短いカードを縦方向に組み合わせて不要な空白を減らす。単元名は収録データに存在する全単元を完全な日本語名で表示し、表示幅が許す限り1行に収め、折り返す場合は意味のまとまりで自然に改行する。

### Scope

- `filterLayout=2`のパターンBを指定なし・無効値時の既定表示へ変更する
- 単元カードを全幅の主カードとして維持する
- PC・タブレットで「分野」と「回答・復習状態」を左側へ縦積みし、「開催回・公開区分」を右側で2段分使用して不要な空白を減らす
- 375pxでは既存DOM順の1列を維持する
- 収録データで使用中の全`unitId`を完全な日本語名へ対応付ける
- 単元名の表示幅を優先し、可能な限り1行で表示する
- 1行に収まらない単元名には意味上自然な位置だけに任意改行位置を設定する
- 自動テスト、型検査、Lint、通常build、Pages build、Chromium監査を更新・実行する
- `docs/`を最新生成物へ更新する

### Out of scope

- 受験科目ブロックの位置、構造、文言、選択肢、操作変更
- 絞り込み条件、OR/AND評価、件数、開始条件の変更
- 問題データ、問題本文、選択肢、正答、解説、図表の変更
- Java Learning Labの実装
- GitHub Pages障害の復旧またはdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

- 指定なし・無効な`filterLayout`ではパターンBが表示される
- PC・タブレットで短いカード下の大きな未使用空間が解消され、カード同士が無理なく詰められている
- カード高さを固定せず、内部縦スクロールを追加していない
- 現在収録中の全単元が英語IDではなく完全な日本語名で表示される
- 単元カードは表示幅を有効利用し、可能な限り1行表示となる
- 改行が必要な名称は単語・意味のまとまりで折り返され、文字途中の不自然な分割がない
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- キーボード操作とラベル関連付けが維持される
- テスト、型検査、Lint、通常build、Pages build、Chromium監査が成功する
- Draft Pull Requestと確認用証拠が存在する

### Dependencies

- `JLL-FE-001`: completed
- `JLL-FE-002`: completed
- ユーザー指定: パターンB採用、不要な余白削減、単元名の完全日本語表示と自然な折返し

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Current HEAD

実装・検証commit後にGitHub実状態から固定する。

### Validation result

実装中。

### Merge commit

未着手。実装担当はマージしない。

### GitHub Pages result

一時スキップ方針を継続する。Pages buildとartifact uploadは検証対象とする。

### Next task

`JLL-JAVA-001`

---

## Planned task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Purpose

Repository内のJava Learning Labの設計、既存実装、テスト、未完了範囲を再確認し、単一の実装タスクとして具体化して再開する。

### Scope

- Rootおよび`prototype/`配下の管理文書、設計文書、既存Java実装、テストの確認
- 現状、変更対象、対象外、完了条件、検証方法の確定
- 必要な設計更新、実装、検証、`docs/`更新、Draft Pull Request作成

### Out of scope

- 完了済みFE機能の追加変更
- GitHub Pages障害の復旧
- 実装担当による`main`へのマージ

### Completion criteria

`JLL-FE-003`完了後、Repository実状態からJava Learning Labの現状と未完了範囲を具体化して実装を進める。

### Dependencies

- `JLL-FE-003`: completed後に開始

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に記録する。

### Current HEAD

実装開始時に記録する。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。

### Next task

Java Learning Labの現状調査後に決定する。'''
pattern = re.compile(r"## Current task\n.*?\n---\n\n## Completed task", re.S)
task_list, count = pattern.subn(current_and_planned + "\n\n---\n\n## Completed task", task_list, count=1)
if count != 1:
    raise RuntimeError("Current task section was not replaced")
write("task-list.md", task_list)

next_work = '''# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`in_progress`

## Role

現在の担当は実装担当。

## Objective

採用済みのパターンBを既定表示にし、単元を全幅、分野と回答状態を左側の縦積み、開催回を右側の縦長領域として配置する。カード内容量の差による大きな空白を減らし、収録中の全単元名を完全な日本語で、可能な限り1行、必要時は意味のまとまりで自然に折り返して表示する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-003`
- Start HEAD: `1d0eaebf73a4e9567ccb91017edf5b2d470caafe`
- Branch: `work`
- Pull Request: 未作成

## Change targets

- Root `DESIGN.md`
- `prototype/DESIGN.md`
- `prototype/src/feFilterLayout.js`
- `prototype/src/feUnitLabels.js`
- `prototype/src/FePracticeSetup.jsx`
- `prototype/src/fe-filter-variants.css`
- `prototype/tests/fe-filter-layout.test.mjs`
- `prototype/tests/fe-unit-labels.test.mjs`
- `prototype/scripts/audit-fe-filter-layouts.mjs`
- `.github/workflows/fe-filter-layout-audit.yml`
- `prototype/package.json`
- `docs/`
- 管理文書と検証証拠

## Change forbidden

- 受験科目ブロックの変更
- 絞り込みロジック、選択状態、件数、開始条件の変更
- 問題データ、問題本文、選択肢、正答、解説、図表の変更
- Java Learning Lab
- force push、squash merge、rebase merge
- Pages障害の復旧作業

## Required implementation

1. `filterLayout`の指定なし・無効値をパターン2へフォールバックする
2. パターン2で単元を全幅先頭、分野と回答状態を左列の上下、開催回を右列の2段相当へ配置する
3. カード高さを固定せず、カード内部スクロールを追加しない
4. 実データに存在する全41種の`unitId`へ完全な日本語名を定義する
5. 未登録IDは英語IDを露出せず「単元名未登録」とする
6. 単元名用の列最小幅を広げ、1行表示を優先する
7. 長い名称は`wbr`相当の意味上自然な改行候補だけを持たせる
8. 375pxではDOM順の1列へ戻す
9. 自動テストとブラウザ監査で日本語名、折返し、横はみ出し、カード内スクロール、キーボード操作を確認する
10. `docs/`を生成し、Draft Pull RequestとCIまで進める

## Completion criteria

`task-list.md`の`JLL-FE-003`完了条件をすべて満たし、`review_ready`へ更新する。

## Temporary GitHub Pages policy

Pages deploymentと公開URL確認は一時スキップする。通常build、Pages build、artifact uploadは継続する。

## User latest instructions

- 無理のない範囲で不要な余白をなくす
- 単元名は日本語で省略せず、可能な限り1行で表示する
- 1行が無理な場合は自然な位置で改行する

## Next user command

実装完了後は`確認`。
'''
write("NEXT_WORK.md", next_work)

# Update current project priority without changing the temporary Pages policy.
context = read("PROJECT_CONTEXT.md")
context_section = '''## 5. Current priority

現在の優先タスクは`JLL-FE-003`である。

目的は、採用済みのFE絞り込みパターンBを既定表示にし、内容量の異なるカード間に生じる不要な空白を減らすとともに、収録中の全単元名を完全な日本語で、可能な限り1行、必要時は意味のまとまりで自然に折り返して表示することである。

確定条件:

- 受験科目は独立ブロックのまま変更しない
- 単元を全幅の主カードとして扱う
- 分野と回答・復習状態を左側で縦積みする
- 開催回・公開区分を右側の縦長領域として扱う
- カード高さを固定せず、内部スクロールを追加しない
- 現在収録中の全`unitId`を完全な日本語名へ対応付ける
- 単元名は幅を有効利用して1行表示を優先する
- 改行時は意味のまとまりに設定した候補位置だけを使用する
- 375px、768px、1,280pxで検証する

`JLL-JAVA-001`は`planned`として保持し、`JLL-FE-003`の確認・マージ後に再開する。

`JLL-FE-001`と`JLL-FE-002`は確認合格し、merge commit方式で`main`へマージ済みである。

FE問題数は次の区分を正確に使う。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）
'''
context = replace_section(context, "## 5. Current priority", "## 5.1 Temporary GitHub Pages skip policy", context_section, "PROJECT_CONTEXT current priority")
write("PROJECT_CONTEXT.md", context)

# Record the design decision before application code changes.
design = read("DESIGN.md")
design_section = '''## 9. FE filter layout

- **受験科目**は絞り込みグリッドへ含めず、既存の独立ブロック、位置、構造、文言、選択肢、操作を維持する
- 受験科目より下にある「分野」「単元」「開催回・公開区分」「回答・復習状態」だけをモジュール不規則型Gridへ配置する
- 採用レイアウトはパターンBとし、URL指定なし・無効値では`filterLayout=2`を使用する
- 比較・回帰確認用として`filterLayout=1|2|3`は維持するが、通常画面へ切替UIを追加しない
- パターンBは単元を全幅の先頭カードとし、その下で分野と回答・復習状態を左側へ縦積みし、開催回・公開区分を右側の縦長領域へ配置する
- 内容量の異なるカードを同じ高さへ固定せず、短いカード同士を縦方向に組み合わせて大きな未使用空間を減らす
- Grid間隔とカード内余白は操作性を損なわない範囲で詰め、情報のまとまりを維持する
- 条件群の内部に縦スクロールバーを設けず、全選択肢を常時表示する
- 収録中の全単元は英語IDを露出せず、完全な日本語名で表示する
- 単元カードは選択肢1件あたりの最小幅を広く取り、可能な限り1行表示を優先する
- 1行に収まらない単元名は省略せず、あらかじめ定義した意味上自然な位置でだけ折り返す
- 問題数表示は単元名の可読性を阻害しない
- 375pxでは全パターンをDOM順の1列へ戻す
- 768pxでは8列基準、1,280px以上では12列基準でパターンBの左右構成を維持する
- 表示変更によって選択条件、キーボード順、ラベル関連付け、抽出結果を変えない
'''
design = replace_section(design, "## 9. FE filter layout", "## 10. FE question content", design_section, "root FE filter design")
write("DESIGN.md", design)

prototype_design = read("prototype/DESIGN.md")
prototype_section = '''## 2. 絞り込み表示

- **受験科目**は既存の独立ブロックを維持し、Gridの対象へ含めない。
- Gridの対象は「1. 分野」「2. 単元」「3. 開催回・公開区分」「4. 回答・復習状態」の4ブロックだけとする。
- 採用済みのパターンBを通常表示の既定とし、指定なし・無効値は`filterLayout=2`へフォールバックする。
- `filterLayout=1|2|3`は比較・回帰確認用として維持し、利用者向け切替UIは追加しない。
- パターンBは単元を全幅の先頭カードとする。
- その下は分野と回答・復習状態を左側へ縦積みし、開催回・公開区分を右側で2段相当使用する。
- カード高さは内容量で決定し、固定高、強制的な同一高、内部縦スクロールを使用しない。
- Grid間隔とカード内余白は、44px級の操作対象と情報の区切りを維持できる範囲で縮小する。
- 収録データに存在する全単元IDへ完全な日本語表示名を定義する。
- 未登録単元IDを英語のまま画面へ出さず、「単元名未登録」と表示してテストで検出する。
- 単元カードだけは選択肢の最小列幅を広くし、1行表示できる項目を増やす。
- 長い単元名は全文を維持し、`wbr`相当の意味上自然な候補位置だけで改行する。
- 文字単位の強制改行、末尾省略、横スクロールは使用しない。
- 375pxではDOM順の1列、768pxでは8列基準、1,280px以上では12列基準とする。
- ページ全体の横スクロール、カードの重なり、内容切れを禁止する。
'''
prototype_design = replace_section(prototype_design, "## 2. 絞り込み表示", "## 3. 科目B", prototype_section, "prototype filter design")
write("prototype/DESIGN.md", prototype_design)

# Complete Japanese unit labels and semantic break opportunities.
unit_module = '''export const FE_UNIT_LABELS = {
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
'''
write("prototype/src/feUnitLabels.js", unit_module)

setup = read("prototype/src/FePracticeSetup.jsx")
setup = replace_exact(
    setup,
    'import { filterPracticeQuestions, scopeLabel } from "./feSession.js";\n',
    'import { filterPracticeQuestions, scopeLabel } from "./feSession.js";\nimport { getFeUnitLabel, getFeUnitLabelParts } from "./feUnitLabels.js";\n',
    "unit label import",
)
setup, count = re.subn(r'const unitLabels = \{.*?\n\};\n', '', setup, count=1, flags=re.S)
if count != 1:
    raise RuntimeError("unitLabels block was not removed")
setup = replace_exact(
    setup,
    'function ChoicePanelBody({ title, description, values, options, onChange, emptyLabel }) {',
    '''function renderOptionLabel(option) {
  const parts = option.labelParts?.length ? option.labelParts : [option.label];
  return parts.map((part, index) => (
    <span key={`${option.value}-${index}`}>{index > 0 && <wbr />}{part}</span>
  ));
}

function ChoicePanelBody({ title, description, values, options, onChange, emptyLabel }) {''',
    "option label renderer",
)
setup = replace_exact(setup, '<span><strong>{option.label}</strong>{option.count !== undefined && <small>{option.count}問</small>}</span>', '<span><strong>{renderOptionLabel(option)}</strong>{option.count !== undefined && <small>{option.count}問</small>}</span>', "render semantic label")
setup = replace_exact(setup, '  return domainLabels[value] || unitLabels[value] || value;', '  return domainLabels[value] || getFeUnitLabel(value) || value;', "selected unit label")
setup = replace_exact(setup, '      label: unitLabels[value] || value,\n      count:', '      label: getFeUnitLabel(value),\n      labelParts: getFeUnitLabelParts(value),\n      count:', "unit option labels")
write("prototype/src/FePracticeSetup.jsx", setup)

resolver = read("prototype/src/feFilterLayout.js")
resolver = replace_exact(resolver, 'const DEFAULT_FE_FILTER_LAYOUT = "1";', 'const DEFAULT_FE_FILTER_LAYOUT = "2";', "default layout")
write("prototype/src/feFilterLayout.js", resolver)

css = read("prototype/src/fe-filter-variants.css")
css = replace_exact(
    css,
    '''.fe-filter-variant-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-flow: row;
  gap: 0.7rem;
  align-items: start;
}''',
    '''.fe-filter-variant-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-flow: row;
  grid-auto-rows: min-content;
  gap: 0.55rem;
  align-items: start;
}''',
    "compact grid",
)
css = replace_exact(
    css,
    '''html[data-fe-filter-layout="2"] .fe-filter-variant-grid > :nth-child(3) {
  grid-column: 6 / -1;
  grid-row: 2;
}

html[data-fe-filter-layout="2"] .fe-filter-variant-grid > :nth-child(4) {
  grid-column: 1 / -1;
  grid-row: 3;
}''',
    '''html[data-fe-filter-layout="2"] .fe-filter-variant-grid > :nth-child(3) {
  grid-column: 6 / -1;
  grid-row: 2 / span 2;
}

html[data-fe-filter-layout="2"] .fe-filter-variant-grid > :nth-child(4) {
  grid-column: 1 / span 5;
  grid-row: 3;
}''',
    "desktop pattern B packing",
)
css = replace_exact(css, '  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));', '  grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));', "filter option minimum width")
css = replace_exact(
    css,
    '''.fe-check-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));
  gap: 0.32rem;
}''',
    '''.fe-check-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));
  gap: 0.32rem;
}

@media (min-width: 721px) {
  .fe-filter-variant-grid > :nth-child(2) .fe-check-grid-compact {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  }
}''',
    "unit option width",
)
css = replace_exact(
    css,
    '''.fe-check-grid-compact label strong {
  min-width: 0;
  overflow: visible;
  overflow-wrap: anywhere;
  text-overflow: clip;
  white-space: normal;
  font-size: 0.78rem;
  line-height: 1.35;
}''',
    '''.fe-check-grid-compact label strong {
  min-width: 0;
  overflow: visible;
  overflow-wrap: normal;
  word-break: normal;
  line-break: strict;
  text-overflow: clip;
  white-space: normal;
  font-size: 0.78rem;
  line-height: 1.35;
}''',
    "natural label wrapping",
)
css = replace_exact(
    css,
    '''  html[data-fe-filter-layout="2"] .fe-filter-variant-grid > :nth-child(3) {
    grid-column: 4 / -1;
  }''',
    '''  html[data-fe-filter-layout="2"] .fe-filter-variant-grid > :nth-child(3) {
    grid-column: 4 / -1;
  }

  html[data-fe-filter-layout="2"] .fe-filter-variant-grid > :nth-child(4) {
    grid-column: 1 / span 3;
  }''',
    "tablet pattern B packing",
)
write("prototype/src/fe-filter-variants.css", css)

layout_test = read("prototype/tests/fe-filter-layout.test.mjs")
layout_test = layout_test.replace('resolveFeFilterLayoutVariant(""), "1"', 'resolveFeFilterLayoutVariant(""), "2"')
layout_test = layout_test.replace('resolveFeFilterLayoutVariant("?filterLayout=4"), "1"', 'resolveFeFilterLayoutVariant("?filterLayout=4"), "2"')
layout_test = replace_exact(
    layout_test,
    '  assert.doesNotMatch(css, /text-overflow:\\s*ellipsis/);',
    '''  assert.doesNotMatch(css, /text-overflow:\\s*ellipsis/);
  assert.doesNotMatch(css, /overflow-wrap:\\s*anywhere/);
  assert.match(css, /data-fe-filter-layout=\\"2\\"[\\s\\S]*:nth-child\\(3\\)[\\s\\S]*grid-row:\\s*2 \\/ span 2/);
  assert.match(css, /:nth-child\\(2\\) \\.fe-check-grid-compact[\\s\\S]*minmax\\(min\\(100%, 240px\\), 1fr\\)/);''',
    "layout test additions",
)
write("prototype/tests/fe-filter-layout.test.mjs", layout_test)

unit_test = '''import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { FE_UNIT_LABELS, getFeUnitLabel, getFeUnitLabelParts } from "../src/feUnitLabels.js";

const dataPath = new URL("../public/data/fe-official-past-questions.json", import.meta.url);

test("every distributed FE unit has a complete Japanese label", async () => {
  const data = JSON.parse(await readFile(dataPath, "utf8"));
  const unitIds = [...new Set(data.questions.map((question) => question.unitId).filter(Boolean))].sort();

  assert.equal(unitIds.length, 41);
  for (const unitId of unitIds) {
    const entry = FE_UNIT_LABELS[unitId];
    assert.ok(entry, `Missing Japanese unit label: ${unitId}`);
    assert.equal(getFeUnitLabel(unitId), entry.label);
    assert.equal(getFeUnitLabelParts(unitId).join(""), entry.label);
    assert.doesNotMatch(entry.label, /[A-Za-z]/, `Unit label contains an English identifier: ${unitId}`);
    assert.ok(entry.label.length > 0);
    assert.ok(entry.parts.every((part) => part.length > 0));
  }
});

test("unknown unit identifiers never leak into learner-facing text", () => {
  assert.equal(getFeUnitLabel("future-unknown-unit"), "単元名未登録");
  assert.deepEqual(getFeUnitLabelParts("future-unknown-unit"), ["単元名未登録"]);
});
'''
write("prototype/tests/fe-unit-labels.test.mjs", unit_test)

# Store this task's browser evidence separately and validate that raw unit slugs are not displayed.
audit = read("prototype/scripts/audit-fe-filter-layouts.mjs")
audit = audit.replace('"jll-fe-002-browser"', '"jll-fe-003-browser"')
audit = audit.replace('taskId: "JLL-FE-002"', 'taskId: "JLL-FE-003"')
audit = audit.replace('# JLL-FE-002 Browser Evidence', '# JLL-FE-003 Browser Evidence')
audit = replace_exact(
    audit,
    '''      domOrder: cards.map((card) => card.querySelector('legend')?.textContent?.trim() || '')
    };''',
    '''      domOrder: cards.map((card) => card.querySelector('legend')?.textContent?.trim() || ''),
      unitLabels: [...cards[1].querySelectorAll('label strong')].map((label) => label.textContent?.trim() || '')
    };''',
    "audit unit labels",
)
audit = replace_exact(
    audit,
    '''    assert(metrics.labels.count > 0 && metrics.labels.clipped.length === 0, `Filter labels are clipped for variant ${variant} at ${width}px`);''',
    '''    assert(metrics.labels.count > 0 && metrics.labels.clipped.length === 0, `Filter labels are clipped for variant ${variant} at ${width}px`);
    assert(metrics.unitLabels.length > 0 && metrics.unitLabels.every((label) => label && !/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(label)), `A raw unit identifier is visible for variant ${variant} at ${width}px`);''',
    "audit raw unit IDs",
)
write("prototype/scripts/audit-fe-filter-layouts.mjs", audit)

package_json = read("prototype/package.json")
package_json = package_json.replace('qa/jll-fe-002-browser/audit.json', 'qa/jll-fe-003-browser/audit.json')
write("prototype/package.json", package_json)

workflow = read(".github/workflows/fe-filter-layout-audit.yml")
workflow = workflow.replace('name: fe-filter-layout-evidence', 'name: fe-filter-density-evidence')
workflow = workflow.replace('prototype/qa/jll-fe-002-browser', 'prototype/qa/jll-fe-003-browser')
write(".github/workflows/fe-filter-layout-audit.yml", workflow)
