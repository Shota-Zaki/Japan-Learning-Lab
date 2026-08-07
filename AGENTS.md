# Repository Operating Rules

このRepositoryでは、GitHub上の現在状態を作業状態の唯一の正本として扱う。

## 1. 対象Repository

- Repository: `Shota-Zaki/Japan-Learning-Lab`
- Base Branch: `main`
- 恒久作業Branch: `work`
- GitHub Pages公開元: `work` Branchの`/docs`
- GitHub Pages URL: `https://shota-zaki.github.io/Japan-Learning-Lab/`

`work`はタスク完了後も削除しない。`works`というBranch名は使用しない。

## 2. 情報の優先順位

情報が競合する場合は、次の順番で優先する。

1. 最新のユーザー指示
2. 現在のRepository内容とGitHub設定
3. `task-list.md`
4. `NEXT_WORK.md`
5. この`AGENTS.md`
6. `PROJECT_CONTEXT.md`
7. `DESIGN.md`
8. 現在のPull Request、Issue、CI結果
9. 同じプロジェクト内の過去チャット
10. 推測または一般的な慣習

最新のユーザー指示は会話内だけに残さず、該当する管理文書へ反映する。

## 3. 作業開始時の確認

新しいチャットでは、過去チャットの説明を求める前に次を確認する。

1. Repositoryの存在とアクセス権
2. `main`と`work`の状態
3. 未マージPull Request
4. `AGENTS.md`
5. `PROJECT_CONTEXT.md`
6. `task-list.md`
7. `NEXT_WORK.md`
8. UI変更時は`DESIGN.md`
9. CIの最新結果
10. GitHub Pagesの設定と公開状態

チャット履歴だけを根拠にTask ID、Branch、Pull Request、HEADを決めない。

## 4. 管理文書

### `PROJECT_CONTEXT.md`

サービス目的、対象ユーザー、機能範囲、技術スタック、URL、Repository、Branch、命名、確定済み方針を記録する。

### `DESIGN.md`

全体の画面構成、デザイン原則、コンポーネント方針、レスポンシブ、アクセシビリティを記録する。画面構成やUI方針を変更する場合は、原則として実装前に更新する。

コース固有の詳細設計は、対象ディレクトリ内の設計文書を補助資料として使用できる。ただしRepository直下の管理文書と競合させない。

### `task-list.md`

タスク状態を管理する唯一の正本とする。進行中状態は原則1件だけとする。

各タスクには最低限、次を記録する。

- Task ID
- タイトル
- 状態
- 目的
- 対象範囲
- 対象外
- 完了条件
- 依存関係
- Branch
- Pull Request
- 開始HEAD
- 現在HEADまたはレビュー対象HEAD
- 検証結果
- マージコミット
- GitHub Pages確認結果
- 次のタスク

### `NEXT_WORK.md`

次の担当が、このファイルだけでも作業を再開できる具体的な指示書とする。

最低限、次を記録する。

- 現在のTask ID
- 現在工程
- 作業目的
- 修正対象
- 変更してよい範囲
- 変更禁止範囲
- 完了条件
- 必須検証
- 現在のBranchとレビュー対象HEAD
- Pull Request
- 未解決の指摘
- ユーザーからの最新修正希望
- 作業完了時の更新対象

## 5. タスク状態

次の状態を使用する。

- `planned`: 未着手
- `in_progress`: 実装中
- `review_ready`: 実装、自己検証、Pull Request、Pages更新まで完了し確認待ち
- `needs_fix`: 確認またはCIで問題が見つかり修正待ち
- `completed`: 確認合格、マージ、公開確認まで完了
- `blocked`: 外部依存、権限不足、仕様矛盾などで継続不能

## 6. 実装担当

実装担当は、原則として次の順番で作業する。

1. RepositoryとGitHub実状態を確認する
2. 管理文書を確認する
3. 必要に応じて`DESIGN.md`を先に更新する
4. `work`上で実装または修正する
5. テスト、型検査、Lint、buildを実行する
6. `/docs`を最新の公開成果物へ更新する
7. 375px、768px、1280px以上で主要画面を確認する
8. `task-list.md`を更新する
9. `NEXT_WORK.md`を確認工程向けに更新する
10. `work`へcommit、pushする
11. `work`から`main`へのDraft Pull Requestを作成または更新する
12. CIとGitHub Pagesを確認する

実装担当は自分の実装を`main`へマージしない。Pull Requestを勝手にReady for reviewへ変更しない。

## 7. 確認担当

確認担当は、実装担当とは別の新しいチャットで開始する。説明をそのまま信用せず、固定HEAD、差分、テスト、CI、GitHub Pagesを独立して確認する。

確認担当は原則としてアプリケーションコードを修正しない。問題がある場合は、`task-list.md`を`needs_fix`へ更新し、`NEXT_WORK.md`へ具体的な修正指示を記録する。

Blocking問題がなく、完了条件を満たした場合だけ、管理文書更新、merge commit方式でのマージ、`work`同期、Pages再確認まで行う。

Squash merge、rebase merge、force push、履歴改変は、明示的な許可がない限り行わない。

## 8. GitHub Pages

GitHub Pagesは次の構成を使用する。

```text
Source: GitHub Actions
Source Branch: work
Published artifact source: /docs
```

Repository直下`docs/`には、ブラウザ確認可能な最新ビルド成果物を置く。生成可能な成果物は直接編集せず、build処理から生成する。

最低限、次を維持する。

- `docs/index.html`
- `docs/404.html`
- `docs/.nojekyll`
- 静的アセット
- 必要な公開データ

CI失敗時は、直前の成功デプロイが公開され続けるため、公開済みRevisionと現在HEADを区別して記録する。

## 9. UI・実装上の追加規則

- UI変更時は、参考資料から抽出した中立的な設計方針だけを文書化する。
- 参考元のサイト名、ブランド名、キャラクター名、ロゴ名、作品名、識別可能な固有表現を、UI文言、README、DESIGN.md、コード、コメント、CSSクラス名、CSS変数名、コンポーネント名、ファイル名、テスト名、差分ログへ持ち込まない。
- 外部参考元は、問題内容やデータの正本として扱わない。
- 不可逆操作、課金、秘密情報、force push、仕様矛盾、他作業を破壊する可能性が高い変更だけは、実行前に確認する。
- 軽微な不明点は、Repository、既存設計、一般的な実装規則から判断し、最終報告で仮定を明示する。

## 10. 完了報告

作業終了時は、最低限次を報告する。

- 担当
- Task ID
- 実施工程
- 変更内容
- 検証結果
- Branch
- Pull Request
- 固定HEAD
- マージコミット
- GitHub Pages確認結果
- 残課題
- 次にユーザーが送るコマンド

次にユーザーが送るコマンドは、原則として`実装`、`修正`、`確認`のいずれかとする。
