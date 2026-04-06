'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { staggerChildren, slideUp, fadeIn } from '@/lib/animations';

// 星のデータ（固定シード値でSSR/CSR 差分を防ぐ）
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: ((i * 137.508) % 100).toFixed(2),
  y: ((i * 97.345) % 100).toFixed(2),
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2,
  duration: 2.5 + (i % 4) * 0.7,
  delay: (i % 10) * 0.3,
}));

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      {/* 背景グラデーション */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oracle-900/60 via-oracle-950 to-oracle-950"
      />

      {/* 星フィールド */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((star) => (
          <motion.span
            key={star.id}
            className="absolute rounded-full bg-divine-50"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 中央の光の玉 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[600px] w-[600px] rounded-full
          bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.08)_0%,transparent_70%)]"
      />

      {/* メインコンテンツ */}
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-8 text-center"
      >
        {/* 上部バッジ */}
        <motion.div variants={fadeIn}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-700/50 bg-oracle-900/80 px-4 py-1.5 text-sm text-gold-400 backdrop-blur-sm">
            <span aria-hidden>✦</span>
            AI × 占星術 × 心理学
            <span aria-hidden>✦</span>
          </span>
        </motion.div>

        {/* タイトル */}
        <motion.div variants={slideUp} className="flex flex-col items-center gap-3">
          <h1 className="text-5xl font-bold leading-tight tracking-wide sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-gold-gradient">天職神託</span>
          </h1>
          <p className="font-serif text-lg text-gold-500/80 sm:text-xl">
            Tenshoku Shintaku
          </p>
        </motion.div>

        {/* サブコピー */}
        <motion.p
          variants={slideUp}
          className="max-w-md text-base leading-relaxed text-divine-300/80 sm:text-lg"
        >
          あなたの魂が求める天職を、
          <br className="hidden sm:block" />
          星の導きとAIの知恵で見つけ出す
        </motion.p>

        {/* 特徴リスト */}
        <motion.ul
          variants={staggerChildren}
          className="flex flex-wrap justify-center gap-3 text-sm text-divine-300/60"
        >
          {['ビッグファイブ分析', 'RIASEC適職診断', '運命数・星座鑑定', 'AIによる天職神託'].map(
            (item) => (
              <motion.li
                key={item}
                variants={fadeIn}
                className="flex items-center gap-1.5"
              >
                <span className="text-gold-500" aria-hidden>
                  ◆
                </span>
                {item}
              </motion.li>
            )
          )}
        </motion.ul>

        {/* CTA */}
        <motion.div variants={slideUp} className="flex flex-col items-center gap-4">
          <Link href="/diagnosis/basic-info">
            <Button variant="primary" size="lg">
              <span aria-hidden>✧</span>
              診断を始める
              <span aria-hidden>✧</span>
            </Button>
          </Link>
          <div className="flex items-center gap-4 text-xs text-divine-300/40">
            <span>所要時間 約10〜15分 ・ 無料</span>
            <span aria-hidden>·</span>
            <Link href="/pricing" className="hover:text-divine-300/70 transition-colors underline underline-offset-2">
              料金プランを見る
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* 底部の装飾ライン */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-700/40 to-transparent"
      />
    </main>
  );
}
