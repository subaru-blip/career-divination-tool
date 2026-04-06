// 全スコア + マッチング結果から DiagnosisResult を生成する

import type {
  BasicInfo,
  DiagnosisScores,
  DiagnosisResult,
  CareerPath,
} from '../../types/diagnosis';
import type { Occupation } from '../../types/occupation';
import type { Archetype } from '../../types/diagnosis';
import { classifyArchetype } from './archetypeClassifier';
import { matchOccupations } from './occupationMatcher';

export function generateResult(
  scores: DiagnosisScores,
  basicInfo: BasicInfo,
  occupations: Occupation[],
  archetypes: Archetype[],
): DiagnosisResult {
  // アーキタイプ判定
  const archetype = classifyArchetype(scores.bigFive, archetypes);

  // 職業マッチング
  const qualifications =
    basicInfo.qualifications.length > 0 ? basicInfo.qualifications : undefined;

  const { realPath, idealPath } = matchOccupations(
    { bigFive: scores.bigFive, riasec: scores.riasec },
    qualifications,
    occupations,
  );

  // 神託メッセージ生成
  const divineMessage = buildDivineMessage(scores, archetype, idealPath);

  return {
    archetype,
    divineMessage,
    realPath,
    idealPath,
  };
}

// ──────────────────────────────────────────────
// 神託メッセージ生成
// ──────────────────────────────────────────────

function buildDivineMessage(
  scores: DiagnosisScores,
  archetype: Archetype,
  idealPath: CareerPath,
): string {
  const { fortune, bigFive } = scores;
  const mainOcc = idealPath.mainOccupation.name;

  const elementMessage: Record<string, string> = {
    火: 'あなたの魂には炎が宿っています。情熱の赴くままに道を切り拓いてください。',
    水: 'あなたの魂は深い水のように、柔軟にすべてを包みこむ力を持っています。',
    風: 'あなたの魂は風のように自由です。変化を恐れず、新しい地平へと飛び立ってください。',
    土: 'あなたの魂は大地のように揺るぎない。着実に積み重ねたものが、やがて大きな実りとなります。',
  };

  const traitHighlight =
    bigFive.openness >= 70
      ? '豊かな創造性と探究心'
      : bigFive.conscientiousness >= 70
        ? '類い稀な誠実さと自律心'
        : bigFive.extraversion >= 70
          ? '人を引きつける輝きとエネルギー'
          : bigFive.agreeableness >= 70
            ? '深い共感力と温かい思いやり'
            : 'あなた固有の感受性と洞察力';

  const elementMsg = elementMessage[fortune.element] ?? '星が示す道を信じて歩んでください。';

  return (
    `あなたは【${archetype.name}】——${fortune.zodiacSign}の星のもとに生まれ、` +
    `運命数${fortune.destinyNumber}の${fortune.element}の属性を持つ存在です。` +
    `\n\n${elementMsg}` +
    `\n\nあなたの本質にある「${traitHighlight}」は、この世界に欠かせない光です。` +
    `\n\n星々の導きが示す道は、**${mainOcc}**としての使命。` +
    `迷いや不安があっても、あなたには乗り越える力が備わっています。` +
    `自分自身を信じ、一歩ずつ前へ。あなたの旅が実り豊かなものになることを、星は約束しています。`
  );
}
