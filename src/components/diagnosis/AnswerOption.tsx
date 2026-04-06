'use client';

import { motion } from 'framer-motion';
import type { QuestionOption } from '@/types/question';

interface AnswerOptionProps {
  option: QuestionOption;
  index: number;
  onSelect: (value: number) => void;
}

export function AnswerOption({ option, index, onSelect }: AnswerOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option.value)}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.015, x: 4 }}
      whileTap={{ scale: 0.97 }}
      className="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl
        bg-oracle-800/60 border border-oracle-600/40
        hover:bg-oracle-700/70 hover:border-gold-500/50
        hover:shadow-[0_0_20px_rgba(212,168,83,0.12)]
        text-left text-divine-200 text-sm leading-relaxed
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
      aria-label={option.label}
    >
      {/* インデックスバッジ */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          text-xs font-bold border border-oracle-500/60 text-divine-300/70
          group-hover:border-gold-400/60 group-hover:text-gold-300
          transition-colors duration-200"
      >
        {String.fromCharCode(65 + index)}
      </span>

      <span className="font-medium group-hover:text-divine-100 transition-colors duration-200">
        {option.label}
      </span>

      {/* 右矢印 */}
      <span
        className="ml-auto flex-shrink-0 text-divine-300/30 group-hover:text-gold-400/60
          translate-x-0 group-hover:translate-x-1 transition-all duration-200"
      >
        →
      </span>
    </motion.button>
  );
}
