'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { PLANS, type PlanKey } from '@/lib/plans';
import { Button } from '@/components/ui/Button';

interface DashboardData {
  plan: PlanKey;
  usage: number;
  remaining: number | null;
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }
    fetch('/api/user/plan')
      .then((r) => r.json() as Promise<DashboardData>)
      .then(setData)
      .catch(console.error);
  }, [isSignedIn, isLoaded, router]);

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const json = await res.json() as { url?: string; error?: string };
      if (json.url) {
        window.location.href = json.url;
      }
    } finally {
      setPortalLoading(false);
    }
  }

  if (!isLoaded || !data) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </main>
    );
  }

  const plan = PLANS[data.plan];
  const usagePercent =
    plan.monthlyChats === Infinity || plan.monthlyChats === 0
      ? null
      : Math.min(100, Math.round((data.usage / plan.monthlyChats) * 100));

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden px-4 py-12 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oracle-900/40 via-oracle-950 to-oracle-950"
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">マイページ</h1>
          <p className="mt-1 text-sm text-divine-300/60">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        {/* 現在のプラン */}
        <div className="rounded-2xl border border-oracle-700/60 bg-oracle-900/60 p-6">
          <h2 className="font-serif text-lg font-semibold text-divine-100">現在のプラン</h2>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold-500" aria-hidden>✦</span>
                <span className="font-serif text-2xl font-bold text-gold-400">{plan.name}</span>
              </div>
              {plan.price > 0 && (
                <p className="mt-1 text-sm text-divine-300/60">
                  ¥{plan.price.toLocaleString()}/月
                </p>
              )}
            </div>

            {data.plan !== 'free' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePortal}
                disabled={portalLoading}
              >
                {portalLoading ? '処理中...' : 'プラン管理'}
              </Button>
            ) : (
              <Link href="/pricing">
                <Button variant="secondary" size="sm">
                  アップグレード
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* AI相談使用状況 */}
        <div className="rounded-2xl border border-oracle-700/60 bg-oracle-900/60 p-6">
          <h2 className="font-serif text-lg font-semibold text-divine-100">AI相談 使用状況</h2>

          <div className="mt-4 space-y-4">
            {plan.monthlyChats === 0 ? (
              <div className="rounded-xl border border-oracle-700/40 bg-oracle-800/40 p-4 text-center">
                <p className="text-sm text-divine-300/60">
                  AI相談はスタンダードプラン以上でご利用いただけます
                </p>
                <Link href="/pricing" className="mt-3 inline-block">
                  <Button variant="primary" size="sm">
                    プランを選ぶ
                  </Button>
                </Link>
              </div>
            ) : plan.monthlyChats === Infinity ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gold-400">{data.usage}</span>
                <span className="text-divine-300/60">回 利用済み（今月）・無制限</span>
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gold-400">{data.usage}</span>
                    <span className="ml-1 text-divine-300/60">/ {plan.monthlyChats} 回</span>
                  </div>
                  <span className="text-sm text-divine-300/60">
                    残り {data.remaining ?? 0} 回
                  </span>
                </div>
                {usagePercent !== null && (
                  <div className="h-2 w-full rounded-full bg-oracle-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 過去の診断（将来用プレースホルダー） */}
        <div className="rounded-2xl border border-oracle-700/60 bg-oracle-900/60 p-6">
          <h2 className="font-serif text-lg font-semibold text-divine-100">過去の診断結果</h2>
          <div className="mt-4 rounded-xl border border-oracle-700/30 bg-oracle-800/30 p-6 text-center">
            <p className="text-sm text-divine-300/40">
              診断履歴の保存機能は近日公開予定です
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ホームに戻る
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
