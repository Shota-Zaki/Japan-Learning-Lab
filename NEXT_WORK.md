# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`review_ready`

## Next role

確認担当。

実装担当の修正と自己検証は完了している。Pull Request `#4`はopen / draft / unmergedのまま維持し、固定された実装・検証HEAD、実差分、CI、browser artifactを独立して確認する。Blocking問題がなければ、管理文書更新、merge commit方式のマージ、`work`同期まで行う。

## Objective

採用済みのパターンBで、単元カードを全幅、分野と回答・復習状態を左側へ通常gapで縦積み、開催回・公開区分を右側へ配置する。右側カードの高さが左側カード間へ大きな空白を発生させないことを確認する。単元名は完全な日本語で表示し、ブラウザ監査が問題データ・選択肢・フォントの最終描画後を測定していることを確認する。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-003`
- Task status: `review_ready`
- Pull Request: `#4`
- Pull Request state: open / draft / unmerged
- Start HEAD: `1d0eaebf73a4e9567ccb91017edf5b2d470caafe`
- Prior confirmation review HEAD: `8b624578f68b7ee59cc1de5515c1114316839f72`
- Fixed implementation and verification HEAD: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Review target: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Latest task-list management commit: `7bb28c84c4023ef001e6e25530dbfa7d51ecaa64`
- Current `work` HEAD: この文書更新コミット以降の管理文書HEAD。アプリケーション確認対象は上記Review targetへ固定する

## Implemented fixes

### Pattern B spacing

- `prototype/src/fe-filter-variants.css`で右側の開催回カードを共有Grid行の高さ配分から分離した
- `prototype/src/main.jsx`で左スタック高と右カード高を実測し、Grid全体の下端だけを補う
- 左側の「分野」と「回答・復習状態」は通常のGrid gapで連続配置する
- 固定カード高、条件群内部スクロール、項目省略は追加していない
- 375pxではabsolute配置と補正を解除し、既存DOM順の1列へ戻す
- 受験科目ブロックは独立状態を維持する

### Browser audit final-state validation

- 最終収録数が最低期待値へ到達するまで待機する
- 各条件群の最終option数を待機・記録する
- `document.fonts.ready`を待機する
- 5回連続で同一状態となるまで測定を開始しない
- キャプチャ前後の双方でoverflow、clipping、DOM順、単元名、Pattern B gapを検証する
- キャプチャ前後で最終件数、option数、DOM順、単元ラベルが変化した場合は失敗する
- Chrome終了待機と一時ディレクトリ削除retryを追加し、CI後処理競合を解消した

## Fixed verification evidence

### Standard workflow

- Workflow: `31144511506`
- Run number: `370`
- Build job: `92761099227`
- Result: success
- Automated tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact ID: `8980987977`
- Pages artifact digest: `sha256:1560b786ba93b9c6d57be7f8723949538e8aee4022d8fce4eeb326ec2210242b`

### Browser workflow

- Workflow: `31144511527`
- Run number: `39`
- Browser audit job: `92761088942`
- Result: success
- Browser evidence artifact ID: `8980991042`
- Browser evidence digest: `sha256:c32e7c8aa55307a135da0e7539b152de6f214ad6d0f5582607aee82a4eb8e861`
- Evidence files: `audit.json`, `README.md`, 9 screenshots
- Scenarios: 3 layouts × 375px / 768px / 1,280px
- Final rendered source count: `1997`
- Final option counts: `[3, 24, 28, 4]`
- Pattern B left-card gap at 768px: `8.8px`
- Pattern B computed row gap at 768px: `8.8px`
- Pattern B left-card gap at 1,280px: `8.8px`
- Pattern B computed row gap at 1,280px: `8.8px`
- Horizontal overflow: 0
- Card internal scrollbar / content clipping: 0
- Raw English unit identifier / unresolved unit label: 0
- Console warning/error: 0
- Failed network request: 0
- Keyboard checkbox operation: success
- DOM order: `分野 → 単元 → 開催回・公開区分 → 回答・復習状態`

## Review scope

確認担当は次を独立して確認する。

1. Repository、Branch、Pull Requestの実状態
2. Review target `66a03576b5b9ac2c86c35c63045f923137f08a0c`
3. `main`との差分
4. `task-list.md`の目的、範囲、対象外、完了条件
5. 受験科目ブロックが独立状態を維持していること
6. Pattern Bの単元全幅、左側縦積み、右側開催回配置
7. 768px・1,280pxで左側2カード間が8.8px相当であること
8. 375pxでDOM順の1列となること
9. 固定高、内部スクロール、ラベル省略がないこと
10. 単元名が完全な日本語で、可能な限り1行、必要時のみ自然に折り返すこと
11. artifact `8980991042`の`audit.json`と9スクリーンショット
12. 最終収録数・option数・フォント完了・安定サンプル待機の実装
13. 横はみ出し、重なり、内容切れ、Console error、Network failureが0件であること
14. キーボード操作、fieldset/legend、label/input関連付け、DOM順
15. Standard workflowとbrowser workflowの成功
16. Pages buildとartifact uploadの成功
17. `task-list.md`、`NEXT_WORK.md`、PR本文の整合性

## Change allowed for confirmation role

- `task-list.md`
- `NEXT_WORK.md`
- レビュー結果と検証証拠を記録する管理文書
- 明白な管理メタデータ不一致

## Change forbidden for confirmation role

- アプリケーションコード、CSS、テスト、workflowの修正
- 受験科目ブロックの構造・文言・操作変更
- 絞り込み条件、OR/AND評価、対象件数、開始条件変更
- 問題本文、選択肢、正答、解説、図表の変更
- `JLL-FE-004`の先行実装
- レッスン内容作成の先行実装
- Java Learning Labの実装
- Squash merge、rebase merge、force push
- `work` Branchの削除

問題がある場合は自身でコードを修正せず、`task-list.md`を`needs_fix`へ戻し、再現方法・原因候補・対象ファイル・修正内容・再検証項目をこの文書へ記録する。

## Confirmation pass procedure

Blocking問題がない場合は、1回の作業で次を行う。

1. Review targetを固定して必須検証を実行
2. browser artifactを独立確認
3. `task-list.md`を`completed`へ更新
4. `NEXT_WORK.md`を`JLL-FE-004`向けへ更新
5. 管理文書変更を`work`へcommit・push
6. 管理文書更新後HEADを再確認
7. Pull Request `#4`をmerge commit方式で`main`へマージ
8. マージコミットと`main` CIを確認
9. `work`を最新`main`へ同期し、削除しない
10. GitHub実状態と管理文書の一致を確認

## GitHub Pages policy

- Pages buildとartifact uploadは必須で、今回成功済み
- Deployment jobと公開URLのrevision確認はユーザー指定のtemporary skip policyにより判定対象外
- Pages障害だけを理由にBlockingとしない
- Pages復旧作業や連続retryをこの確認へ混在させない

## Pull Request policy

- Pull Request `#4`はopen / draftのまま確認する
- 実装担当はマージしていない
- 確認合格時のみmerge commit方式でマージする
- `work`を削除しない

## Latest user requests queued after this task

`JLL-FE-003`確認合格後、次タスク`JLL-FE-004`として次を実装する。

- 問題文と解説の文字サイズ・太さ・構造に差を付ける
- 模擬試験の残り時間を右上へ固定する
- 2022年科目Aサンプルを通常演習へ入れない
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

その後はJavaへ進まず、`JLL-FE-LESSON-001`としてレッスン内容作成を優先する。

## Work completion update targets

確認担当は合格時に最低限、次を更新する。

- `task-list.md`: `completed`、最終Pull Request HEAD、マージコミット、最終CI、Pages方針、次タスク
- `NEXT_WORK.md`: `JLL-FE-004`の具体的な実装指示
- PR `#4`: 確認結果とマージ状態
- `work`: 最新`main`へ同期

## Next user command

`確認`
