# JLL-FE-001 修正監査記録

## 対象

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Pull Request: `#1`
- 修正開始HEAD: `a1912c53719b64bfcc5b4e83bb5eb2bcf8ef5796`
- 実装Revision: `10af5e9e9489a39eec43efb77ca13087f748f07d`
- 生成成果物commit: `d832cddb2949a12c9fb1d53a031ac989f4400c19`

## 修正内容

### 完了済み模擬試験レビュー

- 結果画面の各問題をネイティブ開閉要素で展開可能にした
- 問題文、構造化コンテンツ、選択肢、ユーザー回答、正答、正誤または未回答、構造化解説を表示する
- 単一正答、複数正答、未回答を共通の表示モデルで扱う
- 模擬試験中の正誤・解説非表示を維持した
- キーボード操作とフォーカス表示を追加した

### 履歴表示

- 通常演習、ランダム模擬試験、公式サンプル模擬試験を区別する
- 公式サンプル模擬試験では保存済みのセット名を表示する
- 旧保存データでセット名が欠ける場合は安全な代替文言を表示する

### 絞り込み表示

- コンパクトグリッド型を正式採用し、表示切替を廃止した
- 条件群の高さを選択肢数に応じて個別に伸長させた
- 条件群内部の縦スクロールを廃止し、全選択肢を常時表示する
- 項目名の省略表示を廃止し、複数行へ折り返して全文表示する
- 375pxで1列、768pxで最大2列、1280px以上で最大3列の方針へ統一した

## 自動検証

GitHub Actions Pull Request run:

- Run ID: `31082788764`
- Run number: `195`
- Workflow: `Build and deploy GitHub Pages`
- Conclusion: success

`npm run verify:fe`結果:

- 通常build: success
- Tests: 50 / 50 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Pages build: success
- Pages artifact upload: success

追加テスト:

- 完了済みセッションの単一正答、複数正答、未回答レビュー
- 通常演習、ランダム模擬試験、公式サンプル模擬試験の履歴ラベル
- 絞り込みがコンパクトグリッド固定であること
- 省略表示と内部縦スクロールが存在しないこと
- 項目名が複数行表示可能であること
- 結果レビューにユーザー回答と解説が存在すること

## 回帰確認

- 2022年12月公開サンプル科目A: 60問、公式問番号順
- 2022年12月公開サンプル科目B: 20問、公式問番号順
- 科目B: 167問
- 科目A問5、問6、問7の図表参照を維持
- 科目A問9の本文、4選択肢、正答を維持
- セッション保存、復元、履歴、復習、再挑戦テスト成功

## 既知のNon-blocking

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- GitHub Actionsで一部ActionのNode.js 20非推奨warning

## 独立確認で必要な項目

- GitHub Pages上で絞り込み項目が省略されず、全件表示されること
- 各条件群の高さが内容量に応じて変わり、内部縦スクロールがないこと
- 完了済み模擬試験の問題別レビューを実操作で確認すること
- 375px、768px、1280px以上で横スクロール、フォーカス、コード・表の表示を確認すること
- Console error、Page error、HTTP error、Request failureを確認すること

## 次回実装メモ

次の内容は今回の修正対象外として保持する。

- 問題一覧の進捗表示左側を数値入力にし、問題番号へ直接移動できるようにする
- 問題一覧が多い場合に限り、問題一覧領域内へスクロールバーを表示する
