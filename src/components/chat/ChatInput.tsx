'use client';

import { useRef, type KeyboardEvent, type FormEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLimitReached?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isLimitReached = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!disabled && value.trim()) {
      onSubmit();
    }
  };

  if (isLimitReached) {
    return (
      <div className="rounded-2xl border border-oracle-700/50 bg-oracle-900/80 px-4 py-3 text-center text-sm text-divine-200/50">
        相談回数の上限（10回）に達しました。
        <br />
        最初からやり直すと新たにご相談いただけます。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 overflow-hidden rounded-2xl border border-oracle-600/50 bg-oracle-800/80 focus-within:border-gold-600/60 focus-within:ring-1 focus-within:ring-gold-600/30 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="何でもお気軽にご相談ください..."
          rows={1}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-divine-100 placeholder-divine-200/30 outline-none disabled:opacity-50"
          style={{ maxHeight: '120px', minHeight: '48px' }}
          aria-label="メッセージを入力"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-oracle-950 transition-all hover:shadow-[0_0_16px_rgba(212,168,83,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="送信"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
        </svg>
      </button>
    </form>
  );
}
