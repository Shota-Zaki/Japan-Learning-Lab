# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試を完成させる

### Status

`needs_fix`

### Purpose

FE Learning Labの演習機能を、公式問題データ、複合絞り込み、科目A・科目B分離、科目B演習、構造化表示、模擬試験、履歴復元、GitHub Pages公開まで含めて完成させる。

### Scope

- Repository直下`docs/`へのPages成果物生成
- 深いURLの再読込対応
- 科目Aと科目Bの単一選択
- 分野、単元、開催回、回答状態の複数選択
- 各条件群の全選択・全解除
- 選択中条件の上部表示
- 折りたたみ型とコンパクトグリッド型
- 同一条件群OR、条件群間AND
- 科目Bの実演習
- 科目Bの単一正答・複数正答
- 問題本文、コード、表、リスト、注記、画像、解説の構造化表示
- ランダム模擬試験
- 2022年12月公開サンプル問題の固定模擬試験
- 科目A免除制度問題の補足収録
- セッション保存、再開、履歴、復習、再挑戦
- 完了済み模擬試験の回答・正答・解説レビュー
- 模擬試験種別と対象セットを識別できる履歴表示
- CI、GitHub Pages、公開スモークテスト
- 管理文書とGitHub実状態の整合

### Out of scope

- Java Learning Labの新規実装または再開
- FEとJavaの同時進行
- 実装担当による`main`へのマージ
- 実装担当によるPull RequestのReady for review変更
- 公式図表を欠落させた状態で固定サンプル模試を公開すること
- テスト要件を弱めてCIを通すこと

### Completion criteria

1. 科目A 60問、科目B 20問の2022年12月公開サンプルが、実際に画面へ渡される統合済み問題バンク上で公式問番号順に揃う
2. 公式冊子上で図表が必要な科目A問5、問6、問7に`image`ブロックが保持される
3. 科目A問9は公式構成どおり、本文と4選択肢を持つテキスト問題として保持される
4. 画像参照先がbuild後とGitHub Pages上で取得可能である
5. `npm run verify:fe`が成功する
6. 全自動テスト、TypeScript、ESLint、通常build、Pages buildが成功する
7. `docs/`が最新の実装Revisionから再生成される
8. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を利用できる
9. 模擬試験中は正誤と解説を隠し、完了後は各問題のユーザー回答、正答、正誤、解説を確認できる
10. 公式サンプル模試の履歴が「通常演習」と誤表示されず、対象セットを識別できる
11. Draft Pull Request #1の最新実装HEADに対するCIが成功する
12. GitHub Pagesが最新実装相当の成果物を公開し、公開スモークテストが成功する
13. `task-list.md`、`NEXT_WORK.md`、監査記録、Pull Requestの説明がGitHub実状態と一致する
14. 確認担当が固定HEAD、実差分、複数画面幅、コンソール、ネットワークを独立検証できる

### Dependencies

- 固定された公式問題データ同期元
- 公式冊子と整合するRepository管理下の補完図表
- GitHub ActionsとGitHub Pages

### Branch

`work`

### Pull Request

- Number: `#1`
- State: Draft / Open / Unmerged
- Base: `main`
- Head: `work`

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Fixed review target HEAD

`64a8c62bd8af80e20715b4c8b03d95f56788cdfd`

### Verified implementation and deployment

- Implementation source revision: `eeb71ff55296687c4908240c7f92aae7ff9d3f6d`
- Generated output commit: `a6ce158e3c5daaf5f3d5cbd9e65f32666d5154be`
- Pages evidence commit: `64a8c62bd8af80e20715b4c8b03d95f56788cdfd`
- Push workflow run: `31079968039` / run number `191` / success
- Pull request workflow run: `31079972458` / run number `192` / success
- Public smoke check: success
- Independent review audit: `prototype/qa/fe-independent-review-2026-08-06/audit.md`

### Independent review passed checks

- 実行時相当の統合結果: 1,997問
- 科目A: 1,830問
- 科目B: 167問
- 2022年12月公開サンプル科目A: 60問、公式問番号順
- 2022年12月公開サンプル科目B: 20問、公式問番号順
- 科目B公式サンプルは20問対象で開始ボタン有効
- 科目B公式サンプルの開始、回答、見直し、全問完了、結果保存、履歴、再挑戦が動作
- 新規ページで進行中セッションを復元し、現在問、回答済み件数、選択済み回答を保持
- 科目A問5、問6、問7の図表を表示
- 科目A問9は画像なし、本文、4選択肢を表示
- 375px、768px、1280pxで全体の横スクロールなし
- 狭幅のコード表示は内部横スクロール
- キーボードフォーカス表示あり
- 検証中のConsole error、Page error、Request failureなし
- CI、Pages artifact、公開資産の整合を確認

### Blocking issues

#### B-01: 模擬試験終了後に解説を閲覧できない

模擬試験中は「正誤と解説を試験終了後に表示します」と案内されるが、終了後の結果画面は得点、集計、各問題の正誤だけを表示する。問題文、ユーザー回答、正答、解説へアクセスできる詳細レビュー導線がない。

「間違えた問題を復習」は新しい未回答セッションを開始する機能であり、完了済み模擬試験の解説確認ではない。

主な修正対象候補:

- `prototype/src/FeSessionView.jsx`
- 必要に応じて`prototype/src/FeRichContent.jsx`
- 結果画面関連CSS
- 結果画面関連テスト

#### B-02: 公式サンプル模試の履歴種別が誤表示される

科目Bの2022年12月公開サンプル模試を完了した履歴が「通常演習・20問」と表示される。公式サンプル模試であることと対象セットを履歴から識別できない。

主な修正対象候補:

- `prototype/src/FeHistoryView.jsx`
- 履歴表示関連テスト

### Required fixes

1. 完了済み模擬試験の結果から、各問題の詳細レビューを開けるようにする
2. 詳細レビューに問題文、ユーザー回答、正答、正誤、構造化解説を表示する
3. 模擬試験中は従来どおり正誤と解説を表示しない
4. 未回答、単一正答、複数正答を正しく表示する
5. 結果詳細のキーボード操作、フォーカス表示、見出し構造、読み上げ可能なラベルを整備する
6. 履歴ラベルを`mockMode`、`sampleSetLabel`などから生成し、公式サンプル模試を「通常演習」と表示しない
7. 完了後解説と履歴ラベルの自動テストを追加する
8. 既存の問題バンク統合、公式サンプル件数、図表、保存・復元を回帰させない
9. `npm run verify:fe`、Pages build、公開スモークテストを成功させる

### Non-blocking issues

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件
- GitHub Actionsが使用する一部ActionのNode.js 20非推奨warning。検証ランタイムはNode.js 22で成功

### Merge commit

未マージ。Blocking問題があるためPull Request #1をマージしない。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Verified source revision: `eeb71ff55296687c4908240c7f92aae7ff9d3f6d`
- Generated output commit: `a6ce158e3c5daaf5f3d5cbd9e65f32666d5154be`
- Workflow run: `31079968039` / run number `191`
- Deploy: success
- Public smoke check: success
- 公開自体は成功しているが、Blocking機能不足があるため確認合格とはしない

### Next task

`JLL-JAVA-001`は`planned`のまま維持する。`JLL-FE-001`が修正、再確認、merge、`work`同期、公開再確認を経て`completed`になるまで開始しない。

---

## Planned task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Dependency

`JLL-FE-001`の確認合格、`main`へのmerge commit、`work`同期、GitHub Pages再確認

### Branch

`work`

### Pull Request

未作成。既存PR完了後に必要に応じて新しいDraft Pull Requestを作成する。
