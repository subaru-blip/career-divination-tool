import { NextResponse } from 'next/server';
import { DiagnoseRequestSchema } from '@/lib/validations/diagnose';
import { calculateBigFive } from '@/lib/scoring/bigfive';
import { calculateRIASEC } from '@/lib/scoring/riasec';
import { calculateValues } from '@/lib/scoring/values';
import { calculateFortune } from '@/lib/scoring/fortune';
import { generateResult } from '@/lib/scoring/resultGenerator';
import { sampleOccupations } from '@/data/sample-occupations';
import { archetypes } from '@/data/archetypes';

export async function POST(request: Request) {
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

  const { basicInfo, answers } = parsed.data;

  try {
    const bigFive = calculateBigFive(answers);
    const riasec = calculateRIASEC(answers);
    const values = calculateValues(answers);
    const fortune = calculateFortune(basicInfo.birthDate);

    const scores = { bigFive, riasec, values, fortune };

    const result = generateResult(scores, basicInfo, sampleOccupations, archetypes);

    return NextResponse.json({ result, scores });
  } catch (err) {
    console.error('[/api/diagnose] Internal error:', err);
    return NextResponse.json(
      { error: '診断処理中にエラーが発生しました' },
      { status: 500 },
    );
  }
}
