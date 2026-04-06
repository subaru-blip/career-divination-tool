import { NextResponse } from 'next/server';

// お試し版: Stripe Webhookは無効化
export async function POST() {
  return NextResponse.json({ received: true });
}
