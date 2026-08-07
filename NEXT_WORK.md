# Next Work

## Current Task ID

`JLL-JAVA-001`

## Current phase

`planned`

## Role

次の担当は実装担当。

新しいチャットでRepository実状態を再取得し、Java Learning Labの設計、既存実装、テスト、未完了範囲を確認してから実装を開始する。

## Objective

Java Learning Labの現在状態をRepositoryから再構成し、次の単一実装タスクとして具体化する。

`JLL-FE-001`は確認合格し、Pull Request #1をmerge commit方式で`main`へマージ済みである。確認工程では、この文書の更新後に`work`を最新`main`へfast-forward同期する。

次の実装担当は、GitHub実状態で`main`と`work`の同期を再確認してからJava作業を開始する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Previous Pull Request: `#1` / merged
- Previous task fixed review HEAD: `d4003fbc2b80a05402100d5bbe4e51a44c87d21f`
- Previous task final PR HEAD: `4e1b719ad6b7d620c795914ecd28efa1660c9b6f`
- Previous task merge commit: `afbbc24d375c699be0e7b0c5758d9318dc97c1d5`
- Previous task confirmation evidence: `prototype/qa/fe-final-review-2026-08-07/audit.md`
- Previous task application validation: workflow run `31112859435`, run number `250`, success
- Previous task final management validation: workflow run `31134642544`, run number `264`, success
- Current `work` HEAD: この文書更新後の最新`main`へ同期し、実装開始時に再取得する

## Previous task result

`JLL-FE-001`はPages依存項目を除く全完了条件に合格した。

- Tests: 54 / 54 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Independent artifact browser validation: pass
- Blocking findings: none

問題数は次の区分で記録する。

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）

## Temporary GitHub Pages policy

2026-08-07のユーザー指示により、GitHub Pagesが正常完了可能と確認され、方針が明示的に解除されるまで、Pages依存工程を全タスクでスキップする。

スキップ対象:

- Pages deploymentの手動実行または再実行
- 公開Revision一致確認
- 公開画面、Console、Network、公開リソースの確認
- deployment成功後にだけ行える`docs/`と公開証拠の同期
- Pages障害だけを理由にした`blocked`または`needs_fix`

継続対象:

- 通常build
- 自動テスト
- 型検査
- Lint
- Pages build
- Pages artifact upload
- 固定HEAD、差分、ソース、生成物の確認
- Pages以外の完了条件に基づく実装と確認

自動workflowでdeployが動作した場合も、Pages結果は判定に使用しない。手動retryは行わない。

## First implementation procedure

1. Repository、アクセス権、`main`、`work`、Open Pull Requestを再確認する
2. `work`が最新`main`と同期済みであることを確認する
3. Root `AGENTS.md`、`PROJECT_CONTEXT.md`、`task-list.md`、この文書を確認する
4. Rootおよび`prototype/`配下のJava関連設計文書を確認する
5. Java Learning Labの既存ソース、テスト、データ、ビルド経路を確認する
6. 未完了機能、回帰、技術的負債、設計不一致を整理する
7. UI方針変更が必要な場合は、実装前に`DESIGN.md`を更新する
8. `task-list.md`へ目的、範囲、対象外、完了条件、依存関係、開始HEADを記録し、状態を`in_progress`へ変更する
9. この文書を具体的な実装指示へ更新する
10. `work`上で実装する
11. テスト、型検査、Lint、通常build、Pages buildを実行する
12. Pages artifact uploadまで確認する
13. Pages deploymentと公開確認は一時スキップ方針に従って延期する
14. Draft Pull Requestを作成または更新し、`review_ready`まで自走する

## Change allowed

- Java Learning Labに関係するアプリケーションコード
- Java Learning Labのテスト、データ、設定
- 必要な設計文書
- `task-list.md`
- `NEXT_WORK.md`
- 通常buildおよびPages buildで生成される成果物
- Javaタスクの検証証拠

## Change forbidden

- FE問題本文、選択肢、正答、図表の意図しない変更
- `JLL-FE-001`の追加仕様変更をJavaタスクへ混在させること
- GitHub Pages障害の復旧作業
- Pages復旧前の連続retry
- Force push
- `work`の削除
- 実装担当による`main`へのマージ
- 参考元の固有名称をUI文言、設計文書、コード、コメント、識別子へ持ち込むこと

## Completion criteria for planning phase

- Java Learning Labの現在設計と実装状態をRepositoryから確認する
- 未完了範囲を具体的な単一タスクへ絞る
- 対象範囲、対象外、完了条件、検証方法を`task-list.md`へ記録する
- 必要なUI方針を`DESIGN.md`へ先行反映する
- `NEXT_WORK.md`を実装工程向けの具体的指示へ更新する
- `work`の開始HEADを記録する

## User latest instruction

2026-08-07: GitHub Pages公開工程はスキップして先へ進む。

## Next user command

`実装`
