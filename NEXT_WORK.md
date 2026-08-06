# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`needs_fix`の実装修正工程

## Role

次の担当は、別の新しいチャットで実装担当として作業する。

確認担当がBlocking問題を再現したため、Pull Request #1はマージせずDraft / Open / Unmergedのまま維持する。

## Objective

実行時の問題バンク統合で科目Bが誤って重複除外される不具合を修正し、科目B 167問と2022年12月公開サンプル20問を画面・演習・保存・履歴から利用可能にする。

## Repository state at handoff

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Review target HEAD: `9633c88f214c719ee8413e93be87821a9dd31257`
- Review result commit 1: `8d9231b7ef00c207f4caf9c3aa8ac90c9876152e`
- このファイル更新後の最新HEADはPull Requestから再取得すること
- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`

## Blocking issue

### Symptom

配信済みの基本問題JSONには科目B 167問、2022年12月公開サンプル科目B 20問が存在するが、実画面では次の状態になる。

- 全体: 1,838問
- 科目A: 1,830問
- 科目B: 8問
- 科目B公式サンプル: 0問
- 「公式サンプル問題を開始」: disabled

期待値:

- 基本問題JSON: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題JSON: 科目A 20問
- 統合結果: 1,997問（科目A 1,830 / 科目B 167）
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

### Reproduction

1. FE Learning Labを開く
2. 演習・模試を開く
3. 科目Bを選択する
4. 模擬試験を選択する
5. 2022年12月公開サンプル問題を選択する
6. 「0問が対象」と表示され、開始ボタンが無効になることを確認する

### Root cause

`prototype/src/FeLearningApp.jsx`の`normalizedFingerprint()`が、出典ベースの重複判定キーを次の3項目だけで作っている。

- `sourceCategory`
- `periodId`
- `sourceQuestionNumber`

`subject`を含めていないため、同一開催回・同一問番号の科目Aと科目Bが衝突する。

確認担当の再現集計:

- 誤って除外された科目B: 159問
- 2022年12月公開サンプル科目B: 20問すべて誤除外
- 例: `fe-ipa-2022sample-b-001`が科目A問1と同じfingerprintになる

現行`prototype/tests/fe-official-sample.test.mjs`は生の基本問題JSONへ直接`selectPracticeQuestions()`を適用しており、実行時の`mergeQuestionBanks()`を通らないため不具合を検出できない。

## Required implementation

1. `normalizedFingerprint()`の出典ベースキーへ少なくとも`subject`を追加する
2. 真の重複だけを除外し、科目Aと科目Bを別問題として保持する
3. `mergeQuestionBanks()`をテスト可能なモジュールへ分離するかexportする
4. 実行時と同じ統合処理を通す回帰テストを追加する
5. 統合結果が1,997問、科目A 1,830問、科目B 167問になることを固定する
6. 統合済み問題バンクで2022年12月公開サンプルが科目A 60問・科目B 20問、公式問番号順になることを固定する
7. 科目B公式サンプル画面で20問が対象となり、開始可能であることを検証する
8. 科目Bの単一正答・複数正答、解説、保存、再読込後の復元、履歴、復習、再挑戦を検証する
9. 既存の科目A問5・問6・問7の図表、問9のテキスト問題を回帰させない
10. `docs/`を最新実装から再生成する
11. Pull Request本文、監査記録、`task-list.md`、`NEXT_WORK.md`を実結果に合わせて更新する

## Main files to inspect

- `prototype/src/FeLearningApp.jsx`
- 問題バンク統合処理を分離する新規または既存モジュール
- `prototype/tests/fe-official-sample.test.mjs`
- 実行時統合結果を検証するテスト
- 必要に応じて`prototype/src/FePracticeSetup.jsx`
- 生成された`docs/`
- `task-list.md`
- `NEXT_WORK.md`
- Pull Request #1本文

## Allowed changes for implementation role

- 上記Blocking修正に必要なアプリケーションコード
- 回帰テスト
- 生成データと`docs/`
- 監査記録
- 管理文書
- Pull Request本文

## Forbidden changes

- Java Learning Labの実装再開
- Pull RequestをReady for reviewへ変更すること
- `main`へのマージ
- Squash merge、rebase merge、force push
- `work` Branchの削除
- テスト要件を弱めること
- 科目Bの問題を減らして期待値を8問へ合わせること

## Completion criteria

- 実行時統合結果: 1,997問
- 科目A: 1,830問
- 科目B: 167問
- 科目A公式サンプル: 60問
- 科目B公式サンプル: 20問
- 科目B公式サンプル開始ボタンが有効
- 科目Bの回答、保存、復元、履歴、復習、再挑戦が成功
- 375px、768px、1280px以上で主要画面に横スクロールなし
- Console error、Page error、HTTP error、Request failure 0件
- `npm run verify:fe`成功
- 最新実装HEADのCI成功
- `docs/`更新
- GitHub Pages再公開と公開スモークテスト成功
- 管理文書とGitHub実状態が一致

## Mandatory validation

Repository rootから:

```bash
cd prototype
npm ci
npm run verify:fe
```

追加自動検証:

- 実行時と同一の統合関数へ基本問題JSONと補足問題JSONを渡す
- 統合後の全体・科目別件数をassertする
- 科目B公式サンプル20問と問番号順をassertする
- 科目A公式サンプル60問と問番号順をassertする

追加ブラウザ検証:

- 科目B → 模擬試験 → 2022年12月公開サンプル問題
- 20問が対象と表示される
- 開始ボタンが有効
- 回答を保存し、再読込後に復元される
- 完了後に履歴を開ける
- 復習と再挑戦を開始できる
- 375px、768px、1280px以上
- ConsoleとNetworkを確認

## Review evidence already passed

次は回帰確認として再実施する。

- 科目A問5・問6・問7のSVGは375px、768px、1280pxで横スクロールなし
- 3図表に代替テキストあり
- 科目A問9は画像なし、4選択肢、正答`エ`
- 上記画面のConsole error、HTTP error、Request failureは0件
- キーボードフォーカスの可視アウトラインあり

## Non-blocking issue

`prototype/src/FeSessionView.jsx`に既存の`react-hooks/exhaustive-deps` warningが1件ある。今回のBlocking修正と分離してよいが、検証結果へ残すこと。

## Work completion updates

作業完了時に次を更新する。

- `task-list.md`: `review_ready`、最新HEAD、CI、Pages、ブラウザ証拠
- `NEXT_WORK.md`: 独立確認向け
- Pull Request #1本文
- 必要な監査記録
- `docs/`

## Latest user request

`確認`

確認結果は不合格。Blocking問題をRepositoryへ記録済み。

## Next user command

`修正`
