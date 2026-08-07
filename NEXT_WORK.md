# Next Work

## Current Task ID

`JLL-FE-LESSON-001`

## Current phase

`planned`

## Next role

実装担当。

`JLL-FE-004`は確認担当の独立確認でBlocking findingなしと判定済み。PR #5のmerge commit方式での`main` merge、`work`同期、最終Pages確認はこの確認チャット内で完了させる。次の新規チャットではRepositoryの最終実状態を再確認してから`JLL-FE-LESSON-001`を開始する。

## Objective

FE Learning Labの既存レッスン画面を学習用途として具体化し、最初のレッスン作成範囲を単一タスクとして設計・実装する。Java Learning Labや問題バンク拡充へ先行せず、既存FEレッスンの構造・学習順序・本文・例・確認項目を実用レベルへ進める。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-LESSON-001`
- Task status: `planned`
- Pull Request: 未作成
- Start HEAD: 実装開始時の最新`work` HEADをGitHub実状態から固定する
- Current HEAD: この管理文書更新以後の最新`work` HEADをGitHub実状態の正本とする
- Predecessor: `JLL-FE-004` / confirmation passed / PR #5 finalization in progress in the confirmation chat

## Purpose and first implementation step

実装開始時は次を順に行う。

1. `main` / `work` HEAD、差分、未マージPR、CI、Pages、`task-list.md`、`NEXT_WORK.md`を再確認する
2. Root `DESIGN.md`と`prototype/DESIGN.md`、既存`FeLessonHome`および関連コンポーネント・CSS・テストを確認する
3. 既存設計方針だけで最初のレッスン範囲を決定できる場合はそのまま具体化する。UI構成に重大な複数案がある場合のみ候補を提示して確認する
4. 必要なら実装前にRoot / prototype `DESIGN.md`を更新する
5. `work`上で単一タスク範囲として実装し、必須検証、`docs/`生成、PC / スマートフォン表示確認、Draft PR、CI、Pagesまで進める

## Change scope

- 既存レッスン画面・データ構造・学習導線の確認
- 最初に提供するレッスン単元と学習順序の具体化
- 到達目標、本文、例、確認ポイントの実装
- レッスン表示に必要な最小限のUI / CSS変更
- 必要なテスト、設計文書、管理文書、Pages成果物の更新

## Change forbidden

- 問題本文、選択肢、正答、解説内容の改変
- `JLL-FE-004`で確定した演習・模試UIを目的外に再変更すること
- `JLL-FE-003`で確定した絞り込み順序・配置・単元名表示を再変更すること
- `JLL-FE-QBANK-001`を同時に開始すること
- Java Learning Labの先行実装
- 実装担当による`main` merge
- Ready for review化、squash merge、rebase merge、force push、`work`削除

## Completion criteria

- 最初のレッスン作成範囲がRepository管理文書に具体化されている
- 学習順序、到達目標、本文、例、確認項目が実際の画面で利用できる
- 必要なUI変更が`DESIGN.md`と整合する
- FE演習・模試・絞り込み・履歴に意図しない回帰がない
- test、typecheck、lint、normal build、Pages buildが成功する
- `docs/`が最新buildから生成される
- PC / スマートフォン表示を確認する
- Draft PR `work` → `main`を作成または更新する
- CIとPages公開Revisionを確認する
- `task-list.md`と`NEXT_WORK.md`を`review_ready`向けに更新し、固定HEADと証拠を記録する

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

UI変更がある場合は既存browser auditと、対象レッスンのPC / スマートフォン表示を確認する。追加の自動browser auditが費用対効果に見合う場合はタスク内で追加する。

## Dependencies and queued work

1. `JLL-FE-LESSON-001`: current / next implementation
2. `JLL-FE-QBANK-001`: lesson task完了後。Google Driveの調査メモを着手時に参照し、公式一次資料を正本として問題バンクを拡充する
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## Unresolved findings

なし。`JLL-FE-004`の確認Blockingは解消済み。

## Latest user correction / memo

保留メモ「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」は`JLL-FE-003`で実装済みのため追加対応不要。

## Completion updates

`JLL-FE-LESSON-001`を`review_ready`へ渡すときは最低限次を更新する。

- `task-list.md`: status、目的、範囲、対象外、完了条件、依存、Branch、PR、Start HEAD、Current HEAD、検証、Pages、次タスク
- `NEXT_WORK.md`: 確認担当が単独で開始できる固定HEAD・検証証拠・未解決事項
- `PROJECT_CONTEXT.md`: 優先タスクや確定方針に変更がある場合
- Root / prototype `DESIGN.md`: UI方針を変更した場合

## Next user command

`実装`
