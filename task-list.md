# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-003`

### Title

FE絞り込みの不要な余白を減らし、単元名を完全な日本語で自然に表示する

### Status

`review_ready`

### Purpose

採用済みのパターンBを通常表示の既定にし、内容量の異なるカードを無理に同じ高さへ揃えず、短いカードを縦方向に組み合わせて不要な空白を減らす。単元名は実行時に正規化された旧形式を含めて完全な日本語名で表示し、表示幅が許す限り1行に収め、折り返す場合は意味のまとまりで自然に改行する。

### Scope

- `filterLayout=2`を指定なし・無効値時の既定表示として維持
- 単元カードを全幅の主カードとして維持
- PC・タブレットで「分野」と「回答・復習状態」を左側へ通常のGrid gapで縦積み
- 「開催回・公開区分」を右側へ配置し、左右の高さ計算を分離
- 375pxでは既存DOM順の1列を維持
- 受験科目ブロックの独立状態を維持
- canonical `unitId`と旧形式の実行時単元値を完全な日本語表示名へ解決
- 単元名を可能な限り1行表示し、必要時のみ自然な位置で折り返す
- 問題データ、選択肢数、フォント、レイアウト測定が安定した後にブラウザ監査を実行
- 3レイアウト × 375px・768px・1,280pxを自動監査

### Out of scope

- 受験科目ブロックの位置、構造、文言、選択肢、操作変更
- 絞り込み条件、OR/AND評価、件数、開始条件の変更
- 問題本文、選択肢、正答、解説、図表の変更
- `JLL-FE-004`の問題文・解説の視覚階層、固定タイマー、出題対象、開催回表記の変更
- レッスン内容作成
- Java Learning Labの実装
- GitHub Pages障害の復旧またはdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

- 指定なし・無効な`filterLayout`でパターンBが表示される
- 768px・1,280pxで「分野」と「回答・復習状態」の間隔が通常のGrid gap相当となる
- 右側カードの高さに由来する大きな未使用空間が発生しない
- カード高さを固定せず、条件群内部へ縦スクロールを追加しない
- 単元名が英語IDや「単元名未登録」ではなく完全な日本語名で表示される
- 単元カードは表示幅を有効利用し、必要時のみ自然に折り返す
- ブラウザ監査が問題データ・選択肢・フォントの最終描画後を測定する
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- キーボード操作とDOM順、fieldset/legend、label/input関連付けが維持される
- テスト、型検査、Lint、通常build、Pages build、Chromium監査が成功する
- Draft Pull Requestと固定検証証拠が存在する

### Dependencies

- `JLL-FE-001`: completed
- `JLL-FE-002`: completed
- ユーザー指定: パターンB採用、不要な余白削減、単元名の完全日本語表示と自然な折返し

### Branch

`work`

### Pull Request

- Number: `#4`
- Base: `main`
- Head: `work`
- State: open / draft / unmerged
- Review state: confirmation requested

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Prior confirmation review HEAD

`8b624578f68b7ee59cc1de5515c1114316839f72`

### Fixed implementation and verification HEAD

`66a03576b5b9ac2c86c35c63045f923137f08a0c`

管理文書更新後も、アプリケーションコード・監査コード・テストの確認対象はこのHEADに固定する。

### Validation result

- Implementation self-check: passed
- Automated tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Standard workflow: `31144511506` / run `370` / success
- Standard build job: `92761099227` / success
- Pages artifact ID: `8980987977`
- Pages artifact digest: `sha256:1560b786ba93b9c6d57be7f8723949538e8aee4022d8fce4eeb326ec2210242b`
- Browser audit workflow: `31144511527` / run `39` / success
- Browser audit job: `92761088942` / success
- Browser evidence artifact ID: `8980991042`
- Browser evidence digest: `sha256:c32e7c8aa55307a135da0e7539b152de6f214ad6d0f5582607aee82a4eb8e861`
- Browser evidence: 3レイアウト × 375px・768px・1,280pxの9スクリーンショット
- Final rendered source count: `1997`
- Final option counts: `[3, 24, 28, 4]`
- Pattern B left-card gap at 768px: `8.8px` / computed row gap `8.8px`
- Pattern B left-card gap at 1,280px: `8.8px` / computed row gap `8.8px`
- Horizontal overflow: 0
- Card internal scrollbar / content clipping: 0
- Raw English unit identifier / unresolved unit label: 0
- Console warning/error: 0
- Failed network request: 0
- Keyboard checkbox operation: success
- DOM order: `分野 → 単元 → 開催回・公開区分 → 回答・復習状態`
- Pull Request comments: none
- Unresolved review threads: none

### Resolved Blocking findings

1. Pattern Bの右側カードを共有行の高さ配分から分離し、左側2カードを通常gapで連続配置した。
2. ブラウザ監査は最終収録数、最終option数、`document.fonts.ready`、連続した安定サンプルを待つ。キャプチャ前後の双方で全レイアウト要件を検証し、最終データ状態が変化した場合は失敗する。
3. Chrome終了待機と一時ディレクトリ削除のretryを追加し、CI後処理競合を解消した。

### Required confirmation

確認担当は次を独立して実施する。

- 固定HEAD `66a03576b5b9ac2c86c35c63045f923137f08a0c`と`main`の差分確認
- artifact `8980991042`の`audit.json`と9スクリーンショット確認
- Pattern Bの768px・1,280pxで左カード間隔が8.8pxであることの再確認
- 最終件数・option数・overflow・clipping・DOM順・キーボード操作の再確認
- Standard workflow `31144511506`とbrowser workflow `31144511527`の成功確認
- Blocking問題がなければ管理文書更新、merge commit方式のマージ、`work`同期を実施

### Merge commit

未着手。実装担当のためマージしない。

### GitHub Pages result

- Pages build and artifact upload: success
- Deploy job: skipped
- Deployment and public revision verification: ユーザー指定のtemporary skip policyにより判定対象外
- Pages障害は今回の実装完了判定を妨げない

### Next task

`JLL-FE-004`。ただし`JLL-FE-003`が確認合格・`completed`になるまで開始しない。

---

## Planned task

### Task ID

`JLL-FE-004`

### Title

FE演習の可読性、模擬試験タイマー、出題対象、開催回表記を修正する

### Status

`planned`

### Purpose

問題文と解説の視覚的な区別を明確にし、模擬試験中の残り時間を常時確認できるようにする。通常演習へ混在させない公式サンプルの扱いと、免除試験の表示名をユーザー指定に合わせる。

### Scope

- 問題文と解説で文字サイズ、太さ、見出し、余白に明確な差を付ける
- 模擬試験の残り時間を画面右上へ固定し、スクロール中も常時表示する
- 2022年科目Aサンプルを通常の演習出題対象から除外する
- `2026年7月科目A免除制度修了試験`を`令和8年度 免除試験`と表示する
- 必要に応じて`DESIGN.md`を実装前に更新する
- 自動テスト、型検査、Lint、通常build、Pages build、PC・スマートフォン表示を検証する

### Out of scope

- 問題本文、選択肢、正答、解説内容そのものの改変
- `JLL-FE-003`の絞り込み配置変更
- レッスン本文の作成
- Java Learning Labの実装
- 実装担当による`main`へのマージ

### Completion criteria

- 問題文と解説が文字サイズ・太さ・構造で明確に区別できる
- 模擬試験の残り時間が右上へ固定され、375pxを含む対象画面幅で本文や操作を妨げない
- 2022年科目Aサンプルが通常演習の候補へ入らない
- 対象開催回が`令和8年度 免除試験`と表示される
- 既存セッション、模擬試験、結果レビュー、履歴に回帰がない
- 必須検証、`docs/`更新、Draft Pull Request更新が完了する

### Dependencies

- `JLL-FE-003`: completed後に開始

### Branch

`work`

### Pull Request

`JLL-FE-003`確認合格・マージ後に作成または更新する。

### Start HEAD

実装開始時にGitHub実状態から固定する。

### Current HEAD

未着手。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。Pages buildとartifact uploadは必須。

### Next task

`JLL-FE-LESSON-001`

---

## Planned task

### Task ID

`JLL-FE-LESSON-001`

### Title

FEレッスン内容を作成する

### Status

`planned`

### Purpose

FE演習のUI修正完了後、Java実装へ進まず、学習用レッスンの構成と本文作成を開始する。

### Scope

- 既存レッスン画面、データ構造、設計方針、対象ユーザーの再確認
- レッスン単元、学習順序、到達目標、本文、例、確認項目の具体化
- UI変更が必要な場合は`DESIGN.md`を実装前に更新
- 実装、テスト、build、`docs/`、Draft Pull Request、管理文書の更新

### Out of scope

- Java Learning Labの再開
- 公式問題本文や正答の改変
- 実装担当による`main`へのマージ

### Completion criteria

`JLL-FE-004`完了後、Repository実状態から最初のレッスン作成範囲を単一タスクとして具体化し、検証可能な成果物を作成する。

### Dependencies

- `JLL-FE-004`: completed後に開始

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に記録する。

### Current HEAD

未着手。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。

### Next task

レッスン内容作成の進捗から決定する。

---

## Deferred task

### Task ID

`JLL-JAVA-001`

### Title

Java Learning Labの現在設計と進捗を再確認して実装を再開する

### Status

`planned`

### Purpose

Repository内のJava Learning Labの設計、既存実装、テスト、未完了範囲を再確認し、単一の実装タスクとして具体化して再開する。

### Scope

- Rootおよび`prototype/`配下の管理文書、設計文書、既存Java実装、テストの確認
- 現状、変更対象、対象外、完了条件、検証方法の確定
- 必要な設計更新、実装、検証、`docs/`更新、Draft Pull Request作成

### Out of scope

- 未完了のFE修正とレッスン作成を飛ばして着手すること
- GitHub Pages障害の復旧
- 実装担当による`main`へのマージ

### Completion criteria

FEレッスン内容作成の優先タスク完了後、最新のユーザー指示とRepository実状態を確認して着手可否を再判定する。

### Dependencies

- `JLL-FE-LESSON-001`以降の優先タスク

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に記録する。

### Current HEAD

未着手。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。

### Next task

着手時に決定する。

---

## Completed task summary

### JLL-FE-002

- Status: `completed`
- Pull Request: `#3` / merged
- Final Pull Request HEAD: `aaac236ab887c7a55f0491cf40a9c88824e3507b`
- Merge commit: `c01be523eb78d0a4ce9d7e6c8cf13eeb7868b3a8`
- Validation: tests 56 / 56、TypeScript、ESLint、build、Pages build、9 browser scenarios success
- GitHub Pages: build/artifact success、deployment/public verificationはtemporary skip
- Next task: `JLL-FE-003`

### JLL-FE-001

- Status: `completed`
- Pull Request: `#1` / merged
- Final Pull Request HEAD: `b50b5b2f301e135d7140aee015a41c12e8b62ab8`
- Merge commit: `82b7a01c042f339b5eae019f851905ce7505b39a`
- Validation: tests 52 / 52、TypeScript、ESLint、build、Pages build、PC/tablet/mobile browser review success
- GitHub Pages: build/artifact success、deployment/public verificationはtemporary skip
- Next task: `JLL-FE-002`
