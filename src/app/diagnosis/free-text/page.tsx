'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { freeTextQuestions } from '@/data/free-text-questions';
import { useDiagnosis } from '@/store/diagnosisStore';
import { FreeTextQuestion } from '@/components/diagnosis/FreeTextQuestion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function FreeTextPage() {
  const router = useRouter();
  const { dispatch } = useDiagnosis();

  // 各質問のテキストをローカルstateで管理
  const [texts, setTexts] = useState<Record<string, string>>(
    Object.fromEntries(freeTextQuestions.map((q) => [q.id, '']))
  );

  const handleChange = (questionId: string, text: string) => {
    setTexts((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = () => {
    // 入力があるものだけdispatch
    freeTextQuestions.forEach((q) => {
      const text = texts[q.id];
      if (text.trim()) {
        dispatch({
          type: 'SET_FREE_TEXT',
          payload: { questionId: q.id, text },
        });
      }
    });
    router.push('/diagnosis/loading');
  };

  const handleBack = () => {
    router.push('/diagnosis/questions');
  };

  return (
    <main className="min-h-dvh bg-oracle-950 star-field py-10 px-4">
      {/* 背景グラデーション */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-oracle-900/20 via-transparent to-oracle-950/80"
      />

      <div className="relative z-10 mx-auto max-w-lg">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs tracking-widest uppercase text-gold-400/70 mb-3">
            Step 3 of 4
          </p>
          <h1 className="text-3xl font-bold text-gold-gradient mb-3">
            魂の声を聞かせてください
          </h1>
          <p className="text-sm text-divine-300/60 leading-relaxed">
            以下の問いに自由に答えてください。<br />
            すべてスキップ可能です。
          </p>
        </motion.div>

        {/* 質問カード */}
        <Card className="p-6 md:p-8 space-y-8">
          {freeTextQuestions.map((question, i) => (
            <FreeTextQuestion
              key={question.id}
              question={question}
              index={i}
              value={texts[question.id]}
              onChange={(text) => handleChange(question.id, text)}
            />
          ))}
        </Card>

        {/* アクションボタン */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 space-y-3"
        >
          <Button
            size="lg"
            fullWidth
            onClick={handleSubmit}
          >
            ✨ 神託を受け取る
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleBack}
          >
            ← 質問に戻る
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-xs text-divine-300/35 mt-5"
        >
          記述内容はAIによる分析にのみ使用されます。
        </motion.p>
      </div>
    </main>
  );
}
