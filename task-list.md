# Task List

このファイルをタスク状態の唯一の正本とする。

## Current task

### Task ID

`JLL-FE-003`

### Title

FE絞り込みの不要な余白を減らし、単元名を完全な日本語で自然に表示する

### Status

`in_progress`

### Purpose

採用済みのパターンBを通常表示の既定にし、内容量の異なるカードを無理に同じ高さへ揃えず、短いカードを縦方向に組み合わせて不要な空白を減らす。単元名は収録データに存在する全単元を完全な日本語名で表示し、表示幅が許す限り1行に収め、折り返す場合は意味のまとまりで自然に改行する。

### Scope

- `filterLayout=2`のパターンBを指定なし・無効値時の既定表示へ変更する
- 単元カードを全幅の主カードとして維持する
- PC・タブレットで「分野」と「回答・復習状態」を左側へ縦積みし、「開催回・公開区分」を右側で2段分使用して不要な空白を減らす
- 375pxでは既存DOM順の1列を維持する
- 収録データで使用中の全`unitId`を完全な日本語名へ対応付ける
- 単元名の表示幅を優先し、可能な限り1行で表示する
- 1行に収まらない単元名には意味上自然な位置だけに任意改行位置を設定する
- 自動テスト、型検査、Lint、通常build、Pages build、Chromium監査を更新・実行する
- `docs/`を最新生成物へ更新する

### Out of scope

- 受験科目ブロックの位置、構造、文言、選択肢、操作変更
- 絞り込み条件、OR/AND評価、件数、開始条件の変更
- 問題データ、問題本文、選択肢、正答、解説、図表の変更
- Java Learning Labの実装
- GitHub Pages障害の復旧またはdeployment再試行
- 実装担当による`main`へのマージ

### Completion criteria

- 指定なし・無効な`filterLayout`ではパターンBが表示される
- PC・タブレットで短いカード下の大きな未使用空間が解消され、カード同士が無理なく詰められている
- カード高さを固定せず、内部縦スクロールを追加していない
- 現在収録中の全単元が英語IDではなく完全な日本語名で表示される
- 単元カードは表示幅を有効利用し、可能な限り1行表示となる
- 改行が必要な名称は単語・意味のまとまりで折り返され、文字途中の不自然な分割がない
- 375px、768px、1,280pxで横はみ出し、重なり、内容切れ、操作不能がない
- キーボード操作とラベル関連付けが維持される
- テスト、型検査、Lint、通常build、Pages build、Chromium監査が成功する
- Draft Pull Requestと確認用証拠が存在する

### Dependencies

- `JLL-FE-001`: completed
- `JLL-FE-002`: completed
- ユーザー指定: パターンB採用、不要な余白削減、単元名の完全日本語表示と自然な折返し

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

`1d0eaebf73a4e9567ccb91017edf5b2d470caafe`

### Current HEAD

実装・検証commit後にGitHub実状態から固定する。

### Validation result

実装中。

### Merge commit

未着手。実装担当はマージしない。

### GitHub Pages result

一時スキップ方針を継続する。Pages buildとartifact uploadは検証対象とする。

### Next task

`JLL-JAVA-001`

---

## Planned task

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

- 完了済みFE機能の追加変更
- GitHub Pages障害の復旧
- 実装担当による`main`へのマージ

### Completion criteria

`JLL-FE-003`完了後、Repository実状態からJava Learning Labの現状と未完了範囲を具体化して実装を進める。

### Dependencies

- `JLL-FE-003`: completed後に開始

### Branch

`work`

### Pull Request

未作成。

### Start HEAD

実装開始時に記録する。

### Current HEAD

実装開始時に記録する。

### Validation result

未着手。

### Merge commit

未着手。

### GitHub Pages result

一時スキップ方針を継続する。

### Next task

Java Learning Labの現状調査後に決定する。

---

## Completed task

### Task ID

`JLL-FE-002`

### Title

FE演習の絞り込みを、独立した受験科目ブロックを維持したモジュール不規則型Bento Gridの3パターンへ変更する

### Status

`completed`

### Purpose

FE演習の既存絞り込み機能、文言、選択肢、操作を変更せず、受験科目を独立配置のまま維持し、その下の4条件群だけをモジュール不規則型Bento Gridの3パターンへ変更する。

### Scope completed

- 受験科目ブロックをGrid外・前方の独立領域として維持
- 既存4条件群だけを同一DOM・同一要素の3レイアウトへ変更
- 検証専用query parameter `filterLayout=1|2|3`を追加
- 通常画面への切替UI、説明、カテゴリ、選択肢、アイコン追加なし
- 375pxはDOM順1列、768pxは8列基準、1,280px以上は12列基準
- query解決、DOM維持、独立受験科目の自動テストを追加
- 3案×3幅の固定Chromium監査と比較画像を追加

### Out of scope retained

- 受験科目の位置、構造、文言、選択肢、操作変更
- 問題データ、問題本文、選択肢、正答、解説、図表変更
- Java Learning Lab
- GitHub Pages障害の復旧とdeployment再試行

### Completion criteria result

Pages公開依存項目を除く全完了条件に合格した。3案は既存要素だけで構成され、768pxと1,280pxで異なる幾何配置、375pxで1列となる。受験科目は独立し、カード内スクロール、横はみ出し、内容切れ、ラベル省略、操作不能は検出されなかった。

### Branch

`work`

### Pull Request

- Number: `#3`
- Base: `main`
- Head: `work`
- State: merged
- Merge method: merge commit
- Review result: pass

### Start HEAD

`c58aa9455b1941055310c0dd82b65352530a6482`

### Fixed implementation HEAD

`ca5212d91b3b9792a53d0fac4bc7f69648682798`

### Evidence HEAD

`890c54477b633c86b09682c0684b9ced1ab865cb`

### Fixed review handoff HEAD

`0c40a622e4c42b2a61eb2410bd2a3aaf136c32de`

### Confirmation management HEAD

`eae32d3fead59505e5c6d38f346ea3750b272e4d`

### Final Pull Request HEAD

`aaac236ab887c7a55f0491cf40a9c88824e3507b`

### Validation result

- Independent diff review: pass
- Task外アプリケーション変更: なし
- Design-before-implementation commit order: pass
- Automated tests: 56 / 56 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Standard workflow: `31138309148` / run `298` / success
- Browser audit workflow: `31138309139` / run `9` / success
- Browser audit: 3 patterns × 375px / 768px / 1280px = 9 scenarios
- Fixed application artifact ID: `8978626351`
- Fixed application artifact digest: `sha256:9078615fbc21cf4ff5199afdaee4fa8770ab2d96f010ae14be86518ddd082f81`
- Browser evidence artifact ID: `8978626972`
- Browser evidence digest: `sha256:a2a1e445d0dff2b3f5dfb38239298fd354ba51fe4c7860f328d764d1e5644679`
- Browser checks: independent subject selector, four common filter groups, stable DOM order, no horizontal overflow, no card scrollbar or clipping, no clipped labels, keyboard checkbox operation, no console/network error, distinct layouts at 768px and 1280px
- Repository evidence: `prototype/qa/jll-fe-002-browser/README.md`
- Repository evidence summary: `prototype/qa/jll-fe-002-browser/audit-summary.json`
- Blocking findings: none
- Main Branch CI: workflowは`work` pushと`main`向けPull Requestだけをtriggerとするため、merge後の`main` pushでは新規runなし

### Merge commit

`c01be523eb78d0a4ce9d7e6c8cf13eeb7868b3a8`

### GitHub Pages result

- Pages build and artifact upload: success
- Deployment and public revision verification: temporary skip policyにより判定対象外
- Pages障害はBlockingにしない

### Non-blocking issues

- CIブラウザ画像はrunnerに日本語グリフがなく豆腐表示になるが、DOM文字列、レイアウト実測、内容切れ検査は成功している。今回のレイアウト差分による回帰ではない。
- `audit:fe-filter-layouts`のshell fallbackはCIのfresh checkoutでは旧`audit.json`が存在しないため失敗を隠さないが、ローカル反復実行では旧成果物が残る可能性がある。将来の監査基盤整理時に単純化を検討する。

### Next task

`JLL-JAVA-001`

---

## Completed task

### Task ID

`JLL-FE-001`

### Title

FE演習の公開構成、複合絞り込み、科目B、公式サンプル模試、演習ナビゲーション、詳細解説を完成させる

### Status

`completed`

### Purpose

FE演習機能を、公式問題データ、複合絞り込み、科目A・科目B、模擬試験、履歴、結果レビュー、問題移動、詳細解説まで含めて完成させる。

### Scope completed

- 科目A・科目Bの通常演習
- ランダム模擬試験と2022年12月公開サンプル模擬試験
- 複合絞り込み、全文表示、可変高さ、条件群内スクロール廃止
- 構造化問題、図表、詳細解説
- 模擬試験中の正誤・解説非表示と完了後レビュー
- セッション保存、再開、履歴、復習、再挑戦
- 問題番号入力による直接移動と問題一覧内部スクロール
- 自動テスト、型検査、Lint、通常build、Pages build、artifact upload
- 固定CI artifactによる1,280px、768px、375pxの独立ブラウザ確認

### Out of scope retained

- Java Learning Lab
- 問題データに存在しない技術的根拠の生成
- GitHub Pages障害を回避する追加workflowまたは連続retry

### Completion criteria result

Pages依存項目を除く全完了条件、自動検証、固定CI artifactによる独立ブラウザ検証に合格した。

### Branch

`work`

### Pull Request

- Number: `#1`
- Base: `main`
- Head: `work`
- State: merged
- Merge method: merge commit

### Start HEAD

`af7be0dbc73b8bce193defefdd013e13a667596f`

### Fixed review HEAD

`d4003fbc2b80a05402100d5bbe4e51a44c87d21f`

### Final Pull Request HEAD

`4e1b719ad6b7d620c795914ecd28efa1660c9b6f`

### Confirmation evidence

- Evidence: `prototype/qa/fe-final-review-2026-08-07/audit.md`
- Evidence commit: `5d58f6c396721a4764218b27914c79702f3b2e57`

### Validation result

- Application workflow: `31112859435` / run `250` / success
- Final management workflow: `31134642544` / run `264` / success
- Tests: 54 / 54 passed
- TypeScript: success
- ESLint: success
- Normal build: success
- Pages build: success
- Pages artifact upload: success
- Pages artifact ID: `8972435856`
- Artifact digest: `sha256:e7ecf4b7966fcddfbc5d5b585f10397e8bfee669ec2baec226cf60a51fe16685`
- Independent artifact browser validation: pass

### Question data result

- 配信基本問題バンク: 1,977問（科目A 1,810 / 科目B 167）
- 補足問題バンク: 科目A 20問
- 実行時統合・画面表示: 1,997問（科目A 1,830 / 科目B 167）
- 構造化済み科目B: 142問
- 2022年12月公開サンプル: 科目A 60問 / 科目B 20問

### Merge commit

`afbbc24d375c699be0e7b0c5758d9318dc97c1d5`

### GitHub Pages result

- Pages build and artifact upload: success
- Latest deployment attempt: timeout / failure
- Public revision and public UI verification: deferred
- Disposition: Non-blockingで延期

### Next task

`JLL-FE-002` completed後、`JLL-JAVA-001`へ進む。
