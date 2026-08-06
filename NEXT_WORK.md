# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`review_ready`の独立確認工程

## Role

次の担当は、別の新しいチャットで確認担当として作業する。

確認担当は実装担当の説明を前提にせず、最新Pull Request HEAD、実差分、CI、GitHub Pagesを独立して確認する。

## Objective

FE演習の公開構成、複合絞り込み、科目B、構造化表示、公式サンプル模試、保存・復元、GitHub Pages公開が完了条件を満たすか確認する。

今回の修正では、2022年12月公開の科目Aサンプル問5・問6・問7に必要な図表を補完し、問9は公式構成どおりのテキスト問題として要件を訂正した。

## Repository state at handoff

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Fixed implementation HEAD: `56482206a7aa24910148aff661fb0ab598316261`
- Generated output and deployment evidence HEAD before management-document updates: `bd339fd9355216fea3c381b8ff14d9491949e35a`
- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`

管理文書commitと、その後のPages deployment evidence commitが上記HEADより後に追加される。作業開始時にPull Request #1から最新`work` HEADを再取得し、そのHEADをレビュー対象として固定すること。

## Implemented correction

1. 固定同期元の問5・問6・問7には公式冊子の図表データが存在しないことを確認した
2. 公式冊子と照合した補完SVGをRepository管理下へ追加した
3. 同期時に該当問題へだけ補完図表を付与する処理を追加した
4. 問題側、選択肢側、HTML画像、参照画像を同じ構造化経路で正規化するよう改善した
5. GitHub Pagesのベースパスを考慮してローカル画像を解決するよう表示処理を修正した
6. 問5・問6・問7の画像参照を自動テストで固定した
7. 問9を公式構成どおりのテキスト問題として自動テストで固定した
8. 公開後の問題JSONと3 SVGを取得するPagesスモークテストを追加した
9. 生成データと`docs/`を`work`へ自動反映するCIを維持した

## Main files changed by this correction

- `prototype/scripts/complete-fe-sample-set.mjs`
- `prototype/src/FeRichContent.jsx`
- `prototype/tests/fe-official-sample.test.mjs`
- `prototype/public/assets/fe/a-2022-005-figure.svg`
- `prototype/public/assets/fe/a-2022-006-figure.svg`
- `prototype/public/assets/fe/a-2022-007-figure.svg`
- `.github/workflows/pages.yml`
- 生成された`prototype/public/data/fe-official-past-questions.json`
- 生成された`docs/`
- 管理文書と監査記録

## Verification evidence

### Pull Request workflow

- Run ID: `31077350598`
- Run number: `162`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Result: success
- `npm run verify:fe`: success
- Tests: 43 / 43 passed
- TypeScript: success
- ESLint: 0 errors / 1 warning
- Existing warning: `prototype/src/FeSessionView.jsx`のHook依存warning
- Normal build: success
- Pages build: success

### Work push and Pages deployment

- Run ID: `31077346989`
- Run number: `161`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Build: success
- Generated output commit: success
- Deploy: success
- Public smoke check: success
- Published problem JSON: success
- Published Q5/Q6/Q7 SVG fetch: success

## Review scope

確認担当は次を確認する。

1. 対象Repository、`main`、`work`、Pull Request #1
2. 最新`work` HEADの固定
3. `main`との差分
4. `task-list.md`の目的、範囲、完了条件
5. Java Learning Labへ意図しない変更がないこと
6. 問5、問6、問7の本文、図表、選択肢、正答
7. 問9がテキスト問題として保持されること
8. 科目A 60問、科目B 20問と公式問番号順
9. 科目Bの回答、解説、保存、復元、履歴、復習、再挑戦
10. 375px、768px、1280px以上の表示
11. ページ全体に不要な横スクロールがないこと
12. キーボード操作、代替テキスト、フォーカス、基本アクセシビリティ
13. Console error、Console warning、HTTP error、Request failure
14. `npm ci`と`npm run verify:fe`
15. GitHub Actionsの最新結果
16. Repository直下`docs/`の更新
17. GitHub Pagesの実表示と3 SVGの取得
18. 管理文書、PR本文、CI、Pages evidenceの整合性

## Mandatory validation

Repository rootから:

```bash
cd prototype
npm ci
npm run verify:fe
```

追加確認:

- 生成後の問題JSONで問5、問6、問7の`image`ブロックを確認
- 問9の問題文、4選択肢、正答を確認
- 公開資産3件をHTTP取得し、200系かつ非空を確認
- 375px、768px、1280px以上で固定サンプル模試を開く
- 問5・問6・問7の図表が縮小表示され、ページ全体の横スクロールを発生させないことを確認
- ブラウザコンソールとネットワークを確認

## Allowed changes for confirmation role

原則として次だけを変更できる。

- `task-list.md`
- `NEXT_WORK.md`
- レビュー結果と検証証拠を記録する管理文書
- 明白な管理メタデータの不一致

## Forbidden changes for confirmation role

- アプリケーションコード、SVG、テスト、設定の修正
- 新機能追加
- Java Learning Labの実装再開
- 検証対象HEADを途中で変更すること
- Squash merge、rebase merge、force push
- `work` Branchの削除

コード、UI、テスト、設定にBlocking問題がある場合は、確認担当自身では修正せず、`needs_fix`へ戻して具体的な修正指示を記録する。

## Pass procedure

Blocking問題がなく、完了条件を満たす場合は次を一括で実行する。

1. レビュー対象HEADを固定する
2. 必須検証とGitHub Pages確認を完了する
3. `task-list.md`を`completed`へ更新する
4. `NEXT_WORK.md`を次タスク向けに更新する
5. 管理文書を`work`へcommit、pushする
6. 管理文書更新後のHEADを再検証する
7. Pull Request #1をmerge commit方式で`main`へマージする
8. マージコミットを確認する
9. `main`のCIを確認する
10. `work`を最新`main`へ同期する
11. `work`を削除しない
12. GitHub Pagesの再公開を確認する
13. 管理文書とGitHub実状態の一致を確認する

## Failure procedure

Blocking問題がある場合はマージしない。

1. BlockingとNon-blockingを分類する
2. 再現方法、原因候補、修正対象、再検証項目を記録する
3. `task-list.md`を`needs_fix`へ更新する
4. `NEXT_WORK.md`を実装担当向けの具体的修正指示へ更新する
5. 管理文書を`work`へcommit、pushする
6. Pull Request #1をDraft / Open / Unmergedのまま維持する

## Latest user request

`修正`

この指示に基づく実装、自己検証、生成成果物更新、Draft PR更新、Pages公開確認は完了し、独立確認待ちへ移行した。

## Next user command

`確認`
