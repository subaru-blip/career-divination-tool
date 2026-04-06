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

    // freeTexts はログ等に使うが未使用変数警告を防ぐ
    void sanitizedFreeTexts;

    return NextResponse.json({ result, scores });
  } catch (err) {
    console.error('[/api/diagnose] Internal error:', err);
    return NextResponse.json(
      { error: '診断処理中にエラーが発生しました' },
      { status: 500 },
    );
  }
}
