# FE Learning Lab 完成監査再開

## 判定

状態: 未完了・修正実装中

2026-08-05の完成判定は、次の不足が判明したため撤回する。

1. GitHub Pages用成果物がRepository直下`docs/`を正本としていない。
2. 出題条件が単一選択中心で、複数条件の組合せを扱えない。
3. 科目Bが実演習フローへ接続されていない。
4. 問題本文と解説が単一文字列で表示され、段落、コード、表、画像、注記の表示境界がない。

## 今回の修正範囲

- `prototype/DESIGN.md`へFE完成修正の表示・操作規則を追加
- 科目A・科目Bの同期モデル
- 科目Bのアルゴリズム／情報セキュリティ分類
- 問題本文・解説の構造化ブロック
- 単一正答・複数正答
- 科目・分野・単元・開催回・回答状態の複合絞り込み
- 同一条件群OR、条件群間AND
- 0件・不足件数表示
- FE保存スキーマVersion 2とVersion 1互換復元
- Repository直下`docs/`へのPages build
- 深いURL用`404.html`と`.nojekyll`
- GitHub Actionsでのテスト、型検査、Lint、Pages build

## 現在の証拠

Repositoryへ実装差分はpush済み。ただし、次の実行証拠はまだ取得できていない。

- 移行元全データを使った科目A・科目B同期結果
- 科目別件数
- 構造化ブロック件数
- 自動テスト結果
- TypeScript結果
- ESLint結果
- Pages build結果
- 375px、768px、1280pxの実ブラウザ結果
- GitHub Pages公開確認
- 深いURL再読込確認
- ブラウザ警告・エラー0件

このため、本監査は合格にしない。

## 合格条件

`prototype/NEXT_WORK.md`に記載した全項目を固定HEADに対して実行し、結果と証拠を本監査へ追記する。Java Learning Labはそれまで停止する。
