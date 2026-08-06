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
8. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を実ブラウザで利用できる
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

`9633c88f214c719ee8413e93be87821a9dd31257`

確認担当はこのHEADのPages artifactと実画面を独立確認した。管理文書更新後のHEADはPull Requestから再取得する。

### Verification result

#### Passed checks

- Pull Request #1はDraft / Open / Unmerged、Base `main`、Head `work`
- PR用Workflow run `31077783324` run number `172`のbuildは成功
- Pages deployment evidenceはsource revision `b7ec726bc36e4d051344ee9c62adbd2dfcdd7349`、run `31077780284` run number `171`、public smoke check success
- Pages artifactを取得し、`index.html`、`404.html`、`.nojekyll`相当、静的アセット、問題JSON、問5・問6・問7のSVGを確認
- 公開問題JSONには1,977問、科目A 1,810問、科目B 167問、2022年12月サンプルは科目A 60問・科目B 20問存在
- 375px、768px、1280pxで科目A問5・問6・問7を実ブラウザ表示
- 3図表に代替テキストがあり、ページ全体の横スクロールなし
- 科目A問9は画像なし、4選択肢、正答`エ`
- 上記画面でConsole error、Page error、HTTP error、Request failureは0件
- キーボードフォーカスの可視アウトラインを確認

#### Blocking issue

実行時に画面へ渡される統合済み問題バンクから、科目Bの159問が誤って除外される。

実測:

- 配信済み基本問題JSON: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題JSON: 科目A 20問
- 期待する統合結果: 1,997問（科目A 1,830 / 科目B 167）
- 実際の画面上の統合結果: 1,838問（科目A 1,830 / 科目B 8）
- 誤除外: 科目B 159問
- 2022年12月公開サンプル科目B: JSONには20問あるが画面では0問
- 科目B公式サンプル開始ボタン: disabled

再現手順:

1. GitHub Pages成果物または同一artifactを開く
2. FE Learning Lab → 演習・模試
3. 科目Bを選択する
4. 模擬試験 → 2022年12月公開サンプル問題
5. 「0問が対象」と表示され、「公式サンプル問題を開始」が無効になる

原因:

- `prototype/src/FeLearningApp.jsx`の`normalizedFingerprint()`が、出典ベースの重複判定キーを`sourceCategory`、`periodId`、`sourceQuestionNumber`だけで作成している
- 科目をキーに含めていないため、同一開催回・同一問番号の科目Aと科目Bが同一問題と誤判定される
- 例: `fe-ipa-2022sample-b-001`は科目A問1と衝突する
- 現行`prototype/tests/fe-official-sample.test.mjs`は生の基本問題JSONを直接`selectPracticeQuestions()`へ渡しており、実行時の`mergeQuestionBanks()`を経由しないため不具合を検出できない

### Required fix

1. 出典ベースの重複判定キーへ少なくとも`subject`を含め、科目Aと科目Bを別問題として扱う
2. 実行時と同じ問題バンク統合処理をテスト可能なモジュールへ分離またはexportする
3. 基本1,977問と補足20問を統合した結果が1,997問、科目A 1,830問、科目B 167問になる回帰テストを追加する
4. 統合済み問題バンクに対し、2022年12月公開サンプルが科目A 60問・科目B 20問で公式問番号順になるテストを追加する
5. 科目B公式サンプル画面で20問が対象となり、開始可能であることをブラウザ検証する
6. 科目Bの回答、解説、保存、再読込後の復元、履歴、復習、再挑戦をブラウザ検証する
7. `npm run verify:fe`、最新HEADのCI、`docs/`再生成、GitHub Pages再公開を行う
8. Pull Request本文、監査記録、`task-list.md`、`NEXT_WORK.md`を実結果へ更新する

### Non-blocking issue

- `prototype/src/FeSessionView.jsx`の既存`react-hooks/exhaustive-deps` warning 1件。今回のBlocking修正とは分離してよいが、残存を記録すること。

### Merge commit

未マージ。Blocking問題のためマージ禁止。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- 最新確認済み公開source revision: `b7ec726bc36e4d051344ee9c62adbd2dfcdd7349`
- 科目A図表の公開確認: 合格
- 科目B実行時統合: 不合格

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
