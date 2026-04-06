import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { setUserPlan } from '@/lib/subscription';
import type { PlanKey } from '@/lib/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-03-25.dahlia',
});

const STANDARD_PRICE_ID = process.env.STRIPE_STANDARD_PRICE_ID;
const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID;

function getPlanFromPriceId(priceId: string): PlanKey {
  if (priceId === STANDARD_PRICE_ID) return 'standard';
  if (priceId === PREMIUM_PRICE_ID) return 'premium';
  return 'free';
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: '署名がありません' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  } catch (err) {
    console.error('[/api/stripe/webhook] Signature verification failed:', err);
    return NextResponse.json({ error: '署名の検証に失敗しました' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string | undefined;
        const subscriptionId = session.subscription as string | undefined;

        if (!userId) {
          console.warn('[webhook] checkout.session.completed: userId missing');
          break;
        }

        // サブスクリプションからプライスIDを取得してプランを判定
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id ?? '';
          const plan = getPlanFromPriceId(priceId);
          await setUserPlan(userId, plan, customerId, subscriptionId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const priceId = subscription.items.data[0]?.price.id ?? '';
        const plan = getPlanFromPriceId(priceId);
        const customerId = subscription.customer as string;
        await setUserPlan(userId, plan, customerId, subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const customerId = subscription.customer as string;
        await setUserPlan(userId, 'free', customerId, undefined);
        break;
      }

      default:
        // 未処理のイベントは無視
        break;
    }
  } catch (err) {
    console.error('[/api/stripe/webhook] Handler error:', err);
    return NextResponse.json({ error: 'Webhookの処理中にエラーが発生しました' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
