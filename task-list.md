# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Purpose

Repository内のJava Learning Labの設計、既存実装、テスト、未完了範囲を再確認し、単一の実装タスクとして再開できる状態にする。

### Scope

- Rootおよび`prototype/`配下の管理文書、設計文書、既存Java実装、テストの確認
- 現状と完了条件の確定
- 必要な場合の`DESIGN.md`先行更新
- `work` BranchでのJava Learning Lab実装
- 自動テスト、型検査、Lint、通常build、Pages build、artifact upload

### Out of scope

- `JLL-FE-001`の追加仕様変更
- GitHub Pages障害の復旧作業
- Pages復旧前のdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

次回の実装担当がRepository実状態を確認し、Java Learning Labの現在設計と未完了範囲を具体化した後、`task-list.md`と`NEXT_WORK.md`へ実装範囲、対象外、完了条件、検証方法を記録して実装を進める。

### Dependencies

- `JLL-FE-001`の確認合格とmerge commit
- `work` Branchの最新`main`同期

GitHub Pages公開成功は開始条件に含めない。

### Branch

`work`

### Pull Request

未作成。実装開始後に必要なDraft Pull Requestを作成する。

### Start HEAD

`JLL-FE-001`のmerge commitと`work`同期完了後のHEADを、実装開始時に記録する。

### Current HEAD

確認工程完了時に更新する。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。Pages deployment、公開Revision一致、公開画面確認、公開証拠同期はBlocking条件にしない。

### Next task

Java Learning Labの現状調査後に決定する。

---

## Completed task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試、演習ナビゲーション、詳細解説を完成させる

### Status

`completed`

### Purpose

FE演習機能を、公式問題データ、複合絞り込み、科目A・科目B、模擬試験、履歴、結果レビュー、問題移動、詳細解説まで含めて完成させる。

2026-08-07のユーザー指示により、GitHub Pages deployment、公開Revision一致、公開画面確認、`docs/`成功同期はBlocking完了条件から除外し、延期項目として扱う。

### Scope completed

- Repository直下`docs/`へのPages成果物生成処理
- 科目A・科目Bの通常演習
- ランダム模擬試験
- 2022年12月公開サンプル模擬試験
- 複合絞り込みとコンパクトグリッド表示
- 項目名の全文表示、条件群の可変高さ、条件群内スクロール廃止
- 構造化問題・図表・解説表示
- 模擬試験中の正誤・解説非表示
- 完了後の問題別レビュー
- セッション保存、再開、履歴、復習、再挑戦
- 問題番号入力による直接移動
- 範囲外入力の拒否と許容範囲表示
- 問題一覧領域の高さ制限と内部縦スクロール
- 正答、正答根拠、選択肢ごとの判断、関連知識を含む詳細解説
- 自動テスト、型検査、Lint、通常build、Pages build、artifact upload
- 固定CI artifactを用いたPC・タブレット・スマートフォン幅の独立ブラウザ確認

### Out of scope retained

- Java Learning Labの実装
- 問題データに存在しない技術的根拠の生成
- GitHub Pages障害を回避する追加workflow
- GitHub Pages障害中の連続retry
- Pages公開成功まで本タスクのマージを停止すること

### Completion criteria result

1. 2022年12月公開サンプルは科目A 60問、科目B 20問で公式問番号順に揃う: pass
2. 科目A問5、6、7の図表と問9の本文・選択肢を維持する: pass
3. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦を利用できる: pass
4. 模擬試験中は正誤と解説を隠す: pass
5. 完了後は問題文、ユーザー回答、正答、判定、詳細解説を確認できる: pass
6. 公式サンプル模試の履歴に対象セットを表示する: pass
7. 絞り込みはコンパクトグリッド型のみを使用する: pass
8. 項目名を省略せず全文表示する: pass
9. 条件群は可変高さで内部縦スクロールなしとする: pass
10. 問題番号へ数値入力とEnterまたは移動ボタンで直接移動できる: pass
11. 範囲外の問題番号は移動せず、入力可能範囲を表示する: pass
12. 問題一覧が多い場合は一覧領域だけを縦スクロールでき、現在問題を視認できる: pass
13. 解説に正答、正答の根拠、選択肢ごとの判断、関連知識を表示する: pass
14. 選択肢別解説データを優先し、未登録時は捏造しない汎用説明を使用する: pass
15. 通常演習と模擬試験終了後レビューで同じ詳細解説構造を使用する: pass
16. `npm run verify:fe`、Pull Request CI、Pages build、Pages artifact uploadが成功する: pass
17. Pages deployment、公開Revision一致、公開画面確認、`docs/`成功同期を延期しBlocking条件にしない: applied
18. 固定HEADと`main`との差分を確認担当が独立検証する: pass

### Branch

`work`

### Pull Request

- Number: `#1`
- Base: `main`
- Head: `work`
- Review decision: pass
- Merge method: merge commit

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Fixed review HEAD

`d4003fbc2b80a05402100d5bbe4e51a44c87d21f`

### Confirmation evidence commit

`5d58f6c396721a4764218b27914c79702f3b2e57`

### Automated validation

Pull Request workflow run ID `31112859435`、run number `250`、build job ID `92654857512`は成功した。

- Application validation source: `1c102065233d67253ea89f71f41ff6c9e4aaca3d`
- Pull Request synthetic merge revision: `95966a21741ba9d06060ae6b10c377ce063675ca`
- `npm run verify:fe`: success
- Tests: 54 / 54 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact ID: `8972435856`
- Artifact digest: `sha256:e7ecf4b7966fcddfbc5d5b585f10397e8bfee669ec2baec226cf60a51fe16685`

### Question data result

問題数は基本バンクと実行時統合後を区別する。

- 配信基本問題バンク: 1,977問
  - 科目A: 1,810問
  - 科目B: 167問
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問
  - 科目A: 1,830問
  - 科目B: 167問
- 構造化済み科目B: 142問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

### Independent validation

固定CI artifactをローカル配信して確認した。

- 1,280px、768px、375pxで横方向のページはみ出しなし
- 絞り込み項目名の省略なし
- 条件群は可変高さ、条件群内縦スクロールなし
- 1,830問の問題一覧は内部縦スクロールあり
- 30問演習で問題30への直接移動、現在問題の視認、範囲外31の拒否を確認
- 通常演習回答後に正答、正答根拠、選択肢別判断、関連知識を確認
- 一時停止、端末保存、再読込後の再開を確認
- 科目B公式サンプル20問を開始可能
- 模擬試験中は正誤・解説を非表示
- 完了後は20問の問題別レビューを表示
- 履歴は`2022年12月公開サンプル問題`として識別

詳細証拠: `prototype/qa/fe-final-review-2026-08-07/audit.md`

### Merge commit

確認工程のmerge実行後に実SHAを記録する。

### GitHub Pages result

- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Pages build and artifact upload: success
- Latest deployment attempt: timeout / failure
- Public revision verification: deferred
- Public UI, Console, Network checks: deferred
- `docs/` successful deployment evidence sync: deferred
- Disposition: 2026-08-07のユーザー指示によりNon-blockingで延期

### Non-blocking issues

- GitHub Pages deployment queue/timeout
- GitHub Actionsで使用する一部upstream actionのNode.js 20非推奨warning
- Repository default Branchが`work`
- 隔離用Branch `pages-recovery`が残っている

### Next task

`JLL-JAVA-001`。FEタスクのmerge commitと`work`同期完了後、ユーザーの`実装`で開始する。