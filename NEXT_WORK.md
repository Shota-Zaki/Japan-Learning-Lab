# Next Work

## Current Task ID

`JLL-FE-004`

## Current phase

`review_ready`

## Next role

確認担当。

`JLL-FE-004`の実装、自己検証、Draft PR #5、PR CI、`work` Pages再公開、public smoke checkまで完了した。実装担当による`main`マージは行っていない。確認担当は固定HEADと実差分を独立検証し、Blockingなしの場合のみ管理文書更新とmerge commit方式のマージへ進む。

## Objective

FE演習について、次の4点をユーザー指定どおり修正する。

1. 問題文と解説の文字サイズ・太さ・構造に明確な差を付け、読み分けやすくする
2. 模擬試験の残り時間を画面右上へ固定し、スクロール中も常時確認できるようにする
3. 2022年科目Aサンプルを通常演習の出題対象から除外する
4. `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-004`
- Task status: `review_ready`
- Previous Task: `JLL-FE-003` / completed
- Previous Pull Request: `#4` / merged
- Previous Final Pull Request HEAD: `66ba0a45ba2cb963bb96fba144021073fb66e279`
- Previous merge commit: `90f33bbcb01792e22426123f90f454bf3a7e4134`
- Previous confirmation input HEAD: `31332628e5ad412c685c1e19f0c31eda99c51d43`
- Previous fixed application / order-test HEAD: `8e9c0dfcf5ad23e60a40abb090180c526d0347d9`
- Previous audited application / Pages source HEAD: `afa550a41d2776543445a3cb727731f6fb902608`
- Previous browser audit: `31155342511` / run `63` / success / 9 scenarios
- Main/work synchronization base: `f71decc77ef5d2a8f44ca8a08b1bbfdce5f1b366`
- Final Pages verification source revision: `dc290e1ba9a0a8101fabf187ac52add2730851c4`
- Final post-merge Pages workflow: `31157266500` / run `406` / success
- Final post-merge build job: `92799385185` / success
- Final post-merge deploy job: `92799508602` / success
- Published source Revision: `dc290e1ba9a0a8101fabf187ac52add2730851c4`
- Final Pages evidence synchronization HEAD: `207fb822434735d36bc0d240e6c440f7b67c7eee`
- Final public smoke check: success
- JLL-FE-004 Start HEAD: `10ba7d3a1d8a08c7294fb1d361221533314ca9d5`
- Fixed implementation HEAD: `5e6036980195108ed9f9429be53ebdba01e9ddcb`
- Implementation verification evidence HEAD: `bc15bda46b2923200ec3042ecae6e380bff67177`
- Draft Pull Request: `#5` / `work` → `main`
- PR CI Pages build: workflow `31159735333` / run `413` / success / build job `92807114332`
- PR CI browser audit: workflow `31159735305` / run `64` / success / job `92807114034`
- Final work Pages source revision: `a1851e21ab0192c3577a03b67f4f79e0b99ce08f`
- Final work Pages workflow: `31159729019` / run `412` / success
- Final Pages evidence synchronization HEAD before handoff metadata: `9df96fb094d3f9f2e4bddd3e4dc33ef687592ef7`
- Public smoke check: success

## Required startup checks

確認担当は会話履歴ではなくGitHub実状態から次を独立確認する。

1. `main`、`work`、Draft PR #5の最新HEADとmergeability
2. JLL-FE-004 Start HEAD `10ba7d3a1d8a08c7294fb1d361221533314ca9d5`からの実差分
3. Fixed implementation HEAD `5e6036980195108ed9f9429be53ebdba01e9ddcb`の変更内容
4. `task-list.md`でJLL-FE-004がCurrent task / review_readyであること
5. Root `AGENTS.md`、`PROJECT_CONTEXT.md`、Root / prototype `DESIGN.md`との整合
6. PR CI run `413`とbrowser audit run `64`の実結果
7. Pages source revision `a1851e21ab0192c3577a03b67f4f79e0b99ce08f`とpublic smoke check
8. PC・スマートフォン相当幅で問題本文/解説の階層、固定タイマー、通常演習除外、learner-facing表記を独立確認

## Implementation result

- 問題本文を解説本文より大きく・太くし、問題見出しと解説見出しも別階層へ調整済み
- 模擬試験の残り時間をサイトヘッダー右上の空き領域へfixed表示し、520px以下向け縮小規則を追加済み
- 2022年科目Aサンプルは通常演習`topic`セットアップ候補から除外し、`mock`経路は維持
- `2026-exemption-07`のlearner-facing表示を`令和8年度 免除試験`へ正規化し、元データは変更していない
- 新規回帰テスト`prototype/tests/fe-004-regression.test.mjs`を追加
- Root / prototype `DESIGN.md`へ今回のUI方針を先行反映済み
- `npm run verify:fe`、レスポンシブ監査、PR CI、Pages公開確認はすべてsuccess

## Implementation scope

### 1. 問題文と解説の視覚階層

- 現在の問題画面・結果レビュー画面で問題文と解説が同じ視覚ウェイトになっている箇所を特定する
- 文字サイズ、font-weight、見出し、余白の差で情報階層を明確にする
- 問題本文・選択肢・正答・解説の内容そのものは変更しない
- 通常演習と結果レビューの両方で一貫させる

### 2. 模擬試験の残り時間

- 模擬試験中だけ残り時間を右上へ固定する
- スクロールしても常時見えること
- 375pxを含むスマートフォン幅で問題本文、ナビゲーション、操作要素を隠さないこと
- 通常演習へ不要なタイマー表示を追加しないこと

### 3. 2022年科目Aサンプルの通常演習除外

- 通常演習の候補生成経路を確認し、2022年科目Aサンプルを除外する
- 固定模擬試験など、サンプルを明示的に使用する既存経路を壊さない
- 問題データ自体を削除・改変しない

### 4. 開催回表示

- learner-facing表示だけを`令和8年度 免除試験`へ変更する
- 内部ID、出典識別情報、正答・問題データは変更しない
- 絞り込み、履歴、結果レビュー等の関連表示で表記が不整合にならないよう確認する

## Design requirement

UI変更を含むため、実装前にRoot / prototypeの`DESIGN.md`を確認する。既存方針だけで決定できないUI判断がある場合は複数候補を提示してユーザー確認を取る。それ以外は既存デザイン方針へ沿って自走する。

JLL-FE-003で確定した次の仕様は変更しない。

- 受験科目ブロックは独立
- 絞り込み順: 分野 → 回答・復習状態 → 開催回・公開区分 → 単元
- pattern Bが既定
- 条件群内部へ縦スクロールを追加しない
- 単元名は完全な日本語表示

## Change forbidden

- JLL-FE-003の絞り込みレイアウト・順序を再変更すること
- 問題本文、選択肢、正答、解説内容そのものの改変
- 公式問題の出典情報を失う変更
- `JLL-FE-LESSON-001`、`JLL-FE-QBANK-001`、Java Learning Labの先行実装
- 実装担当による`main`へのマージ
- Pull Requestを勝手にReady for reviewへ変更すること
- Squash merge / rebase merge / force push
- `work` Branchの削除

## Completion criteria

- 問題文と解説が文字サイズ・太さ・構造で明確に区別できる
- 模擬試験の残り時間が右上へ固定され、対象viewportで本文や操作を妨げない
- 2022年科目Aサンプルが通常演習の候補へ入らない
- 対象開催回が`令和8年度 免除試験`と表示される
- 既存セッション、模擬試験、結果レビュー、履歴に回帰がない
- PC・スマートフォン表示を検証する
- Tests、TypeScript、ESLint、normal build、Pages buildが成功する
- Repository `docs/`が最新build成果物へ更新される
- Draft Pull Requestが存在する
- CIとPages公開Revision確認が完了する
- `task-list.md`と`NEXT_WORK.md`を確認担当向け`review_ready`へ更新する

## Required verification

Repository実状態から利用可能なscriptを確認したうえで、最低限次を実行する。

```bash
cd prototype
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
```

既存の`npm run verify:fe`が上記を包含する場合は併用する。UI変更はブラウザ監査または同等の固定証拠を残す。

## Queued work after JLL-FE-004

1. `JLL-FE-LESSON-001`: FEレッスン内容作成
2. `JLL-FE-QBANK-001`: 公式一次資料ベースの問題バンク拡充（既存作業と競合しない時点で着手）
3. `JLL-JAVA-001`: 上記FE優先タスク後まで延期

## Work completion update targets

- `DESIGN.md` / `prototype/DESIGN.md`（必要なUI方針変更がある場合）
- `task-list.md`
- `NEXT_WORK.md`
- `PROJECT_CONTEXT.md`
- `docs/`
- Draft Pull Request
- CI / browser evidence / Pages公開結果
- 固定HEAD

## Next user command

`確認`
