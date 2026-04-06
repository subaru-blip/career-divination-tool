'use client';

import { motion } from 'framer-motion';
import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  maxLength: number;
  label?: string;
}

export function TextArea({ value, maxLength, label, className = '', ...rest }: TextAreaProps) {
  const count = value.length;
  const ratio = count / maxLength;
  const isNearLimit = ratio > 0.85;
  const isAtLimit = count >= maxLength;

  return (
    <div className="relative">
      <textarea
        value={value}
        maxLength={maxLength}
        rows={5}
        aria-label={label}
        className={`w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100
          placeholder:text-divine-300/35 resize-none leading-relaxed text-sm
          focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20
          transition-colors duration-200
          ${isAtLimit ? 'border-red-500/50 focus:border-red-500/60' : ''}
          ${className}`}
        {...rest}
      />

      {/* 文字カウンター */}
      <motion.div
        className={`absolute bottom-3 right-3 text-xs font-medium ${
          isAtLimit
            ? 'text-red-400'
            : isNearLimit
            ? 'text-gold-400'
            : 'text-divine-300/40'
        }`}
        animate={{ scale: isAtLimit ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.2 }}
      >
        {count} / {maxLength}
      </motion.div>
    </div>
  );
}
