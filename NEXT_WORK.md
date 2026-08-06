# Next Work

## Current Task ID

`JLL-FE-001`

## Current phase

`in_progress`（問題ナビゲーションと詳細解説の修正）

## Role

実装担当。Pull Request #1はDraft / Open / Unmergedのまま維持し、`main`へマージしない。

## Objective

次の3件を同一改修として実装する。

1. 問題一覧へ数値入力を追加し、入力した問題番号へ直接移動できるようにする
2. 問題数が多い場合、問題一覧領域内だけを縦スクロールできるようにする
3. 通常演習と結果レビューの解説を、正答根拠、選択肢ごとの判断、関連知識を確認できる構造へ改善する

## Repository state

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Branch: `work`
- Base Branch: `main`
- Pull Request: `#1`
- Pull Request state: Draft / Open / Unmerged
- Revision start HEAD: `88c0b50e86a7c3a1fde542b4b5163931daef0695`
- Previous authoritative deployment source: `3cf01154f44a3fa8d101bf5aa04b983e99e819a7`
- Previous authoritative failure evidence commit: `a344262d45d0ffe661d8e64e9437f0f9e04244dc`

## Design decisions

- 問題番号入力は`1`から総問題数までの整数だけを受け付ける
- Enterと移動ボタンの両方で実行できるようにする
- 範囲外入力は現在問題を変えず、入力可能範囲を通知する
- 問題一覧はレスポンシブな列数を維持し、高さ上限を超えた場合だけ内部縦スクロールを使用する
- 問題移動後は現在問題のボタンが一覧内で見える位置へ移動する
- 解説は正答、正答の根拠、選択肢ごとの判断、関連知識の順で表示する
- 問題データまたは選択肢データに個別解説がある場合は優先する
- 個別解説がない場合、具体的な技術理由を捏造せず、未登録であることを明示した汎用説明を表示する
- 関連知識は保存済み単元、キーワード、タグだけから構成する
- 通常演習と完了後レビューは同一の詳細解説コンポーネントを使用する

## Change targets

- `DESIGN.md`
- `prototype/DESIGN.md`
- `prototype/src/FeSessionView.jsx`
- `prototype/src/feExplanation.js`
- `prototype/src/fe-session-enhancements.css`
- `prototype/src/main.jsx`
- `prototype/tests/fe-explanation.test.mjs`
- `docs/`
- `task-list.md`
- `NEXT_WORK.md`
- Pull Request #1の説明

## Change forbidden

- `main`へのマージ
- Pull RequestのReady for review変更
- `work`の削除
- force push、rebase、squash
- 新しいPages復旧workflowの追加
- 既存の公式問題本文、選択肢、正答、図表の改変
- Java Learning Labの実装開始

## Completion criteria

- 問題番号入力、Enter、移動ボタンで指定問題へ移動できる
- 無効値で移動せず、エラーを支援技術へ通知できる
- 問題一覧の現在問題、回答済み、見直し状態を維持する
- 大量問題時に一覧領域だけが縦スクロールする
- 現在問題を移動後も一覧内で確認できる
- 通常演習と結果レビューに詳細解説を表示する
- 個別解説データ優先と安全なfallbackを単体テストで確認する
- 375px、768px、1280px以上で横スクロールを発生させない
- `npm run verify:fe`が成功する
- `docs/`を最新sourceから再生成する
- Pull Request CIを確認する
- Pages deployと公開Revisionを確認する。外部queue障害が再現した場合は証拠を更新して`blocked`へ戻す

## Required validation

1. 解説純粋関数の単体テスト
2. 全Nodeテスト
3. TypeScript
4. ESLint
5. 通常build
6. Pages build
7. 生成`docs/`差分
8. 375px、768px、1280px以上のレイアウト
9. キーボード操作、フォーカス、エラー通知
10. 通常演習回答直後の詳細解説
11. 模擬試験中の正誤・解説非表示
12. 模擬試験終了後レビューの詳細解説
13. Pull Request workflow
14. GitHub Pages workflowと公開スモーク

## Known external blocker

GitHub Pagesのauthoritative run `31105739031`では、build、artifact、preflight、deployment作成後に`deployment_queued`が約10分継続しtimeoutした。改修後も同じ障害が再現した場合、アプリケーション修正の失敗と混同せず、固定HEADと新しいrun IDを記録して停止する。

## Work completion updates

- `task-list.md`の状態、現在HEAD、検証結果、Pages結果を更新する
- `NEXT_WORK.md`を確認担当向け、または外部Blocker再開向けに更新する
- Pull Request #1の説明を最新状態へ更新する
- `work`へcommit、pushする
- 最新HEADのCIを確認する

## Next user command

実装完了後、Pagesを含めて`review_ready`なら`確認`。外部Blockerで停止した場合も、次回の再開指示はRepository状態に従う。
