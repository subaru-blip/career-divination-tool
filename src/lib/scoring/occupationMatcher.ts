// 職業適性マッチング
// ビッグファイブ + RIASEC のコサイン類似度で職業適性スコアを計算する。
// 資格フィルター機能付き。
// 現実パス（資格フィルターあり）と理想パス（フィルターなし）を返す。

import type { BigFiveScores, RIASECScores, CareerPath, OccupationMatch } from '../../types/diagnosis';
import type { Occupation } from '../../types/occupation';

// ──────────────────────────────────────────────
// コサイン類似度ユーティリティ
// ──────────────────────────────────────────────

type ScoreVector = number[];

function toVector(bigFive: BigFiveScores, riasec: RIASECScores): ScoreVector {
  return [
    bigFive.openness,
    bigFive.conscientiousness,
    bigFive.extraversion,
    bigFive.agreeableness,
    bigFive.neuroticism,
    riasec.realistic,
    riasec.investigative,
    riasec.artistic,
    riasec.social,
    riasec.enterprising,
    riasec.conventional,
  ];
}

function cosineSimilarity(a: ScoreVector, b: ScoreVector): number {
  if (a.length !== b.length) return 0;
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

// コサイン類似度（-1〜1）を 0〜100 にスケール
function similarityToScore(sim: number): number {
  return Math.round(((sim + 1) / 2) * 100);
}

// ──────────────────────────────────────────────
// マッチング本体
// ──────────────────────────────────────────────

export interface MatchResult {
  realPath: CareerPath | null;
  idealPath: CareerPath;
}

export function matchOccupations(
  scores: { bigFive: BigFiveScores; riasec: RIASECScores },
  qualifications: string[] | undefined,
  occupations: Occupation[],
): MatchResult {
  const userVector = toVector(scores.bigFive, scores.riasec);

  // 全職業のスコアを計算
  const scored: (OccupationMatch & { occupation: Occupation })[] = occupations.map((occ) => {
    const occVector = toVector(occ.bigFiveProfile, occ.riasecCode);
    const sim = cosineSimilarity(userVector, occVector);
    const matchScore = similarityToScore(sim);

    return {
      occupationId: occ.id,
      name: occ.name,
      category: occ.category,
      matchScore,
      reason: buildMatchReason(scores, occ, sim),
      occupation: occ,
    };
  });

  // スコア降順でソート
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // 理想パス: フィルターなし Top5
  const idealTop5 = scored.slice(0, 5);
  const idealPath = buildCareerPath(idealTop5);

  // 現実パス: 資格フィルターあり
  let realPath: CareerPath | null = null;
  if (qualifications && qualifications.length > 0) {
    const filtered = scored.filter((item) => {
      // 必須資格がない場合はそのまま通す
      if (item.occupation.requiredQualifications.length === 0) return true;
      // 必須資格のうち1つ以上を保有している場合に通す
      return item.occupation.requiredQualifications.some((req) =>
        qualifications.includes(req),
      );
    });

    if (filtered.length > 0) {
      const realTop5 = filtered.slice(0, 5);
      realPath = buildCareerPath(realTop5);
    }
  }

  return { realPath, idealPath };
}

// ──────────────────────────────────────────────
// キャリアパス構築
// ──────────────────────────────────────────────

function buildCareerPath(
  matches: (OccupationMatch & { occupation: Occupation })[],
): CareerPath {
  const [main, ...subs] = matches;
  return {
    mainOccupation: {
      occupationId: main.occupationId,
      name: main.name,
      category: main.category,
      matchScore: main.matchScore,
      reason: main.reason,
    },
    subOccupations: subs.map((s) => ({
      occupationId: s.occupationId,
      name: s.name,
      category: s.category,
      matchScore: s.matchScore,
      reason: s.reason,
    })),
    careerTimeline: generateTimeline(main.name, main.occupation.growthOutlook),
  };
}

// ──────────────────────────────────────────────
// マッチング理由の生成
// ──────────────────────────────────────────────

function buildMatchReason(
  scores: { bigFive: BigFiveScores; riasec: RIASECScores },
  occ: Occupation,
  similarity: number,
): string {
  const percent = Math.round(((similarity + 1) / 2) * 100);
  const traits: string[] = [];

  // 特性が一致している上位2つを抽出してメッセージを生成
  if (scores.bigFive.openness >= 70 && occ.bigFiveProfile.openness >= 70) {
    traits.push('高い創造性・好奇心');
  }
  if (scores.bigFive.conscientiousness >= 70 && occ.bigFiveProfile.conscientiousness >= 70) {
    traits.push('高い自己管理能力・誠実さ');
  }
  if (scores.bigFive.extraversion >= 70 && occ.bigFiveProfile.extraversion >= 70) {
    traits.push('コミュニケーション力の高さ');
  }
  if (scores.bigFive.agreeableness >= 70 && occ.bigFiveProfile.agreeableness >= 70) {
    traits.push('協調性・思いやり');
  }
  if (scores.riasec.investigative >= 70 && occ.riasecCode.investigative >= 70) {
    traits.push('分析・研究への志向');
  }
  if (scores.riasec.artistic >= 70 && occ.riasecCode.artistic >= 70) {
    traits.push('芸術・創作への興味');
  }
  if (scores.riasec.social >= 70 && occ.riasecCode.social >= 70) {
    traits.push('人を助ける仕事への適性');
  }
  if (scores.riasec.enterprising >= 70 && occ.riasecCode.enterprising >= 70) {
    traits.push('リーダーシップ・起業家精神');
  }

  const traitText =
    traits.length > 0
      ? `あなたの${traits.slice(0, 2).join('・')}が、この職種のプロファイルと高く一致しています。`
      : '複数の特性が全体的にバランスよく一致しています。';

  return `適合度${percent}%。${traitText}`;
}

// ──────────────────────────────────────────────
// キャリアタイムライン生成
// ──────────────────────────────────────────────

function generateTimeline(
  occupationName: string,
  growthOutlook: 'high' | 'medium' | 'low',
): CareerPath['careerTimeline'] {
  const growthLabel =
    growthOutlook === 'high'
      ? '急成長が見込まれる'
      : growthOutlook === 'medium'
        ? '安定した需要が続く'
        : '専門性で差別化できる';

  return {
    threeYears: `${occupationName}として基礎スキルを確立し、独自の強みを磨く3年間。${growthLabel}分野で実績を積む。`,
    fiveYears: `専門分野でのポジションを確立し、後進の育成やチームリードにも挑戦。自分ならではのキャリアブランドを構築する。`,
    tenYears: `業界のキーパーソンとして影響力を持ち、より大きなプロジェクトや組織変革に関わる。自身のビジョンを体現するステージへ。`,
  };
}
