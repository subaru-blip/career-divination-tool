'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  current,
  total,
  className = '',
  showLabel = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-divine-300/70">
            {current} / {total}
          </span>
          <span className="font-medium text-gold-400">{percentage}%</span>
        </div>
      )}

      {/* トラック */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-oracle-800/80 border border-oracle-700/50">
        {/* フィルバー */}
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 shadow-[0_0_8px_rgba(212,168,83,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
