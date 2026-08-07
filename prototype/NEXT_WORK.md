# Prototype Next Work

Repository全体の作業状態は、Rootの`task-list.md`と`NEXT_WORK.md`を正本とする。

## Current Task

- Task ID: `JLL-FE-001`
- Status: `review_ready`
- Next role: 確認担当
- Branch: `work`
- Pull Request: `#1` Draft / Open / Unmerged
- Fixed implementation HEAD: `56482206a7aa24910148aff661fb0ab598316261`

管理文書更新後の最新`work` HEADは、確認開始時にPull Request #1から再取得する。

## Correction completed

固定同期元では、2022年12月公開の科目Aサンプル問5、問6、問7について、公式冊子に存在する図表がデータ化されていなかった。

次を実施した。

- 問5、問6、問7の補完SVGを`public/assets/fe/`へ追加
- 同期時に該当問題へだけ補完図表を付与
- 問題、選択肢、HTML、参照画像の正規化処理を統合
- Pagesのベースパスに対応したローカル画像解決
- 問5、問6、問7の画像参照を自動テストで固定
- 問9は公式冊子上で図表のないテキスト問題であるため、以前の図表必須要件を訂正
- 問9の問題文、4選択肢、正答を自動テストで固定
- 公開問題JSONと3 SVGを検証するPagesスモークテストを追加

## Verification evidence

### Pull Request workflow

- Run ID: `31077350598`
- Run number: `162`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Result: success
- Tests: 43 total / 43 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success

### Public deployment

- Run ID: `31077346989`
- Run number: `161`
- Source revision: `56482206a7aa24910148aff661fb0ab598316261`
- Deploy: success
- Public smoke check: success
- Published Q5/Q6/Q7 SVG fetch: success
- Evidence: `qa/pages-deployment.json`

## Review target files

1. `scripts/complete-fe-sample-set.mjs`
2. `src/FeRichContent.jsx`
3. `tests/fe-official-sample.test.mjs`
4. `public/assets/fe/a-2022-005-figure.svg`
5. `public/assets/fe/a-2022-006-figure.svg`
6. `public/assets/fe/a-2022-007-figure.svg`
7. `public/data/fe-official-past-questions.json`
8. `../.github/workflows/pages.yml`
9. `../docs/`
10. `qa/fe-sample-figure-fix-2026-08-06/audit.md`

## Mandatory validation

```bash
npm ci
npm run verify:fe
```

追加で次を独立確認する。

- 科目A 60問、科目B 20問
- 問5、問6、問7の`image`ブロックと公開SVG
- 問9のテキスト問題構成
- 375px、768px、1280px以上で問5、問6、問7を表示
- 図表が親幅へ収まり、ページ全体の横スクロールがないこと
- 問題文、選択肢、正答の維持
- Console error、Console warning、HTTP error、Request failure
- Draft PR #1の最新CI
- 最新HEAD相当のGitHub Pages公開

## Existing non-blocking warning

`src/FeSessionView.jsx`に`react-hooks/exhaustive-deps` warningが1件ある。

今回の図表修正による新規errorではない。確認担当は、動作影響またはBlocking性を独立判断する。

## Forbidden changes for confirmation role

- アプリケーションコード、SVG、テスト、設定の修正
- 図表必須テストの削除、skip、緩和
- 問5、問6、問7の除外または別問題への置換
- 60問未満または20問未満で固定サンプル模試を開始させること
- Java Learning Labの実装
- Squash merge、rebase merge、force push
- `work` Branchの削除

問題がある場合はコードを直さず、Root管理文書を`needs_fix`へ戻して実装担当向けの修正指示を作成する。

## Completion Handoff

合格時は、Rootの手順に従って管理文書更新、merge commit方式のマージ、`main` CI確認、`work`同期、Pages再公開確認まで一括で行う。

次のユーザーコマンドは`確認`。
