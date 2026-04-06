/**
 * ユーザーのサブスクリプション状態を管理するモジュール。
 * MVPではインメモリMapで回数管理し、月初にリセットする。
 * Clerkのpublicメタデータにプラン情報を保存する。
 */

import { clerkClient } from '@clerk/nextjs/server';
import { PLANS, type PlanKey } from './plans';

// ---------------------------------------------------------------------------
// インメモリ使用回数管理（MVP用）
// ---------------------------------------------------------------------------

interface UsageEntry {
  count: number;
  /** YYYY-MM 形式の月 */
  month: string;
}

const usageMap = new Map<string, UsageEntry>();

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getOrInitUsage(userId: string): UsageEntry {
  const month = currentMonth();
  const existing = usageMap.get(userId);
  if (!existing || existing.month !== month) {
    const fresh: UsageEntry = { count: 0, month };
    usageMap.set(userId, fresh);
    return fresh;
  }
  return existing;
}

// ---------------------------------------------------------------------------
// パブリックAPI
// ---------------------------------------------------------------------------

/**
 * ユーザーのプランを取得する。
 * Clerkのpublicメタデータから読み取る。
 */
export async function getUserPlan(userId: string): Promise<PlanKey> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const plan = user.publicMetadata?.plan as PlanKey | undefined;
    if (plan && plan in PLANS) {
      return plan;
    }
  } catch {
    // フォールバック: freeとして扱う
  }
  return 'free';
}

/**
 * ユーザーのプランをClerkメタデータに保存する。
 */
export async function setUserPlan(
  userId: string,
  plan: PlanKey,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
): Promise<void> {
  const clerk = await clerkClient();
  await clerk.users.updateUser(userId, {
    publicMetadata: {
      plan,
      ...(stripeCustomerId && { stripeCustomerId }),
      ...(stripeSubscriptionId && { stripeSubscriptionId }),
    },
  });
}

/**
 * 今月のAI相談使用回数を取得する。
 */
export function getChatUsage(userId: string): number {
  return getOrInitUsage(userId).count;
}

/**
 * AI相談使用回数をインクリメントする。
 */
export function incrementChatUsage(userId: string): number {
  const entry = getOrInitUsage(userId);
  entry.count += 1;
  usageMap.set(userId, entry);
  return entry.count;
}

/**
 * ユーザーがAI相談できるか確認する。
 */
export async function canChat(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  const planConfig = PLANS[plan];

  if (planConfig.monthlyChats === 0) {
    return false;
  }

  if (planConfig.monthlyChats === Infinity) {
    return true;
  }

  const usage = getChatUsage(userId);
  return usage < planConfig.monthlyChats;
}

/**
 * 残り相談回数を取得する。Infinityの場合はnullを返す。
 */
export async function getRemainingChats(userId: string): Promise<number | null> {
  const plan = await getUserPlan(userId);
  const planConfig = PLANS[plan];

  if (planConfig.monthlyChats === Infinity) {
    return null;
  }

  const usage = getChatUsage(userId);
  return Math.max(0, planConfig.monthlyChats - usage);
}
