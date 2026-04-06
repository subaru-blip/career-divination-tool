'use client';

import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

interface GapAnalysisProps {
  analysis: string;
}

export function GapAnalysis({ analysis }: GapAnalysisProps) {
  return (
    <motion.section
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="space-y-4"
    >
      <div className="text-center">
        <h2 className="font-serif text-xl font-semibold text-divine-100">
          あなたの意外な発見
        </h2>
        <p className="mt-1 text-sm text-divine-200/50">
          今の自分と診断結果のギャップから見える、隠れた可能性
        </p>
      </div>

      <div className="rounded-2xl border border-gold-700/25 bg-oracle-900/50 p-6">
        <div
          className="text-sm text-divine-200/80 leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: analysis
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-400 font-semibold">$1</strong>')
          }}
        />
      </div>
    </motion.section>
  );
}
