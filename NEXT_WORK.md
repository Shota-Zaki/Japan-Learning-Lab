# Next Work

## Current Task ID

`JLL-FE-002`

## Current phase

`review_ready`

## Role

次の担当は確認担当。

新しいチャットでRepository、Pull Request、固定HEAD、CI、browser evidenceを独立して再取得し、アプリケーションコードを修正せずに確認する。

## Objective

受験科目ブロックを独立維持し、その下の既存4条件群だけを同一DOM・同一要素のままモジュール不規則型Bento Grid 3パターンへ変更した実装を確認する。

確認対象の3パターンは検証専用query parameter `filterLayout=1|2|3`で切り替える。通常画面に切替UI、説明、選択肢、カテゴリ、アイコンは追加されていない。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Pull Request: `#3`
- Pull Request state: Draft / open
- Task start HEAD: `c58aa9455b1941055310c0dd82b65352530a6482`
- Fixed implementation HEAD: `ca5212d91b3b9792a53d0fac4bc7f69648682798`
- Evidence HEAD: `890c54477b633c86b09682c0684b9ced1ab865cb`
- Review-ready task metadata predecessor: `5e905e090dc71f279980d5e849dc72fb808cf59f`
- Current `work` HEAD: この`NEXT_WORK.md`更新commit。確認開始時にGitHub実状態からSHAを固定する

## Implemented changes

- Root `DESIGN.md`と`prototype/DESIGN.md`を実装前に更新
- `prototype/src/feFilterLayout.js`で`filterLayout=1|2|3`だけを受け付け、指定なし・無効値はパターン1へフォールバック
- `prototype/src/main.jsx`でroot datasetへ検証用variantを設定
- `prototype/src/FePracticeSetup.jsx`の既存DOM、選択肢、文言、状態管理は変更しない
- `prototype/src/fe-filter-variants.css`で12列、8列、1列の3段階レスポンシブ配置を実装
- パターン1: 4/8列と7/5列の交互配分
- パターン2: 単元を全幅先頭カードとし、下段を非対称配置
- パターン3: 開催回・公開区分を全幅先頭カードとし、下段を非対称配置
- 375pxでは全案をDOM順の1列へ戻す
- query解決、単一DOM、独立受験科目、スクロールバー・省略表示不使用を自動テストへ追加
- Chrome DevTools Protocolによる3案×3幅のbrowser audit workflowを追加
- Repository内に固定証拠要約を保存

## Change forbidden during confirmation

確認担当は原則として次を変更しない。

- React、CSS、テスト、workflow、build設定
- 受験科目ブロック
- 絞り込み要素、選択肢、文言、操作
- 問題データ、問題本文、正答、解説
- Java Learning Lab

Blocking問題を発見した場合は、コードを修正せず、`task-list.md`を`needs_fix`へ変更し、この文書へ具体的な修正指示、再現方法、再検証項目を記録する。

## Required independent review

1. Repository、`main`、`work`、Draft Pull Request `#3`を再取得する
2. `work`の最新HEADとPR merge refを固定する
3. `main`との差分を確認し、Task外変更がないことを確認する
4. `AGENTS.md`、`PROJECT_CONTEXT.md`、`DESIGN.md`、`prototype/DESIGN.md`、`task-list.md`を確認する
5. 受験科目ブロックが絞り込みGridの外側・前方に独立していることを確認する
6. 4条件群のDOM、文言、選択肢、操作が3案で共通であることを確認する
7. `filterLayout=1|2|3`以外の利用者向け切替UIがないことを確認する
8. 375px、768px、1280pxで3案すべてを確認する
9. 横はみ出し、カード内縦スクロール、ラベル切れ、重なり、操作不能がないことを確認する
10. キーボード操作、フォーカス、チェックボックスとラベルの関連付けを確認する
11. 絞り込み選択、解除、全選択、全解除、チップ解除、件数、開始操作に回帰がないことを確認する
12. `npm run verify:fe`または固定CI結果を独立確認する
13. Browser evidenceとartifact digestを確認する
14. Pages buildとartifact uploadを確認する
15. Pages deploymentと公開画面は一時スキップ方針に従い、Blockingにしない
16. Blockingがなければ、管理文書更新、merge commit方式のマージ、`work`同期まで確認担当として実行する

## Existing validation evidence

### Standard CI

- Workflow: `Build and deploy GitHub Pages`
- Run ID: `31137470015`
- Run number: `286`
- Fixed implementation HEAD: `ca5212d91b3b9792a53d0fac4bc7f69648682798`
- Pull Request merge ref: `c081acdffe746ae247a2b088a7c90204581cf73f`
- Result: success
- Tests: 56 / 56 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact ID: `8978516762`
- Pages artifact digest: `sha256:17716de6eaeea2ff42687197b273952dc13fb53965292478e6055d5cf376d7d3`

### Browser audit

- Workflow: `Audit FE filter layout variants`
- Run ID: `31137470033`
- Run number: `3`
- Result: success
- Browser: runner Google Chrome
- Scenarios: 3 patterns × 375px / 768px / 1280px = 9
- Browser evidence artifact ID: `8978513504`
- Browser evidence artifact digest: `sha256:ff04460276151e4a2fc02d65296514d96e6bc3213504ca886b898129bb3b97b7`
- Repository evidence: `prototype/qa/jll-fe-002-browser/README.md`
- Repository evidence summary: `prototype/qa/jll-fe-002-browser/audit-summary.json`
- Artifact screenshots: `layout-1-1280.png`, `layout-2-1280.png`, `layout-3-1280.png`

Browser audit合格内容:

- 受験科目が4条件群Gridより前に独立
- 4条件群とDOM順を維持
- ページ横はみ出しなし
- カード内縦スクロール・内容切れなし
- 省略されたラベルなし
- キーボードによるチェック操作成功
- Console warning/errorなし
- Network failureなし
- 768pxと1280pxで3案が異なる幾何配置
- 375pxで全案が1列

## User latest instructions

- 絞り込みをモジュール不規則型Bento Gridにする
- 同じ形でなくてよい
- 現在ある要素の追加・変更はしない
- 3パターン作る
- 受験科目は独立させた現在の状態を維持する

## Temporary GitHub Pages policy

GitHub Pagesが正常完了可能と確認され、ユーザーが方針を解除するまで次をスキップする。

- Pages deploymentの手動実行・再実行
- 公開Revision一致確認
- 公開画面、Console、Network確認
- Pages障害だけを理由にした`blocked`または`needs_fix`

通常build、テスト、型検査、Lint、Pages build、Pages artifact upload、固定artifact browser確認は継続する。

## Completion action for confirmation role

Blocking問題がなければ、確認担当は次を一括で行う。

- `task-list.md`を`completed`へ更新
- 次タスク`JLL-JAVA-001`をCurrent taskへ移す
- この文書をJava実装担当向けに更新
- 管理文書を`work`へcommit、push
- Pull Request `#3`をmerge commit方式で`main`へマージ
- `main` CIを確認
- `work`を最新`main`へ同期し、削除しない
- Pages公開確認は一時スキップとして記録

## Next user command

`確認`
