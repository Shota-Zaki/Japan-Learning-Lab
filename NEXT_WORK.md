# Next Work

## Current Task ID

`JLL-FE-QBANK-001`

## Current phase

`planned`

## Next role

実装担当。

## Objective

FE科目A問題バンクの現行収録範囲を年度・開催回・公開区分別に実測し、公式一次資料で設問・選択肢・正答・図表・出典を確認できる問題だけを追加する。外部サイトの2,960問相当は比較ベンチマークとして扱い、ユニーク問題数の目標値にはしない。

## Repository state at handoff

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-QBANK-001`
- Task status: `planned`
- Pull Request: 未作成
- Predecessor: `JLL-FE-LESSON-001` completed / PR #6 merged
- Predecessor merge commit: `2c3700f57f195199d365e009b7b9248746366eab`
- Predecessor final Pages evidence synchronization HEAD: `83a36279fa862cb974b40b8642cbf612eab04872`
- `task-list.md` handoff commit: `dba34c4f2a35a014124493c7ef17c2b6617f261a`
- Current `work` HEAD: この`NEXT_WORK.md`更新以後の最新HEADをGitHub実状態から再取得し、Task Start HEADとして`task-list.md`へ記録する

## Required startup checks

新規実装チャットでは過去チャットだけで開始せず、次をGitHub実状態から再確認する。

1. `main` / `work`最新HEADと差分
2. 未マージPR
3. `AGENTS.md`
4. `PROJECT_CONTEXT.md`
5. `task-list.md`
6. `NEXT_WORK.md`
7. `prototype/package.json` / lockfile
8. 関連する問題データ、同期・検証スクリプト、テスト
9. 最新CI / Pages
10. Google Drive調査メモを調査ナビとして参照し、採用データは公式一次資料で再確認

## Scope

- 現行科目A収録数を実データから再計測
- 年度・開催回・公開区分別に収録・欠落範囲を整理
- 公式一次資料から設問、選択肢、正答、図表、出典識別情報を確認
- 正規化指紋で重複を判定
- `canonicalQuestion`と`sourceOccurrence`を分離するデータモデルを優先検討
- 同一問題が複数開催回に現れる場合、問題本体を重複登録せず出典・開催履歴を維持できる構造にする
- 必要な同期・検証スクリプト、テスト、出典メタデータを更新
- 最終収録数と追加不可範囲・理由をRepository管理文書へ記録
- 作業量が大きい場合、競合を避けつつ小タスクへ分割する

## Change forbidden / out of scope

- 第三者サイトの問題文、選択肢、解説、画像の転載・スクレイピング再配布
- 出典未確認・不完全問題を件数合わせで追加
- 科目B問題バンクの増減
- 問題演習・絞り込み・模擬試験UIの目的外変更
- FEレッスン本文変更
- Java Learning Labの先行実装
- `docs/`手編集
- 実装担当による`main` merge、Ready for review化
- squash / rebase / force push / `work`削除

## Research reference

- Google Drive: [JLL-FE-QBANK-001 科目A問題バンク拡充 調査メモ](https://docs.google.com/document/d/1A1CvxwXzK5LvfxReNuSXrk5DZRdh4ZF-iWe35fhbNM4/edit)
- 目的: 公式一次資料の所在、外部サイトの収録規模、重複、著作権・出典要件、追加候補の優先順位を確認するための調査ナビ
- 既知の注意: 2,960は延べ収録規模として扱い、ユニーク問題数と同一視しない
- 正本: 問題本文・選択肢・正答・図表は必ず公式一次資料を採用根拠とする

## Completion criteria

- 年度・開催回・公開区分別の収録状況と欠落範囲をRepositoryへ記録
- 追加問題の公式一次資料出典と正答を追跡可能にする
- 既存問題を意図せず欠落・改変しない
- 選択肢、正答、重複、図表、出典の自動検証成功
- 2,960問相当との差を理由別に説明可能
- 最終収録数を`PROJECT_CONTEXT.md`と`task-list.md`へ反映
- `docs/`をbuildで生成
- Draft PR作成/更新
- CIとPagesを確認し、固定HEADと証拠を管理文書へ記録

## Required verification

```bash
cd prototype
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm run verify:fe
```

問題バンク固有の同期・検証scriptが存在する場合は、`prototype/package.json`と実装を再確認し、そのtask固有検証も実行する。UIに変更がない限り不要なUI変更・browser audit追加は行わないが、既存回帰workflowの状態は確認する。

## Predecessor final evidence

`JLL-FE-LESSON-001`は確認完了済み。

- PR #6: merged
- Merge commit: `2c3700f57f195199d365e009b7b9248746366eab`
- Final post-merge Pages workflow: `31189901419` / run `492`
- Build job `92903779534`: success
- Pages deployment: success
- Public revision verification: success
- Public smoke check: success
- Published sourceRevision: `2c3700f57f195199d365e009b7b9248746366eab`
- Pages evidence synchronization HEAD: `83a36279fa862cb974b40b8642cbf612eab04872`
- deploy job全体が`cancelled`表示なのは、公開・public smoke成功後に証拠commitをpushし、concurrency cancellationが発生したため。公開結果は成功

## Latest user memo

保留メモ「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」は`JLL-FE-003`で実装済みのため追加対応不要。

## Completion updates

実装担当は最低限以下を更新する。

- `task-list.md`: Start HEAD、status、scope、検証、PR、固定HEAD、Pages、次タスク
- `NEXT_WORK.md`: 確認担当が単独で独立確認できる具体的handoff
- `PROJECT_CONTEXT.md`: 問題バンク収録数、確定したデータモデル/出典方針、Pages状態
- 必要なRepository内の調査・出典記録

## Next user command

`実装`
