// 16アーキタイプ定義（神話的ポップなテイスト）

import type { Archetype } from '../types/diagnosis';

export const archetypes: Archetype[] = [
  // ──────────────────────────────────────────────
  // 1. 黎明の導き手（oracle-of-dawn）
  // 高O, 高E — 朝焼けオレンジ+金
  // ──────────────────────────────────────────────
  {
    id: 'oracle-of-dawn',
    name: '黎明の導き手',
    description:
      '夜明けとともに立ち上がり、人々に新しい可能性を示す存在。あなたは圧倒的な好奇心と社交性を武器に、まだ誰も見えていない未来を照らし出します。言葉と行動を通じて周囲を鼓舞し、変化の波頭に立つことが自然にできる人物です。古い常識を疑い、新しい枠組みを提示する力があります。どんな暗闇も、あなたが差し込む一筋の光で動き始めます。',
    colorPalette: {
      primary: '#FF8C42',
      secondary: '#FFD700',
      accent: '#FFF3CD',
    },
    bigFiveProfile: {
      openness: 90,
      conscientiousness: 55,
      extraversion: 85,
      agreeableness: 65,
      neuroticism: 30,
    },
  },

  // ──────────────────────────────────────────────
  // 2. 炎の創造者（flame-creator）
  // 高O, 高E, 低A — 赤+橙
  // ──────────────────────────────────────────────
  {
    id: 'flame-creator',
    name: '炎の創造者',
    description:
      '内なる炎を燃料に、世界に爪痕を刻む創造主。あなたのエネルギーは並外れており、誰かに止められても自分の信念に従って突き進みます。協調よりも革新を優先し、時にぶつかりながらも時代を変える作品・組織・ムーブメントを生み出してきました。摩擦を恐れず、自分の炎で世界を照らすことを使命とする魂です。',
    colorPalette: {
      primary: '#D62828',
      secondary: '#F46036',
      accent: '#FF9A3C',
    },
    bigFiveProfile: {
      openness: 88,
      conscientiousness: 50,
      extraversion: 82,
      agreeableness: 28,
      neuroticism: 45,
    },
  },

  // ──────────────────────────────────────────────
  // 3. 深淵の探究者（deep-seeker）
  // 高O, 低E（内向） — 深青+紫
  // ──────────────────────────────────────────────
  {
    id: 'deep-seeker',
    name: '深淵の探究者',
    description:
      '表層ではなく、物事の根底にある真実を求めて潜り続ける者。静かな観察と深い思索こそがあなたの最大の武器です。多くの人が見逃すパターンや本質を、長時間の集中と独自の視点で見抜きます。孤独を恐れず、むしろ一人の時間に力を蓄える内向的な探究心は、知的な宝を掘り当てる力を秘めています。',
    colorPalette: {
      primary: '#0D3B66',
      secondary: '#6B2D8B',
      accent: '#A8D8EA',
    },
    bigFiveProfile: {
      openness: 92,
      conscientiousness: 65,
      extraversion: 22,
      agreeableness: 55,
      neuroticism: 50,
    },
  },

  // ──────────────────────────────────────────────
  // 4. 静寂の守護者（silent-guardian）
  // 高C, 高A — 銀+白
  // ──────────────────────────────────────────────
  {
    id: 'silent-guardian',
    name: '静寂の守護者',
    description:
      '言葉よりも行動で、誰かを守り支え続ける誠実な盾。あなたは約束を守り、細部に気を配り、チームの土台を静かに支えます。自分を誇示することなく、しかし確実に周囲の人を守ろうとする姿勢は、人々に深い安心感を与えます。大きな声を上げずとも、あなたがいることで世界は少し安全で優しい場所になります。',
    colorPalette: {
      primary: '#C0C0C0',
      secondary: '#FFFFFF',
      accent: '#E8E8E8',
    },
    bigFiveProfile: {
      openness: 45,
      conscientiousness: 90,
      extraversion: 38,
      agreeableness: 88,
      neuroticism: 30,
    },
  },

  // ──────────────────────────────────────────────
  // 5. 星辰の航海士（star-navigator）
  // 高O, 高E, 低N — 藍+星金
  // ──────────────────────────────────────────────
  {
    id: 'star-navigator',
    name: '星辰の航海士',
    description:
      '星を羅針盤に、嵐の海でも迷わず進む者。あなたは感情の波にのまれず、どんな逆境でも前向きに可能性を探し続けます。好奇心と行動力と精神的な安定感を兼ね備えており、未知の海域に飛び込むことを恐れません。周囲の人々に「一緒ならどこへでも行ける」と感じさせるカリスマを持つ、開拓者の魂です。',
    colorPalette: {
      primary: '#1A237E',
      secondary: '#FFD700',
      accent: '#7986CB',
    },
    bigFiveProfile: {
      openness: 85,
      conscientiousness: 60,
      extraversion: 80,
      agreeableness: 62,
      neuroticism: 18,
    },
  },

  // ──────────────────────────────────────────────
  // 6. 大地の設計者（earth-architect）
  // 高C, 低O — 茶+緑
  // ──────────────────────────────────────────────
  {
    id: 'earth-architect',
    name: '大地の設計者',
    description:
      '地盤から丁寧に設計し、百年先まで揺るがない構造を造り上げる職人。突飛なアイデアより、実証された手法と緻密な計画を愛します。ルールと秩序の中にこそ自由があることを知っており、組織・システム・インフラを丁寧に築くことで、多くの人の生活を下から支えます。着実さの中に宿る力強さが、あなたの本質です。',
    colorPalette: {
      primary: '#5D4037',
      secondary: '#388E3C',
      accent: '#A5D6A7',
    },
    bigFiveProfile: {
      openness: 30,
      conscientiousness: 92,
      extraversion: 42,
      agreeableness: 68,
      neuroticism: 25,
    },
  },

  // ──────────────────────────────────────────────
  // 7. 風の伝令者（wind-messenger）
  // 高E, 高A — 水色+白
  // ──────────────────────────────────────────────
  {
    id: 'wind-messenger',
    name: '風の伝令者',
    description:
      '人と人、場と場をつなぎ、対話の中に橋を架ける存在。あなたの明るさと共感力は、硬く閉じた心をも穏やかに開かせます。どこへ行っても自然に人が集まり、あなたを通じて情報や感情が流れ出します。コミュニティの潤滑油として、時に大きな変化のきっかけを作る、つながりの魔法使いです。',
    colorPalette: {
      primary: '#4FC3F7',
      secondary: '#FFFFFF',
      accent: '#B3E5FC',
    },
    bigFiveProfile: {
      openness: 60,
      conscientiousness: 55,
      extraversion: 88,
      agreeableness: 85,
      neuroticism: 32,
    },
  },

  // ──────────────────────────────────────────────
  // 8. 影の分析者（shadow-analyst）
  // 低E, 高C, 高O — 黒+紫
  // ──────────────────────────────────────────────
  {
    id: 'shadow-analyst',
    name: '影の分析者',
    description:
      '光の当たらない場所でこそ本領を発揮する知性の使者。華やかな表舞台より、データや構造の裏側にある真実を解き明かすことに喜びを感じます。他者が気づかないリスクや矛盾を鋭く指摘し、組織の暗部を浄化する力を持ちます。無口でも鋭く、目立たなくても不可欠——そんな静かな知性の体現者です。',
    colorPalette: {
      primary: '#212121',
      secondary: '#6A1B9A',
      accent: '#CE93D8',
    },
    bigFiveProfile: {
      openness: 82,
      conscientiousness: 88,
      extraversion: 18,
      agreeableness: 42,
      neuroticism: 48,
    },
  },

  // ──────────────────────────────────────────────
  // 9. 月光の癒し手（moonlight-healer）
  // 高A, 高N — 銀+薄紫
  // ──────────────────────────────────────────────
  {
    id: 'moonlight-healer',
    name: '月光の癒し手',
    description:
      '月の光のように柔らかく、傷ついた魂を照らし続ける存在。深い共感力と感受性で他者の痛みを感じ取り、ただそこに寄り添うことができます。自分自身も傷つきやすいからこそ、人の繊細な部分に触れる力を持っています。癒しと受容は、この世界で最も切実に求められているギフト——それを与えられる魂です。',
    colorPalette: {
      primary: '#E0E0E0',
      secondary: '#CE93D8',
      accent: '#F3E5F5',
    },
    bigFiveProfile: {
      openness: 65,
      conscientiousness: 50,
      extraversion: 40,
      agreeableness: 90,
      neuroticism: 75,
    },
  },

  // ──────────────────────────────────────────────
  // 10. 鉄の司令官（iron-commander）
  // 低A, 高C, 高E — 黒+金
  // ──────────────────────────────────────────────
  {
    id: 'iron-commander',
    name: '鉄の司令官',
    description:
      '鉄のような意志と規律で組織を動かし、結果を出し続けるリーダー。感傷より効率を優先し、明確な目標と高い基準を自他に課します。困難な決断を迷わず下し、チームを勝利へと導く胆力があります。厳しくとも公正で、その背中を見て育つ者は多い。組織の核として、嵐の中でも方向を失わない羅針盤的存在です。',
    colorPalette: {
      primary: '#212121',
      secondary: '#FFD700',
      accent: '#BDBDBD',
    },
    bigFiveProfile: {
      openness: 48,
      conscientiousness: 92,
      extraversion: 78,
      agreeableness: 25,
      neuroticism: 20,
    },
  },

  // ──────────────────────────────────────────────
  // 11. 水晶の予見者（crystal-seer）
  // 高O, 高N — 水晶色+氷青
  // ──────────────────────────────────────────────
  {
    id: 'crystal-seer',
    name: '水晶の予見者',
    description:
      '普通の人には見えない未来のかたちを水晶越しに見通す、繊細な予知の使者。豊かな想像力と感受性が、時代の変化をいち早くキャッチします。自分の内側の波に翻弄されることもありますが、その繊細さこそが他者にはない深い洞察を生み出します。まだ誰も語っていない物語を、言葉や絵や概念として世界に届けてください。',
    colorPalette: {
      primary: '#B0BEC5',
      secondary: '#80DEEA',
      accent: '#E0F7FA',
    },
    bigFiveProfile: {
      openness: 92,
      conscientiousness: 42,
      extraversion: 38,
      agreeableness: 62,
      neuroticism: 78,
    },
  },

  // ──────────────────────────────────────────────
  // 12. 森の賢者（forest-sage）
  // 高C, 高A, 低E — 深緑+茶
  // ──────────────────────────────────────────────
  {
    id: 'forest-sage',
    name: '森の賢者',
    description:
      '深い森の中で静かに智慧を蓄え、求める者に惜しまなく与える賢者。自ら表舞台には立たないが、あなたの言葉は人の人生を変える力を持ちます。長い時間をかけて積み上げた知識・経験・徳は、どんな資格証よりも重い本物の資産です。焦らず、揺れず、必要な人のもとに確実に届く言葉を持つ、成熟した魂です。',
    colorPalette: {
      primary: '#1B5E20',
      secondary: '#5D4037',
      accent: '#A5D6A7',
    },
    bigFiveProfile: {
      openness: 60,
      conscientiousness: 88,
      extraversion: 20,
      agreeableness: 85,
      neuroticism: 28,
    },
  },

  // ──────────────────────────────────────────────
  // 13. 雷の開拓者（thunder-pioneer）
  // 高E, 低N, 低A — 黄+紫
  // ──────────────────────────────────────────────
  {
    id: 'thunder-pioneer',
    name: '雷の開拓者',
    description:
      '雷のように突然に現れ、停滞した空気を一瞬で刷新する変革の化身。誰かの許可などいらない——あなたは直感と行動力で未踏の地に最初の足跡を刻みます。感情的なブレが少なく、プレッシャーの下でこそ本領を発揮します。強引に見えて、その道は必ず後から整備され、多くの人が歩く大路になります。',
    colorPalette: {
      primary: '#F9A825',
      secondary: '#6A1B9A',
      accent: '#FFF176',
    },
    bigFiveProfile: {
      openness: 70,
      conscientiousness: 55,
      extraversion: 85,
      agreeableness: 28,
      neuroticism: 15,
    },
  },

  // ──────────────────────────────────────────────
  // 14. 河の調停者（river-mediator）
  // 高A, 中E — 水色+緑
  // ──────────────────────────────────────────────
  {
    id: 'river-mediator',
    name: '河の調停者',
    description:
      '対立する者たちの間を流れ、互いを理解させる河のような存在。誰の言葉にも耳を傾け、それぞれの立場を丁寧に訳して届けます。争いを避けながらも、本質的な解決策を提示できる中庸の力を持ちます。周囲から「あなたがいると話し合いがまとまる」と言われることが多い、平和の架け橋です。',
    colorPalette: {
      primary: '#4DD0E1',
      secondary: '#66BB6A',
      accent: '#B2EBF2',
    },
    bigFiveProfile: {
      openness: 55,
      conscientiousness: 60,
      extraversion: 62,
      agreeableness: 88,
      neuroticism: 40,
    },
  },

  // ──────────────────────────────────────────────
  // 15. 虚空の哲学者（void-philosopher）
  // 高O, 低E, 高N — 漆黒+深紫
  // ──────────────────────────────────────────────
  {
    id: 'void-philosopher',
    name: '虚空の哲学者',
    description:
      '存在・意味・時間——誰も問わないような根本的な問いと向き合い続ける深淵の思想家。人生の矛盾や虚無を直視しながらも、そこから目をそらさない胆力があります。その思索の深さは、表面的な答えに満足できない人々に宇宙的な慰めと驚きをもたらします。暗闇の中にいるからこそ、光の意味を語れる——希少な魂の持ち主です。',
    colorPalette: {
      primary: '#0A0A0A',
      secondary: '#311B92',
      accent: '#7C4DFF',
    },
    bigFiveProfile: {
      openness: 95,
      conscientiousness: 38,
      extraversion: 15,
      agreeableness: 50,
      neuroticism: 80,
    },
  },

  // ──────────────────────────────────────────────
  // 16. 陽光の勇者（sun-champion）
  // 高E, 高C, 低N — 金+白
  // ──────────────────────────────────────────────
  {
    id: 'sun-champion',
    name: '陽光の勇者',
    description:
      '太陽のように輝き、全力で人々の前に立ち、光を振りまきながら走り続ける勇者。行動力・計画性・精神的安定の三位一体が、どんな逆境も乗り越えさせます。人を巻き込む熱量と、やり遂げる誠実さを持ち、チームや組織を明るい未来へと引っ張ります。「この人についていきたい」と感じさせる天性のカリスマを持つ、眩しいほどの存在感です。',
    colorPalette: {
      primary: '#FFD700',
      secondary: '#FFFFFF',
      accent: '#FFF9C4',
    },
    bigFiveProfile: {
      openness: 65,
      conscientiousness: 88,
      extraversion: 90,
      agreeableness: 68,
      neuroticism: 15,
    },
  },
];
