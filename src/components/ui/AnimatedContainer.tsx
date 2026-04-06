'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeIn, slideUp, scaleIn } from '@/lib/animations';

type AnimationVariant = 'fadeIn' | 'slideUp' | 'scaleIn';

const variantMap = { fadeIn, slideUp, scaleIn } as const;

interface AnimatedContainerProps {
  children: ReactNode;
  variant?: AnimationVariant;
  className?: string;
  delay?: number;
  /** 親の staggerChildren を使う場合は true にして variants を外部から制御 */
  asChild?: boolean;
}

export function AnimatedContainer({
  children,
  variant = 'fadeIn',
  className = '',
  delay = 0,
  asChild = false,
}: AnimatedContainerProps) {
  const variants = variantMap[variant];

  if (asChild) {
    // 親の stagger に乗る場合は initial/animate を指定しない
    return (
      <motion.div variants={variants} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
