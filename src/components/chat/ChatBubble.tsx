'use client';

import { motion } from 'framer-motion';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function ChatBubble({ role, content, isStreaming = false }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="mr-2 flex-shrink-0 self-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-oracle-700 text-sm">
            ✦
          </div>
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-gradient-to-br from-gold-600/80 to-gold-700/80 text-oracle-950'
            : 'rounded-bl-sm border border-oracle-700/50 bg-oracle-800/80 text-divine-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-current opacity-70" />
        )}
      </div>

      {isUser && (
        <div className="ml-2 flex-shrink-0 self-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600/30 text-sm text-gold-300">
            You
          </div>
        </div>
      )}
    </motion.div>
  );
}
