# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`needs_fix`対応の実装工程

## Role

次の担当は実装担当として作業する。

## Objective

2022年12月公開の科目Aサンプル問題に必要な公式図表を完全に保持し、FE演習の全検証、GitHub Pages生成、公開確認まで完了させる。

現在、サンプル60問の件数と順序は満たしているが、問5に`image`ブロックがないためCIが失敗している。

## Repository state at handoff

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Application review target HEAD: `64ac59b5631507da07da459c1cc52e9ed9ffdffc`
- Latest failed workflow: `31073454949`
- Last successful Pages source revision: `a0a3f665dbe9ccb8cbcd829cd7d8af69171996a7`
- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`

この引継ぎ文書を追加した管理文書commitは、上記アプリケーションHEADより後に存在する。作業開始時にGitHub上の最新`work` HEADを再取得すること。

## Current failure

`npm run verify:fe`のテスト工程で、42件中1件が失敗している。

```text
Test: subject A sample retains the four figure-dependent questions
Failure: fe-ipa-2022sample-a-005 must retain its official figure
```

テスト失敗により、TypeScript、ESLint、Pages build、artifact upload、deployは後続実行されていない。

## Likely root cause

`prototype/scripts/complete-fe-sample-set.mjs`は、主に次の候補から画像を抽出している。

- `assets`
- `sourceAssets`
- `prompt.assets`
- `extensions.exam.assets`
- 既存`questionBlocks`内の`image`

問5の正規データでは、図表情報が別の階層または別形式に格納されている可能性がある。件数やIDを合わせるだけでは不十分であり、元レコードの実構造を確認する必要がある。

## Files to inspect first

1. `prototype/scripts/complete-fe-sample-set.mjs`
2. `prototype/tests/fe-official-sample.test.mjs`
3. `prototype/public/data/fe-official-past-questions.json`
4. 同期元の固定commitにある問5、問6、問7、問9の元レコード
5. `prototype/src/FeRichContent.jsx`
6. `prototype/scripts/prepare-pages-build.mjs`

## Allowed changes

- 公式サンプル問題の抽出、統合、画像正規化処理
- 正規データ構造に対応するための同期スクリプト
- 図表URLまたは画像ブロックの生成処理
- 正しい仕様を追加検証するテスト
- FE演習の図表表示に必要な最小限の表示修正
- buildで生成される公開データと`docs/`
- `task-list.md`
- `NEXT_WORK.md`
- 必要な監査記録
- Pull Request #1の説明

## Forbidden changes

- Java Learning Labの実装
- FEとJavaの同時進行
- 図表必須テストの削除、skip、期待値緩和
- 問5を固定サンプルセットから除外すること
- 図表のない代替問題へ差し替えること
- 公式問番号順の変更
- 60問未満または20問未満で固定サンプル模試を開始可能にすること
- 問題文、選択肢、正答の意図しない変更
- `main`へのマージ
- Pull RequestをReady for reviewへ変更すること
- force push、rebase、履歴改変

## Required implementation

1. 同期元の固定データから問5の元レコードを特定する
2. 図表を保持しているフィールド名、入れ子構造、パス形式を確認する
3. 問5、問6、問7、問9を同じ規則で正規化できるよう抽出処理を修正する
4. 相対パスは固定commitを参照する取得可能なURL、またはbuildへ含めるローカル資産へ正規化する
5. `questionBlocks`へ`type: image`、`src`、`alt`を保持する
6. 重複画像を作らない
7. 既存60問の順序、問題文、選択肢、正答を維持する
8. GitHub Pagesのベースパスでも画像を取得できることを確認する

## Completion criteria

- `fe-ipa-2022sample-a-005`に公式図表の`image`ブロックがある
- 問6、問7、問9も図表が保持される
- 画像参照が空文字、404、Repository内の存在しない相対パスになっていない
- 科目A 60問、科目B 20問を維持する
- 公式問番号順を維持する
- `npm run verify:fe`が成功する
- 全テストが成功する
- TypeScriptが成功する
- ESLintが成功する
- 通常buildが成功する
- Pages buildが成功する
- Repository直下`docs/`が最新になる
- Draft Pull Request #1のCIが成功する
- 最新HEAD相当のGitHub Pagesが公開される
- 公開画面で問5の図表を確認できる
- Console error、Console warning、HTTP error、Request failureが0件である
- 管理文書とGitHub実状態が一致する

## Mandatory validation

Repository rootから:

```bash
cd prototype
npm ci
npm run verify:fe
```

追加確認:

- 生成後の問題JSONで問5、問6、問7、問9の`questionBlocks`を確認
- 画像URLまたは公開資産をHTTP取得して200系と非空を確認
- 375px、768px、1280px以上で固定サンプル模試を開く
- 問5の本文、図表、選択肢が欠落なく表示されることを確認
- ページ全体の横スクロールがないことを確認
- ブラウザコンソールとネットワークを確認

## Unresolved findings

### Blocking

1. 科目Aサンプル問5の公式図表が保持されていない
2. 最新CIが失敗している
3. 最新変更がGitHub Pagesへ公開されていない

### Non-blocking but required before review

1. PR本文の問題件数が最新同期結果と一致していない
2. 過去の完成監査は、後続変更前のHEADを対象としており最新HEADを保証しない
3. 実装完了後に新しい監査HEADを固定する必要がある

## Latest user request

Repository上の管理文書を、このチャットのプロジェクトコンテキストとGitHub実状態に合わせる。

この要望はRoot管理文書の追加と、既存引継ぎ文書の修正で反映する。アプリケーションのBlocking問題は別途修正する。

## Documents to update when the fix is complete

- `task-list.md`
- `NEXT_WORK.md`
- `PROJECT_CONTEXT.md`の現在状態欄
- 必要に応じて`DESIGN.md`
- `prototype/NEXT_WORK.md`
- 新しい監査記録
- 過去監査の失効案内
- Pull Request #1の本文
- Pages deployment evidence

## Handoff result expected

修正担当は、実装、自己検証、`docs/`更新、push、Draft PR更新、CI成功、Pages公開確認まで行い、状態を`review_ready`へ更新する。

その後、ユーザーは別の新しいチャットで`確認`と送る。
