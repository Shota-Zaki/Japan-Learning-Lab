# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`review_ready`

## Next role

確認担当。

実装担当は`main`へマージしない。次の新しいチャットでは`確認`として、固定されたアプリケーション差分、最新監査、Pages公開証拠、管理文書を独立確認する。

## Objective

Bento Grid、不要な余白削減、受験科目の独立状態、完全な日本語単元名表示を維持しつつ、絞り込みブロックの表示・DOM・キーボード順が次になっていることを独立確認する。

1. 分野
2. 回答・復習状態
3. 開催回・公開区分
4. 単元

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-003`
- Task status: `review_ready`
- Pull Request: `#4`
- Pull Request state: open / draft / unmerged
- Fixed application / order-test HEAD: `8e9c0dfcf5ad23e60a40abb090180c526d0347d9`
- Audited workflow / Pages source HEAD: `afa550a41d2776543445a3cb727731f6fb902608`
- Pages output synchronization commit: `4cd677854fda9f4a4f204df5519e86f5600fc595`
- Latest management state before this handoff update: `733fb5de21128bb11289f9943d9fda5c32527e11`
- Browser audit workflow: `31155342511` / run `63` / success
- Browser audit artifact: `8984932272`
- Browser artifact digest: `sha256:e504fafd4f823c65d7ae0f222c1e2aa3869568ed3d2bda2c7a908e1a748aca8c`
- Pages workflow: `31155340547` / run `403` / success
- Public Pages source Revision: `afa550a41d2776543445a3cb727731f6fb902608`
- Repository `docs/build-info.json` sourceRevision: `afa550a41d2776543445a3cb727731f6fb902608`
- Pages temporary skip policy: recovered / removed

## Implemented change

1. `prototype/src/FePracticeSetup.jsx` の4条件群を `domains → reviewScopes → periodIds → unitIds` へ変更した。
2. legendを「1. 分野」「2. 回答・復習状態」「3. 開催回・公開区分」「4. 単元」へ統一した。
3. パターンBは分野・回答状態を左側へ縦積み、開催回を右側、単元をその下の全幅カードへ配置した。
4. `prototype/src/main.jsx` の可変高さ計測を新DOMインデックスへ追従させた。
5. 単元向け広幅選択肢指定を4番目カードへ追従させた。
6. ソーステストへ4条件群の順序と旧番号残存防止を追加した。
7. Chromium監査へDOM順とキーボード群順の明示検証を追加した。
8. Root / prototypeの`DESIGN.md`を最新順序へ同期した。
9. Pages成功後の証拠同期で任意QAファイルが存在しない場合に失敗するworkflow不具合を修正した。
10. 固定Pages source HEADの成果物をRepository `docs/`へ同期し、公開Revision一致を確認した。
11. 作業中に使用した一時補助workflow / triggerはすべて削除した。
12. `prototype/qa/jll-fe-003-browser/`のテキスト証拠を最新browser auditへ更新した。

## Change forbidden during confirmation

- アプリケーションコード、CSS、テスト、設定の修正
- `JLL-FE-004`の先行実装
- レッスン内容またはJava Learning Labの実装
- Squash merge / rebase merge / force push
- `work` Branchの削除

Blocking問題がある場合はコードを直さず、`task-list.md`を`needs_fix`へ戻し、このファイルへ具体的な再現方法と修正指示を記録する。

## Completion criteria to verify

- 指定なし・無効な`filterLayout`でパターンBが既定になる
- 375px、768px、1,280pxの全3レイアウトで4条件群の順序が正しい
- DOM順とキーボード群順が一致する
- 受験科目が独立ブロックのまま
- Bento Gridの不要な大空白がなく、カード内部スクロールがない
- 単元名が完全な日本語で、可能な限り1行、必要時のみ自然に折り返す
- 横overflow、重なり、内容切れ、操作不能がない
- Tests、TypeScript、ESLint、normal build、Pages build、browser auditが成功する
- `docs/build-info.json` のsourceRevisionが `afa550a41d2776543445a3cb727731f6fb902608` と一致する
- `prototype/qa/pages-deployment.json`がPages成功と同一Revisionを記録する
- PR `#4` がopen / draft / unmergedである
- 一時補助workflow / triggerがRepositoryに残っていない

## Required independent verification

```bash
cd prototype
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm run audit:fe-filter-layouts
```

GitHub上では次も独立確認する。

- `main`との差分
- fixed application / order-test HEAD `8e9c0dfcf5ad23e60a40abb090180c526d0347d9`
- audited workflow / Pages source HEAD `afa550a41d2776543445a3cb727731f6fb902608`
- browser audit run `31155342511` とartifact `8984932272`
- Pages run `31155340547`
- Repository `docs/`と`prototype/qa/pages-deployment.json`
- `task-list.md`、`PROJECT_CONTEXT.md`、`DESIGN.md`との整合性

## Approval path

Blocking問題がなければ、確認担当はプロジェクト規則に従い次を一括実行する。

1. レビュー対象HEADを固定
2. 必須検証を独立実行
3. Pages公開状態を確認
4. `JLL-FE-003`を`completed`へ更新
5. `JLL-FE-004`を次の進行対象として登録
6. 管理文書を`work`へcommit / push
7. 管理文書更新後のHEADを再確認
8. PR `#4`をmerge commit方式で`main`へマージ
9. `main` CIを確認
10. `work`を最新`main`へ同期し、削除しない
11. Pages再公開を確認

## Queued work after approval

`JLL-FE-004`:

- 問題文と解説の文字サイズ・太さ・構造に差を付ける
- 模擬試験の残り時間を右上へ固定する
- 2022年科目Aサンプルを通常演習へ入れない
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

その後はJavaへ進まず、`JLL-FE-LESSON-001`としてFEレッスン内容作成を優先する。

## Work completion update targets

- `task-list.md`
- `NEXT_WORK.md`
- `PROJECT_CONTEXT.md`
- Pull Request `#4`
- 最新固定HEAD
- CI結果
- Pages公開結果

## Next user command

`確認`
