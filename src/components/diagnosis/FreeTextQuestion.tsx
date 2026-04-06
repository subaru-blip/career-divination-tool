'use client';

import { motion } from 'framer-motion';
import type { FreeTextQuestion as FreeTextQuestionType } from '@/types/question';
import { TextArea } from './TextArea';

interface FreeTextQuestionProps {
  question: FreeTextQuestionType;
  index: number;
  value: string;
  onChange: (text: string) => void;
}

export function FreeTextQuestion({ question, index, value, onChange }: FreeTextQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: 'easeOut' }}
      className="space-y-3"
    >
      {/* 質問ヘッダー */}
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-gold-500/40 bg-gold-500/10 text-gold-300">
          {index + 1}
        </span>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-divine-100 leading-snug">
            {question.text}
          </h3>
          <p className="text-xs text-divine-300/50 mt-1">
            スキップ可能 — 空白のまま進めることができます
          </p>
        </div>
      </div>

      {/* テキストエリア */}
      <div className="ml-10">
        <TextArea
          value={value}
          maxLength={question.maxLength}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          label={question.text}
        />
      </div>
    </motion.div>
  );
}
