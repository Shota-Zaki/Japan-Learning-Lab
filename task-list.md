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
- `main`へのマージ
- Pull RequestをReady for reviewへ変更すること
- 公式図表を欠落させた状態で固定サンプル模試を公開すること
- テスト要件を弱めてCIを通すこと

### Completion criteria

1. 科目A 60問、科目B 20問の2022年12月公開サンプルが公式問番号順で揃う
2. 科目Aの図表依存問題、少なくとも問5、問6、問7、問9に公式図表の`image`ブロックが保持される
3. 画像参照先がbuild後とGitHub Pages上で取得可能である
4. `npm run verify:fe`が成功する
5. 全自動テスト、TypeScript、ESLint、通常build、Pages buildが成功する
6. `docs/`が最新のソースRevisionから再生成される
7. 375px、768px、1280px以上で主要画面を確認する
8. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を確認する
9. Console error、Console warning、HTTP error、Request failureが0件である
10. Draft Pull Request #1のCIが成功する
11. GitHub Pagesが最新HEAD相当の成果物を公開し、公開スモークテストが成功する
12. `task-list.md`、`NEXT_WORK.md`、監査記録、Pull Requestの説明がGitHub実状態と一致する

### Dependencies

- 公式サンプル問題の図表データまたは図表参照元を、固定された正規データから取得できること
- GitHub ActionsとGitHub Pagesが利用可能であること

### Branch

`work`

### Pull Request

- Number: `#1`
- State: Draft / Open / Unmerged
- Base: `main`
- Head: `work`

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Application review target HEAD

`64ac59b5631507da07da459c1cc52e9ed9ffdffc`

このHEAD以後に管理文書commitが追加される。アプリケーション修正の再レビューでは、新しい実装HEADを改めて固定する。

### Verification result

Latest workflow at application review target:

- Workflow: `Build and deploy GitHub Pages`
- Run ID: `31073454949`
- Result: `failure`
- `npm run verify:fe`: failure
- Tests: 42 total / 41 passed / 1 failed
- Failed test: `subject A sample retains the four figure-dependent questions`
- Failure detail: `fe-ipa-2022sample-a-005 must retain its official figure`
- Typecheck, Lint, Pages build: 未実行。テスト失敗で後続工程が停止
- Deploy job: skipped

### Merge commit

未マージ

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Last successful deployment record: Run `31068718621`
- Last successful source revision: `a0a3f665dbe9ccb8cbcd829cd7d8af69171996a7`
- Current application review target is newer than the published source revision
- 最新変更は未公開

### Current blocking issue

科目Aの2022年12月公開サンプル問5に、公式図表を表す`image`ブロックが保持されていない。サンプル60問の件数と順序は満たしているが、公開に必要な図表完全性を満たしていない。

### Required fix

- 正規データ内で問5の図表が格納されている実際のフィールド構造を特定する
- `prototype/scripts/complete-fe-sample-set.mjs`の図表抽出処理を修正する
- 問5、問6、問7、問9の図表を保持する
- テストを弱めずに全検証を成功させる
- Pages成果物を再生成し、公開画面で図表を確認する

### Next task

`JLL-JAVA-001`は`planned`のまま維持する。`JLL-FE-001`が`completed`になるまで開始しない。

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

未作成。必要に応じて既存PR完了後に新しいDraft Pull Requestを作成する。
