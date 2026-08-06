# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`review_ready`の独立確認工程

## Role

次の担当は、別の新しいチャットで確認担当として作業する。

実装担当はBlocking修正、回帰テスト、`docs/`再生成、CI、GitHub Pages再公開まで完了した。Pull Request #1はDraft / Open / Unmergedのまま維持する。

## Objective

科目B誤除外の修正を固定HEADで独立検証し、Blocking問題がなければ管理文書更新、merge commit、`main`のCI確認、`work`同期、GitHub Pages再確認まで完了する。

## Repository state at handoff

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Application review target HEAD: `10acc296f2d051d14a5c7f7d11b032ccf07fe46c`
- Implementation source revision: `191749c850bd14b97b038a44024bb17b270af2b1`
- 管理文書更新後の最新PR HEADは確認開始時に再取得して固定する
- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Audit: `prototype/qa/fe-question-bank-merge-fix-2026-08-06/audit.md`
- Deployment evidence: `prototype/qa/pages-deployment.json`

## Implemented fix

### Previous symptom

- 実行時統合: 1,838問
- 科目A: 1,830問
- 科目B: 8問
- 科目B公式サンプル: 0問
- 開始ボタン: disabled

### Fix

- 問題バンクの正規化、妥当性検証、fingerprint生成、統合処理を`prototype/src/feQuestionBank.js`へ分離
- `prototype/src/FeLearningApp.jsx`は共通統合処理を使用
- fingerprintへ科目、出典座標、問題本文、構造化本文、選択肢、構造化選択肢、正答を含めた
- 同一出典座標でも科目または問題内容が異なる問題を保持
- ID一致または内容一致の真の重複だけを除外
- 実行時と同じ統合処理を通す回帰テストを追加

## Implementation verification evidence

### Data and selection

- 実行時統合: 1,997問
- 科目A: 1,830問
- 科目B: 167問
- 2022年12月公開サンプル科目A: 60問、公式問番号順
- 2022年12月公開サンプル科目B: 20問、公式問番号順
- 科目B公式サンプルの設定件数20問でセッション選択成功

### Automated checks

- `npm run verify:fe`: success
- Tests: 47 / 47 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success
- 科目B複数正答、回答状態、保存、復元、再開、完了、履歴由来スコープのテスト成功
- 科目A問5・問6・問7の図表参照を維持
- 科目A問9の本文、4選択肢、正答`エ`を維持

### CI and Pages

- Push workflow run: `31079687176` / run number `185` / success
- Pull request workflow run: `31079690171` / run number `186` / success
- Pages source revision: `191749c850bd14b97b038a44024bb17b270af2b1`
- Generated output commit: `10acc296f2d051d14a5c7f7d11b032ccf07fe46c`
- Deploy: success
- Public smoke check: success

## Mandatory independent review

1. Repository、`main`、`work`、Pull Request #1の実状態を再取得する
2. 最新PR HEADを固定し、Application review target HEAD以降が管理文書のみか確認する
3. `main`との差分を独立確認する
4. `cd prototype && npm ci && npm run verify:fe`を実行する
5. 実行時統合関数で1,997問、科目A 1,830問、科目B 167問を確認する
6. 科目A公式サンプル60問、科目B公式サンプル20問と公式問番号順を確認する
7. 科目B → 模擬試験 → 2022年12月公開サンプル問題で20問対象と開始ボタン有効を確認する
8. 科目Bの単一正答・複数正答、解説、保存、再読込後の復元、履歴、復習、再挑戦を確認する
9. 科目A問5・問6・問7の図表、問9のテキスト問題を回帰確認する
10. 375px、768px、1280px以上で横スクロール、可読性、フォーカス表示を確認する
11. Console error、Page error、HTTP error、Request failureを確認する
12. GitHub Pagesの実表示と公開資産を確認する
13. `task-list.md`、`NEXT_WORK.md`、監査記録、PR本文、CI、Pages evidenceの整合性を確認する

## Pass handling

Blocking問題がなければ、確認担当は次を一括で実施する。

1. `task-list.md`を`completed`へ更新
2. `NEXT_WORK.md`を次タスク`JLL-JAVA-001`向けに更新
3. 管理文書を`work`へcommit、push
4. 管理文書更新後のHEADを再検証
5. Pull Request #1をmerge commit方式で`main`へマージ
6. `main`のCIを確認
7. `work`を最新`main`へ同期し、削除しない
8. GitHub Pagesの再公開を確認
9. 管理文書とGitHub実状態の一致を確認

## Failure handling

Blocking問題がある場合はマージしない。

- 問題をBlocking / Non-blockingへ分類
- 再現手順、原因候補、修正対象、再検証項目を記録
- `task-list.md`を`needs_fix`へ更新
- `NEXT_WORK.md`を実装担当向け修正指示へ更新
- 管理文書を`work`へcommit、push
- Pull Request #1をDraft / Open / Unmergedのまま維持

## Allowed changes for review role

- `task-list.md`
- `NEXT_WORK.md`
- レビュー結果と検証証拠を記録する管理文書
- 明白な管理メタデータの不一致

アプリケーションコード、UI、テスト、設定に問題がある場合は確認担当自身で修正しない。

## Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- GitHub Actionsが使用する一部ActionのNode.js 20非推奨warning。検証ランタイムはNode.js 22で成功

## Latest user request

`修正`

実装担当が修正工程を完了し、独立確認可能な状態へ戻した。

## Next user command

`確認`
