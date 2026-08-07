# Next Work

## Current Task ID

`JLL-FE-003`

## Current phase

`needs_fix`

## Next role

実装担当。

確認担当がBlocking問題を2件確認したため、Pull Request `#4`はマージしていない。新しいチャットでRepository実状態を再取得し、この文書の修正指示を反映する。`JLL-FE-004`、レッスン内容作成、Java Learning Labへは進まない。

## Objective

採用済みのパターンBを通常表示の既定にし、単元カードを全幅、分野と回答・復習状態を左側へ隙間なく縦積み、開催回・公開区分を右側へ配置して不要な空白を解消する。canonical IDと旧形式の実行時単元値を完全な日本語表示名へ解決し、可能な限り1行、必要時は意味のまとまりで自然に折り返す。ブラウザ監査は問題データとフォントの最終描画完了後を測定する。

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
- Fixed application review HEAD: `4e71a6b77a5903de5fa2eac7187f76619c631b4a`
- CI hardening HEAD: `5c161669720f4a3f5508ff1d27722de50d7d76dd`
- Confirmation review HEAD: `8b624578f68b7ee59cc1de5515c1114316839f72`
- Confirmation task-list update: `662e92cd979b77c1db79a64d5d323921585d8f97`
- Current `work` HEAD: この文書更新後にGitHub実状態から再取得する

## Confirmation result

`failed`

CIの自動テスト、型検査、Lint、通常build、Pages build、artifact uploadは成功している。ただし、最終描画に大きな未使用空間が残り、ブラウザ監査が非同期問題データの読込完了前を測定していたため、完了条件を満たしていない。

## Blocking finding 1: パターンBの左列に大きな空白が残る

### Reproduction

1. `work`の成果物を1,280px幅で開く
2. `?screen=fe&tab=practice&filterLayout=2`へ移動する
3. 収録数と絞り込み件数の読込が完了するまで待つ
4. 「1. 分野」と「4. 回答・復習状態」の間を確認する

### Actual result

左側の「1. 分野」と「4. 回答・復習状態」の間に、右側の「3. 開催回・公開区分」の高さに由来する大きな未使用空間が残る。artifact `8980485643`の`layout-2-1280.png`でも確認できる。

### Cause candidate

`prototype/src/fe-filter-variants.css`で、4カードを同一Gridへ置いたまま次の配置をしている。

- 分野: row 2 / left
- 単元: row 1 / full width
- 開催回・公開区分: row 2からrow 3をspan / right
- 回答・復習状態: row 3 / left

右側カードのintrinsic heightが共有row 2・3の配分へ影響し、左側2カードが独立した縦スタックになっていない。

### Required fix

- 単元カードの下を、左側の独立した縦スタックと右側カードの2カラムとして高さ計算を分離する
- DOM順は「分野、単元、開催回・公開区分、回答・復習状態」の既存順を維持する
- CSS Gridのnamed area、補助wrapper、display contents等を使用する場合も、読み上げ順、fieldset/legend、label/input関連付けを壊さない
- 受験科目ブロックは現在の独立状態を維持する
- カード固定高、条件群内スクロール、項目省略は追加しない
- 375pxでは既存DOM順の1列へ戻す
- 768pxと1,280pxで左側2カード間の余白を通常のgrid gap相当へ抑える

## Blocking finding 2: ブラウザ監査が最終描画前を測定する

### Reproduction

1. workflow `31143102205`のartifact `8980485643`を取得する
2. `audit.json`のvariant 2 / 1,280pxを確認する
3. 同artifactの`layout-2-1280.png`と比較する

### Actual result

- `audit.json`: 単元ラベル15件、開催回カード高約116px
- スクリーンショット: 読込後の単元24件、開催回28件を表示し、開催回カードは大幅に高い

同一シナリオ内で、メトリクスとスクリーンショットが異なる描画状態を記録している。したがって、横はみ出し、カード内overflow、ラベル切れ、単元名網羅、カード間余白の合格判定は最終状態を証明していない。

### Cause candidate

`prototype/scripts/audit-fe-filter-layouts.mjs`の`waitForApplication`は次だけを待機している。

- `document.readyState === "complete"`
- 絞り込みカード4件
- 受験科目ブロックの存在

問題データの非同期読込完了、収録数、選択肢件数の安定、Webフォント完了を待たず、メトリクス取得後に描画が更新されている。

### Required fix

- 問題バンクのloading終了をDOMから判定できる条件を追加する
- 少なくとも収録数表示が`—`ではなく最終値になり、分野・単元・開催回の件数が連続観測で安定してから測定する
- `document.fonts.ready`を待ってからラベル幅とスクリーンショットを取得する
- メトリクスとスクリーンショットを同一の安定描画状態から取得する
- audit結果へ各条件群の最終option数を記録する
- 期待する最低件数またはRepository内データから導出した件数と一致しない場合は監査を失敗させる
- パターンBについて、左側2カード間の垂直gapが許容値以内であることを機械検証する
- 監査の再試行は一時的なChrome起動失敗だけを吸収し、未完成描画を成功扱いしない

## Change targets

- `DESIGN.md`または`prototype/DESIGN.md`: 必要な場合、独立した左縦スタックの構造を先に明記
- `prototype/src/FePracticeSetup.jsx`: 必要な補助wrapperまたは意味を壊さない構造変更
- `prototype/src/fe-filter-variants.css`: パターンBの左右独立レイアウト修正
- `prototype/scripts/audit-fe-filter-layouts.mjs`: 最終描画待機、件数安定、gap検証
- `.github/workflows/fe-filter-layout-audit.yml`: 必要な監査条件の更新
- `prototype/tests/fe-filter-layout.test.mjs`: 構造・既定値・禁止事項の回帰テスト
- `prototype/qa/jll-fe-003-browser/`: 修正後の最終証拠
- `docs/`: `npm run build:pages`から再生成
- Root管理文書

## Change forbidden

- 受験科目ブロックの構造・文言・操作変更
- 絞り込みの条件内容、OR/AND評価、対象件数、開始条件変更
- 問題本文、選択肢、正答、解説、図表の変更
- `JLL-FE-004`の先行実装
- レッスン内容作成の先行実装
- Java Learning Labの実装
- Pages deploymentの連続retry
- Squash merge、rebase merge、force push
- `work` Branchの削除
- 実装担当による`main`へのマージ

## Completion criteria

- 指定なし・無効な`filterLayout`でパターンBが表示される
- 受験科目ブロックが独立状態を維持する
- 単元カードが全幅を使用する
- 768px・1,280pxで分野と回答・復習状態が通常gapで連続して縦積みされる
- 右側の開催回カードの高さが左側カード間の空白を生まない
- カード固定高、内部縦スクロール、ラベル省略がない
- 収録中単元と旧形式の実行時単元値が完全な日本語で表示される
- 長い単元名は可能な限り1行、必要時のみ自然な候補位置で折り返す
- ブラウザ監査が問題データ・フォントの最終描画完了後を測定する
- 監査メトリクスとスクリーンショットの件数・寸法が同一状態を示す
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- キーボード操作とラベル関連付けが維持される
- 絞り込みロジック、件数、開始条件に回帰がない
- 必須検証、`docs/`、証拠、Draft PR、管理文書が整合する

## Required validation

1. `cd prototype && npm ci`
2. `cd prototype && npm run verify:fe`
3. 3レイアウト × 375px / 768px / 1,280pxのChromium監査
4. パターンBの3幅で最終描画スクリーンショットを保存
5. 最終option数、カード座標、カード間gap、overflow、clippingをauditへ記録
6. 単元名未登録: 0
7. raw English unit identifier: 0
8. horizontal overflow: 0
9. card scrollbar / content clipping: 0
10. console warning/error: 0
11. failed network request: 0
12. keyboard checkbox operation: success
13. Standard workflowとbrowser audit workflowの成功
14. artifact ID、digest、workflow run、job、固定HEADを管理文書へ記録

## Prior successful checks that do not waive the blockers

- Automated tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Standard workflow: `31143102204` / run `346` / build job `92756925888`
- Browser workflow: `31143102205` / run `27` / job `92756925738`
- Browser artifact: `8980485643`
- Browser artifact digest: `sha256:0b7e1b3e43f4135024d8abf8ef82eb0988a9edd252570ddc5977f53176aab55e`

## GitHub Pages policy

- Pages buildとartifact uploadは必須
- Deployment jobと公開URLのrevision確認はtemporary skip policyにより判定対象外
- Pages障害だけを理由にBlockingとしない
- Pages復旧作業や連続retryをこの修正へ混在させない

## Pull Request policy

- Pull Request `#4`をopen / draftのまま更新する
- 修正後の固定HEADと検証証拠をPR本文へ反映する
- 実装担当はマージしない
- Ready for reviewへ変更しない

## Work completion update targets

- `task-list.md`: `review_ready`、修正HEAD、検証結果、artifact、CI、Pages方針
- `NEXT_WORK.md`: 確認担当向けの固定レビュー指示
- `PROJECT_CONTEXT.md`: 現在優先タスクとHEADが必要なら更新
- PR `#4`: 修正概要と最終証拠
- `docs/`と`prototype/qa/jll-fe-003-browser/`

## Latest user requests queued after this task

`JLL-FE-003`確認合格後、次タスク`JLL-FE-004`として次を実装する。

- 問題文と解説の文字サイズ・太さ・構造に差を付ける
- 模擬試験の残り時間を右上へ固定する
- 2022年科目Aサンプルを通常演習へ入れない
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する

`JLL-FE-004`完了後はJavaへ進まず、`JLL-FE-LESSON-001`としてレッスン内容作成を優先する。

## Next user command

`修正`
