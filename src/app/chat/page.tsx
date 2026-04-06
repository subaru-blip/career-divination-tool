'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDiagnosis } from '@/store/diagnosisStore';
import { ChatContainer } from '@/components/chat/ChatContainer';
import type { DiagnosisContext } from '@/lib/ai/systemPrompt';

export default function ChatPage() {
  const { state } = useDiagnosis();
  const router = useRouter();

  const result = state.session?.result ?? null;
  const basicInfo = state.session?.basicInfo ?? null;

  useEffect(() => {
    if (!result || !basicInfo) {
      router.replace('/');
    }
  }, [result, basicInfo, router]);

  const context: DiagnosisContext | null = useMemo(() => {
    if (!result || !basicInfo) return null;
    return { result, basicInfo };
  }, [result, basicInfo]);

  if (!context) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </main>
    );
  }

  return (
    <main
      className="flex flex-col"
      style={{ height: '100dvh' }}
    >
      {/* ヘッダー */}
      <header className="flex items-center justify-between border-b border-oracle-800/60 bg-oracle-950/90 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/result"
          className="flex items-center gap-2 text-sm text-divine-200/60 hover:text-divine-200/90 transition-colors"
          aria-label="結果ページに戻る"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
          結果に戻る
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden>✦</span>
          <h1 className="font-serif text-sm font-semibold text-gold-300">天職神託 AI</h1>
        </div>

        <div className="w-20" aria-hidden />
      </header>

      {/* チャット本体 */}
      <div className="flex-1 overflow-hidden bg-oracle-950">
        <ChatContainer context={context} />
      </div>
    </main>
  );
}
