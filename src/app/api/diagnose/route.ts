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
    industryExperience: sanitizedBasicInfoRaw.industryExperience ?? null,
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

    // LLMで「神様の言葉」を生成（テンプレートの代わり）
    try {
      const freeTextSummary = sanitizedFreeTexts
        .filter(ft => ft.text.trim())
        .map(ft => ft.text)
        .join('\n');

      const llmResponse = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `あなたは天職診断ツール「天職神託」の神官です。以下のユーザーの診断結果をもとに、神聖で詩的な「神様の言葉」を生成してください。

アーキタイプ: ${result.archetype.name}
天職（理想パス）: ${result.idealPath.mainOccupation.name}
${result.realPath ? `天職（現実パス）: ${result.realPath.mainOccupation.name}` : ''}
星座: ${scores.fortune.zodiacSign}
運命数: ${scores.fortune.destinyNumber}
属性: ${scores.fortune.element}
性格の特徴: 開放性${scores.bigFive.openness} 誠実性${scores.bigFive.conscientiousness} 外向性${scores.bigFive.extraversion} 協調性${scores.bigFive.agreeableness}
${freeTextSummary ? `ユーザーの自由記述:\n${freeTextSummary}` : ''}

条件:
- 200-300文字程度
- 神話的だがポップで親しみやすいトーン
- 占いっぽすぎず、転職アドバイザーの信頼感もある
- ユーザーの自由記述があればその内容にも触れる
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
