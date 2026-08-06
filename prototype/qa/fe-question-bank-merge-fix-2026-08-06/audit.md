# FE Question Bank Merge Fix Audit

## Scope

Task `JLL-FE-001`のBlocking問題である、実行時問題バンク統合時の科目B誤除外を修正した記録。

## Root cause

旧実装は`sourceCategory`、`periodId`、`sourceQuestionNumber`だけで重複判定したため、科目Aと科目B、および同一出典座標を再利用する別問題を衝突させていた。

## Implementation

- 問題バンクの正規化、妥当性検証、fingerprint生成、統合処理を`prototype/src/feQuestionBank.js`へ分離
- `prototype/src/FeLearningApp.jsx`は分離した実行時統合関数を使用
- fingerprintへ科目、出典情報、問題本文、構造化本文、選択肢、構造化選択肢、正答を含める
- ID一致または内容まで一致する問題だけを重複除外
- 実行時統合処理を通す回帰テストを追加

## Verification source

- Implementation source revision: `191749c850bd14b97b038a44024bb17b270af2b1`
- Generated Pages HEAD: `10acc296f2d051d14a5c7f7d11b032ccf07fe46c`
- Push workflow run: `31079687176` / run number `185`
- Pull request workflow run: `31079690171` / run number `186`
- Pull Request: `#1`, Draft / Open / Unmerged

## Automated verification

`npm run verify:fe`成功。

- Runtime merged bank: 1,997問
- 科目A: 1,830問
- 科目B: 167問
- 2022年12月公開サンプル科目A: 60問、公式問番号順
- 2022年12月公開サンプル科目B: 20問、公式問番号順
- 科目B公式サンプルの設定件数20問でセッション選択成功
- 同一出典座標の科目違い・内容違いを保持
- IDが異なる完全重複を除外
- 科目A問5・問6・問7の図表参照を維持
- 科目A問9の本文、4選択肢、正答を維持
- 全テスト: 47 / 47 passed
- TypeScript: success
- ESLint: 0 errors / 1 existing warning
- Normal build: success
- Pages build: success

## Deployment verification

- Pages source revision: `191749c850bd14b97b038a44024bb17b270af2b1`
- Generated output commit: `10acc296f2d051d14a5c7f7d11b032ccf07fe46c`
- Deploy: success
- Public smoke check: success
- Public URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`
- Deployment evidence: `prototype/qa/pages-deployment.json`

## Remaining verification for independent reviewer

確認担当は最新PR HEADを固定し、実ブラウザで科目B公式サンプル20問の対象表示、開始ボタン、回答、解説、再読込後の復元、履歴、復習、再挑戦を独立確認する。

## Non-blocking issue

`prototype/src/FeSessionView.jsx`の`react-hooks/exhaustive-deps` warning 1件は既存問題として残る。今回のBlocking修正とは分離する。
