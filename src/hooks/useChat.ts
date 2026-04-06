'use client';

import { useState, useCallback, useRef } from 'react';
import type { DiagnosisContext } from '@/lib/ai/systemPrompt';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MAX_TURNS = 10;

export function useChat(context: DiagnosisContext | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const abortControllerRef = useRef<AbortController | null>(null);

  const isLimitReached = turnCount >= MAX_TURNS;

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming || isLimitReached || !context) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    try {
      abortControllerRef.current = new AbortController();

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          context,
          sessionId: sessionIdRef.current,
          turnCount,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: '不明なエラー' })) as { error?: string };
        const errorMessage = errorData.error ?? '不明なエラーが発生しました';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: `エラー: ${errorMessage}` } : m,
          ),
        );
        return;
      }

      if (!res.body) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: 'レスポンスが空です' } : m,
          ),
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: current } : m)),
        );
      }

      setTurnCount((c) => c + 1);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: '通信エラーが発生しました。再度お試しください。' }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [input, isStreaming, isLimitReached, context, messages, turnCount]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isStreaming,
    turnCount,
    isLimitReached,
  };
}
