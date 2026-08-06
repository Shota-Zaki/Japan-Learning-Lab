# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`in_progress`（最新`work` RevisionのGitHub Pages deploy・公開検証）

## Role

実装担当。Pull Request #1はDraft / Open / Unmergedのまま維持し、`main`へマージしない。

## Objective

問題ナビゲーションと詳細解説のアプリケーション実装は完了している。アプリケーションコードを変更せず、この文書の更新commitをpush workflowのtriggerとして、最新`work` RevisionをGitHub Pagesへdeployする。

最新sourceのdeploy、公開Revision一致、公開リソーススモーク、`docs/`と成功証拠の同期まで確認し、成功時に`review_ready`へ更新する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Revision start HEAD: `88c0b50e86a7c3a1fde542b4b5163931daef0695`
- Application implementation HEAD: `a38c9af1ce63ac98cd870d2ce3f175636cc7ac46`
- Pages workflow correction HEAD: `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`
- Previous blocked handoff HEAD: `76d8a20d4c578fb62391863c31a9e75ac07a6bac`
- Retry failure evidence commit: `834e18a`（workflow attempt 2）
- Task state resume commit: `2734e9bcf9f58c254a526b48db3ba220c5168406`
- Latest deployment trigger HEAD: この文書の更新commit

## Implemented scope

1. 問題番号入力、Enter、移動ボタンによる直接移動
2. 範囲外入力時の非移動とエラー通知
3. 問題一覧領域の内部縦スクロール
4. 移動後の現在問題ボタンの自動視認
5. 正答、正答根拠、選択肢ごとの判断、関連知識を含む詳細解説
6. 通常演習と完了後レビューで共通する詳細解説表示
7. 個別解説データ優先と、技術的根拠を捏造しないfallback

## Existing automated validation

Pull Request workflow run ID `31110519907`、run number `248`、build job ID `92646803294`は成功済み。

- `npm run verify:fe`: success
- Tests: 54 / 54 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- 科目A: 1810問
- 科目B: 167問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

## Pages recovery attempt 2 result

GitHub公式ステータスでActionsとPagesがOperationalであることを確認し、push workflow run ID `31110515900`のfailed jobsを再実行した。

- Run attempt: `2`
- Build job ID: `92652535075` / success
- Deploy job ID: `92652494381`
- Pages deployment: success
- Expected public revision: `77d71a8cddc86cbc709f6113ca66f3cfd469e2ed`
- Observed public revision: `8515d2c8773a16c559b461f2351a3487fba54765`
- Public revision verification: failure

Pages deployment serviceのtimeoutは解消した。ただし過去runの再実行は古いsourceを使用するため、既に公開中のより新しいRevisionを置き換えられなかった。過去runの連続再実行は行わない。

## Current procedure

1. この文書の更新commitで最新`work` push workflowを新規起動する
2. 新規runのsource SHAを固定する
3. build jobで`npm run verify:fe`、Pages build、artifact uploadを確認する
4. deploy jobでPages deployment成功を確認する
5. 公開`build-info.json`のsourceRevisionが新規run source SHAと一致することを確認する
6. 公開index、JS、CSS、問題データ、favicon、科目A問5・6・7の図表を確認する
7. workflowが`docs/`、問題データ、`prototype/qa/pages-deployment.json`を`work`へ同期し、failure evidenceを削除したことを確認する
8. 375px、768px、1280px以上の公開表示を確認する
9. 問題番号入力、一覧スクロール、詳細解説、模擬試験中非表示、結果レビューを確認する
10. キーボード、フォーカス、Console、Networkを確認する
11. `task-list.md`を`review_ready`へ更新する
12. `NEXT_WORK.md`を確認担当向けに更新する
13. Pull Request #1の説明を最新状態へ更新する
14. Pull RequestはDraftのまま維持する

## Change targets

Pages成功時に限り、workflow自動同期または管理更新で次を変更する。

- `docs/`
- `prototype/public/data/fe-official-past-questions.json`
- `prototype/qa/pages-deployment.json`
- `prototype/qa/pages-deployment-failure.json`
- `task-list.md`
- `NEXT_WORK.md`
- Pull Request #1の説明

## Change forbidden

- アプリケーションコードの追加修正
- `main`へのマージ
- Pull RequestのReady for review変更
- `work`の削除
- force push、rebase、squash
- 新しいPages復旧workflowの追加
- 既存の公式問題本文、選択肢、正答、図表の改変
- Java Learning Labの実装開始
- 過去runの再実行

## Completion criteria remaining

- 最新`work` sourceのbuildとPages deployが成功する
- 公開Revisionが最新sourceと一致する
- 公開リソースのスモークが成功する
- `docs/`と成功証拠が最新sourceから同期される
- 375px、768px、1280px以上の公開表示を確認する
- 問題番号移動、一覧スクロール、詳細解説を公開画面で確認する
- 確認担当が固定HEADを独立検証できる状態にする

## Next user command

実装工程完了後、`review_ready`なら`確認`。失敗時はRepositoryの更新済み指示に従い`実装`。
