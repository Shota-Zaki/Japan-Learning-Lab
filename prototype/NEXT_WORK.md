# 次工程

## FE Learning Lab

状態: **完成・監査合格**

FE Learning Labの完成条件は、`prototype/qa/fe-completion-audit-2026-08-06/audit.md`に記録した証拠により満たされた。

完了済み:

- Repository直下`docs/`へのPages成果物生成と`work`への自動commit
- GitHub Pages公開と公開リソースのHTTPスモークテスト
- 科目A・科目Bの公式問題同期
- 科目Bの実演習
- 単一正答・複数正答
- 複数条件の同一群OR・群間AND
- 正解、不正解、未回答、見直し対象の複数選択
- 本文、コード、表、画像、注記、解説の構造化表示
- 375px、768px、1280pxの実ブラウザ監査
- 一時停止、再開、再読込復元、結果、履歴、復習、再挑戦
- Console error、Console warning、HTTP error、Request failure 0件

公開URL:

`https://shota-zaki.github.io/Japan-Learning-Lab/`

FE Learning Labの完成を妨げる未実装事項はない。

## 継続時の回帰条件

今後FE Learning Labを変更する場合は、少なくとも次を維持する。

1. `npm run verify:fe`を成功させる。
2. 科目A・科目Bの問題件数と固定blob検証を維持する。
3. 科目Bを0件にしない。
4. 同一条件群OR・異なる条件群ANDを維持する。
5. 本文、コード、表、解説の表示境界を維持する。
6. Pages build後に`docs/`を`work`へ反映する。
7. 公開トップ、CSS、JavaScript、公式問題JSON、faviconのHTTPスモークテストを成功させる。
8. Pagesでは端末保存を使用し、存在しないセッションAPIへアクセスしない。
9. ページ全体に不要な横スクロールを発生させない。
10. ブラウザコンソールとネットワークエラーを0件に保つ。

## 次の開発対象

Java Learning Labの作業停止を解除する。

次工程では、Repositoryの現在の設計文書と進捗を再確認したうえで、Java Learning Labを再開する。FE Learning Labの変更を同時進行させず、FEの回帰条件を維持する。
