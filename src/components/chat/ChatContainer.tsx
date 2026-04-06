'use client';

import { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import type { DiagnosisContext } from '@/lib/ai/systemPrompt';

const MAX_TURNS = 10;

interface ChatContainerProps {
  context: DiagnosisContext;
}

export function ChatContainer({ context }: ChatContainerProps) {
  const { messages, input, setInput, sendMessage, isStreaming, turnCount, isLimitReached } =
    useChat(context);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 初回あいさつメッセージ（UI上のみ）
  const greeting = `お疲れ様でした。診断結果が出ましたね。\n\nあなたのアーキタイプ「${context.result.archetype.name}」についてでも、天職候補の${context.result.idealPath.mainOccupation.name}についてでも、転職や就活の具体的なことでも、何でもお気軽にご相談ください。\n\n星々が示す道を、一緒に歩いていきましょう。`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {/* メッセージリスト */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ paddingBottom: '8px' }}
        role="log"
        aria-label="チャット履歴"
        aria-live="polite"
      >
        <div className="space-y-4">
          {/* 初回あいさつ */}
          <ChatBubble role="assistant" content={greeting} />

          {/* メッセージ */}
          {messages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* 残り回数インジケーター */}
      {!isLimitReached && (
        <div className="px-4 pb-1 text-right text-xs text-divine-200/30">
          残り相談回数: {MAX_TURNS - turnCount}回
        </div>
      )}

      {/* 入力フォーム */}
      <div className="border-t border-oracle-800/60 px-4 pb-4 pt-3">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          disabled={isStreaming}
          isLimitReached={isLimitReached}
        />
      </div>
    </div>
  );
}
