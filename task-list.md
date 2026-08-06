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

1. 科目A 60問、科目B 20問の2022年12月公開サンプルが公式問番号順で揃う
2. 公式冊子上で図表が必要な科目A問5、問6、問7に`image`ブロックが保持される
3. 科目A問9は公式構成どおり、本文と4選択肢を持つテキスト問題として保持される
4. 画像参照先がbuild後とGitHub Pages上で取得可能である
5. `npm run verify:fe`が成功する
6. 全自動テスト、TypeScript、ESLint、通常build、Pages buildが成功する
7. `docs/`が最新の実装Revisionから再生成される
8. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を維持する
9. Draft Pull Request #1のCIが成功する
10. GitHub Pagesが最新実装相当の成果物を公開し、公開スモークテストが成功する
11. `task-list.md`、`NEXT_WORK.md`、監査記録、Pull Requestの説明がGitHub実状態と一致する
12. 確認担当が固定HEAD、実差分、複数画面幅、コンソール、ネットワークを独立検証できる

### Completion status

- 条件1: 達成。科目A 60問、科目B 20問、公式問番号順を自動テストで確認
- 条件2: 達成。問5、問6、問7の補完SVGを構造化`image`ブロックとして保持
- 条件3: 達成。問9をテキスト問題として検証
- 条件4: 達成。公開スモークテストで3 SVGをHTTP取得し、非空を確認
- 条件5: 達成
- 条件6: 達成。ESLintは0 errors、既存のHook依存warningが1件
- 条件7: 達成
- 条件8: 既存自動テストを含む全43テスト成功
- 条件9: 達成
- 条件10: 達成
- 条件11: 本管理文書更新とPR本文更新で達成
- 条件12: 確認担当の独立検証待ち

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

### Fixed implementation HEAD

`56482206a7aa24910148aff661fb0ab598316261`

このHEADで、問5・問6・問7の公開図表検証を含むWorkflow定義まで固定した。

### Generated output and deployment evidence HEAD before management-document updates

`bd339fd9355216fea3c381b8ff14d9491949e35a`

管理文書更新後の最終`work` HEADは、確認担当がPull Request #1から再取得して固定する。

### Verification result

#### Pull Request verification

- Workflow: `Build and deploy GitHub Pages`
- Run ID: `31077350598`
- Run number: `162`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Result: success
- `npm run verify:fe`: success
- Tests: 43 total / 43 passed / 0 failed / 0 skipped
- TypeScript: success
- ESLint: 0 errors / 1 warning
- Existing warning: `prototype/src/FeSessionView.jsx`の`react-hooks/exhaustive-deps`
- Normal build: success
- Pages build: success
- Pages artifact: success

#### Work push and public deployment

- Workflow run ID: `31077346989`
- Run number: `161`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Build: success
- Generated data and`docs/` commit: success
- Deploy: success
- Public resource smoke test: success
- Verified published figures:
  - `assets/fe/a-2022-005-figure.svg`
  - `assets/fe/a-2022-006-figure.svg`
  - `assets/fe/a-2022-007-figure.svg`

### Merge commit

未マージ

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Deployment status: success
- Public smoke check: success
- Published source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Evidence: `prototype/qa/pages-deployment.json`

### Resolved blocking issue

固定同期元の問5・問6・問7レコードには、公式冊子に存在する図表データが含まれていなかった。同期元に存在しない情報を推測フィールドから抽出する方法では復元できないため、公式冊子と照合した補完SVGをRepository管理下へ追加し、同期時に該当問題へだけ付与した。

以前の引継ぎでは問9も図表必須としていたが、公式冊子上の問9はテキスト問題であるため、その前提を訂正した。問9は問題文、4選択肢、正答を自動テストで固定している。

### Remaining review items

確認担当は、最新Pull Request HEADを固定し、次を独立検証する。

- `main`との差分と変更禁止範囲
- `npm ci`と`npm run verify:fe`
- 375px、768px、1280px以上で問5・問6・問7を表示
- 図表、本文、選択肢の可読性
- ページ全体の横スクロールがないこと
- Console error、Console warning、HTTP error、Request failure
- GitHub Pagesの実表示と公開資産
- 管理文書、PR、CI、Pagesの整合性

### Next task

`JLL-JAVA-001`は`planned`のまま維持する。`JLL-FE-001`が確認合格、merge、`work`同期、公開再確認を経て`completed`になるまで開始しない。

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
