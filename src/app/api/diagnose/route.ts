import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { DiagnoseRequestSchema } from '@/lib/validations/diagnose';
import { calculateBigFive } from '@/lib/scoring/bigfive';
import { calculateRIASEC } from '@/lib/scoring/riasec';
import { calculateValues } from '@/lib/scoring/values';
import { calculateFortune } from '@/lib/scoring/fortune';
import { generateResult } from '@/lib/scoring/resultGenerator';
import { getOccupations } from '@/lib/cache/occupationCache';
import { archetypes } from '@/data/archetypes';
import { sanitizeBasicInfo, sanitizeText } from '@/lib/security/sanitize';
import { checkRateLimit } from '@/lib/security/rateLimit';
import type { BasicInfoFormValues } from '@/lib/validations/basicInfo';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  // レート制限チェック
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'リクエストボディのパースに失敗しました' },
      { status: 400 },
    );
  }

  const parsed = DiagnoseRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'バリデーションエラー', details: parsed.error.issues },
      { status: 400 },
    );
  }

  // サニタイズ処理
  const rawBasicInfo = parsed.data.basicInfo as unknown as BasicInfoFormValues;
  const sanitizedBasicInfoRaw = sanitizeBasicInfo(rawBasicInfo);
  // BasicInfo 型に合わせて gender の undefined を null に正規化
  const sanitizedBasicInfo = {
    ...sanitizedBasicInfoRaw,
    gender: sanitizedBasicInfoRaw.gender ?? null,
    industryExperience: sanitizedBasicInfoRaw.industryExperience ?? [],
    constraints: sanitizedBasicInfoRaw.constraints ?? '',
  } satisfies import('@/types/diagnosis').BasicInfo;

  const sanitizedFreeTexts = parsed.data.freeTexts.map((ft) => ({
    ...ft,
    text: sanitizeText(ft.text, 500),
  }));

  const { answers } = parsed.data;

  try {
    const bigFive = calculateBigFive(answers);
    const riasec = calculateRIASEC(answers);
    const values = calculateValues(answers);
    const fortune = calculateFortune(sanitizedBasicInfo.birthDate);

    const scores = { bigFive, riasec, values, fortune };

    // キャッシュから職業データを取得
    const occupations = getOccupations();
    const result = generateResult(scores, sanitizedBasicInfo, occupations, archetypes);

    // 自由記述テキストの準備
    const freeTextSummary = sanitizedFreeTexts
      .filter(ft => ft.text.trim())
      .map(ft => ft.text)
      .join('\n');

    // 制約テキストはbasicInfoから取得
    const constraintsText = sanitizedBasicInfo.constraints?.trim() ?? '';

    // LLMで現実パスを生成（制約テキストがある場合）
    if (constraintsText) {
      try {
        const occupationList = occupations.map(o =>
          `${o.id}|${o.name}|${o.category}|年収${o.averageSalary}|成長性${o.growthOutlook}|必須資格:${o.requiredQualifications.join(',') || 'なし'}`
        ).join('\n');

        const realPathResponse = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          messages: [{
            role: 'user',
            content: `あなたはキャリアアドバイザーです。以下のユーザーの状況と適性から、現実的に今すぐ目指せる職業を5つ選んでください。

## ユーザーの現実的な制約
${constraintsText}

## ユーザーの適性スコア
- 開放性: ${bigFive.openness}/100, 誠実性: ${bigFive.conscientiousness}/100, 外向性: ${bigFive.extraversion}/100, 協調性: ${bigFive.agreeableness}/100
- RIASEC: R${riasec.realistic} I${riasec.investigative} A${riasec.artistic} S${riasec.social} E${riasec.enterprising} C${riasec.conventional}
${sanitizedBasicInfo.qualifications.length > 0 ? `- 保有資格: ${sanitizedBasicInfo.qualifications.join(', ')}` : ''}
${sanitizedBasicInfo.currentOccupation ? `- 現在の職業: ${sanitizedBasicInfo.currentOccupation}` : ''}

## 職業データベース
${occupationList}

## 回答形式（厳密にこのJSON形式で返してください。JSON以外のテキストは一切含めないでください）
[
  {"id": "職業ID", "reason": "この人の制約を踏まえて、なぜこの職業が現実的か（80字以内）"},
  ...
]

選定基準:
- ユーザーの制約（金銭・家族・地域・時間等）を最優先で考慮
- 制約を満たした上で、適性スコアとの一致度も加味
- 「今の状況でも始められる」ことを重視
- 必須資格がある職業は、ユーザーが保有している場合のみ選出`,
          }],
        });

        const realPathText = realPathResponse.content[0];
        if (realPathText.type === 'text') {
          try {
            const parsed = JSON.parse(realPathText.text) as { id: string; reason: string }[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              const realMatches = parsed
                .map(p => {
                  const occ = occupations.find(o => o.id === p.id);
                  if (!occ) return null;
                  // 適性スコアも計算して付与
                  const occVector = [occ.bigFiveProfile.openness, occ.bigFiveProfile.conscientiousness, occ.bigFiveProfile.extraversion, occ.bigFiveProfile.agreeableness, occ.bigFiveProfile.neuroticism, occ.riasecCode.realistic, occ.riasecCode.investigative, occ.riasecCode.artistic, occ.riasecCode.social, occ.riasecCode.enterprising, occ.riasecCode.conventional];
                  const userVector = [bigFive.openness, bigFive.conscientiousness, bigFive.extraversion, bigFive.agreeableness, bigFive.neuroticism, riasec.realistic, riasec.investigative, riasec.artistic, riasec.social, riasec.enterprising, riasec.conventional];
                  let dot = 0, magA = 0, magB = 0;
                  for (let i = 0; i < userVector.length; i++) { dot += userVector[i] * occVector[i]; magA += userVector[i] ** 2; magB += occVector[i] ** 2; }
                  const sim = (Math.sqrt(magA) * Math.sqrt(magB)) === 0 ? 0 : dot / (Math.sqrt(magA) * Math.sqrt(magB));
                  const matchScore = Math.round(((sim + 1) / 2) * 100);
                  return {
                    occupationId: occ.id,
                    name: occ.name,
                    category: occ.category,
                    matchScore,
                    reason: p.reason,
                  };
                })
                .filter((m): m is NonNullable<typeof m> => m !== null);

              if (realMatches.length > 0) {
                const [main, ...subs] = realMatches;
                const mainOcc = occupations.find(o => o.id === main.occupationId);
                result.realPath = {
                  mainOccupation: main,
                  subOccupations: subs,
                  careerTimeline: {
                    threeYears: `${main.name}として基礎スキルを確立し、今の状況を安定させながら着実にキャリアを積む3年間。`,
                    fiveYears: `専門分野でのポジションを確立。制約が緩和されれば、理想パスへの橋渡しも視野に入る。`,
                    tenYears: `${main.name}での経験を活かし、より自由なキャリア選択ができるステージへ。理想の${result.idealPath.mainOccupation.name}への挑戦も可能に。`,
                  },
                };
              }
            }
          } catch {
            console.error('[/api/diagnose] Failed to parse real path JSON');
          }
        }
      } catch (err) {
        console.error('[/api/diagnose] AI real path generation failed:', err);
      }
    }

    // LLMで「神様の言葉」を生成（テンプレートの代わり）
    try {
      const llmResponse = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `あなたは天職診断ツール「天職神託」の神官です。以下のユーザーの診断結果をもとに、神聖で詩的な「神様の言葉」を生成してください。

アーキタイプ: ${result.archetype.name}
天職（理想パス）: ${result.idealPath.mainOccupation.name}
${result.realPath ? `現実パス: ${result.realPath.mainOccupation.name}` : ''}
星座: ${scores.fortune.zodiacSign}
運命数: ${scores.fortune.destinyNumber}
属性: ${scores.fortune.element}
性格の特徴: 開放性${scores.bigFive.openness} 誠実性${scores.bigFive.conscientiousness} 外向性${scores.bigFive.extraversion} 協調性${scores.bigFive.agreeableness}
${freeTextSummary ? `ユーザーの自由記述:\n${freeTextSummary}` : ''}
${constraintsText ? `ユーザーの現実的な制約:\n${constraintsText}` : ''}

条件:
- 250-350文字程度
- 神話的だがポップで親しみやすいトーン
- 占いっぽすぎず、転職アドバイザーの信頼感もある
- ユーザーの自由記述があればその内容にも触れる
${constraintsText ? '- ユーザーの制約を否定せず、「今はこの道だけど、星はもっと大きな可能性を見ている」というニュアンスを含める' : ''}
${result.realPath && result.realPath.mainOccupation.name !== result.idealPath.mainOccupation.name ? `- 現実パス（${result.realPath.mainOccupation.name}）から理想パス（${result.idealPath.mainOccupation.name}）への希望のメッセージを含める` : ''}
- **太字**で強調したい部分を1-2箇所入れる
- 最後は前向きな一言で締める
- 改行を適切に入れる`,
        }],
      });

      const llmMessage = llmResponse.content[0];
      if (llmMessage.type === 'text' && llmMessage.text.trim()) {
        result.divineMessage = llmMessage.text;
      }
    } catch (err) {
      // LLM生成に失敗した場合はテンプレートのメッセージをそのまま使う
      console.error('[/api/diagnose] LLM divine message failed, using template:', err);
    }

    return NextResponse.json({ result, scores });
  } catch (err) {
    console.error('[/api/diagnose] Internal error:', err);
    return NextResponse.json(
      { error: '診断処理中にエラーが発生しました' },
      { status: 500 },
    );
  }
}
