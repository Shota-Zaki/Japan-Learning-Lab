# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`needs_fix`の修正工程

## Role

次の担当は、別の新しいチャットで実装担当として作業する。

確認担当は固定HEAD、Pull Request差分、GitHub Actions、Pages artifact、公開成果物、実ブラウザ操作を独立検証し、Blocking問題を2件確認した。Pull Request #1はDraft / Open / Unmergedのまま維持する。

## Objective

完了済み模擬試験の問題別解説レビューを実装し、公式サンプル模試の履歴種別を正しく表示する。既に修正済みの問題バンク統合、科目B件数、公式サンプル件数、図表、保存・復元を回帰させない。

## Repository state at handoff

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Fixed independent review target HEAD: `64a8c62bd8af80e20715b4c8b03d95f56788cdfd`
- Verified implementation source revision: `eeb71ff55296687c4908240c7f92aae7ff9d3f6d`
- Verified generated output commit: `a6ce158e3c5daaf5f3d5cbd9e65f32666d5154be`
- Review audit: `prototype/qa/fe-independent-review-2026-08-06/audit.md`
- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- 管理文書更新後の最新`work` HEADは作業開始時に再取得する

## Blocking issue B-01

### Title

模擬試験終了後に解説を閲覧できない

### Reproduction

1. FE演習で科目Bを選択する
2. 模擬試験を選択する
3. 2022年12月公開サンプル問題を選択する
4. 20問の模擬試験を開始する
5. 問題へ回答する
6. 模擬試験を終了する
7. 結果画面を確認する

### Expected

模擬試験中は正誤と解説を隠す。試験終了後は各問題について、最低限次を確認できる。

- 問題文と構造化コンテンツ
- ユーザー回答
- 正答
- 正誤または未回答
- 構造化解説

### Actual

模擬試験中は「正誤と解説を試験終了後に表示します」と案内されるが、終了後の結果画面には得点、集計、各問題の正誤だけが表示される。問題行は詳細表示へ遷移せず、ユーザー回答、正答、解説を閲覧できない。

「間違えた問題を復習」は新しい未回答の演習セッションを開始する。完了済み模擬試験の回答と解説を確認する機能ではない。

### Suspected files

- `prototype/src/FeSessionView.jsx`
- 必要に応じて`prototype/src/FeRichContent.jsx`
- 結果画面関連CSS
- 結果画面関連テスト

### Required implementation

1. `FeResultView`から各問題の詳細レビューを開けるようにする
2. 詳細レビューへ問題文、選択肢、ユーザー回答、正答、正誤、解説を表示する
3. 未回答を明示する
4. 単一正答と複数正答の両方を扱う
5. 模擬試験中の正誤・解説非表示は維持する
6. 問題行または詳細開閉UIをキーボードで操作可能にする
7. フォーカス表示、見出し、`aria-expanded`または適切なナビゲーションラベルを用意する
8. 狭幅画面で選択肢、コード、表、解説が全体横スクロールを発生させない

## Blocking issue B-02

### Title

公式サンプル模試の履歴種別が誤表示される

### Reproduction

1. 科目Bの2022年12月公開サンプル模試を完了する
2. 学習履歴を開く
3. 完了したセッションの説明を確認する

### Expected

履歴上で、公式サンプル模試であることと対象セットを識別できる。

例として、保存済み`sampleSetLabel`を使用して「2022年12月公開サンプル問題・20問」のように表示する。

### Actual

カード見出しは「科目B 模擬セッション」だが、説明が「通常演習・20問」と表示される。対象セットも表示されない。

### Suspected files

- `prototype/src/FeHistoryView.jsx`
- 履歴表示関連テスト

### Required implementation

1. 履歴カードの説明をセッション種別に応じて生成する
2. `config.type === "mock"`では通常演習用の`scopeLabel`を使用しない
3. `mockMode === "official-sample"`では`sampleSetLabel`を表示する
4. ランダム模擬試験と公式サンプル模試を区別する
5. 既存保存データで値が欠ける場合は安全なフォールバックを表示する

## Confirmed passing behavior to preserve

- 実行時統合問題バンク: 1,997問
- 科目A: 1,830問
- 科目B: 167問
- 2022年12月公開サンプル科目A: 60問、公式問番号順
- 2022年12月公開サンプル科目B: 20問、公式問番号順
- 科目B公式サンプルは20問対象で開始可能
- 科目B公式サンプルの回答、見直し、全問完了、結果保存、履歴、再挑戦
- 新規ページで進行中セッションの現在問、回答済み件数、選択済み回答を復元
- 科目A問5、問6、問7の図表
- 科目A問9の画像なし、本文、4選択肢
- 375px、768px、1280pxで全体横スクロールなし
- キーボードフォーカス表示
- 公開資産の取得成功

## Change allowed

- `prototype/src/FeSessionView.jsx`
- `prototype/src/FeHistoryView.jsx`
- 必要な共通コンポーネント
- 必要なCSS
- `prototype/tests/`配下の関連テスト
- `prototype/qa/`配下の検証記録
- `docs/`のbuild生成物
- `task-list.md`
- `NEXT_WORK.md`
- Pull Request本文

## Change forbidden

- `main`への直接変更またはマージ
- Pull RequestのReady for review変更
- `work`の削除
- force push、rebase、squash、履歴改変
- テスト要件の削減
- Java Learning Labの実装再開
- 問題本文、選択肢、正答、図表の意図しない変更

## Completion conditions

1. 完了済み模擬試験の各問題について問題文、ユーザー回答、正答、正誤、解説を確認できる
2. 模擬試験中は正誤と解説を表示しない
3. 未回答、単一正答、複数正答を正しく表示する
4. 公式サンプル模試の履歴が「通常演習」と表示されず、対象セットを識別できる
5. ランダム模擬試験、通常演習、公式サンプル模試の履歴ラベルを区別する
6. 完了後解説と履歴ラベルを自動テストで検証する
7. 問題バンク統合1,997問、科目B 167問、公式サンプルB 20問を維持する
8. 科目A問5、問6、問7の図表と問9の構成を維持する
9. 保存、復元、履歴、復習、再挑戦を回帰させない
10. 375px、768px、1280pxで全体横スクロールがない
11. キーボード操作、フォーカス表示、読み上げ可能なラベルを確認する
12. Console error、Page error、HTTP error、Request failureがない
13. `npm run verify:fe`が成功する
14. `docs/`を最新実装から再生成する
15. Pull Request #1のCIとGitHub Pages公開スモークテストが成功する
16. `task-list.md`、`NEXT_WORK.md`、監査記録、Pull Request本文を最新状態へ更新する
17. 状態を`review_ready`へ戻す

## Mandatory automated verification

- 完了済み模擬試験の結果詳細にユーザー回答、正答、解説が含まれること
- 模擬試験中の回答直後には正答と解説が表示されないこと
- 未回答の結果詳細が安全に表示されること
- 複数正答のユーザー回答と正答を集合として正しく表示すること
- 公式サンプル模試の履歴ラベルに対象セットが含まれること
- ランダム模擬試験が通常演習と誤表示されないこと
- 既存の`fe-official-sample`、`fe-session`、保存・復元テストが成功すること
- `npm run verify:fe`

## Mandatory browser verification

1. 科目Bの2022年12月公開サンプル20問を開始する
2. 回答後、模擬試験中に正答と解説が表示されないことを確認する
3. 未回答を含む状態と全問回答状態の両方で終了する
4. 結果画面から問題詳細を開き、ユーザー回答、正答、正誤、解説を確認する
5. 履歴に戻り、公式サンプル模試と対象セットの表示を確認する
6. 履歴から結果を再表示し、問題詳細を再確認する
7. 復習と再挑戦を確認する
8. 375px、768px、1280px以上で表示する
9. キーボード操作とフォーカス表示を確認する
10. Console error、Page error、HTTP error、Request failureを確認する
11. GitHub Pagesの公開画面で同じ導線を確認する

## Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- GitHub Actionsが使用する一部ActionのNode.js 20非推奨warning。検証ランタイムはNode.js 22で成功

## User memo for next implementation

- 問題一覧の進捗表示「1 / 10」の左側を数値入力にし、入力した問題番号へ直接移動できるようにする
- 問題一覧の件数が多い場合は、問題一覧の領域内にスクロールバーを表示する
- 現時点では実装せず、次の修正工程で既存UI、レスポンシブ表示、キーボード操作との整合を確認して対応する

## Latest user request

`メモ`

問題一覧の番号入力による直接移動と、多件数時の一覧内スクロールを次回修正項目として記録した。

## Work completion update targets

- `task-list.md`
- `NEXT_WORK.md`
- `prototype/qa/`の修正検証記録
- Pull Request #1本文またはコメント
- `docs/`の最新生成物
- Pages deployment evidence

## Next user command after implementation

`確認`
