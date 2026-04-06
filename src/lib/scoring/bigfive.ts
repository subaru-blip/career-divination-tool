// ビッグファイブスコア算出（TIPI-J準拠）
// TIPI-Jは各特性2問（正転1問+逆転1問）で構成される。
// 逆転項目は multiplier: -1 で管理し、ここで変換する。

import type { QuestionAnswer, BigFiveScores } from '../../types/diagnosis';
import { bigFiveQuestions } from '../../data/questions';

// 各特性の生スコア合計を 0-100 に正規化する。
// 生スコアは 2問 × 5段階 = 2〜10 の範囲になる。
// 逆転処理後: 各問の有効値 = multiplier < 0 ? (6 - value) : value
// 合計範囲: 2〜10 → normalize to 0〜100
const RAW_MIN = 2;
const RAW_MAX = 10;

function normalizeScore(raw: number): number {
  const clamped = Math.max(RAW_MIN, Math.min(RAW_MAX, raw));
  return Math.round(((clamped - RAW_MIN) / (RAW_MAX - RAW_MIN)) * 100);
}

export function calculateBigFive(answers: QuestionAnswer[]): BigFiveScores {
  // 各特性の生スコア合計(逆転処理済み)を初期化
  const totals: Record<keyof BigFiveScores, number> = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };
  const counts: Record<keyof BigFiveScores, number> = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  for (const question of bigFiveQuestions) {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer === undefined) continue;

    const { target, multiplier } = question.scoringKey;
    const trait = target as keyof BigFiveScores;

    // 逆転項目: multiplier が -1 の場合、6 - value で反転（1↔5, 2↔4）
    const effectiveValue = multiplier < 0 ? 6 - answer.value : answer.value;

    totals[trait] += effectiveValue;
    counts[trait] += 1;
  }

  // 未回答の特性はデフォルト中央値(3)×2=6 として正規化
  const scoreForTrait = (trait: keyof BigFiveScores): number => {
    if (counts[trait] === 0) return 50; // フォールバック
    return normalizeScore(totals[trait]);
  };

  return {
    openness: scoreForTrait('openness'),
    conscientiousness: scoreForTrait('conscientiousness'),
    extraversion: scoreForTrait('extraversion'),
    agreeableness: scoreForTrait('agreeableness'),
    neuroticism: scoreForTrait('neuroticism'),
  };
}
