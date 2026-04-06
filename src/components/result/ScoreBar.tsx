'use client';

import { motion } from 'framer-motion';

interface ScoreBarProps {
  label: string;
  score: number; // 0-100
  color?: string;
  delay?: number;
}

export function ScoreBar({ label, score, color = '#d4a853', delay = 0 }: ScoreBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-divine-200/80">{label}</span>
        <span className="font-semibold text-gold-300">{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-oracle-800">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}66` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
