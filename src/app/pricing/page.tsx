'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { PLANS, type PlanKey } from '@/lib/plans';
import { Button } from '@/components/ui/Button';

interface UserPlanData {
  plan: PlanKey;
}

const PLAN_KEYS: PlanKey[] = ['free', 'standard', 'premium'];

const PLAN_HIGHLIGHT: Record<PlanKey, boolean> = {
  free: false,
  standard: true,
  premium: false,
};

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<PlanKey>('free');
  const [loading, setLoading] = useState<PlanKey | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setCurrentPlan('free');
      return;
    }
    fetch('/api/user/plan')
      .then((r) => r.json() as Promise<UserPlanData>)
      .then((data) => setCurrentPlan(data.plan))
      .catch(() => setCurrentPlan('free'));
  }, [isSignedIn, isLoaded]);

  async function handleSelectPlan(planKey: PlanKey) {
    if (planKey === 'free') return;

    if (!isSignedIn) {
      router.push('/sign-up');
      return;
    }

    if (currentPlan !== 'free') {
      // 既存サブスクユーザーはStripe Portalへ
      setLoading(planKey);
      try {
        const res = await fetch('/api/stripe/portal', { method: 'POST' });
        const data = await res.json() as { url?: string; error?: string };
        if (data.url) {
          window.location.href = data.url;
        }
      } finally {
        setLoading(null);
      }
      return;
    }

    const priceId =
      planKey === 'standard'
        ? process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;

    if (!priceId) {
      alert('準備中です。しばらくお待ちください。');
      return;
    }

    setLoading(planKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden px-4 py-16 sm:px-6">
      {/* 背景 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oracle-900/40 via-oracle-950 to-oracle-950"
      />

      <div className="relative z-10 w-full max-w-5xl">
        {/* タイトル */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-700/50 bg-oracle-900/80 px-4 py-1.5 text-sm text-gold-400 backdrop-blur-sm">
            <span aria-hidden>✦</span>
            プラン選択
            <span aria-hidden>✦</span>
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-gold-gradient sm:text-5xl">
            あなたに合ったプランを
          </h1>
          <p className="mt-3 text-divine-300/70">
            天職への旅を、あなたのペースで進めよう
          </p>
        </div>

        {/* プランカード */}
        <div className="grid gap-6 sm:grid-cols-3">
          {PLAN_KEYS.map((planKey) => {
            const plan = PLANS[planKey];
            const isHighlight = PLAN_HIGHLIGHT[planKey];
            const isCurrent = currentPlan === planKey;
            const isLoadingThis = loading === planKey;

            return (
              <div
                key={planKey}
                className={[
                  'relative flex flex-col rounded-2xl border p-6 transition-all',
                  isHighlight
                    ? 'border-gold-500/60 bg-oracle-800/80 shadow-[0_0_30px_rgba(212,168,83,0.15)]'
                    : 'border-oracle-700/60 bg-oracle-900/60',
                ].join(' ')}
              >
                {isHighlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-3 py-0.5 text-xs font-bold text-oracle-950">
                      おすすめ
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <span className="rounded-full border border-oracle-500 bg-oracle-800 px-3 py-0.5 text-xs text-divine-300/70">
                      現在のプラン
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="font-serif text-xl font-bold text-divine-100">
                    {plan.name}
                  </h2>
                  <p className="mt-1 text-sm text-divine-300/60">{plan.description}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="font-serif text-4xl font-bold text-gold-400">
                      ¥{plan.price.toLocaleString()}
                    </span>
                    {plan.price > 0 && (
                      <span className="mb-1 text-sm text-divine-300/60">/月</span>
                    )}
                  </div>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-divine-200/80">
                      <span className="text-gold-500" aria-hidden>◆</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {planKey === 'free' ? (
                  <Button
                    variant="ghost"
                    fullWidth
                    disabled
                  >
                    {isCurrent ? '現在のプラン' : '無料プラン'}
                  </Button>
                ) : (
                  <Button
                    variant={isHighlight ? 'primary' : 'secondary'}
                    fullWidth
                    disabled={isCurrent || isLoadingThis}
                    onClick={() => handleSelectPlan(planKey)}
                  >
                    {isLoadingThis
                      ? '処理中...'
                      : isCurrent
                        ? '現在のプラン'
                        : currentPlan !== 'free'
                          ? 'プランを変更'
                          : 'このプランを選ぶ'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-divine-300/40">
          プランはいつでも変更・解約できます。課金はStripeの安全な決済システムで処理されます。
        </p>
      </div>
    </main>
  );
}
