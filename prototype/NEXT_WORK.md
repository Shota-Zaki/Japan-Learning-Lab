# Prototype Next Work

Repository全体の作業状態は、Rootの`task-list.md`と`NEXT_WORK.md`を正本とする。

## Current Task

- Task ID: `JLL-FE-001`
- Status: `needs_fix`
- Role: 実装担当
- Branch: `work`
- Pull Request: `#1` Draft / Open / Unmerged
- Application review target HEAD: `64ac59b5631507da07da459c1cc52e9ed9ffdffc`

## Correction of previous status

このファイルは以前、FE Learning Labを「完成・監査合格」と記載していた。

その判定後に、2022年12月公開サンプル模擬試験の完全収録に関する変更が追加され、最新CIで新しいBlocking問題が検出された。したがって、以前の完成判定は最新HEADには適用しない。

Java Learning Labの作業停止は解除しない。FEタスクの確認合格、`main`へのmerge commit、`work`同期、最新GitHub Pages確認が完了するまでJava作業を再開しない。

## Current Blocking Issue

Latest failed workflow:

- Workflow: `Build and deploy GitHub Pages`
- Run ID: `31073454949`
- Result: `failure`
- Tests: 42 total / 41 passed / 1 failed

Failure:

```text
subject A sample retains the four figure-dependent questions
fe-ipa-2022sample-a-005 must retain its official figure
```

科目Aサンプル問5に、公式図表を表す`image`ブロックが保持されていない。

## Files to inspect

1. `scripts/complete-fe-sample-set.mjs`
2. `tests/fe-official-sample.test.mjs`
3. `public/data/fe-official-past-questions.json`
4. `src/FeRichContent.jsx`
5. `scripts/prepare-pages-build.mjs`
6. 同期元の固定データにある問5、問6、問7、問9の元レコード

## Required Fix

- 問5の図表が格納されている実際のデータ構造を特定する
- 図表抽出処理を修正する
- 問5、問6、問7、問9の公式図表を`questionBlocks`へ保持する
- 相対パスを公開環境で取得可能な参照へ正規化する
- 問題文、選択肢、正答、公式問番号順を維持する
- テストを削除、skip、緩和しない

## Mandatory Validation

```bash
npm ci
npm run verify:fe
```

追加で次を確認する。

- 科目A 60問、科目B 20問
- 問5、問6、問7、問9の`image`ブロック
- 画像参照のHTTP取得成功
- Repository直下`docs/`の再生成
- 375px、768px、1280px以上で固定サンプル模試を確認
- 問5の本文、図表、選択肢を確認
- Console error、Console warning、HTTP error、Request failure 0件
- Draft PR #1のCI成功
- 最新HEAD相当のGitHub Pages公開

## Forbidden Changes

- Java Learning Labの実装
- 図表必須テストの弱体化
- 問5の除外または別問題への置換
- 60問未満で固定サンプル模試を開始させること
- `main`へのマージ
- Pull RequestをReady for reviewへ変更すること
- force push、rebase、履歴改変

## Completion Handoff

修正完了時は、Rootの`task-list.md`を`review_ready`へ更新し、Rootの`NEXT_WORK.md`を確認担当向けに書き換える。

あわせて次を更新する。

- `PROJECT_CONTEXT.md`の現在状態
- 必要な監査記録
- Pull Request #1の本文
- Pages deployment evidence

その後、ユーザーは別の新しいチャットで`確認`と送る。
