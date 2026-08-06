# FE Sample Figure Fix Audit

## Audit scope

- Task ID: `JLL-FE-001`
- Role: 実装担当の修正記録
- Branch: `work`
- Pull Request: `#1` Draft / Open / Unmerged
- Fixed implementation HEAD: `56482206a7aa24910148aff661fb0ab598316261`
- Audit date: `2026-08-06`

この記録は実装担当の自己検証証拠であり、確認担当の独立レビュー結果ではない。

## Blocking issue

2022年12月公開の科目Aサンプル問5で、問題文と選択肢は存在するが、回答に必要な図表の`image`ブロックが生成されていなかった。

初期引継ぎでは問5、問6、問7、問9をすべて図表依存問題としていた。

## Root-cause investigation

固定同期元の対象レコードを実際に確認した。

- 問5: 問題文、選択肢、正答は存在するが、画像、HTML画像、参照ID、資産配列が存在しない
- 問6: 公式冊子上の流れ図と配列図が固定同期元に存在しない
- 問7: 公式冊子上の配列図が固定同期元に存在しない
- 問9: 公式冊子上で図表のないテキスト問題

したがって、問5の欠落は単一フィールドの抽出漏れだけではなく、固定同期元自体に図表情報がないことが根本原因だった。

また、問9へ図表を要求する引継ぎ条件は公式冊子の実構成と不一致だった。

## Resolution

### Supplemental figures

公式冊子と照合した補完SVGをRepository管理下へ追加した。

- `prototype/public/assets/fe/a-2022-005-figure.svg`
- `prototype/public/assets/fe/a-2022-006-figure.svg`
- `prototype/public/assets/fe/a-2022-007-figure.svg`

各SVGは次を持つ。

- 固定viewBox
- 意味のある`title`
- 内容説明用`desc`
- 背景と線画
- Pages buildでコピー可能な相対パス

### Normalization

`prototype/scripts/complete-fe-sample-set.mjs`で次を行う。

- 問題レベルの直接画像資産を抽出
- 選択肢レベルの直接画像資産を抽出
- 参照画像を問題側と選択肢側へ割り当て
- HTML内の`img`を構造化画像へ変換
- 問5、問6、問7へ対象IDを明示して補完SVGを付与
- 問5、問6、問7に画像がない場合は同期処理を失敗させる
- 問9は図表必須対象から除外し、テキスト問題として保持する

### Rendering

`prototype/src/FeRichContent.jsx`で次を行う。

- `javascript:`画像参照を拒否
- 外部URL、data URL、blob URL、絶対パスを維持
- 相対ローカル資産を`import.meta.env.BASE_URL`で解決
- GitHub PagesのプロジェクトベースパスでSVGを取得可能にする

既存CSSは次を満たす。

- 図表親要素の`overflow: hidden`
- 画像の`max-width: 100%`
- 画像の`height: auto`
- コンテンツの`min-width: 0`
- ページルートの`overflow-x: clip`

## Regression tests

`prototype/tests/fe-official-sample.test.mjs`で次を検証する。

1. 科目A 60問が公式問番号順で揃う
2. 科目B 20問が公式問番号順で揃う
3. 問5が`assets/fe/a-2022-005-figure.svg`を参照する
4. 問6が`assets/fe/a-2022-006-figure.svg`を参照する
5. 問7が`assets/fe/a-2022-007-figure.svg`を参照する
6. 画像参照が空または危険なschemeではない
7. 問9がコーディング規約に関する本文、4選択肢、正答`エ`を保持する

## Verification result

### Pull Request workflow

- Workflow: `Build and deploy GitHub Pages`
- Run ID: `31077350598`
- Run number: `162`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Conclusion: success

Results:

- Official FE sync: success
- Completed sample counts: A 60 / B 20
- Generated bank: 1,977 questions
- Tests: 43 / 43 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success
- Pages artifact upload: success

Existing warning:

- File: `prototype/src/FeSessionView.jsx`
- Rule: `react-hooks/exhaustive-deps`
- Detail: `useEffect`の`session`依存
- This correction introduced no ESLint error

### Work push and public deployment

- Run ID: `31077346989`
- Run number: `161`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Build: success
- Generated data and`docs/` commit: success
- Deploy: success
- Public smoke check: success

Public smoke validation:

- Published index fetched
- Published official-question JSON fetched and parsed
- Q5 reference checked
- Q6 reference checked
- Q7 reference checked
- Q5 SVG fetched and non-empty
- Q6 SVG fetched and non-empty
- Q7 SVG fetched and non-empty

Deployment evidence:

- `prototype/qa/pages-deployment.json`
- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`

## Generated output

The Pages artifact contains:

- `docs/data/fe-official-past-questions.json`
- `docs/assets/fe/a-2022-005-figure.svg`
- `docs/assets/fe/a-2022-006-figure.svg`
- `docs/assets/fe/a-2022-007-figure.svg`
- current application JavaScript and CSS bundles
- `docs/index.html`
- `docs/404.html`
- `docs/.nojekyll`

## Known limitations and independent review items

実装担当はCI、構造、公開資産取得、レスポンシブ制約を確認した。

確認担当は別チャットで、最新Pull Request HEADを固定して次を独立確認する。

- 375px、768px、1280px以上で問5、問6、問7を実表示
- 図表内文字と線の可読性
- 本文、図表、選択肢の順序
- ページ全体の横スクロール
- キーボード操作とフォーカス
- 代替テキスト
- Console error、Console warning
- HTTP error、Request failure
- 既存Hook warningのBlocking性
- `main`との差分と回帰

## Handoff decision

実装担当の修正、自己検証、CI、生成成果物、GitHub Pages公開、公開スモークテストは成功した。

Task statusを`review_ready`へ変更し、Pull Request #1をDraft / Open / Unmergedのまま確認担当へ引き渡す。
