'use client';

import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

interface DivineMessageProps {
  message: string;
}

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-gold-300 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function DivineMessage({ message }: DivineMessageProps) {
  const paragraphs = message.split('\n\n');

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative px-6 py-8 text-center"
    >
      {/* 装飾的な星のアイコン */}
      <div className="mb-4 flex justify-center">
        <span className="text-4xl" aria-hidden>✦</span>
      </div>

      <div className="space-y-4">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'font-serif text-xl text-gold-200 leading-relaxed'
                : 'font-serif text-base text-divine-200 leading-relaxed'
            }
          >
            {renderInline(para)}
          </p>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <span className="text-2xl text-gold-600/60" aria-hidden>✦ ✦ ✦</span>
      </div>
    </motion.div>
  );
}
