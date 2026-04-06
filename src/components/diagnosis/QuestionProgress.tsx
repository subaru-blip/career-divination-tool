'use client';

import { motion } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface QuestionProgressProps {
  current: number;
  total: number;
}

export function QuestionProgress({ current, total }: QuestionProgressProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <motion.p
          key={current}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-divine-200"
        >
          <span className="text-gold-400 font-bold">{current}</span>
          <span className="text-divine-300/60"> / {total} 問</span>
        </motion.p>

        <p className="text-xs text-divine-300/50 tracking-wide">
          残り {total - current} 問
        </p>
      </div>

      <ProgressBar current={current} total={total} showLabel={false} />
    </div>
  );
}
