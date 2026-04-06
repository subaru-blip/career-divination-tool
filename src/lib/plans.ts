export const PLANS = {
  free: {
    name: '無料',
    price: 0,
    monthlyChats: 0,
    description: '天職診断を無料で体験',
    features: ['天職診断 無制限', 'AI相談 なし'],
  },
  standard: {
    name: 'スタンダード',
    price: 500,
    monthlyChats: 300,
    description: 'AI相談で深く掘り下げる',
    features: ['天職診断 無制限', 'AI相談 300回/月', '優先サポート'],
  },
  premium: {
    name: 'プレミアム',
    price: 1500,
    monthlyChats: Infinity,
    description: '無制限のAI相談で徹底分析',
    features: ['天職診断 無制限', 'AI相談 無制限', '優先サポート', '限定コンテンツ'],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
