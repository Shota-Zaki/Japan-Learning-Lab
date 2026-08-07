# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`review_ready`

## Next role

確認担当。

実装担当とは別の新しいチャットでRepository実状態を再取得し、固定されたアプリケーションHEAD、PR差分、CI、ブラウザ証拠、管理文書を独立して確認する。Blocking問題がなければ、プロジェクト規則に従って管理文書更新、merge commit方式のマージ、`work`同期まで進める。

## Objective

採用済みのパターンBを通常表示の既定にし、単元カードを全幅、分野と回答・復習状態を左側へ縦積み、開催回・公開区分を右側へ配置して不要な空白を減らす。canonical IDと旧形式の実行時単元値を完全な日本語表示名へ解決し、可能な限り1行、必要時は意味のまとまりで自然に折り返す。

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- Permanent working Branch: `work`
- Application directory: `prototype/`
- Current Task: `JLL-FE-003`
- Task status: `review_ready`
- Pull Request: `#4`
- Pull Request state: open / draft
- Start HEAD: `1d0eaebf73a4e9567ccb91017edf5b2d470caafe`
- Fixed application review HEAD: `4e71a6b77a5903de5fa2eac7187f76619c631b4a`
- Evidence HEAD: `bdb5a1aceae4293c3add3911b1cb2a4867650382`
- Latest recorded management predecessor: `c3b9639b5ae584fc11f7346fd285a5329bf448d8`
- Final `work` HEAD: confirmation担当が作業開始時にGitHub実状態から固定する

## Implemented changes

- 指定なし・無効な`filterLayout`の既定をパターンBへ変更
- 単元を全幅、分野と回答・復習状態を左側の縦積み、開催回・公開区分を右側の2段領域へ配置
- 固定高や条件群内スクロールを使わず、内容量差による大きな余白を削減
- canonical `unitId`41種へ日本語表示名と自然な任意改行位置を定義
- 実行時に日本語へ正規化される旧単元値を逆解決する互換処理を追加
- `コンピュータシステム`、`企業と法務`、旧表記の`システム開発技術`、`ソフトウェア開発管理技術`を含む互換テストを追加
- 未解決の「単元名未登録」と英語ID露出をCIブラウザ監査で失敗させる検証を追加
- 一時的な自己変更診断workflowを削除
- Repository内のブラウザ証拠を最終監査結果へ更新

## Change targets reviewed

- Root `DESIGN.md`
- `prototype/DESIGN.md`
- `prototype/src/feFilterLayout.js`
- `prototype/src/feUnitLabels.js`
- `prototype/src/FePracticeSetup.jsx`
- `prototype/src/fe-filter-variants.css`
- `prototype/tests/fe-filter-layout.test.mjs`
- `prototype/tests/fe-unit-labels.test.mjs`
- `prototype/scripts/audit-fe-filter-layouts.mjs`
- `.github/workflows/fe-filter-layout-audit.yml`
- `prototype/package.json`
- `docs/`
- `prototype/qa/jll-fe-003-browser/`
- Root管理文書

## Change forbidden during confirmation

- アプリケーションコード、CSS、テスト、workflow、生成成果物の修正
- 新しいUI仕様の追加
- `JLL-FE-004`の先行実装
- レッスン内容作成の先行実装
- Squash merge、rebase merge、force push
- `work` Branchの削除

明白な管理メタデータ不一致だけは確認担当が管理文書で修正できる。コード、UI、テスト、設定にBlocking問題がある場合はマージせず、`needs_fix`へ戻す。

## Completion criteria to review

- 指定なし・無効な`filterLayout`でパターンBが表示される
- 受験科目ブロックが独立状態を維持する
- PC・タブレットで不要な大きな空白が減っている
- カード固定高と条件群内縦スクロールがない
- 収録中単元と旧形式の実行時単元値が完全な日本語で表示される
- 「単元名未登録」と英語IDが利用者向け表示へ出ない
- 長い単元名は省略せず、自然な位置で折り返す
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- キーボード操作とラベル関連付けが維持される
- 絞り込みロジック、件数、開始条件に回帰がない
- 必須検証、`docs/`、証拠、Draft PR、管理文書が整合する

## Required validation evidence

- Automated tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Standard workflow: `31142671218` / run `332` / success
- Standard build job: `92755625780` / success
- Browser audit workflow: `31142671147` / run `20` / success
- Browser audit job: `92755625324` / success
- Browser audit coverage: 3 layouts × 375px / 768px / 1,280px = 9 scenarios
- Browser evidence artifact ID: `8980340883`
- Browser evidence digest: `sha256:d6c813f0eec4d9226a03b81840709a41ad1e4b2e0295b1d1a38a132eb2fb9f86`
- Captured unit labels: 144
- Distinct unit labels: 24
- Unresolved unit labels: 0
- Raw English unit identifiers: 0
- Horizontal overflow: 0
- Card scrollbar or content clipping: 0
- Console warnings/errors: 0
- Failed network requests: 0
- Repository evidence: `prototype/qa/jll-fe-003-browser/README.md`
- Repository evidence summary: `prototype/qa/jll-fe-003-browser/audit.json`
- Pull Request comments: none at implementation handoff
- Unresolved review threads: none at implementation handoff

## GitHub Pages policy

- Pages buildとartifact uploadは成功済み
- Deployment jobはtemporary skip policyによりskipped
- 公開URLのrevision確認は一時的に判定対象外
- Pages障害だけを理由にBlockingとしない
- Pages復旧作業や連続retryをこの確認へ混在させない

## Unresolved findings

Blocking、Non-blockingともに実装担当からの未解決指摘なし。

確認担当は実装説明を信用せず、PR #4の実差分、固定アプリケーションHEAD、最新`work` HEAD、CI、証拠を独立して再確認する。

## Latest user requests queued after this task

次タスク`JLL-FE-004`として、次を実装する。

- 問題文と解説の文字サイズ・太さ・構造に差を付けて読み分けやすくする
- 模擬試験の残り時間を右上へ固定し、常に見えるようにする
- 2022年科目Aサンプルを通常演習へ入れない
- `2026年7月科目A免除制度修了試験`の表示を`令和8年度 免除試験`にする

`JLL-FE-004`完了後はJavaへ進まず、`JLL-FE-LESSON-001`としてレッスン内容作成を優先する。

## Confirmation pass procedure

1. Repository、`main`、`work`、PR #4、最新CIを再取得する
2. `AGENTS.md`、`PROJECT_CONTEXT.md`、`task-list.md`、この文書、必要な`DESIGN.md`を確認する
3. PR #4のレビュー対象アプリケーションHEADを`4e71a6b77a5903de5fa2eac7187f76619c631b4a`として固定する
4. `main`との差分、変更対象、変更禁止範囲、完了条件を独立確認する
5. テスト、型検査、Lint、通常build、Pages build、CI、browser artifactを確認する
6. PC、タブレット、スマートフォン、キーボード操作、アクセシビリティを確認する
7. Blocking問題がなければ`task-list.md`を`completed`へ更新し、`JLL-FE-004`を次のcurrent taskとして登録する
8. この文書を`JLL-FE-004`実装担当向けに更新する
9. 管理文書を`work`へcommit、pushし、更新後HEADを再検証する
10. PR #4をmerge commit方式で`main`へマージする
11. merge commit、`main`実状態、`work`同期、CI、Pages方針との整合を確認する
12. `work`を削除しない

## Confirmation failure procedure

Blocking問題がある場合はマージしない。

- 問題をBlockingとNon-blockingに分類する
- 再現方法、原因候補、修正対象、必要な修正、再検証項目を記録する
- `task-list.md`を`needs_fix`へ更新する
- この文書を実装担当向けの具体的修正指示へ更新する
- 管理文書を`work`へcommit、pushする
- PR #4をopen / draftのまま維持する

## Next user command

`確認`
