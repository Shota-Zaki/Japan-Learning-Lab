# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`needs_fix`の実装担当修正工程（最新Pages deploy実行中）

## Role

次の担当は、別の新しいチャットで実装担当として作業する。

確認担当は固定HEAD、差分、ソース、テスト、Pull Request CI、CI生成Pages artifactを独立確認した。アプリケーション修正と自動検証は合格範囲だが、最新実装に対応するGitHub Pages deploy証拠と公開スモーク結果が固定されていないため、Pull Request #1はDraft / Open / Unmergedのまま維持する。

## Objective

最新`work`の`docs/`をGitHub Pagesへ確実にdeployし、最新公開Revisionと公開画面の検証証拠をRepositoryへ記録する。

アプリケーションコードは原則変更しない。公開確認で新しい不具合が判明した場合だけ、原因を特定して必要最小限の修正を行う。

## Repository state at confirmation failure

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Independent review fixed HEAD: `fe1ee2aaaace3f89170544aaeca1a7d4d545d4e2`
- Review handoff source revision: `93cfb3bcc3c67668f10bd87c9a4f32deb8453849`
- Generated output commit: `5700b363fe233594c7717d483da44fe37aecf81f`
- Repository `docs/build-info.json` sourceRevision: `93cfb3bcc3c67668f10bd87c9a4f32deb8453849`
- Pull Request CI merge revision: `1ac951a6095ca78582517d9f1c222f2165a69c53`
- Confirmation task-list update commit: `9886f8c9a20b90349f92dbe0a5a32ae192035242`
- Pages deploy trigger start HEAD: `036a90d601e93add0eab586cccaa0db1db42eed0`
- このファイル更新後の最新HEADは作業完了時に固定する

## Confirmation result

### Passed

- 修正範囲は絞り込み、結果レビュー、履歴表示、テスト、設計文書、生成成果物、管理文書に限定されている
- 絞り込み表示はコンパクトグリッド型に固定されている
- 項目名は省略されず複数行で表示する実装である
- 条件群は内容量に応じて伸長し、内部縦スクロールを使用しない実装である
- 模擬試験中は正誤と解説を隠す実装である
- 完了後の結果画面は問題文、ユーザー回答、正答、判定、選択肢、解説を表示する実装である
- 履歴は通常演習、ランダム模擬試験、公式サンプル模擬試験を区別し、公式サンプルではセット名を表示する実装である
- Pull Request workflow run `31083188418` / run number `197`: success
- `npm run verify:fe`: success
- Tests: 50 / 50 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- 科目B: 167問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問、公式問番号順

### Blocking B-03

最新Pages公開証拠が未固定である。

- `prototype/qa/pages-deployment.json`は旧source revision `eeb71ff55296687c4908240c7f92aae7ff9d3f6d`、workflow run number `191`を記録している
- 最新source revision `93cfb3bcc3c67668f10bd87c9a4f32deb8453849`または生成成果物commit `5700b363fe233594c7717d483da44fe37aecf81f`に対応するdeploy runが管理文書に記録されていない
- 固定済みrun number `197`はPull Request workflowであり、deploy jobはskippedである
- 最新公開Revisionを識別できないため、公開画面の複数幅、模擬試験結果レビュー、履歴表示、Console / Page / Network確認を完了できない
- Completion criteriaのPages deployと独立公開確認が未達である

## Required implementation work

1. GitHub Actionsの公開workflowと現在のPages設定を確認する
2. `work`の最新`docs/`を対象にPages deployを実行する
3. build、artifact upload、deployの全jobがsuccessであることを確認する
4. deploy run ID、run number、対象branch、対象commit、deployment URLを固定する
5. 公開`build-info.json`のsourceRevisionをRepository内`docs/build-info.json`と照合する
6. 公開`index.html`が参照するJS/CSS資産名をRepository内`docs/`と照合する
7. 375px、768px、1280px以上で絞り込みを確認する
8. 長い項目名が省略されないことを確認する
9. 条件群が項目数に応じた高さで、内部縦スクロールなしで全項目を表示することを確認する
10. 1〜3列のレスポンシブ配置とページ全体の意図しない横スクロールがないことを確認する
11. 科目Bの2022年12月公開サンプル20問を開始できることを確認する
12. 模擬試験終了前に正答と解説が表示されないことを確認する
13. 未回答を含む状態で終了し、問題別レビューに問題文、回答、正答、判定、解説が表示されることを確認する
14. 複数正答問題と未回答問題の表示を確認する
15. 履歴に公式サンプルセット名が表示され、結果を再表示できることを確認する
16. キーボード操作、フォーカス表示、Console error、Page error、HTTP error、Request failureを確認する
17. `prototype/qa/pages-deployment.json`を最新deployと公開スモーク結果へ更新する
18. 必要に応じて確認証拠を`prototype/qa/`へ追加または更新する
19. `task-list.md`を`review_ready`へ更新する
20. `NEXT_WORK.md`を確認担当向けに更新する
21. 変更をcommit、pushし、Pull Request #1を更新する
22. 最新Pull Request CIを確認し、再確認対象HEADを固定する

## Change allowed

- GitHub ActionsとPages公開状態の確認
- 公開証拠の更新
- `prototype/qa/pages-deployment.json`
- 必要な確認証拠
- `task-list.md`
- `NEXT_WORK.md`
- Public deployを発火するために必要な、既存方針に沿った最小限の管理変更
- 公開確認で実不具合が発見された場合の必要最小限のコード、CSS、テスト、設計文書、生成成果物修正

## Change forbidden

- `main`へのマージ
- Pull RequestのReady for review変更
- `work`の削除
- force push、rebase、squash
- 問題一覧の番号入力と一覧スクロールを今回のBlocking修正へ混在させること
- Java Learning Labの実装開始
- Pages証拠だけを更新し、実際の公開Revisionを照合しないこと

## Completion criteria for this fix

- 最新`work`のPages deploy jobがsuccess
- 最新公開RevisionとRepository内`docs/`の一致を証明できる
- 必須公開スモーク項目が成功
- `prototype/qa/pages-deployment.json`が最新deployを記録
- Pull Request CIがsuccess
- `task-list.md`が`review_ready`
- `NEXT_WORK.md`が確認担当向け
- Pull Request #1がDraft / Open / Unmerged
- 再確認対象HEADが固定されている

## Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- GitHub Actionsで一部ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点は、現タスク完了後に運用意図を確認する余地がある

## User memo for next implementation

次の内容は今回のBlocking修正へ追加せず、JLL-FE-001完了後の次回実装候補として保持する。

- 問題一覧の進捗表示「1 / 10」の左側を数値入力にし、入力した問題番号へ直接移動できるようにする
- 問題一覧の件数が多い場合は、問題一覧の領域内にスクロールバーを表示する
- 基本情報の演習解説を、根拠、選択肢ごとの判断、関連知識まで含む詳細な内容へ改善する

## Next user command

`修正`
