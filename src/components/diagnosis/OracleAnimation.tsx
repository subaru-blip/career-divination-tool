'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ORACLE_MESSAGES = [
  'あなたの魂の声を聴いています...',
  '星々の導きを読み解いています...',
  '運命の書を紐解いています...',
  '天職の光が見えてきました...',
];

interface OracleAnimationProps {
  messageIntervalMs?: number;
}

export function OracleAnimation({ messageIntervalMs = 1400 }: OracleAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  // メッセージをフェードイン/アウトで切り替え
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ORACLE_MESSAGES.length);
    }, messageIntervalMs);
    return () => clearInterval(interval);
  }, [messageIntervalMs]);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* 中央の光の円（pulsing） */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* 外側のリング（遅めにpulse） */}
        <motion.div
          className="absolute inset-0 rounded-full border border-gold-400/20"
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* 中間のリング */}
        <motion.div
          className="absolute inset-4 rounded-full border border-gold-400/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        {/* 内側のグロー */}
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-br from-gold-300/20 to-gold-500/10 blur-md"
          animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />

        {/* コアの光点 */}
        <motion.div
          className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-gold-200 to-gold-500
            shadow-[0_0_40px_rgba(212,168,83,0.7),0_0_80px_rgba(212,168,83,0.3)]"
          animate={{
            scale: [0.95, 1.05, 0.95],
            boxShadow: [
              '0 0 30px rgba(212,168,83,0.5), 0 0 60px rgba(212,168,83,0.2)',
              '0 0 50px rgba(212,168,83,0.8), 0 0 100px rgba(212,168,83,0.4)',
              '0 0 30px rgba(212,168,83,0.5), 0 0 60px rgba(212,168,83,0.2)',
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 回転するシンボル */}
        <motion.div
          className="absolute inset-6 rounded-full border border-dashed border-gold-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-10 rounded-full border border-dashed border-gold-300/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* メッセージ */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center text-divine-200/80 text-sm tracking-wide font-serif"
          >
            {ORACLE_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ローディングドット */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold-400/60"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
