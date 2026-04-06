'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDiagnosis } from '@/store/diagnosisStore';
import { OracleAnimation } from '@/components/diagnosis/OracleAnimation';
import { ParticleField } from '@/components/diagnosis/ParticleField';
import type { DiagnosisResult, DiagnosisScores } from '@/types/diagnosis';

// 最低演出時間（ミリ秒）
const MIN_DISPLAY_MS = 4000;

export default function LoadingPage() {
  const router = useRouter();
  const { state, dispatch } = useDiagnosis();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const startTime = Date.now();

    const fetchResult = async () => {
      try {
        const session = state.session;
        if (!session) {
          // セッションがなければ最初に戻す
          router.push('/diagnosis/basic-info');
          return;
        }

        const res = await fetch('/api/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(session),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json() as {
          scores: DiagnosisScores;
          result: DiagnosisResult;
        };

        dispatch({ type: 'SET_SCORES', payload: data.scores });
        dispatch({ type: 'SET_RESULT', payload: data.result });

        // 演出の最低時間を確保してから遷移
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

        setTimeout(() => {
          router.push('/result');
        }, remaining);
      } catch (err) {
        console.error('診断APIエラー:', err);

        // エラーでも最低時間待ってから結果ページへ（結果ページ側でエラーハンドリング）
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

        setTimeout(() => {
          router.push('/result');
        }, remaining);
      }
    };

    fetchResult();
  }, [dispatch, router, state.session]);

  return (
    <main className="min-h-dvh bg-oracle-950 flex flex-col items-center justify-center overflow-hidden">
      {/* 星パーティクル */}
      <ParticleField count={100} />

      {/* 背景グラデーション */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-radial-[at_50%_50%] from-oracle-800/20 via-oracle-900/60 to-oracle-950"
      />

      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* 上部テキスト */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-gold-gradient mb-2">
            神託降臨中
          </h1>
          <p className="text-xs tracking-widest uppercase text-divine-300/40">
            Oracle Descending
          </p>
        </motion.div>

        {/* メインアニメーション */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <OracleAnimation messageIntervalMs={1500} />
        </motion.div>

        {/* 下部テキスト */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-2"
        >
          <p className="text-xs text-divine-300/40 max-w-xs leading-relaxed">
            あなたの回答を星の配置と照らし合わせ、<br />
            天職の導きを紐解いています。
          </p>
        </motion.div>
      </div>
    </main>
  );
}
