// RIASEC スコア算出（Holland 職業興味理論）
// 各タイプ2問、5段階リッカート尺度。
// 全問正転（multiplier: 1）なので逆転処理なし。

import type { QuestionAnswer, RIASECScores } from '../../types/diagnosis';
import { riasecQuestions } from '../../data/questions';

// 生スコア: 2問 × 5段階 = 2〜10 → 0〜100 に正規化
const RAW_MIN = 2;
const RAW_MAX = 10;

function normalizeScore(raw: number): number {
  const clamped = Math.max(RAW_MIN, Math.min(RAW_MAX, raw));
  return Math.round(((clamped - RAW_MIN) / (RAW_MAX - RAW_MIN)) * 100);
}

export function calculateRIASEC(answers: QuestionAnswer[]): RIASECScores {
  const totals: Record<keyof RIASECScores, number> = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
  };
  const counts: Record<keyof RIASECScores, number> = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
  };

  for (const question of riasecQuestions) {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer === undefined) continue;

    const trait = question.scoringKey.target as keyof RIASECScores;
    totals[trait] += answer.value;
    counts[trait] += 1;
  }

  const scoreForTrait = (trait: keyof RIASECScores): number => {
    if (counts[trait] === 0) return 50;
    return normalizeScore(totals[trait]);
  };

  return {
    realistic: scoreForTrait('realistic'),
    investigative: scoreForTrait('investigative'),
    artistic: scoreForTrait('artistic'),
    social: scoreForTrait('social'),
    enterprising: scoreForTrait('enterprising'),
    conventional: scoreForTrait('conventional'),
  };
}
