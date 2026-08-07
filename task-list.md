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

採用済みのパターンBを通常表示の既定にし、内容量の異なるカードを無理に同じ高さへ揃えず、不要な空白を減らす。単元名は実行時に正規化された旧形式を含めて完全な日本語名で表示し、表示幅が許す限り1行に収め、折り返す場合は意味のまとまりで自然に改行する。加えて、最新のユーザー指定に従い、絞り込みブロックの表示・読み上げ順を「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」に変更する。

### Scope

- `filterLayout=2`を指定なし・無効値時の既定表示として維持
- 絞り込みブロックを「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」の順に表示する
- DOM順・キーボード移動順も同じ順序へ揃え、375pxの1列表示でもこの順序を維持する
- 既存のBento Grid方針と不要な余白削減方針を維持し、カードの具体的な配置は上記順序を壊さない範囲で調整する
- 受験科目ブロックの独立状態を維持
- canonical `unitId`と旧形式の実行時単元値を完全な日本語表示名へ解決
- 単元名を可能な限り1行表示し、必要時のみ自然な位置で折り返す
- 問題データ、選択肢数、フォント、レイアウト測定が安定した後にブラウザ監査を実行
- 3レイアウト × 375px・768px・1,280pxを自動監査
- 固定アプリケーションHEADと一致する最新のPages成果物を`docs/`へ生成してコミット

### Out of scope

- 受験科目ブロックの位置、構造、文言、選択肢、操作変更
- 絞り込み条件、OR/AND評価、件数、開始条件の変更
- 問題本文、選択肢、正答、解説、図表の変更
- `JLL-FE-004`の問題文・解説の視覚階層、固定タイマー、出題対象、開催回表記の変更
- レッスン内容作成
- Java Learning Labの実装
- GitHub Pages deployment障害の復旧または再試行
- 実装担当による`main`へのマージ

### Completion criteria

- 指定なし・無効な`filterLayout`でパターンBが表示される
- 375px、768px、1,280pxのすべてで、絞り込みブロックの表示順が「分野 → 回答・復習状態 → 開催回・公開区分 → 単元」になっている
- DOM順・キーボード移動順が表示順と一致する
- 不要な大きな未使用空間が発生しない
- カード高さを固定せず、条件群内部へ縦スクロールを追加しない
- 単元名が英語IDや「単元名未登録」ではなく完全な日本語名で表示される
- 単元カードは表示幅を有効利用し、必要時のみ自然に折り返す
- ブラウザ監査が問題データ・選択肢・フォントの最終描画後を測定する
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- fieldset/legend、label/input関連付けが維持される
- テスト、型検査、Lint、通常build、Pages build、Chromium監査が成功する
- Repository直下`docs/`が最新の固定アプリケーションHEADのPages buildと一致する
- Draft Pull Requestと固定検証証拠が存在する

### Dependencies

- `JLL-FE-001`: completed
- `JLL-FE-002`: completed
- ユーザー指定: パターンB採用、不要な余白削減、単元名の完全日本語表示と自然な折返し
- 最新ユーザー指定: 絞り込み順を「1. 分野 2. 回答・復習状態 3. 開催回・公開区分 4. 単元」に変更

### Branch

`work`

### Pull Request

- Number: `#4`
- Base: `main`
- Head: `work`
- State: open / draft / unmerged
- Review state: needs fix

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Prior confirmation review HEAD

`8b624578f68b7ee59cc1de5515c1114316839f72`

### Fixed implementation and verification HEAD

`66a03576b5b9ac2c86c35c63045f923137f08a0c`

このHEADまでのアプリケーション実装・監査結果は、最新の並び順指定により旧仕様の検証証拠となった。次回修正では最新PR HEADから実装し、新しい固定HEADを記録する。

### Pages output synchronization HEAD

`875ac26e5dd506e11a6ec0ff52a48c223251cdb9`

### Standard workflow restoration HEAD

`6cc846a4f5b5af97f836f845b96c1a94b8225474`

### Previous implementation result

`passed under prior ordering / superseded by latest user request`

#### Previously passed checks

- Pattern B: 単元カード全幅、左側2カード縦積み、右側開催回カード配置を確認
- 768px left-card gap: `8.8px` / computed row gap: `8.8px`
- 1,280px left-card gap: `8.8px` / computed row gap: `8.8px`
- 375px: 旧DOM順の1列表示
- Final rendered source count: `1997`
- Final option counts: `[3, 24, 28, 4]`
- Horizontal overflow: 0
- Card internal scrollbar / content clipping: 0
- Raw English unit identifier / unresolved unit label: 0
- Console warning/error: 0
- Failed network request: 0
- Keyboard checkbox operation: success
- Previous DOM order: `分野 → 単元 → 開催回・公開区分 → 回答・復習状態`
- Standard workflow: `31144511506` / run `370` / success
- Standard build job: `92761099227` / success
- Automated tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact: `8980987977`
- Pages artifact digest: `sha256:1560b786ba93b9c6d57be7f8723949538e8aee4022d8fce4eeb326ec2210242b`
- Browser workflow: `31144511527` / run `39` / success
- Browser job: `92761088942` / success
- Browser artifact: `8980991042`
- Browser artifact digest: `sha256:c32e7c8aa55307a135da0e7539b152de6f214ad6d0f5582607aee82a4eb8e861`
- Browser evidence: `audit.json`と9スクリーンショットを独立確認
- Pull Request comments: 確認開始時点でなし
- Unresolved review threads: 確認開始時点でなし

### Previous fix result

#### Repositoryの`docs/`を固定アプリケーションHEADへ同期

- `GITHUB_SHA=66a03576b5b9ac2c86c35c63045f923137f08a0c npm run build:pages`で生成
- `docs/build-info.json` sourceRevision: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Generated JavaScript: `docs/assets/index-BJI--2FR.js`
- Generated stylesheet: `docs/assets/index-DSeV1n5v.css`
- Stale JavaScript `docs/assets/index-YqsZizrf.js`: removed
- Stale stylesheetは最新stylesheetへ置換
- Pages output commit: `875ac26e5dd506e11a6ec0ff52a48c223251cdb9`
- アプリケーションコード、CSS、テスト、監査コード、問題データは変更していない
- 一時同期workflowは標準workflowへ復元する

### Previous fix validation result

- One-shot synchronization workflow: `31145825406` / run `383` / success
- Synchronization job: `92764918921` / success
- Automated tests: 60 / 60 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Chromium audit: 9 scenarios passed
- Fixed revision assertion: success
- Same fixed-revision Pages build executed twice: success
- Reproducibility diff: no differences
- Generated commit: `875ac26e5dd506e11a6ec0ff52a48c223251cdb9`
- Standard workflow restored at: `6cc846a4f5b5af97f836f845b96c1a94b8225474`
- Pull Request `#4`: open / draft / unmerged

### Latest user change request

- 絞り込みブロックの順番を次へ変更する。
  1. 分野
  2. 回答・復習状態
  3. 開催回・公開区分
  4. 単元
- この変更により、旧順序を前提とした`review_ready`は取り消し、`needs_fix`へ戻す。
- 次回実装担当がコード、テスト、監査、`docs/`、管理文書を新仕様に合わせて更新する。

### Merge commit

未着手。最新ユーザー指定の修正完了前はマージしない。

### GitHub Pages result

- Prior Pages build: success
- Prior Repository `docs/` synchronization: success
- Prior Repository build revision: `66a03576b5b9ac2c86c35c63045f923137f08a0c`
- Generated assets: `index-BJI--2FR.js` / `index-DSeV1n5v.css`
- Reproducibility verification: success / no diff
- 最新の並び順修正後にPages buildと`docs/`同期を再実行する
- Deployment and public revision verification: temporary skip policyにより判定対象外

### Next task

`JLL-FE-003`の最新並び順指定を修正し、再検証して`review_ready`へ戻す。合格・merge・`work`同期後に`JLL-FE-004`へ進む。

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

一時スキップ方針を継続する。Pages build、Repositoryの`docs/`更新、artifact uploadは必須。

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

一時スキップ方針を継続する。Pages build、Repositoryの`docs/`更新、artifact uploadは必須。

### Next task

レッスン内容作成の進捗から決定する。

---

## Planned task

### Task ID

`JLL-FE-QBANK-001`

### Title

FE科目A問題バンクを公式一次資料ベースで拡充する

### Status

`planned`

### Purpose

現在の科目A 1,830問と、外部の過去問学習サイトで確認できる2,960問相当の収録規模との差を監査し、第三者サイトから問題文・解説を転載せず、IPA等の公式一次資料で出典と正答を確認できる問題だけを追加して科目A問題バンクの網羅性を高める。2,960問は収録規模の比較ベンチマークとして扱い、根拠なく件数だけを合わせない。

### Scope

- 現在の科目A 1,830問を基準に、年度・開催回・公開区分別の収録状況と欠落範囲を一覧化する
- 旧制度の午前試験、免除試験、CBT移行後の公開問題・サンプルについて、公式一次資料の有無と利用可能な設問・選択肢・正答・図表を確認する
- 公式一次資料から問題文、選択肢、正答、必要な図表、出典識別情報を取り込み可能な形式へ整備する
- 正規化指紋による重複判定を行い、既存問題との二重登録を防止する
- 図表付き問題は本文、選択肢、正答、必要図表が揃ったものだけを公開対象とする
- 新規追加問題について同期スクリプト、検証スクリプト、テスト、出典メタデータを更新する
- 最終的な科目A収録数と、追加できなかった範囲・理由を管理文書へ記録する
- 第三者サイトは収録範囲の比較・欠落調査の参考に限定し、問題文、選択肢、解説、画像を転用しない

### Out of scope

- 第三者サイトからの問題文、選択肢、解説、画像の転載またはスクレイピングによる再配布
- 科目B問題バンクの増減
- 問題演習UI、絞り込みUI、模擬試験UIの変更
- FEレッスン本文の作成・変更
- Java Learning Labの実装
- 件数を2,960問へ合わせるための出典未確認問題や不完全問題の追加
- 現在並行して進行中の作業へ割り込んで着手すること

### Completion criteria

- 年度・開催回・公開区分別の科目A収録状況と欠落範囲がRepository管理下に記録されている
- 追加した全問題について公式一次資料の出典と正答を追跡できる
- 既存の科目A 1,830問を意図せず欠落・改変していない。除外が必要な場合は理由と対象IDを明示する
- 新規追加問題で選択肢、正答、重複、図表、出典の自動検証が成功する
- 2,960問相当との差について、追加済み・公式資料不足・データ不完全・重複などの理由別に説明できる
- 最終収録数を実測して`PROJECT_CONTEXT.md`と`task-list.md`へ反映する
- テスト、型検査、Lint、通常build、Pages buildが成功する
- 実装開始時に必要なら作業を複数の小タスクへ分割し、1タスクで巨大な一括取り込みを行わない

### Dependencies

- 最新ユーザー指示: 現在並行している2つの作業と競合させない
- 着手時点で既存の進行中作業が完了または明示的に停止しており、`task-list.md`とGitHub実状態が整合していること
- 既定優先順位では`JLL-FE-LESSON-001`の後に着手する。ユーザーが明示的に優先順位を変更した場合はその指示を優先する

### Branch

`work`

### Pull Request

未作成。着手時に既存の進行中Pull Requestと競合しないことを確認して作成または更新する。

### Start HEAD

実装開始時にGitHub実状態から固定する。

### Current HEAD

未着手。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針が継続中であれば、その時点のRepositoryルールに従う。Pages buildとRepository管理対象成果物の更新要否は着手時に再確認する。

### Next task

着手完了時の最新優先順位から決定する。

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
- GitHub Pages deployment障害の復旧
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

一時スキップ方針を継続する。Pages build、Repositoryの`docs/`更新、artifact uploadは必須。

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