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

const FLOW_STEPS = [
  { step: '01', title: '基本情報', desc: '生年月日・今の状況・制約を入力', time: '2分' },
  { step: '02', title: '性格診断', desc: '35問の選択式で適性を測定', time: '5分' },
  { step: '03', title: '自由記述', desc: '理想の1日・やりたくないことを回答', time: '3分' },
  { step: '04', title: '神託結果', desc: 'AIが2つのキャリアパスを提示', time: '' },
];

const FEATURES = [
  {
    icon: '🧠',
    title: '科学的な性格分析',
    desc: 'ビッグファイブ（TIPI-J）とRIASECの2大心理学モデルで、あなたの性格と職業適性を多角的に分析します。',
  },
  {
    icon: '🔮',
    title: '占星術の導き',
    desc: '生年月日から運命数・星座・属性を算出。あなたの持つ宿命のエネルギーを診断に織り込みます。',
  },
  {
    icon: '🤖',
    title: 'AIキャリアアドバイザー',
    desc: '診断結果を全て把握したAIに、何度でも相談可能。「結局どうすればいい？」に答えます。',
  },
];

const RESULT_HIGHLIGHTS = [
  {
    label: '理想パス',
    color: 'text-gold-400',
    border: 'border-gold-500/40',
    desc: '制約を全部取り払った、あなたの性格に本当に合っている天職。「本来はこれが向いてるんだ」を知れる。',
  },
  {
    label: '現実パス',
    color: 'text-oracle-300',
    border: 'border-oracle-500/40',
    desc: 'お金・家族・地域など今の状況をAIが読み取って、現実的に目指せる仕事を提案。',
  },
];

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 sm:px-6 sm:py-28 w-full">
        {/* 背景 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oracle-900/60 via-oracle-950 to-oracle-950"
        />
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
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            h-[600px] w-[600px] rounded-full
            bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.08)_0%,transparent_70%)]"
        />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center gap-8 text-center"
        >
          <motion.div variants={fadeIn}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-700/50 bg-oracle-900/80 px-4 py-1.5 text-sm text-gold-400 backdrop-blur-sm">
              <span aria-hidden>✦</span>
              AI × 占星術 × 心理学
              <span aria-hidden>✦</span>
            </span>
          </motion.div>

          <motion.div variants={slideUp} className="flex flex-col items-center gap-3">
            <h1 className="text-5xl font-bold leading-tight tracking-wide sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="text-gold-gradient">天職神託</span>
            </h1>
            <p className="font-serif text-lg text-gold-500/80 sm:text-xl">
              Tenshoku Shintaku
            </p>
          </motion.div>

          <motion.p
            variants={slideUp}
            className="max-w-lg text-base leading-relaxed text-divine-300/80 sm:text-lg"
          >
            「自分は何に向いてるんだろう？」<br />
            科学的な性格分析と星の導きで、<br className="hidden sm:block" />
            あなたの<span className="text-gold-400 font-semibold">本当の天職</span>を見つけ出します。
          </motion.p>

          <motion.div variants={slideUp} className="flex flex-col items-center gap-4">
            <Link href="/diagnosis/basic-info">
              <Button variant="primary" size="lg">
                <span aria-hidden>✧</span>
                無料で診断を始める
                <span aria-hidden>✧</span>
              </Button>
            </Link>
            <p className="text-xs text-divine-300/40">
              約10分 ・ 完全無料 ・ 登録不要
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= こんな悩みありませんか ================= */}
      <section className="relative w-full px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-2xl font-bold text-divine-100 sm:text-3xl">
              こんな悩み、ありませんか？
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              '自分が何をやりたいのか、正直わからない',
              '適職診断をやっても、いつもピンとこない結果ばかり',
              '資格や家族の事情があって、選択肢が限られている気がする',
              '本当はもっと向いてる仕事があるんじゃないか、とモヤモヤする',
              '転職したいけど、何から始めればいいかわからない',
            ].map((text) => (
              <div
                key={text}
                className="flex items-start gap-3 rounded-xl border border-oracle-700/30 bg-oracle-900/40 px-5 py-4"
              >
                <span className="mt-0.5 text-oracle-400 shrink-0">▸</span>
                <p className="text-sm text-divine-200/80 leading-relaxed">{text}</p>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 text-center text-sm text-divine-200/60 leading-relaxed"
          >
            天職神託は、そんな<span className="text-gold-400">「自分の可能性が見えない」</span>あなたのために作りました。
          </motion.p>
        </div>
      </section>

      {/* ================= 3つの特徴 ================= */}
      <section className="relative w-full px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-serif text-2xl font-bold text-divine-100 mb-10 sm:text-3xl"
          >
            天職神託の3つの特徴
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl border border-oracle-700/40 bg-oracle-900/50 p-6 text-center"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 font-serif font-semibold text-gold-300">{f.title}</h3>
                <p className="mt-2 text-sm text-divine-200/60 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2つの結果 ================= */}
      <section className="relative w-full px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-2xl font-bold text-divine-100 sm:text-3xl">
              2つのキャリアパスを提示
            </h2>
            <p className="mt-3 text-sm text-divine-200/60 leading-relaxed max-w-md mx-auto">
              「今の自分にできること」と「本来の自分に合っていること」。<br />
              両方を知ることで、未来への道筋が見えてきます。
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {RESULT_HIGHLIGHTS.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`rounded-2xl border ${r.border} bg-oracle-900/50 p-6`}
              >
                <h3 className={`font-serif text-lg font-bold ${r.color}`}>{r.label}</h3>
                <p className="mt-2 text-sm text-divine-200/60 leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 診断の流れ ================= */}
      <section className="relative w-full px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-serif text-2xl font-bold text-divine-100 mb-10 sm:text-3xl"
          >
            診断の流れ
          </motion.h2>

          <div className="space-y-4">
            {FLOW_STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-5 rounded-xl border border-oracle-700/30 bg-oracle-900/40 px-5 py-4"
              >
                <span className="font-serif text-2xl font-bold text-gold-500/60 shrink-0">{s.step}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-divine-100">{s.title}</h3>
                  <p className="text-sm text-divine-200/60">{s.desc}</p>
                </div>
                {s.time && (
                  <span className="text-xs text-divine-300/40 shrink-0">{s.time}</span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-center text-sm text-divine-200/50"
          >
            合計約10分。結果はその場ですぐに表示されます。
          </motion.p>
        </div>
      </section>

      {/* ================= 最終CTA ================= */}
      <section className="relative w-full px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-md text-center space-y-6"
        >
          <h2 className="font-serif text-2xl font-bold text-gold-gradient sm:text-3xl">
            あなたの天職を、<br />
            星に聞いてみませんか？
          </h2>
          <p className="text-sm text-divine-200/60 leading-relaxed">
            思い込みや制約を外したとき、<br />
            本当の自分に合った仕事が見えてきます。
          </p>
          <Link href="/diagnosis/basic-info">
            <Button variant="primary" size="lg">
              <span aria-hidden>✧</span>
              無料で診断を始める
              <span aria-hidden>✧</span>
            </Button>
          </Link>
          <p className="text-xs text-divine-300/30">
            完全無料 ・ 登録不要 ・ 約10分で完了
          </p>
        </motion.div>
      </section>

      {/* 底部装飾 */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-700/40 to-transparent"
      />
    </main>
  );
}
