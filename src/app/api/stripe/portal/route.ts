import { NextResponse } from 'next/server';

// お試し版: Stripeポータルは無効化
export async function POST() {
  return NextResponse.json(
    { error: 'お試し版ではポータル機能は利用できません' },
    { status: 403 },
  );
}
