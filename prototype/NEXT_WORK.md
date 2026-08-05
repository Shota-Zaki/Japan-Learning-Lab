# Java Learning Lab Bronzeデータ移行・画面接続指示

## 現在地

Java Learning Labの初期監査と基盤実装を開始済み。

実装済み:

- Java Bronzeの確認済みカタログ
  - 分野別演習4セット・107問
  - 模試2セット・120問
- Java専用セッションモデル
- 単一正答・複数正答の集合一致判定
- 回答確定後の不変性
- 下書き、見直し、一時停止、再開、完了、復習集合、保存データ正規化
- FEと分離した端末保存キー
- Java専用クラウドAPI `/api/java/sessions`
- Java専用D1テーブル `java_sessions`
- Javaセッション自動テスト9件
- 初期監査文書 `docs/java-learning-lab/audit.md`

## 目的

移行元のJava Bronze問題を内容・ID・選択肢順・正答・解説を変えずに変換し、Java Learning Labの実画面へ接続する。

## 実施内容

1. `Shota-Zaki/Engineer-License-Lab` の `main` にある `docs/java/data/questions.js` を入力として、Bronze対象だけを移行する同期スクリプトを追加する。
2. 対象を次に固定する。
   - `bronze-p1`: 34問
   - `bronze-p3`: 22問
   - `bronze-p5`: 20問
   - `bronze-p2`: 31問
   - `bronze-exam-a`: 60問
   - `bronze-exam-b`: 60問
3. 変換後JSONについて次を自動検査する。
   - 合計227問
   - ID重複なし
   - 各セット件数一致
   - 選択肢IDと表示順の保持
   - 正答IDが選択肢内に存在
   - 単一・複数正答の保持
   - 問題本文・コード・解説の欠落なし
4. Java Learning Labの既存プレースホルダーを実フローへ置き換える。
   - Bronzeコース選択
   - 分野別演習／模試選択
   - 問題数・復習条件設定
   - 回答確定・解説
   - 前後移動・未回答移動・見直し
   - 一時停止・再開・再読込復元
   - 結果・履歴・復習・再挑戦
5. URLを追加する。
   - `/engineer/java/lessons/`
   - `/engineer/java/practice/`
   - `/engineer/java/practice/session/`
   - `/engineer/java/history/`
6. Javaの画面では学習時間、残り時間、所要時間を表示しない。
7. FE Learning Labの保存・再開・履歴・復習・深いURL・レスポンシブ表示を回帰させない。
8. 375px、768px、1280px以上で主要フローを確認し、全自動テスト、TypeScript、ESLint、production buildを通す。
9. 非公開Sitesへデプロイし、Javaの深いURL、D1保存、履歴復元、ブラウザ警告・エラー0件を確認する。

## Java Silverの扱い

Java Silver SE 17はまだ公開実装しない。全単元件数、問題ID、選択肢順、正答ID、解説レンダリング境界の監査が完了した単元から段階的に有効化する。

## 完了報告

固定HEAD、移行元SHA、対象件数、重複検査、実装導線、保存仕様、テスト結果、レスポンシブ確認、デプロイ先、FE回帰結果、Silver未実装範囲を明記する。
