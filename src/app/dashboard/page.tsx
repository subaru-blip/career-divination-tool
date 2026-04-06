import { redirect } from 'next/navigation';

// お試し版: ダッシュボードは無効化。トップにリダイレクト
export default function DashboardPage() {
  redirect('/');
}
