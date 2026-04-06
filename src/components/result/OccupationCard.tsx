'use client';

import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { ScoreBar } from './ScoreBar';
import type { OccupationMatch } from '@/types/diagnosis';

interface OccupationCardProps {
  match: OccupationMatch;
  rank: number;
  delay?: number;
  accentColor?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  medical: '医療・福祉',
  it: 'IT・テクノロジー',
  education: '教育',
  creative: 'クリエイティブ',
  business: 'ビジネス・経営',
  finance: '金融',
  legal: '法律',
  science: '科学・研究',
  engineering: 'エンジニアリング',
  social: '社会・公共',
  arts: '芸術・文化',
  service: 'サービス',
  manufacturing: '製造',
  agriculture: '農林水産',
  media: 'メディア・広告',
  sports: 'スポーツ',
  other: 'その他',
};

export function OccupationCard({
  match,
  rank,
  delay = 0,
  accentColor = '#d4a853',
}: OccupationCardProps) {
  const isMain = rank === 1;

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-xl border p-4 ${
        isMain
          ? 'border-gold-600/60 bg-oracle-800/80'
          : 'border-oracle-700/50 bg-oracle-900/60'
      }`}
    >
      {isMain && (
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
      )}

      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 rounded-lg px-2 py-1 text-xs font-bold ${
            isMain ? 'bg-gold-500/20 text-gold-300' : 'bg-oracle-700/60 text-divine-200/60'
          }`}
        >
          #{rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-serif font-semibold ${isMain ? 'text-lg text-gold-200' : 'text-base text-divine-100'}`}>
              {match.name}
            </h3>
            <span className="rounded-full bg-oracle-700/60 px-2 py-0.5 text-xs text-divine-200/60">
              {CATEGORY_LABELS[match.category] ?? match.category}
            </span>
          </div>

          <div className="mt-2">
            <ScoreBar
              label="適合度"
              score={match.matchScore}
              color={isMain ? accentColor : '#6682f5'}
              delay={delay + 0.2}
            />
          </div>

          <p className="mt-2 text-sm leading-relaxed text-divine-200/70">
            {match.reason}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
