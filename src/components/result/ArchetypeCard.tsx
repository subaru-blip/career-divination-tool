'use client';

import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import type { Archetype } from '@/types/diagnosis';

interface ArchetypeCardProps {
  archetype: Archetype;
}

export function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  const { primary, secondary, accent } = archetype.colorPalette;

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 p-6 text-center"
      style={{ background: `linear-gradient(135deg, ${primary}22, ${secondary}11)` }}
    >
      {/* カラーアクセントライン */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${primary}, ${secondary}, transparent)` }}
      />

      {/* アーキタイプ名 */}
      <div
        className="mb-3 text-xs font-semibold uppercase tracking-widest"
        style={{ color: accent }}
      >
        あなたのアーキタイプ
      </div>

      <h2
        className="mb-4 font-serif text-3xl font-bold"
        style={{ color: primary }}
      >
        {archetype.name}
      </h2>

      {/* カラーオーブ */}
      <div className="mb-4 flex justify-center gap-2">
        {[primary, secondary, accent].map((color, i) => (
          <motion.div
            key={i}
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}88` }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <p className="text-sm leading-relaxed text-divine-200/90">
        {archetype.description}
      </p>
    </motion.div>
  );
}
