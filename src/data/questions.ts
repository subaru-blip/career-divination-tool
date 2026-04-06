// 質問バンク: ビッグファイブ(TIPI-J準拠)、Holland RIASEC、価値観・判断基準、好きなもの・嗜好
// 合計35問

import type { Question, QuestionOption } from '../types/question';

// ──────────────────────────────────────────────
// 共通オプション
// ──────────────────────────────────────────────

const likertOptions: QuestionOption[] = [
  { label: 'まったく当てはまらない', value: 1 },
  { label: 'あまり当てはまらない', value: 2 },
  { label: 'どちらでもない', value: 3 },
  { label: 'やや当てはまる', value: 4 },
  { label: 'とても当てはまる', value: 5 },
];

// ──────────────────────────────────────────────
// ビッグファイブ短縮版（TIPI-J準拠、10問）
// 各特性2問。一方は正転(multiplier: 1)、他方は逆転(multiplier: -1)。
// ──────────────────────────────────────────────

export const bigFiveQuestions: Question[] = [
  // 外向性 (Extraversion)
  {
    id: 'bf_e1',
    category: 'bigfive',
    text: '自分は活発で、社交的だと思う',
    options: likertOptions,
    scoringKey: { target: 'extraversion', multiplier: 1 },
  },
  {
    id: 'bf_e2',
    category: 'bigfive',
    text: '自分は内向的で、無口だと思う',
    options: likertOptions,
    scoringKey: { target: 'extraversion', multiplier: -1 },
  },

  // 協調性 (Agreeableness)
  {
    id: 'bf_a1',
    category: 'bigfive',
    text: '自分は他人に同情しやすく、思いやりがあると思う',
    options: likertOptions,
    scoringKey: { target: 'agreeableness', multiplier: 1 },
  },
  {
    id: 'bf_a2',
    category: 'bigfive',
    text: '自分は他人に対して批判的で、口論好きだと思う',
    options: likertOptions,
    scoringKey: { target: 'agreeableness', multiplier: -1 },
  },

  // 誠実性 (Conscientiousness)
  {
    id: 'bf_c1',
    category: 'bigfive',
    text: '自分は信頼でき、自己管理できていると思う',
    options: likertOptions,
    scoringKey: { target: 'conscientiousness', multiplier: 1 },
  },
  {
    id: 'bf_c2',
    category: 'bigfive',
    text: '自分はだらしなく、不精だと思う',
    options: likertOptions,
    scoringKey: { target: 'conscientiousness', multiplier: -1 },
  },

  // 神経症傾向 (Neuroticism)
  {
    id: 'bf_n1',
    category: 'bigfive',
    text: '自分は不安になりやすく、動揺しやすいと思う',
    options: likertOptions,
    scoringKey: { target: 'neuroticism', multiplier: 1 },
  },
  {
    id: 'bf_n2',
    category: 'bigfive',
    text: '自分は安定していて、物事にうろたえないと思う',
    options: likertOptions,
    scoringKey: { target: 'neuroticism', multiplier: -1 },
  },

  // 開放性 (Openness)
  {
    id: 'bf_o1',
    category: 'bigfive',
    text: '自分は新しい経験に開放的で、知的好奇心が旺盛だと思う',
    options: likertOptions,
    scoringKey: { target: 'openness', multiplier: 1 },
  },
  {
    id: 'bf_o2',
    category: 'bigfive',
    text: '自分は慣習的で、創造性に乏しいと思う',
    options: likertOptions,
    scoringKey: { target: 'openness', multiplier: -1 },
  },
];

// ──────────────────────────────────────────────
// Holland RIASEC（12問）
// 各タイプ2問。「こういう活動が好きだ」形式。
// ──────────────────────────────────────────────

export const riasecQuestions: Question[] = [
  // Realistic（現実型）
  {
    id: 'ri_r1',
    category: 'riasec',
    text: '機械を修理したり、物を組み立てるのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'realistic', multiplier: 1 },
  },
  {
    id: 'ri_r2',
    category: 'riasec',
    text: '野外での作業や、体を動かして物を作る活動が好きだ',
    options: likertOptions,
    scoringKey: { target: 'realistic', multiplier: 1 },
  },

  // Investigative（研究型）
  {
    id: 'ri_i1',
    category: 'riasec',
    text: 'データを分析して法則や傾向を見つけるのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'investigative', multiplier: 1 },
  },
  {
    id: 'ri_i2',
    category: 'riasec',
    text: '科学的な問題を解いたり、理論を深く考えるのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'investigative', multiplier: 1 },
  },

  // Artistic（芸術型）
  {
    id: 'ri_a1',
    category: 'riasec',
    text: '絵を描いたり、音楽を作ったり、文章を書いたりするのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'artistic', multiplier: 1 },
  },
  {
    id: 'ri_a2',
    category: 'riasec',
    text: '演じたり、デザインしたり、自分を自由に表現する活動が好きだ',
    options: likertOptions,
    scoringKey: { target: 'artistic', multiplier: 1 },
  },

  // Social（社会型）
  {
    id: 'ri_s1',
    category: 'riasec',
    text: '人を助けたり、教えたり、カウンセリングするのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'social', multiplier: 1 },
  },
  {
    id: 'ri_s2',
    category: 'riasec',
    text: 'グループ活動を通じて社会や人の役に立てる仕事が好きだ',
    options: likertOptions,
    scoringKey: { target: 'social', multiplier: 1 },
  },

  // Enterprising（企業型）
  {
    id: 'ri_en1',
    category: 'riasec',
    text: '人を説得したり、リードして目標を達成するのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'enterprising', multiplier: 1 },
  },
  {
    id: 'ri_en2',
    category: 'riasec',
    text: 'ビジネスを立ち上げたり、プロジェクトを管理・運営するのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'enterprising', multiplier: 1 },
  },

  // Conventional（慣習型）
  {
    id: 'ri_c1',
    category: 'riasec',
    text: 'データを整理・管理したり、手順通りに正確に処理するのが好きだ',
    options: likertOptions,
    scoringKey: { target: 'conventional', multiplier: 1 },
  },
  {
    id: 'ri_c2',
    category: 'riasec',
    text: '規則やルールに従って、ミスなく業務をこなすことが好きだ',
    options: likertOptions,
    scoringKey: { target: 'conventional', multiplier: 1 },
  },
];

// ──────────────────────────────────────────────
// 価値観・判断基準（8問）
// 二項対立の5段階選択。
// value 1=左側(-)、value 5=右側(+)、value 3=中立
// ──────────────────────────────────────────────

const bipolarOptions = (leftLabel: string, rightLabel: string): QuestionOption[] => [
  { label: `${leftLabel}を強く重視`, value: 1 },
  { label: `どちらかといえば${leftLabel}寄り`, value: 2 },
  { label: 'どちらでもない', value: 3 },
  { label: `どちらかといえば${rightLabel}寄り`, value: 4 },
  { label: `${rightLabel}を強く重視`, value: 5 },
];

export const valuesQuestions: Question[] = [
  {
    id: 'val_sc',
    category: 'values',
    text: '仕事においてどちらをより重視しますか？',
    options: bipolarOptions('安定・安心', '挑戦・変化'),
    scoringKey: { target: 'stabilityVsChallenge', multiplier: 1 },
  },
  {
    id: 'val_it',
    category: 'values',
    text: '仕事のスタイルとしてどちらが合っていますか？',
    options: bipolarOptions('個人で集中して作業', 'チームで協力して作業'),
    scoringKey: { target: 'individualVsTeam', multiplier: 1 },
  },
  {
    id: 'val_im',
    category: 'values',
    text: '仕事を選ぶ基準として何を優先しますか？',
    options: bipolarOptions('収入・待遇の良さ', 'やりがい・使命感'),
    scoringKey: { target: 'incomeVsMeaning', multiplier: 1 },
  },
  {
    id: 'val_lg',
    category: 'values',
    text: '活動の舞台としてどちらを望みますか？',
    options: bipolarOptions('地元・国内で活躍', 'グローバルに活躍'),
    scoringKey: { target: 'localVsGlobal', multiplier: 1 },
  },
  {
    id: 'val_wb',
    category: 'values',
    text: '仕事と私生活のバランスについてどちらに近いですか？',
    options: bipolarOptions('ワークライフバランス重視', 'キャリア成長・昇進重視'),
    scoringKey: { target: 'stabilityVsChallenge', multiplier: 1 },
  },
  {
    id: 'val_rv',
    category: 'values',
    text: '日々の仕事の中でどちらが好きですか？',
    options: bipolarOptions('ルーティン・安定した業務', '変化・新しいことへの対応'),
    scoringKey: { target: 'stabilityVsChallenge', multiplier: 1 },
  },
  {
    id: 'val_cs',
    category: 'values',
    text: '働く組織の規模としてどちらが理想ですか？',
    options: bipolarOptions('大企業・安定した組織', 'スタートアップ・成長企業'),
    scoringKey: { target: 'stabilityVsChallenge', multiplier: 1 },
  },
  {
    id: 'val_sp',
    category: 'values',
    text: 'キャリア開発の方向性としてどちらに惹かれますか？',
    options: bipolarOptions('専門分野を深く極める', '幅広いスキル・経験を積む'),
    scoringKey: { target: 'individualVsTeam', multiplier: 1 },
  },
];

// ──────────────────────────────────────────────
// 好きなもの・嗜好（5問）
// 4択の選択肢。value 1-4
// ──────────────────────────────────────────────

export const preferencesQuestions: Question[] = [
  {
    id: 'pref_holiday',
    category: 'preferences',
    text: '休日の過ごし方として最も自分らしいのはどれですか？',
    options: [
      { label: '家でゆっくり読書や映画鑑賞をする', value: 1 },
      { label: '友人や家族と外出・イベントを楽しむ', value: 2 },
      { label: '一人でスポーツや自然の中でリフレッシュする', value: 3 },
      { label: '趣味の創作活動（料理・工作・音楽など）に没頭する', value: 4 },
    ],
    scoringKey: { target: 'extraversion', multiplier: 1 },
  },
  {
    id: 'pref_subject',
    category: 'preferences',
    text: '学生時代、最も好きだった（得意だった）科目はどれですか？',
    options: [
      { label: '数学・理科（論理・実験・計算）', value: 1 },
      { label: '国語・社会（言語・歴史・地理）', value: 2 },
      { label: '美術・音楽・体育（表現・創作・運動）', value: 3 },
      { label: '英語・情報（コミュニケーション・テクノロジー）', value: 4 },
    ],
    scoringKey: { target: 'investigative', multiplier: 1 },
  },
  {
    id: 'pref_admire',
    category: 'preferences',
    text: '最も憧れる人物のタイプはどれですか？',
    options: [
      { label: '世界的な発明家・科学者（新発見で世界を変えた人）', value: 1 },
      { label: '社会活動家・起業家（課題解決でインパクトを与えた人）', value: 2 },
      { label: '芸術家・クリエイター（作品で感動を与えた人）', value: 3 },
      { label: '教育者・カウンセラー（人の成長を支え続けた人）', value: 4 },
    ],
    scoringKey: { target: 'openness', multiplier: 1 },
  },
  {
    id: 'pref_workplace',
    category: 'preferences',
    text: '理想の職場環境はどれに近いですか？',
    options: [
      { label: '静かで集中できる個人スペースがある環境', value: 1 },
      { label: 'チームで活発にコミュニケーションが取れる環境', value: 2 },
      { label: 'フレキシブルにリモートや外出ができる環境', value: 3 },
      { label: '最新設備・ツールが揃った刺激的な環境', value: 4 },
    ],
    scoringKey: { target: 'extraversion', multiplier: 1 },
  },
  {
    id: 'pref_stress',
    category: 'preferences',
    text: 'ストレスを感じたとき、最もよくする解消法はどれですか？',
    options: [
      { label: '一人の時間を作って静かに休む・考える', value: 1 },
      { label: '誰かと話す・友人に連絡して気持ちを吐き出す', value: 2 },
      { label: '運動・散歩など体を動かす', value: 3 },
      { label: '創作・ゲーム・趣味に没頭して忘れる', value: 4 },
    ],
    scoringKey: { target: 'neuroticism', multiplier: 1 },
  },
];

// ──────────────────────────────────────────────
// 全質問を結合したエクスポート
// ──────────────────────────────────────────────

export const allQuestions: Question[] = [
  ...bigFiveQuestions,
  ...riasecQuestions,
  ...valuesQuestions,
  ...preferencesQuestions,
];

export const QUESTION_COUNT = allQuestions.length; // 35
