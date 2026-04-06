'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-oracle-950 ' +
    'border border-gold-400 shadow-[0_0_20px_rgba(212,168,83,0.35)] ' +
    'hover:shadow-[0_0_32px_rgba(212,168,83,0.55)] font-semibold',
  secondary:
    'bg-oracle-800/80 text-divine-100 border border-oracle-500 ' +
    'hover:bg-oracle-700/80 hover:border-oracle-400 backdrop-blur-sm',
  ghost:
    'bg-transparent text-divine-200 border border-divine-200/30 ' +
    'hover:bg-divine-100/10 hover:border-divine-200/60',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium ' +
    'transition-colors duration-200 focus-visible:outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-oracle-950 disabled:opacity-50 disabled:cursor-not-allowed ';

  const classes = `${base}${variantClasses[variant]} ${sizeClasses[size]}${fullWidth ? ' w-full' : ''} ${className}`;

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={classes}
      disabled={disabled}
      {...(rest as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
