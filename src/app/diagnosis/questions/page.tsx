'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { allQuestions, QUESTION_COUNT } from '@/data/questions';
import { useDiagnosis } from '@/store/diagnosisStore';
import { QuestionCard } from '@/components/diagnosis/QuestionCard';
import { QuestionProgress } from '@/components/diagnosis/QuestionProgress';
import { Button } from '@/components/ui/Button';

export default function QuestionsPage() {
  const router = useRouter();
  const { dispatch } = useDiagnosis();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const currentQuestion = allQuestions[currentIndex];
  const isLastQuestion = currentIndex === QUESTION_COUNT - 1;

  const handleAnswer = useCallback(
    (value: number) => {
      dispatch({
        type: 'ADD_ANSWER',
        payload: {
          questionId: currentQuestion.id,
          selectedOptionIndex: value - 1,
          value,
        },
      });

      if (isLastQuestion) {
        router.push('/diagnosis/free-text');
        return;
      }

      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentQuestion.id, dispatch, isLastQuestion, router]
  );

  const handleBack = useCallback(() => {
    if (currentIndex === 0) {
      router.push('/diagnosis/basic-info');
      return;
    }
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex, router]);

  return (
    <main className="min-h-dvh bg-oracle-950 star-field flex flex-col">
      {/* 背景グラデーション */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-oracle-900/20 via-transparent to-oracle-950/70"
      />

      <div className="relative z-10 flex flex-col flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {/* ヘッダー */}
        <div className="mb-8 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs tracking-widest uppercase text-gold-400/60 mb-2">
              Step 2 of 4 — 質問
            </p>
            <QuestionProgress
              current={currentIndex + 1}
              total={QUESTION_COUNT}
            />
          </motion.div>
        </div>

        {/* 質問カード（スライド遷移） */}
        <div className="flex-1 relative">
          <div
            className="relative rounded-2xl border border-gold-700/50 bg-oracle-900/80 backdrop-blur-md shadow-[0_0_40px_rgba(10,22,40,0.6)] p-6 md:p-8 overflow-hidden"
          >
            {/* 上部ボーダーハイライト */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
            />

            <AnimatePresence mode="wait" custom={direction}>
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                questionIndex={currentIndex}
                direction={direction}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
          >
            ← 戻る
          </Button>

          <p className="text-xs text-divine-300/40">
            選択肢をタップで即座に次へ
          </p>
        </div>
      </div>
    </main>
  );
}
