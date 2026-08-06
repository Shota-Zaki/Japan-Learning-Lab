# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試を完成させる

### Status

`review_ready`

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
9. Draft Pull Request #1の最新実装HEADに対するCIが成功する
10. GitHub Pagesが最新実装相当の成果物を公開し、公開スモークテストが成功する
11. `task-list.md`、`NEXT_WORK.md`、監査記録、Pull Requestの説明がGitHub実状態と一致する
12. 確認担当が固定HEAD、実差分、複数画面幅、コンソール、ネットワークを独立検証できる

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

### Review target HEAD

`10acc296f2d051d14a5c7f7d11b032ccf07fe46c`

このHEADは修正済みアプリケーション、回帰テスト、最新生成データ、`docs/`を含む。以後の管理文書のみのcommitを含む最新PR HEADは確認開始時に再取得する。

### Fix summary

確認担当が検出した実行時問題バンク統合の科目B誤除外を修正した。

- 統合処理を`prototype/src/feQuestionBank.js`へ分離
- `prototype/src/FeLearningApp.jsx`から共通統合処理を使用
- 重複fingerprintへ科目、出典座標、問題本文、構造化本文、選択肢、構造化選択肢、正答を含めた
- 同一出典番号を再利用する別問題を保持し、ID一致または内容一致の真の重複だけを除外
- 実行時と同じ統合処理を通す回帰テストを追加

### Verification result

#### Passed checks

- 実行時統合結果: 1,997問
- 科目A: 1,830問
- 科目B: 167問
- 2022年12月公開サンプル科目A: 60問、公式問番号順
- 2022年12月公開サンプル科目B: 20問、公式問番号順
- 科目B公式サンプルの設定件数20問でセッション選択成功
- 科目B複数正答の完全一致判定成功
- 回答、レビュー、停止、保存状態の正規化、復元、再開、完了の自動テスト成功
- 履歴由来の不正解、未回答、要復習スコープの自動テスト成功
- 科目A問5・問6・問7の図表参照を維持
- 科目A問9の本文、4選択肢、正答`エ`を維持
- `npm run verify:fe`: success
- Tests: 47 / 47 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success
- Generated output commit: `10acc296f2d051d14a5c7f7d11b032ccf07fe46c`
- Push workflow run `31079687176` run number `185`: build / deploy / public smoke success
- Pull request workflow run `31079690171` run number `186`: build success
- GitHub Pages deployment evidence source revision: `191749c850bd14b97b038a44024bb17b270af2b1`
- Audit: `prototype/qa/fe-question-bank-merge-fix-2026-08-06/audit.md`

#### Independent review required

確認担当は最新PR HEADを固定し、科目B公式サンプル画面で20問表示、開始ボタン、回答、解説、再読込後の復元、履歴、復習、再挑戦を実ブラウザで独立確認する。

### Non-blocking issue

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件。今回のBlocking修正とは分離する。
- GitHub Actionsが使用する一部ActionのNode.js 20非推奨warning。Workflow自体はNode.js 22で検証成功している。

### Merge commit

未マージ。実装担当のためマージ禁止。確認合格時に確認担当がmerge commit方式で処理する。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Source revision: `191749c850bd14b97b038a44024bb17b270af2b1`
- Generated output commit: `10acc296f2d051d14a5c7f7d11b032ccf07fe46c`
- Workflow run: `31079687176` / run number `185`
- Deploy: success
- Public smoke check: success

### Next task

`JLL-JAVA-001`は`planned`のまま維持する。`JLL-FE-001`が独立確認、merge、`work`同期、公開再確認を経て`completed`になるまで開始しない。

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
