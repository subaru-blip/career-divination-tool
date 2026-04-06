'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeIn } from '@/lib/animations';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** フェードインアニメーションを無効化する場合は false */
  animate?: boolean;
  /** アニメーション遅延 (秒) */
  delay?: number;
}

export function Card({
  children,
  className = '',
  animate = true,
  delay = 0,
}: CardProps) {
  const base =
    'relative rounded-2xl border border-gold-700/50 bg-oracle-900/70 ' +
    'backdrop-blur-md shadow-[0_0_40px_rgba(10,22,40,0.6)] p-6';

  if (!animate) {
    return <div className={`${base} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={`${base} ${className}`}
    >
      {/* 金色の上部ボーダーハイライト */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
      />
      {children}
    </motion.div>
  );
}
