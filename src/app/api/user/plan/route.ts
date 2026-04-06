import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserPlan, getChatUsage, getRemainingChats } from '@/lib/subscription';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const plan = await getUserPlan(userId);
  const usage = getChatUsage(userId);
  const remaining = await getRemainingChats(userId);

  return NextResponse.json({ plan, usage, remaining });
}
