'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { BasicInfoForm } from '@/components/diagnosis/BasicInfoForm';

export default function BasicInfoPage() {
  return (
    <main className="min-h-dvh bg-oracle-950 star-field py-12 px-4">
      {/* 背景グラデーション */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-oracle-900/30 via-transparent to-oracle-950/80"
      />

      <div className="relative z-10 mx-auto max-w-lg">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-widest uppercase text-gold-400/70 mb-3">
            Step 1 of 4
          </p>
          <h1 className="text-3xl font-bold text-gold-gradient mb-3">
            基本情報の入力
          </h1>
          <p className="text-sm text-divine-300/60 leading-relaxed">
            あなたの星の位置を特定するために、<br />
            いくつかの情報をお聞かせください。
          </p>
        </motion.div>

        {/* フォームカード */}
        <Card className="p-6 md:p-8">
          <BasicInfoForm />
        </Card>

        {/* 注記 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-xs text-divine-300/40 mt-6"
        >
          入力された情報は診断にのみ使用され、外部に共有されることはありません。
        </motion.p>
      </div>
    </main>
  );
}
