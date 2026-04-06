import { redirect } from 'next/navigation';

// お試し版: 認証不要。トップにリダイレクト
export default function SignUpPage() {
  redirect('/');
}
