# Next Work

## Current Task ID

`JLL-JAVA-001`

## Current phase

`planned`

## Role

次の担当は実装担当。

新しいチャットでRepository実状態を再取得し、Java Learning Labの設計、既存実装、テスト、未完了範囲を確認してから、単一の実装タスクとして具体化して着手する。

## Objective

Java Learning Labの現在状態をRepositoryから再構成し、目的、対象範囲、対象外、完了条件、検証方法を確定したうえで実装を再開する。

`JLL-FE-001`と`JLL-FE-002`は確認合格済みである。FEの追加変更はこのタスクへ混在させない。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Previous Pull Request: `#3`
- Previous task: `JLL-FE-002` / completed
- Previous fixed implementation HEAD: `ca5212d91b3b9792a53d0fac4bc7f69648682798`
- Previous fixed review handoff HEAD: `0c40a622e4c42b2a61eb2410bd2a3aaf136c32de`
- Previous final pre-review HEAD: `238579965c75b0e87a8ce98054e8d6eba8e1210e`
- Current `work` HEAD: 確認担当がPR #3のmerge後に最新`main`へ同期する。実装開始時にGitHub実状態から再取得する

## Previous task result

`JLL-FE-002`はPages公開依存項目を除く全完了条件に合格した。

- 受験科目: 独立領域を維持
- 対象: 既存4条件群だけ
- Layouts: `filterLayout=1|2|3`
- Standard CI: `31137755993` / run `294` / success
- Tests: 56 / 56 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Browser audit: `31137755953` / run `7` / success
- Coverage: 3 patterns × 375px / 768px / 1280px
- Blocking findings: none

## Required startup work

1. Repository、`main`、`work`、Open Pull Request、最新CIを再取得する
2. Root `AGENTS.md`、`PROJECT_CONTEXT.md`、`task-list.md`、この`NEXT_WORK.md`を確認する
3. Rootおよび`prototype/`の`DESIGN.md`を確認する
4. Java Learning Labに関係するsrc、tests、scripts、routing、build設定を特定する
5. 現在実装済みの機能、未完了機能、壊れている経路、テスト不足を整理する
6. 1件の実装タスクとして目的、範囲、対象外、完了条件、依存関係を`task-list.md`へ具体化する
7. UIまたは画面構成を変更する場合は、実装前に`DESIGN.md`を更新する
8. `work`で実装し、テスト、型検査、Lint、通常build、Pages buildを実行する
9. `docs/`を最新生成物へ更新する
10. Draft Pull Requestを作成または更新し、CI成功または失敗原因特定まで進める
11. `task-list.md`を`review_ready`へ更新し、この文書を確認担当向けに更新する

## Change allowed

- Java Learning Labに必要なReact、CSS、データ、テスト、scripts、build設定
- Java Learning Labに関係するRootおよび`prototype/`の設計・管理文書
- Java公開成果物を含む`docs/`

## Change forbidden

- 完了済みFE機能の追加仕様変更
- FE問題データ、問題本文、選択肢、正答、解説、図表の変更
- `work` Branchの削除
- force push、squash merge、rebase merge
- Pages障害の復旧をJava実装へ混在させること

## Completion criteria for implementation role

- Java Learning Labの現状と未完了範囲がRepository根拠で具体化されている
- 目的、範囲、対象外、完了条件、検証方法が管理文書へ記録されている
- 必要な設計更新が実装前に行われている
- 実装と自動テストが完了している
- `npm test`、`npm run typecheck`、`npm run lint`、`npm run build`、`npm run build:pages`が成功している、または失敗原因が特定されている
- `docs/`が最新生成物である
- Draft Pull Requestが存在する
- CIが成功している、または失敗理由が管理文書へ記録されている
- `task-list.md`と`NEXT_WORK.md`が確認担当向けに更新されている

## Temporary GitHub Pages policy

GitHub Pagesが正常完了可能と確認され、ユーザーまたはRepository管理文書で解除されるまで次をスキップする。

- Pages deploymentの手動実行・再実行
- 公開Revision一致確認
- 公開画面、Console、Network確認
- Pages障害だけを理由にした`blocked`または`needs_fix`

通常build、テスト、型検査、Lint、Pages build、Pages artifact uploadは継続する。

## User latest instructions

- 次の作業はRepositoryの現在状態を正本として再開する
- 進行中タスクは同時に1件だけとする
- UI変更時は設計方針を先に確定し、管理文書へ反映する

## Work completion updates

実装完了時に最低限、次を更新する。

- `task-list.md`
- `NEXT_WORK.md`
- 必要な`DESIGN.md`
- `docs/`
- Draft Pull Request本文
- 固定HEAD、CI、検証証拠

## Next user command

`実装`
