# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`needs_fix`

## Next role

実装担当。

確認担当はアプリケーション実装、ブラウザ監査、CI証拠を独立確認し、レイアウトと単元名処理自体は合格と判定した。ただしRepository直下`docs/`が固定アプリケーションHEADの最新Pages buildではないため、Pull Request `#4`はマージしていない。

新しいチャットで`修正`と送られたら、この文書のBlocking修正だけを実施する。`JLL-FE-004`、レッスン内容作成、Java Learning Labへは進まない。

## Objective

固定アプリケーションHEAD `66a03576b5b9ac2c86c35c63045f923137f08a0c`の最新Pages成果物をRepository直下`docs/`へ生成・コミットし、再現性、CI、ブラウザ監査、管理文書、Pull Requestの整合性を回復する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-003`
- Task status: `needs_fix`
- Pull Request: `#4`
- Pull Request state: open / draft / unmerged
- Start HEAD: `1d0eaebf73a4e9567ccb91017edf5b2d470caafe`
- Fixed application and verification HEAD: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Confirmation management commit 1: `6b944663b6d4e3a3531d8c857c7655916f59d747`
- Current `work` HEAD: この文書更新コミット。作業開始時にGitHub実状態から再取得する

## Confirmation result

`failed`

## Passed review evidence

次の項目は確認合格済みであり、修正対象ではない。

- Pattern Bは単元カード全幅、左側に分野と回答・復習状態を縦積み、右側に開催回・公開区分を配置
- 768px left-card gap: `8.8px` / row gap: `8.8px`
- 1,280px left-card gap: `8.8px` / row gap: `8.8px`
- 375pxは既存DOM順の1列
- Final source count: `1997`
- Final option counts: `[3, 24, 28, 4]`
- Horizontal overflow: 0
- Internal scrollbar / clipping: 0
- Raw English unit identifier / unresolved unit label: 0
- Console warning/error: 0
- Failed network request: 0
- Keyboard checkbox operation: success
- DOM order: `分野 → 単元 → 開催回・公開区分 → 回答・復習状態`
- Standard workflow: `31144511506` / run `370` / success
- Browser workflow: `31144511527` / run `39` / success
- Browser artifact: `8980991042` / digest `sha256:c32e7c8aa55307a135da0e7539b152de6f214ad6d0f5582607aee82a4eb8e861`
- Pages artifact: `8980987977` / digest `sha256:1560b786ba93b9c6d57be7f8723949538e8aee4022d8fce4eeb326ec2210242b`

## Blocking finding

### Repositoryの`docs/`が固定HEADの最新Pages buildではない

確認時の実状態:

- Repositoryの`docs/build-info.json` sourceRevision: `32a8260703fcb3deb51253c90bb8506fad1bd325`
- Fixed application HEAD: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Fixed HEADはcommitted Pages sourceRevisionより46 commits先
- Repository committed assets: `index-YqsZizrf.js` / `index-D7VeqPfk.css`
- CI Pages artifact sourceRevision: `7768a769c3a1f5b08f59ea3a034ce65e16d8e18c`（Pull Request merge ref）
- CI Pages artifact assets: `index-BJI--2FR.js` / `index-DSeV1n5v.css`

CIでは最新Pages buildが成功しているが、生成物はartifactへアップロードされただけで、Repositoryの`docs/`へ反映されていない。

Temporary Pages skip policyはdeploymentと公開URLのrevision確認だけを除外する。Pages build、Repositoryの`docs/`更新、artifact uploadは必須である。

## Reproduction

1. `work`の`docs/build-info.json`を確認する。
2. `sourceRevision`が`32a8260703fcb3deb51253c90bb8506fad1bd325`であることを確認する。
3. 固定アプリケーションHEAD `66a03576b5b9ac2c86c35c63045f923137f08a0c`と比較する。
4. Standard workflow `31144511506`のPages artifact `8980987977`を展開する。
5. artifact内の`build-info.json`とhash付きassetsがRepository committed `docs/`と異なることを確認する。

## Cause

`npm run build:pages`はCIの作業ツリー内で最新`docs/`を生成しているが、その生成物を`work`へcommitする工程が完了していない。固定HEAD以降の`work`差分は管理文書とPages障害記録のみで、`docs/`は更新されていない。

## Required fix

1. `work`の最新HEADを取得する。
2. アプリケーションコード、CSS、テスト、workflowを変更しない。
3. `prototype/`で依存関係を確認する。
4. 固定アプリケーションHEADを明示してPages buildを実行する。

```bash
cd prototype
npm ci
GITHUB_SHA=66a03576b5b9ac2c86c35c63045f923137f08a0c npm run build:pages
```

5. Repository直下`docs/`の差分を確認する。
6. 最低限、次が最新生成物へ置換されていることを確認する。

- `docs/index.html`
- `docs/404.html`
- `docs/build-info.json`
- `docs/assets/`のhash付きJavaScript/CSS
- buildで生成・削除されるその他の公開成果物

7. 古いhash付きassetが残っていないことを確認する。
8. 同じ`GITHUB_SHA`で`npm run build:pages`を再実行し、生成結果が再現可能で追加差分を生まないことを確認する。
9. `docs/build-info.json`の`sourceRevision`が`66a03576b5b9ac2c86c35c63045f923137f08a0c`であることを確認する。
10. `docs/`をcommitして`work`へpushする。
11. 次の必須検証を実行する。
12. `task-list.md`を`review_ready`へ戻し、この文書を確認担当向けへ更新する。
13. Pull Request `#4`本文へ新しい固定HEAD、workflow、artifact、digestを反映する。
14. Pull Requestはopen / draft / unmergedのまま維持する。

## Required verification

```bash
cd prototype
npm test
npm run typecheck
npm run lint
npm run build
GITHUB_SHA=66a03576b5b9ac2c86c35c63045f923137f08a0c npm run build:pages
npm run audit:fe-filter-layouts
```

追加確認:

- Tests: 60 / 60以上で全件成功
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Browser audit: 3 layouts × 375px / 768px / 1,280px success
- Final source count: `1997`
- Final option counts: `[3, 24, 28, 4]`
- Pattern B left-card gap at 768px / 1,280px: row gap相当
- Horizontal overflow / clipping / internal scrollbar: 0
- Console warning/error / failed request: 0
- Keyboard checkbox operation: success
- Repository committed `docs/`と固定HEAD指定の再build結果: 差分なし
- Standard workflow: success
- Browser workflow: success
- Pages artifact upload: success

## Change allowed

- Repository直下`docs/`のbuild生成物
- `task-list.md`
- `NEXT_WORK.md`
- Pull Request `#4`本文
- 検証証拠の管理メタデータ

## Change forbidden

- `prototype/src/`のアプリケーションコード
- レイアウトCSS
- テストとbrowser audit実装
- GitHub Actions workflow
- 問題データ、問題本文、選択肢、正答、解説、図表
- 受験科目ブロック
- 絞り込み条件、件数、開始条件
- `JLL-FE-004`の先行実装
- レッスン内容作成の先行実装
- Java Learning Labの実装
- Pull Requestのマージ
- Ready for reviewへの変更
- Squash merge、rebase merge、force push
- `work` Branchの削除
- Pages deploymentの手動retry

## Pages policy

- Pages build: 必須
- Repositoryの`docs/`更新: 必須
- Pages artifact upload: 必須
- Pages deployment: temporary skip
- 公開URLのrevision確認: temporary skip
- Pages障害だけを理由に追加の復旧作業や連続retryを行わない

## Completion condition for this fix

- Repository committed `docs/`が固定アプリケーションHEAD指定のPages buildと一致する
- 生成物が再現可能で、同じ条件の再build後に差分がない
- 必須検証と2つのworkflowが成功する
- 新しいartifact IDとdigestが記録される
- `task-list.md`が`review_ready`になる
- `NEXT_WORK.md`が固定HEADと証拠を含む確認担当向け指示になる
- Pull Request `#4`がopen / draft / unmergedで確認可能になる

## Latest user requests queued after this task

`JLL-FE-003`確認合格後、`JLL-FE-004`として次を実装する。

- 問題文と解説の文字サイズ・太さ・構造に差を付ける
- 模擬試験の残り時間を右上へ固定する
- 2022年科目Aサンプルを通常演習へ入れない
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

その後はJavaへ進まず、`JLL-FE-LESSON-001`としてレッスン内容作成を優先する。

## Work completion update targets

- `docs/`
- `task-list.md`
- `NEXT_WORK.md`
- Pull Request `#4`本文
- Standard workflowとbrowser workflowの証拠

## Next user command

`修正`
