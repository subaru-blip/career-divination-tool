'use client';

import { motion } from 'framer-motion';
import { slideFromLeft } from '@/lib/animations';

interface CareerPathProps {
  timeline: {
    threeYears: string;
    fiveYears: string;
    tenYears: string;
  };
  accentColor?: string;
}

const MILESTONES = [
  { label: '3年後', key: 'threeYears' as const },
  { label: '5年後', key: 'fiveYears' as const },
  { label: '10年後', key: 'tenYears' as const },
];

export function CareerPath({ timeline, accentColor = '#d4a853' }: CareerPathProps) {
  return (
    <div className="relative pl-8">
      {/* 縦線 */}
      <div
        className="absolute left-3 top-2 bottom-2 w-0.5"
        style={{ background: `linear-gradient(to bottom, ${accentColor}88, ${accentColor}22)` }}
      />

      <div className="space-y-6">
        {MILESTONES.map((milestone, i) => (
          <motion.div
            key={milestone.key}
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.15 }}
            className="relative"
          >
            {/* ノードドット */}
            <motion.div
              className="absolute -left-[26px] top-1 h-4 w-4 rounded-full border-2 bg-oracle-950"
              style={{ borderColor: accentColor, boxShadow: `0 0 8px ${accentColor}66` }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.1, type: 'spring', stiffness: 300 }}
            />

            <div>
              <span
                className="mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold"
                style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
              >
                {milestone.label}
              </span>
              <p className="text-sm leading-relaxed text-divine-200/80">
                {timeline[milestone.key]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
