import { redirect } from 'next/navigation';

// お試し版: 料金ページは無効化。トップにリダイレクト
export default function PricingPage() {
  redirect('/');
}
