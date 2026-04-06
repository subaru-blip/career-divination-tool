'use client';

import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { OccupationCard } from './OccupationCard';
import { CareerPath } from './CareerPath';
import type { CareerPath as CareerPathType } from '@/types/diagnosis';

interface IdealPathSectionProps {
  path: CareerPathType;
  accentColor?: string;
}

export function IdealPathSection({ path, accentColor = '#d4a853' }: IdealPathSectionProps) {
  return (
    <motion.section
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, ${accentColor}88, transparent)` }}
        />
        <h2 className="font-serif text-xl font-semibold text-gold-300">
          理想パス（魂の天職）
        </h2>
        <div
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}88)` }}
        />
      </div>

      <p className="text-center text-sm text-divine-200/60">
        あなたの本質・個性が最大限に輝く道
      </p>

      <div className="space-y-3">
        <OccupationCard
          match={path.mainOccupation}
          rank={1}
          accentColor={accentColor}
        />
        {path.subOccupations.map((occ, i) => (
          <OccupationCard
            key={occ.occupationId}
            match={occ}
            rank={i + 2}
            delay={i * 0.1}
            accentColor={accentColor}
          />
        ))}
      </div>

      <div className="rounded-xl border border-gold-700/30 bg-oracle-900/40 p-4">
        <h3 className="mb-4 font-serif text-sm font-semibold text-gold-400">
          キャリアタイムライン
        </h3>
        <CareerPath timeline={path.careerTimeline} accentColor={accentColor} />
      </div>
    </motion.section>
  );
}
