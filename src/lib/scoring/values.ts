// 価値観スコア算出
// 二項対立の5段階選択。
// value 1=左側(強負), 2=やや負, 3=中立, 4=やや正, 5=右側(強正)
// ValuesScores の各フィールドは -100 〜 +100 のスケール。

import type { QuestionAnswer, ValuesScores } from '../../types/diagnosis';
import { valuesQuestions } from '../../data/questions';

// 1問の value(1-5) を -100〜+100 にマッピング: (value - 3) * 50
function valueToScale(value: number): number {
  return (value - 3) * 50;
}

// 同一 target に複数問が割り当てられている場合は平均を取る
export function calculateValues(answers: QuestionAnswer[]): ValuesScores {
  const totals: Record<keyof ValuesScores, number> = {
    stabilityVsChallenge: 0,
    individualVsTeam: 0,
    incomeVsMeaning: 0,
    localVsGlobal: 0,
  };
  const counts: Record<keyof ValuesScores, number> = {
    stabilityVsChallenge: 0,
    individualVsTeam: 0,
    incomeVsMeaning: 0,
    localVsGlobal: 0,
  };

  const validTargets = new Set<string>([
    'stabilityVsChallenge',
    'individualVsTeam',
    'incomeVsMeaning',
    'localVsGlobal',
  ]);

  for (const question of valuesQuestions) {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer === undefined) continue;

    const { target, multiplier } = question.scoringKey;
    if (!validTargets.has(target)) continue;

    const trait = target as keyof ValuesScores;
    const scaled = valueToScale(answer.value) * multiplier;
    totals[trait] += scaled;
    counts[trait] += 1;
  }

  const scoreForTrait = (trait: keyof ValuesScores): number => {
    if (counts[trait] === 0) return 0; // 中立をデフォルトに
    const avg = totals[trait] / counts[trait];
    return Math.round(Math.max(-100, Math.min(100, avg)));
  };

  return {
    stabilityVsChallenge: scoreForTrait('stabilityVsChallenge'),
    individualVsTeam: scoreForTrait('individualVsTeam'),
    incomeVsMeaning: scoreForTrait('incomeVsMeaning'),
    localVsGlobal: scoreForTrait('localVsGlobal'),
  };
}
