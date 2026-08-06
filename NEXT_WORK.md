# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`needs_fix`の実装担当修正工程（Pages deploy再試行）

## Role

次の担当は実装担当とする。Pull Request #1はDraft / Open / Unmergedのまま維持し、実装担当は`main`へマージしない。

## Objective

最新`work`の生成済み`docs/`をGitHub Pagesへdeployし、公開RevisionとRepository内成果物の一致を証明する。アプリケーションコードの修正は不要であり、公開workflowと検証証拠のみを対象とする。

## Current repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Independent review fixed HEAD: `fe1ee2aaaace3f89170544aaeca1a7d4d545d4e2`
- Latest workflow source before this retry: `80dc9748122060efa437540fb4474b5ce69fda19`
- Latest failed deployment evidence commit: `44fd83127c027ce1bf55aff5fcc7163ef676e9a1`
- Failed push workflow: run ID `31099619029`, run number `208`
- Successful Pull Request workflow: run ID `31099624881`, run number `209`
- この更新commitを新しいPages deploy sourceとして使用する

## Verified implementation state

- 絞り込み表示はコンパクトグリッド型に固定されている
- 項目名は省略されず複数行で表示する
- 条件群は内容量に応じて伸長し、内部縦スクロールを使用しない
- 模擬試験中は正誤と解説を表示しない
- 完了後は問題文、ユーザー回答、正答、判定、選択肢、解説を表示する
- 履歴は通常演習、ランダム模擬試験、公式サンプル模擬試験を区別する
- Tests: 50 / 50 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- 科目B: 167問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

## Pages failure diagnosis

run `208`ではbuild、`npm run verify:fe`、Pages artifact uploadはすべて成功した。`actions/deploy-pages@v4`はsource revision `80dc9748122060efa437540fb4474b5ce69fda19`のdeployment作成にも成功したが、GitHub Pages側の状態が10分間`deployment_queued`のまま変化せず、actionの既定timeoutでcancelledとなった。

アプリケーション、生成成果物、artifact、権限、deployment作成処理の失敗ではない。既存deploymentがcancelledとなった後、Branchをdeploy前に変更しない現行workflowで新しいsource commitを使用して再試行する。

## Required work

1. このcommitをsourceとするpush workflowを完走させる
2. build、artifact upload、deployをsuccessにする
3. 公開`build-info.json`のsourceRevisionをsource commitと照合する
4. 公開`index.html`のJS/CSS資産をRepository内`docs/`と照合する
5. 公開データ、科目A問5・6・7の図表資産をHTTP取得する
6. `prototype/qa/pages-deployment.json`へrun ID、run number、source revision、公開資産、スモーク結果を記録する
7. `prototype/qa/pages-deployment-failure.json`を削除する
8. `task-list.md`を`review_ready`へ更新する
9. `NEXT_WORK.md`を確認担当向けに更新する
10. Pull Request #1の説明を最新状態へ更新する
11. 最新Pull Request CIを確認し、再確認対象HEADを固定する

## Change forbidden

- `main`へのマージ
- Pull RequestのReady for review変更
- `work`の削除
- force push、rebase、squash
- 問題一覧の番号入力と一覧スクロールの実装
- 演習解説詳細化の実装
- Java Learning Labの実装開始

## Completion criteria

- 最新Pages deploy job: success
- 公開RevisionとRepository内`docs/`: 一致
- 公開スモーク: success
- Pull Request CI: success
- `task-list.md`: `review_ready`
- `NEXT_WORK.md`: 確認担当向け
- Pull Request #1: Draft / Open / Unmerged
- 再確認対象HEAD: 固定済み

## Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- 一部GitHub ActionのNode.js 20非推奨warning
- Repository default branchが`work`である点

## User memo for next implementation

- 問題一覧の進捗表示「1 / 10」の左側を数値入力にし、入力した問題番号へ移動する
- 問題一覧が多い場合、問題一覧領域内へスクロールバーを表示する
- 基本情報の演習解説を、根拠、選択肢ごとの判断、関連知識まで含む内容へ改善する

## Next user command

`修正`
