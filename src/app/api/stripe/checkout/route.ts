import { NextResponse } from 'next/server';

// お試し版: Stripe決済は無効化
export async function POST() {
  return NextResponse.json(
    { error: 'お試し版では決済機能は利用できません' },
    { status: 403 },
  );
}
