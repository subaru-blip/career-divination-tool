'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDiagnosis } from '@/store/diagnosisStore';
import { DivineMessage } from '@/components/result/DivineMessage';
import { ArchetypeCard } from '@/components/result/ArchetypeCard';
import { RealPathSection } from '@/components/result/RealPathSection';
import { IdealPathSection } from '@/components/result/IdealPathSection';
import { ScoreBreakdown } from '@/components/result/ScoreBreakdown';
import { GapAnalysis } from '@/components/result/GapAnalysis';
import { ShareButton } from '@/components/result/ShareButton';
import { Button } from '@/components/ui/Button';
import { staggerChildren } from '@/lib/animations';

export default function ResultPage() {
  const { state } = useDiagnosis();
  const router = useRouter();

  const result = state.session?.result ?? null;
  const scores = state.session?.scores ?? null;
  const archetype = result?.archetype;

  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result, router]);

  if (!result || !archetype) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </main>
    );
  }

  const primary = archetype.colorPalette.primary;
  const secondary = archetype.colorPalette.secondary;

  return (
    <main
      className="relative min-h-dvh"
      style={{
        background: `radial-gradient(ellipse at top, ${primary}18 0%, transparent 60%),
                     radial-gradient(ellipse at bottom right, ${secondary}10 0%, transparent 50%),
                     var(--color-oracle-950)`,
      }}
    >
      {/* 星フィールド背景 */}
      <div className="star-field pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-2xl px-4 py-12">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* ヘッダー */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-500/70">
              天職神託
            </p>
            <h1 className="font-serif text-3xl font-bold text-gold-gradient">
              あなたの天職が
              <br />
              明かされました
            </h1>
          </motion.div>

          {/* アーキタイプカード */}
          <ArchetypeCard archetype={archetype} />

          {/* 神様の言葉 */}
          <div className="rounded-2xl border border-gold-700/30 bg-oracle-900/60 backdrop-blur-sm">
            <DivineMessage message={result.divineMessage} />
          </div>

          {/* スコア（なぜこの結果なのかの根拠） */}
          {scores && (
            <ScoreBreakdown
              bigFive={scores.bigFive}
              riasec={scores.riasec}
            />
          )}

          {/* 理想パス（常に表示） */}
          <IdealPathSection
            path={result.idealPath}
            accentColor={archetype.colorPalette.primary}
          />

          {/* 現実パス（制約・資格入力時） */}
          {result.realPath && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <p className="text-xs tracking-widest uppercase text-oracle-400">
                  ── 一方で ──
                </p>
                <p className="text-sm text-divine-200/70 leading-relaxed max-w-md mx-auto">
                  あなたが教えてくれた今の状況をAIが分析し、<br />
                  <span className="text-gold-400">今すぐ現実的に目指せる道</span>を導き出しました
                </p>
              </motion.div>
              <RealPathSection
                path={result.realPath}
                accentColor={archetype.colorPalette.secondary}
              />
            </>
          )}

          {/* ギャップ分析 */}
          {result.gapAnalysis && (
            <GapAnalysis analysis={result.gapAnalysis} />
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <p className="text-sm text-divine-200/60">
              診断結果についてAIに相談できます
            </p>
            <Link href="/chat">
              <Button variant="primary" size="lg" fullWidth>
                ✦ AIに相談する
              </Button>
            </Link>

            <div className="flex justify-center">
              <ShareButton
                archetypeName={archetype.name}
                archetypeId={archetype.id}
                occupationName={result.idealPath.mainOccupation.name}
                divineMessage={result.divineMessage}
              />
            </div>

            <Link
              href="/"
              className="block text-sm text-divine-200/40 hover:text-divine-200/70 transition-colors"
            >
              最初からやり直す
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
