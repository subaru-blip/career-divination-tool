'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDiagnosis } from '@/store/diagnosisStore';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { Button } from '@/components/ui/Button';
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
    return {
      result,
      basicInfo,
      scores: state.session?.scores ?? null,
    };
  }, [result, basicInfo, state.session?.scores]);

  if (!result || !basicInfo || !context) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 py-2 border-b border-oracle-700 flex items-center justify-between">
        <h1 className="text-divine-200 text-sm font-medium">
          AI相談 — {result.archetype.name}
        </h1>
        <Link href="/result">
          <Button variant="ghost" size="sm">結果に戻る</Button>
        </Link>
      </div>
      <ChatContainer context={context} />
    </div>
  );
}
