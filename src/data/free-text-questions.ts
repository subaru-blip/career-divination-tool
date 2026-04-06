// 自由記述質問（3問）

import type { FreeTextQuestion } from '../types/question';

export const freeTextQuestions: FreeTextQuestion[] = [
  {
    id: 'ft_self',
    text: '今の自分について自由に書いてください',
    placeholder:
      '現在の状況、強みや弱み、最近考えていること、自分を一言で表すとしたら…など、思いつくままに書いてみてください。',
    maxLength: 600,
  },
  {
    id: 'ft_ideal_day',
    text: '理想の1日を描写してください',
    placeholder:
      '朝目覚めてから夜眠るまで、どんな1日を過ごしていたいですか？どこで、誰と、何をしているか、できるだけ具体的に書いてみてください。',
    maxLength: 600,
  },
  {
    id: 'ft_never',
    text: '絶対にやりたくないことは何ですか？',
    placeholder:
      '仕事・生活・人間関係など、どのジャンルでも構いません。「これだけは嫌だ」「この状況は耐えられない」と感じることを、正直に書いてみてください。',
    maxLength: 600,
  },
  {
    id: 'ft_constraints',
    text: '今のあなたの状況を教えてください',
    placeholder:
      '家族の状況、お金のこと、住んでいる場所、今すぐ働く必要があるかどうか、持っている資格や経験など、転職・就職を考える上での「現実」を自由に書いてください。\n\n例：「シングルマザーで子どもが2人。貯金に余裕がなく、すぐに収入が必要。地方在住で引越しは難しい。」',
    maxLength: 800,
  },
];
