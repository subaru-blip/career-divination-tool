'use client';

import { motion } from 'framer-motion';
import type { Question } from '@/types/question';
import { AnswerOption } from './AnswerOption';

const CATEGORY_LABELS: Record<string, string> = {
  bigfive: 'パーソナリティ',
  riasec: '興味・適性',
  values: '価値観',
  preferences: '嗜好・スタイル',
};

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  direction: number;
  onAnswer: (value: number) => void;
}

export function QuestionCard({ question, questionIndex, direction, onAnswer }: QuestionCardProps) {
  const categoryLabel = CATEGORY_LABELS[question.category] ?? question.category;

  const enterX = direction > 0 ? 60 : -60;
  const exitX = direction > 0 ? -60 : 60;

  return (
    <motion.div
      key={question.id}
      initial={{ x: enterX, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' as const } }}
      className="w-full"
    >
      {/* カテゴリバッジ */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs tracking-widest uppercase text-gold-400/60 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5">
          {categoryLabel}
        </span>
        <span className="text-xs text-divine-300/30">Q{questionIndex + 1}</span>
      </div>

      {/* 質問文 */}
      <div className="mb-8">
        <p className="text-lg md:text-xl font-semibold text-divine-100 leading-relaxed">
          {question.text}
        </p>
      </div>

      {/* 選択肢 */}
      <div className="space-y-3">
        {question.options.map((option, i) => (
          <AnswerOption
            key={`${question.id}-${i}`}
            option={option}
            index={i}
            onSelect={onAnswer}
          />
        ))}
      </div>
    </motion.div>
  );
}
