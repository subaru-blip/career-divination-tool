// アーキタイプ分類ロジック
// BigFiveScores とアーキタイプのプロファイル間のコサイン類似度で最適なアーキタイプを判定する。

import type { BigFiveScores, Archetype } from '../../types/diagnosis';

// ──────────────────────────────────────────────
// ベクトル変換とコサイン類似度
// ──────────────────────────────────────────────

type BigFiveVector = [number, number, number, number, number];

function toVector(scores: BigFiveScores): BigFiveVector {
  return [
    scores.openness,
    scores.conscientiousness,
    scores.extraversion,
    scores.agreeableness,
    scores.neuroticism,
  ];
}

function cosineSimilarity(a: BigFiveVector, b: BigFiveVector): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return 0;
  return dot / denom;
}

// ──────────────────────────────────────────────
// アーキタイプ分類
// ──────────────────────────────────────────────

export interface ArchetypeMatch {
  archetype: Archetype;
  similarity: number; // 0〜1
}

/**
 * BigFiveScores からコサイン類似度で最も近いアーキタイプを返す。
 *
 * @param scores - ユーザーのビッグファイブスコア
 * @param archetypes - アーキタイプ定義リスト
 * @returns 最もマッチしたアーキタイプ
 */
export function classifyArchetype(
  scores: BigFiveScores,
  archetypes: Archetype[],
): Archetype {
  if (archetypes.length === 0) {
    throw new Error('アーキタイプリストが空です');
  }

  const userVector = toVector(scores);

  let bestMatch: Archetype = archetypes[0];
  let bestSimilarity = -Infinity;

  for (const archetype of archetypes) {
    const profileVector = toVector(archetype.bigFiveProfile);
    const similarity = cosineSimilarity(userVector, profileVector);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = archetype;
    }
  }

  return bestMatch;
}

/**
 * BigFiveScores から上位N件のアーキタイプマッチを返す（類似度付き）。
 *
 * @param scores - ユーザーのビッグファイブスコア
 * @param archetypes - アーキタイプ定義リスト
 * @param topN - 返す件数（デフォルト3）
 * @returns 上位N件のアーキタイプマッチ（降順）
 */
export function rankArchetypes(
  scores: BigFiveScores,
  archetypes: Archetype[],
  topN: number = 3,
): ArchetypeMatch[] {
  const userVector = toVector(scores);

  const ranked: ArchetypeMatch[] = archetypes.map((archetype) => ({
    archetype,
    similarity: cosineSimilarity(userVector, toVector(archetype.bigFiveProfile)),
  }));

  ranked.sort((a, b) => b.similarity - a.similarity);

  return ranked.slice(0, topN);
}
