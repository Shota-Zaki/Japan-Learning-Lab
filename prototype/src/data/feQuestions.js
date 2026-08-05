const choiceLabels = ["ア", "イ", "ウ", "エ"];

const sourceDocuments = {
  spring: {
    periodId: "2019h31h",
    periodLabel: "平成31年度 春期",
    questionUrl: "https://www.ipa.go.jp/shiken/mondai-kaiotu/gmcbt8000000ddiw-att/2019h31h_fe_am_qs.pdf",
    answerUrl: "https://www.ipa.go.jp/shiken/mondai-kaiotu/gmcbt8000000ddiw-att/2019h31h_fe_am_ans.pdf",
  },
  autumn: {
    periodId: "2019r1a",
    periodLabel: "令和元年度 秋期",
    questionUrl: "https://www.ipa.go.jp/shiken/mondai-kaiotu/gmcbt8000000dict-att/2019r01a_fe_am_qs.pdf",
    answerUrl: "https://www.ipa.go.jp/shiken/mondai-kaiotu/gmcbt8000000dict-att/2019r01a_fe_am_ans.pdf",
  },
};

/**
 * @typedef {{id:string,label:string,text:string}} FeChoice
 * @typedef {{id:string,domain:string,unitId:string,title:string,question:string,choices:FeChoice[],correctAnswer:string,explanation:string,periodId:string,periodLabel:string,sourceType:string,sourceRef:string,sourceUrl:string,sourceQuestionUrl:string,sourceAnswerUrl:string}} FeQuestion
 * @param {{period:"spring"|"autumn",id:string,domain:string,unitId:string,title:string,question:string,choices:string[],correctAnswer:string,explanation:string}} input
 * @returns {FeQuestion}
 */
function officialQuestion({ period, ...question }) {
  const source = sourceDocuments[period];
  return {
    ...question,
    periodId: source.periodId,
    periodLabel: source.periodLabel,
    choices: question.choices.map((text, index) => ({ id: choiceLabels[index], label: choiceLabels[index], text })),
    sourceType: "official-past-question",
    sourceRef: question.title.replace("午前 ", "基本情報技術者試験 科目A "),
    sourceUrl: "https://www.ipa.go.jp/shiken/mondai-kaiotu/2019h31.html",
    sourceQuestionUrl: source.questionUrl,
    sourceAnswerUrl: source.answerUrl,
  };
}

export const FE_DATASET_META = {
  sourceRepository: "https://github.com/Shota-Zaki/Engineer-License-Lab",
  sourceCommit: "1402da68e2e74945bc8fa4add829458220917512",
  sourceFile: "docs/labs/fe/data/question-bank.json",
  sourceFilter: "sourceType === official-past-question",
};

export const feDomains = {
  technology: { label: "テクノロジ系", shortLabel: "テクノロジ", description: "基礎理論・コンピュータ・ネットワーク・セキュリティ" },
  management: { label: "マネジメント系", shortLabel: "マネジメント", description: "プロジェクト・サービス・システム監査" },
  strategy: { label: "ストラテジ系", shortLabel: "ストラテジ", description: "システム戦略・企業活動・法務" },
};

export const feUnitLabels = {
  "basic-theory": "基礎理論",
  network: "ネットワーク",
  security: "情報セキュリティ",
  "computer-components": "コンピュータ構成要素",
  "system-development": "システム開発技術",
  "human-interface": "ユーザーインタフェース",
  "service-management": "サービスマネジメント",
  "system-audit": "システム監査",
  "project-management": "プロジェクトマネジメント",
  "corporate-activity": "企業活動",
  law: "法務",
  "business-strategy": "経営戦略マネジメント",
  "system-strategy": "システム戦略",
  "system-planning": "システム企画",
  "technology-strategy": "技術戦略マネジメント",
};

export const feQuestions = [
  officialQuestion({
    id: "fe-ipa-2019r1a-am-002", period: "autumn", domain: "technology", unitId: "basic-theory", title: "令和元年度 秋期 午前 問2",
    question: "8ビットの値の全ビットを反転する操作はどれか。",
    choices: ["16進表記 00 のビット列と排他的論理和をとる。", "16進表記 00 のビット列と論理和をとる。", "16進表記 FF のビット列と排他的論理和をとる。", "16進表記 FF のビット列と論理和をとる。"],
    correctAnswer: "ウ",
    explanation: "8ビットをすべて反転するには、各ビットについて0を1へ、1を0へ変える演算を使う必要があります。0との演算は値を変えず、全ビットが1のビット列との排他的論理和だけが各桁を反転させます。",
  }),
  officialQuestion({
    id: "fe-ipa-2019r1a-am-014", period: "autumn", domain: "technology", unitId: "network", title: "令和元年度 秋期 午前 問14",
    question: "次に示す接続のうち，デイジーチェーンと呼ばれる接続方法はどれか。",
    choices: ["PCと計測機器をRS-232Cで接続し，PCとプリンタをUSBを用いて接続する。", "Thunderbolt接続ポートが2口ある4Kディスプレイ2台を，PCのThunderbolt接続ポートから1台目のディスプレイにケーブルで接続し，さらに1台目のディスプレイと2台目のディスプレイとの間をケーブルで接続する。", "キーボード，マウス及びプリンタをUSBハブにつなぎ，USBハブとPCとを接続する。", "数台のネットワークカメラ及びPCをネットワークハブに接続する。"],
    correctAnswer: "イ",
    explanation: "デイジーチェーンは、機器を数珠つなぎに接続して、1台目から次の機器へと接続を連ねる方式です。ハブを中心に複数機器を接続する形や、PCから別々の機器へ個別接続する形とは区別します。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-041", period: "spring", domain: "technology", unitId: "security", title: "平成31年度 春期 午前 問41",
    question: "JIS Q 27000:2014（情報セキュリティマネジメントシステム－用語）における“リスクレベル”の定義はどれか。",
    choices: ["脅威によって付け込まれる可能性のある，資産又は管理策の弱点", "結果とその起こりやすさの組合せとして表現される，リスクの大きさ", "対応すべきリスクに付与する優先順位", "リスクの重大性を評価するために目安とする条件"],
    correctAnswer: "イ",
    explanation: "リスクレベルは、リスクの大きさを結果の影響と起こりやすさの組合せで表したものです。脆弱性そのもの、対応優先順位、評価基準の条件とは分けて見分けます。",
  }),
  officialQuestion({
    id: "fe-ipa-2019r1a-am-020", period: "autumn", domain: "technology", unitId: "computer-components", title: "令和元年度 秋期 午前 問20",
    question: "DRAMの特徴はどれか。",
    choices: ["書込み及び消去を一括又はブロック単位で行う。", "データを保持するためのリフレッシュ操作又はアクセス操作が不要である。", "電源が遮断された状態でも，記憶した情報を保持することができる。", "メモリセル構造が単純なので高集積化することができ，ビット単価を安くできる。"],
    correctAnswer: "エ",
    explanation: "DRAMはコンデンサに電荷を蓄えてビットを表す主記憶用メモリです。1ビット当たりの回路が比較的単純なので高集積化しやすく、ビット単価を低くしやすい一方、リフレッシュが必要です。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-046", period: "spring", domain: "technology", unitId: "system-development", title: "平成31年度 春期 午前 問46",
    question: "UMLにおける振る舞い図の説明のうち，アクティビティ図のものはどれか。",
    choices: ["ある振る舞いから次の振る舞いへの制御の流れを表現する。", "オブジェクト間の相互作用を時系列で表現する。", "システムが外部に提供する機能と，それを利用する者や外部システムとの関係を表現する。", "一つのオブジェクトの状態がイベントの発生や時間の経過とともにどのように変化するかを表現する。"],
    correctAnswer: "ア",
    explanation: "アクティビティ図は、処理や作業の流れ、分岐、並行処理など、振る舞いから次の振る舞いへの制御の流れを表します。時系列のメッセージ交換はシーケンス図です。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-050", period: "spring", domain: "technology", unitId: "human-interface", title: "平成31年度 春期 午前 問50",
    question: "JavaScriptの非同期通信の機能を使うことによって，動的なユーザインタフェースを画面全体の遷移を伴わずに実現する技術はどれか。",
    choices: ["Ajax", "CSS", "RSS", "SNS"],
    correctAnswer: "ア",
    explanation: "JavaScriptからサーバへ非同期通信を行い、ページ全体を再読み込みせずに画面の一部を更新する技術はAjaxです。CSSは表示の装飾、RSSは更新情報の配信形式です。",
  }),
  officialQuestion({
    id: "fe-ipa-2019r1a-am-056", period: "autumn", domain: "management", unitId: "service-management", title: "令和元年度 秋期 午前 問56",
    question: "システムの移行計画に関する記述のうち，適切なものはどれか。",
    choices: ["移行計画書には，移行作業が失敗した場合に旧システムに戻す際の判断基準が必要である。", "移行するデータ量が多いほど，切替え直前に一括してデータの移行作業を実施すべきである。", "新旧両システムで環境の一部を共有することによって，移行の確認が容易になる。", "新旧両システムを並行運用することによって，移行に必要な費用が低減できる。"],
    correctAnswer: "ア",
    explanation: "システム移行計画では、移行手順だけでなく、失敗時に旧システムへ戻す切戻し条件と判断基準を事前に定める必要があります。大量データの一括移行や並行運用が無条件に有利とは限りません。",
  }),
  officialQuestion({
    id: "fe-ipa-2019r1a-am-060", period: "autumn", domain: "management", unitId: "system-audit", title: "令和元年度 秋期 午前 問60",
    question: "アクセス制御を監査するシステム監査人の行為のうち，適切なものはどれか。",
    choices: ["ソフトウェアに関するアクセス制御の管理台帳を作成し，保管した。", "データに関するアクセス制御の管理規程を閲覧した。", "ネットワークに関するアクセス制御の管理方針を制定した。", "ハードウェアに関するアクセス制御の運用手続を実施した。"],
    correctAnswer: "イ",
    explanation: "システム監査人は、規程、台帳、ログなどを閲覧・照合し、アクセス制御が適切かを評価します。台帳作成、方針制定、運用手続の実施は監査対象部門側の業務です。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-052", period: "spring", domain: "management", unitId: "project-management", title: "平成31年度 春期 午前 問52",
    question: "ある会場で資格試験を実施する際のアクティビティである“受付”と“試験”の依存関係のうち，プレシデンスダイアグラム法（PDM）の開始-終了関係はどれか。",
    choices: ["受付の開始から30分経過したら，試験を開始する。", "受付の終了から10分経過したら，試験を開始する。", "受付の終了から45分経過したら，試験を終了する。", "試験の開始から20分経過したら，受付を終了する。"],
    correctAnswer: "エ",
    explanation: "PDMの開始-終了関係は、一方のアクティビティの開始が、もう一方のアクティビティの終了を制約する関係です。ここでは試験の開始を基準に受付の終了時点が決まる関係を選びます。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-055", period: "spring", domain: "management", unitId: "service-management", title: "平成31年度 春期 午前 問55",
    question: "サービスマネジメントのプロセス改善におけるベンチマーキングはどれか。",
    choices: ["ITサービスのパフォーマンスを財務，顧客，内部プロセス，学習と成長の観点から測定し，戦略的な活動をサポートする。", "業界内外の優れた業務方法（ベストプラクティス）と比較して，サービス品質及びパフォーマンスのレベルを評価する。", "サービスのレベルで可用性，信頼性，パフォーマンスを測定し，顧客に報告する。", "強み，弱み，機会，脅威の観点からITサービスマネジメントの現状を分析する。"],
    correctAnswer: "イ",
    explanation: "ベンチマーキングは、業界内外の優れた業務方法や水準と比較し、自組織のサービス品質やパフォーマンスの改善点を見つける活動です。",
  }),
  officialQuestion({
    id: "fe-ipa-2019r1a-am-055", period: "autumn", domain: "management", unitId: "service-management", title: "令和元年度 秋期 午前 問55",
    question: "サービスマネジメントシステムにPDCA方法論を適用するとき，Actに該当するものはどれか。",
    choices: ["サービスの設計，移行，提供及び改善のためにサービスマネジメントシステムを導入し，運用する。", "サービスマネジメントシステム及びサービスのパフォーマンスを継続的に改善するための処置を実施する。", "サービスマネジメントシステムを確立し，文書化し，合意する。", "方針，目的，計画及びサービスの要求事項について，サービスマネジメントシステム及びサービスを監視，測定及びレビューし，それらの結果を報告する。"],
    correctAnswer: "イ",
    explanation: "PDCAのActは、Checkで得た監視・測定・レビュー結果を踏まえて改善処置を実施する段階です。サービスと管理活動のパフォーマンスを継続的に改善する処置が該当します。",
  }),
  officialQuestion({
    id: "fe-ipa-2019r1a-am-058", period: "autumn", domain: "management", unitId: "system-audit", title: "令和元年度 秋期 午前 問58",
    question: "システムテストの監査におけるチェックポイントのうち，最も適切なものはどれか。",
    choices: ["テストケースが網羅的に想定されていること", "テスト計画は利用者側の責任者だけで承認されていること", "テストは実際に業務が行われている環境で実施されていること", "テストは利用者側の担当者だけで行われていること"],
    correctAnswer: "ア",
    explanation: "システムテストの監査では、テスト計画、ケース、実施結果、障害対応、再テスト記録などが要件に照らして妥当かを確認します。例外条件や境界条件を含む網羅性が重要です。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-076", period: "spring", domain: "strategy", unitId: "corporate-activity", title: "平成31年度 春期 午前 問76",
    question: "社内カンパニー制を説明したものはどれか。",
    choices: ["1部門を切り離して別会社として独立させ，機動力のある多角化戦略を展開する。", "合併，買収によって，自社にない経営資源を相手企業から得て，スピーディな戦略展開を図る。", "時間を掛けて研究・開発を行い，その成果を経営戦略の基礎とする。", "事業分野ごとの仮想企業を作り，経営資源配分の効率化，意思決定の迅速化，創造性の発揮を促進する。"],
    correctAnswer: "エ",
    explanation: "社内カンパニー制は、企業内の事業分野を仮想的な会社のように扱い、責任と権限を明確にして資源配分や意思決定を迅速化する仕組みです。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-079", period: "spring", domain: "strategy", unitId: "law", title: "平成31年度 春期 午前 問79",
    question: "著作者人格権に該当するものはどれか。",
    choices: ["印刷，撮影，複写などの方法によって著作物を複製する権利", "公衆からの要求に応じて自動的にサーバから情報を送信する権利", "著作物の複製物を公衆に貸し出す権利", "自らの意思に反して著作物を変更，切除されない権利"],
    correctAnswer: "エ",
    explanation: "著作者人格権は、著作者の人格的利益を保護する権利であり、著作物を著作者の意思に反して改変されない権利などを含みます。複製権、公衆送信権、貸与権は著作財産権です。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-073", period: "spring", domain: "strategy", unitId: "business-strategy", title: "平成31年度 春期 午前 問73",
    question: "シェアリングエコノミーの説明はどれか。",
    choices: ["ITの活用によって経済全体の生産性が高まり，更にSCMの進展によって需給ギャップが解消されるので，インフレなき成長が持続するという概念である。", "ITを用いて，再生可能エネルギーや都市基盤の効率的な管理・運営を行い，人々の生活の質を高め，継続的な経済発展を実現するという概念である。", "商取引において，実店舗販売とインターネット販売を組み合わせ，それぞれの長所を生かして連携させることによって，全体の売上を拡大する仕組みである。", "ソーシャルメディアのコミュニティ機能などを活用して，主に個人同士で，個人が保有している遊休資産を共有したり，貸し借りしたりする仕組みである。"],
    correctAnswer: "エ",
    explanation: "シェアリングエコノミーは、個人などが保有する遊休資産を、主に個人間で共有・貸借する仕組みです。都市基盤の効率管理や実店舗とネット販売の連携とは異なります。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-062", period: "spring", domain: "strategy", unitId: "system-strategy", title: "平成31年度 春期 午前 問62",
    question: "オンデマンド型のサービスはどれか。",
    choices: ["インターネットサイトで購入したDVDで視聴する映画", "出版社が部数を決めてオフセット印刷した文庫本", "定期的に決められたスケジュールでスマートフォンに配信されるインターネットニュース", "利用者の要求に応じてインターネット上で配信される再放送のドラマ"],
    correctAnswer: "エ",
    explanation: "オンデマンド型は、利用者の要求があった時点で、その要求に応じてサービスを提供する形態です。物理媒体や定時配信とは異なります。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-066", period: "spring", domain: "strategy", unitId: "system-planning", title: "平成31年度 春期 午前 問66",
    question: "非機能要件項目はどれか。",
    choices: ["新しい業務の在り方や運用に関わる業務手順，入出力情報，組織，責任，権限，業務上の制約などの項目", "新しい業務の遂行に必要なアプリケーションシステムに関わる利用者の作業，システム機能の実現範囲，機能間の情報の流れなどの項目", "経営戦略や情報戦略に関わる経営上のニーズ，システム化・システム改善を必要とする業務上の課題，求められる成果・目標などの項目", "システム基盤に関わる可用性，性能，拡張性，運用性，保守性，移行性などの項目"],
    correctAnswer: "エ",
    explanation: "非機能要件は、システムが何をするかではなく、どの程度の品質で動作するかを定めます。可用性、性能、拡張性、運用性、保守性、移行性などが含まれます。",
  }),
  officialQuestion({
    id: "fe-ipa-2019h31h-am-070", period: "spring", domain: "strategy", unitId: "technology-strategy", title: "平成31年度 春期 午前 問70",
    question: "プロセスイノベーションに関する記述として，適切なものはどれか。",
    choices: ["競争を経て広く採用され，結果として事実上の標準となる。", "製品の品質を向上する革新的な製造工程を開発する。", "独創的かつ高い技術を基に革新的な新製品を開発する。", "半導体の製造プロセスをもっている他企業に製造を委託する。"],
    correctAnswer: "イ",
    explanation: "プロセスイノベーションは、製品そのものではなく、生産方法・製造工程・業務プロセスなどの革新によって効率や品質を高めることです。",
  }),
];
