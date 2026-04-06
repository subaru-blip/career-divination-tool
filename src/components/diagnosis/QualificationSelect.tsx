'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// カテゴリ別資格リスト
const QUALIFICATION_CATEGORIES = [
  {
    label: '医療系',
    items: ['薬剤師', '看護師', '医師', '理学療法士', '作業療法士', '歯科医師', '歯科衛生士', '管理栄養士', '臨床検査技師'],
  },
  {
    label: 'IT系',
    items: ['基本情報技術者', '応用情報技術者', 'AWS認定', 'Google Cloud認定', 'Azure認定', 'ITパスポート', 'ネットワークスペシャリスト', 'データベーススペシャリスト'],
  },
  {
    label: '法律系',
    items: ['弁護士', '司法書士', '行政書士', '社会保険労務士', '税理士', '公認会計士', '宅地建物取引士'],
  },
  {
    label: '教育系',
    items: ['教員免許（小学校）', '教員免許（中学校）', '教員免許（高校）', '保育士', '司書'],
  },
  {
    label: '金融系',
    items: ['FP技能士（1級）', 'FP技能士（2級）', 'FP技能士（3級）', '日商簿記（1級）', '日商簿記（2級）', '日商簿記（3級）', '証券外務員'],
  },
  {
    label: '建築系',
    items: ['一級建築士', '二級建築士', '施工管理技士', '電気工事士'],
  },
  {
    label: '福祉系',
    items: ['社会福祉士', '介護福祉士', '精神保健福祉士', 'ケアマネジャー'],
  },
  {
    label: 'その他',
    items: ['TOEIC 900点以上', 'TOEIC 700〜899点', '英検1級', '英検準1級', '中小企業診断士', 'キャリアコンサルタント'],
  },
] as const;

interface QualificationSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function QualificationSelect({ value, onChange }: QualificationSelectProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');

  const toggle = (qual: string) => {
    if (value.includes(qual)) {
      onChange(value.filter((q) => q !== qual));
    } else {
      onChange([...value, qual]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomInput('');
    }
  };

  const removeQual = (qual: string) => {
    onChange(value.filter((q) => q !== qual));
  };

  return (
    <div className="space-y-3">
      {/* 選択済み資格タグ */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {value.map((qual) => (
            <motion.span
              key={qual}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gold-500/20 border border-gold-500/40 text-gold-300"
            >
              {qual}
              <button
                type="button"
                onClick={() => removeQual(qual)}
                className="ml-1 text-gold-400/70 hover:text-gold-300 transition-colors"
                aria-label={`${qual}を削除`}
              >
                ✕
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* カテゴリ別アコーディオン */}
      <div className="space-y-2">
        {QUALIFICATION_CATEGORIES.map((cat) => {
          const isOpen = openCategory === cat.label;
          const selectedCount = cat.items.filter((item) => value.includes(item)).length;

          return (
            <div key={cat.label} className="rounded-xl border border-oracle-700/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenCategory(isOpen ? null : cat.label)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-divine-200 bg-oracle-800/60 hover:bg-oracle-700/60 transition-colors"
              >
                <span>
                  {cat.label}
                  {selectedCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gold-500/30 text-gold-300">
                      {selectedCount}選択中
                    </span>
                  )}
                </span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 grid grid-cols-2 gap-2 bg-oracle-900/40">
                      {cat.items.map((item) => {
                        const selected = value.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggle(item)}
                            className={`px-3 py-2 rounded-lg text-xs text-left transition-all ${
                              selected
                                ? 'bg-gold-500/30 border border-gold-400/60 text-gold-200'
                                : 'bg-oracle-800/50 border border-oracle-600/40 text-divine-300 hover:border-oracle-400/60'
                            }`}
                          >
                            {selected && <span className="mr-1 text-gold-400">✓</span>}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 自由入力 */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="上記にない資格を入力..."
          className="flex-1 px-3 py-2 rounded-xl text-sm bg-oracle-800/60 border border-oracle-600/50 text-divine-100 placeholder:text-divine-300/40 focus:outline-none focus:border-gold-500/60"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="px-4 py-2 rounded-xl text-sm bg-oracle-700/80 border border-oracle-500/50 text-divine-200 hover:bg-oracle-600/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          追加
        </button>
      </div>
    </div>
  );
}
