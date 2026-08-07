# Next Work

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
