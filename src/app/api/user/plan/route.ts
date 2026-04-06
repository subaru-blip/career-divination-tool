import { NextResponse } from 'next/server';

// お試し版: 全機能開放（認証・プラン管理なし）
export async function GET() {
  return NextResponse.json({
    plan: 'premium',
    usage: 0,
    remaining: 999,
  });
}
