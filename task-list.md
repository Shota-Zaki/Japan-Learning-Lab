# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-003`

### Title

FE絞り込みの不要な余白を減らし、単元名を完全な日本語で自然に表示する

### Status

`needs_fix`

### Purpose

採用済みのパターンBを通常表示の既定にし、内容量の異なるカードを無理に同じ高さへ揃えず、短いカードを縦方向に組み合わせて不要な空白を減らす。単元名は実行時に正規化された旧形式を含めて完全な日本語名で表示し、表示幅が許す限り1行に収め、折り返す場合は意味のまとまりで自然に改行する。

### Scope

- `filterLayout=2`のパターンBを指定なし・無効値時の既定表示へ変更
- 単元カードを全幅の主カードとして維持
- PC・タブレットで「分野」と「回答・復習状態」を左側へ隙間なく縦積みし、「開催回・公開区分」を右側へ独立配置して不要な空白を削減
- 375pxでは既存DOM順の1列を維持
- 収録データのcanonical `unitId`と、実行時に日本語へ正規化された旧単元値の両方を完全な日本語表示名へ解決
- 単元名の表示幅を優先し、可能な限り1行表示
- 1行に収まらない名称は意味上自然な位置だけに任意改行
- 未解決単元名と英語ID露出をブラウザ監査で失敗させる検証を追加
- ブラウザ監査を問題データとフォントの最終描画完了後に実行する
- 自動テスト、型検査、Lint、通常build、Pages build、Chromium監査を実行
- `docs/`とRepository内の確認証拠を更新

### Out of scope

- 受験科目ブロックの位置、構造、文言、選択肢、操作変更
- 絞り込み条件、OR/AND評価、件数、開始条件の変更
- 問題データ、問題本文、選択肢、正答、解説、図表の変更
- `JLL-FE-004`の問題文・解説の視覚階層、固定タイマー、出題対象、開催回表記の変更
- レッスン内容作成
- Java Learning Labの実装
- GitHub Pages障害の復旧またはdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

- 指定なし・無効な`filterLayout`でパターンBが表示される
- PC・タブレットで「分野」と「回答・復習状態」の間に、右側カードの高さに由来する大きな未使用空間が発生しない
- カード高さを固定せず、条件群内部へ縦スクロールを追加しない
- 現在収録中の単元と旧形式の実行時単元値が英語IDや「単元名未登録」ではなく完全な日本語名で表示される
- 単元カードは表示幅を有効利用し、可能な限り1行表示となる
- 改行が必要な名称は単語・意味のまとまりで折り返される
- ブラウザ監査は問題データ読込完了後の最終件数・最終レイアウトを測定する
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- キーボード操作とラベル関連付けが維持される
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
- State: open / draft
- Review state: changes required

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Fixed implementation HEAD

`4e71a6b77a5903de5fa2eac7187f76619c631b4a`

### CI hardening HEAD

`5c161669720f4a3f5508ff1d27722de50d7d76dd`

### Confirmation review HEAD

`8b624578f68b7ee59cc1de5515c1114316839f72`

### Current HEAD

確認不合格の管理文書更新後HEADはGitHub実状態から再取得する。修正対象アプリケーションの基準HEADは`4e71a6b77a5903de5fa2eac7187f76619c631b4a`。

### Validation result

- Confirmation result: failed / Blocking findingsあり
- Automated tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Standard workflow: `31143102204` / run `346` / success
- Standard build job: `92756925888` / success
- Browser audit workflow: `31143102205` / run `27` / success
- Browser audit job: `92756925738` / success
- Browser evidence artifact ID: `8980485643`
- Browser evidence digest: `sha256:0b7e1b3e43f4135024d8abf8ef82eb0988a9edd252570ddc5977f53176aab55e`
- Pull Request comments: none
- Unresolved review threads: none

#### Blocking finding 1: パターンBに大きな未使用空間が残る

- 再現: `?screen=fe&tab=practice&filterLayout=2`を1,280pxで開き、問題データ読込完了後の絞り込みを確認する
- 結果: 左側の「1. 分野」と「4. 回答・復習状態」の間に、右側の「3. 開催回・公開区分」の高さに引き延ばされた大きな空白が残る
- 原因候補: 同一CSS Grid上で右側カードを`grid-row: 2 / span 2`にし、左側2カードを共有行2・3へ配置しているため、右側カードのintrinsic heightが共有行の配分へ影響する
- 修正方針: 単元カードの下を、左側の独立した縦スタックと右側カードの2カラム構造にするなど、左右の高さ計算を分離する。DOM順、ラベル関連付け、375pxの1列順序を維持し、固定高や内部スクロールは使用しない

#### Blocking finding 2: ブラウザ監査が最終描画前を測定する

- 再現: artifact `8980485643`の`audit.json`と`layout-2-1280.png`を比較する
- 結果: `audit.json`の1,280pxパターンBは単元15件・開催回カード高約116pxを記録する一方、同一シナリオのスクリーンショットは読込後の単元24件・開催回28件を表示する
- 原因候補: `waitForApplication`がdocument complete、カード4件、受験科目表示だけで完了し、問題データ読込完了と最終件数の安定を待っていない。メトリクス取得後に非同期描画が進んでいる
- 修正方針: `bankStatus`または画面上の収録数・選択肢件数が最終値へ到達し、連続観測で安定した後にメトリクスとスクリーンショットを取得する。フォント読込完了も待機し、最終状態の件数・余白・クリッピングを検証する

### Required revalidation

- `cd prototype && npm run verify:fe`
- 3レイアウト × 375px / 768px / 1,280pxの最終描画監査
- パターンBで左側2カード間の不要な空白がないこと
- 監査メトリクスとスクリーンショットの件数・カード寸法が同一描画状態であること
- 単元名未登録、英語ID、横はみ出し、カード内スクロール、内容切れ、Console error、Network failureが0件であること
- キーボード操作とDOM順が維持されること
- 修正後のCI artifactを固定し、管理文書へHEAD・run・artifact・digestを記録すること

### Merge commit

未着手。確認不合格のためマージしない。

### GitHub Pages result

- Pages build and artifact upload: success
- Deployment and public revision verification: temporary skip policyにより判定対象外
- Deploy job: skipped
- Pages障害は今回の不合格理由ではない

### Next task

`JLL-FE-004`。ただし`JLL-FE-003`が`completed`になるまで開始しない。

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
- `2026年7月科目A免除制度修了試験`の利用者向け表示を`令和8年度 免除試験`へ変更する
- 必要に応じて`DESIGN.md`を実装前に更新する
- 自動テスト、型検査、Lint、通常build、Pages build、PC・スマートフォン表示を検証する
- `docs/`、Draft Pull Request、管理文書を更新する

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
- Title: FE演習の絞り込みを、独立した受験科目ブロックを維持したモジュール不規則型Gridの3パターンへ変更する
- Purpose: 受験科目を独立配置のまま維持し、その下の4条件群だけを3レイアウトへ変更する
- Scope: `filterLayout=1|2|3`、375px・768px・1,280px、同一DOM、キーボード操作、Chromium監査
- Out of scope: 問題データ変更、Java、Pages障害復旧
- Completion criteria: Pages公開依存項目を除き合格
- Dependencies: `JLL-FE-001`
- Branch: `work`
- Pull Request: `#3` / merged
- Start HEAD: `c58aa9455b1941055310c0dd82b65352530a6482`
- Fixed implementation HEAD: `ca5212d91b3b9792a53d0fac4bc7f69648682798`
- Final Pull Request HEAD: `aaac236ab887c7a55f0491cf40a9c88824e3507b`
- Validation: tests 56 / 56、TypeScript、ESLint、build、Pages build、9 browser scenarios success
- Merge commit: `c01be523eb78d0a4ce9d7e6c8cf13eeb7868b3a8`
- GitHub Pages: build/artifact success、deployment/public verificationはtemporary skip
- Next task: `JLL-FE-003`

### JLL-FE-001

- Status: `completed`
- Title: FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試、演習ナビゲーション、詳細解説を完成させる
- Purpose: FE演習を公式問題、科目A・B、模擬試験、履歴、結果レビュー、問題移動、詳細解説まで完成させる
- Scope: FE演習全般、自動テスト、build、固定CI artifactによるブラウザ確認
- Out of scope: Java、問題データにない根拠生成、Pages障害回避workflow
- Completion criteria: Pages公開依存項目を除き合格
- Dependencies: 既存FE基盤
- Branch: `work`
- Pull Request: `#1` / merged
- Start HEAD: `d151cbfb71cdb00af52d3ec50afea74f3035b230`
- Fixed implementation HEAD: `5a62c156ec07e93d1bb5108bab858d1f314f2592`
- Final Pull Request HEAD: `b50b5b2f301e135d7140aee015a41c12e8b62ab8`
- Validation: tests 52 / 52、TypeScript、ESLint、build、Pages build、PC/tablet/mobile browser review success
- Merge commit: `82b7a01c042f339b5eae019f851905ce7505b39a`
- GitHub Pages: build/artifact success、deployment/public verificationはtemporary skip
- Next task: `JLL-FE-002`
