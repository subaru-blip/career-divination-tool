'use client';

import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import type { BigFiveScores, RIASECScores } from '@/types/diagnosis';

const BIG_FIVE_LABELS: { key: keyof BigFiveScores; label: string; desc: string }[] = [
  { key: 'openness', label: '開放性', desc: '好奇心・創造性' },
  { key: 'conscientiousness', label: '誠実性', desc: '自己管理・計画性' },
  { key: 'extraversion', label: '外向性', desc: '社交性・活動性' },
  { key: 'agreeableness', label: '協調性', desc: '思いやり・共感' },
  { key: 'neuroticism', label: '感受性', desc: '感情の繊細さ' },
];

const RIASEC_LABELS: { key: keyof RIASECScores; label: string; desc: string }[] = [
  { key: 'realistic', label: 'R 現実型', desc: '手を動かす・ものづくり' },
  { key: 'investigative', label: 'I 研究型', desc: '分析・探究・論理' },
  { key: 'artistic', label: 'A 芸術型', desc: '創作・表現・独創' },
  { key: 'social', label: 'S 社会型', desc: '人を助ける・教える' },
  { key: 'enterprising', label: 'E 企業型', desc: 'リーダー・説得・交渉' },
  { key: 'conventional', label: 'C 慣習型', desc: '正確さ・管理・ルール' },
];

function ScoreBar({ label, desc, value, color }: {
  label: string;
  desc: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-divine-100">{label}</span>
          <span className="text-xs text-divine-300/40">{desc}</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-oracle-800/80">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface ScoreBreakdownProps {
  bigFive: BigFiveScores;
  riasec: RIASECScores;
}

export function ScoreBreakdown({ bigFive, riasec }: ScoreBreakdownProps) {
  // RIASEC上位3つを強調
  const riasecEntries = RIASEC_LABELS.map(r => ({ ...r, value: riasec[r.key] }));
  riasecEntries.sort((a, b) => b.value - a.value);
  const topCode = riasecEntries.slice(0, 3).map(e => e.label[0]).join('');

  return (
    <motion.section
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="font-serif text-xl font-semibold text-divine-100">
          あなたの性格プロフィール
        </h2>
        <p className="mt-1 text-sm text-divine-200/50">
          診断結果はこのスコアに基づいています
        </p>
      </div>

      {/* ビッグファイブ */}
      <div className="rounded-2xl border border-oracle-700/40 bg-oracle-900/50 p-6 space-y-4">
        <h3 className="font-serif text-sm font-semibold text-gold-400">
          ビッグファイブ（性格特性）
        </h3>
        {BIG_FIVE_LABELS.map((b) => (
          <ScoreBar
            key={b.key}
            label={b.label}
            desc={b.desc}
            value={bigFive[b.key]}
            color="#d4a853"
          />
        ))}
      </div>

      {/* RIASEC */}
      <div className="rounded-2xl border border-oracle-700/40 bg-oracle-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold text-oracle-300">
            RIASEC（職業興味）
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-oracle-800 border border-oracle-600/40 text-divine-200/70 font-mono tracking-wider">
            {topCode}型
          </span>
        </div>
        {RIASEC_LABELS.map((r) => (
          <ScoreBar
            key={r.key}
            label={r.label}
            desc={r.desc}
            value={riasec[r.key]}
            color="#6682f5"
          />
        ))}
      </div>
    </motion.section>
  );
}
