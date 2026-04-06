import type { Metadata } from 'next';
import Link from 'next/link';
import { archetypes } from '@/data/archetypes';

interface PageProps {
  searchParams: Promise<{ a?: string; o?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { a, o } = await searchParams;

  const archetype = archetypes.find((ar) => ar.id === a);
  const archetypeName = archetype?.name ?? '天職神託';
  const occupation = o ?? '天職';

  const title = `${archetypeName} - 天職神託`;
  const description = `天職神託の結果：アーキタイプは「${archetypeName}」、天職は「${occupation}」でした。あなたも診断してみませんか？`;

  const ogImageParams = new URLSearchParams({
    archetype: archetypeName,
    occupation,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og?${ogImageParams.toString()}`,
          width: 1200,
          height: 630,
          alt: `${archetypeName} の天職診断結果`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?${ogImageParams.toString()}`],
    },
  };
}

export default async function SharedResultPage({ searchParams }: PageProps) {
  const { a, o } = await searchParams;

  const archetype = archetypes.find((ar) => ar.id === a);
  const archetypeName = archetype?.name ?? a ?? '不明';
  const occupation = o ?? '不明';
  const primary = archetype?.colorPalette.primary ?? '#4c63d2';
  const secondary = archetype?.colorPalette.secondary ?? '#ffd700';

  return (
    <main
      className="relative min-h-dvh"
      style={{
        background: `radial-gradient(ellipse at top, ${primary}18 0%, transparent 60%),
                     radial-gradient(ellipse at bottom right, ${secondary}10 0%, transparent 50%),
                     var(--color-oracle-950)`,
      }}
    >
      <div className="star-field pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-10 text-center">
          {/* ヘッダー */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-500/70">
              天職神託
            </p>
            <h1 className="font-serif text-3xl font-bold text-gold-gradient">
              友人の天職が明かされました
            </h1>
          </div>

          {/* アーキタイプ */}
          <div
            className="rounded-2xl border p-8"
            style={{
              borderColor: `${primary}40`,
              background: `${primary}0f`,
            }}
          >
            <p className="mb-3 text-xs uppercase tracking-widest text-divine-200/50">
              アーキタイプ
            </p>
            <p
              className="font-serif text-4xl font-bold"
              style={{ color: secondary }}
            >
              {archetypeName}
            </p>
          </div>

          {/* 天職 */}
          <div className="rounded-2xl border border-gold-700/30 bg-oracle-900/60 p-8 backdrop-blur-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-divine-200/50">
              天職
            </p>
            <p className="font-serif text-3xl font-bold text-divine-100">
              {occupation}
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <p className="text-sm text-divine-200/60">
              あなたの天職も神託に問いかけてみませんか？
            </p>
            <Link
              href="/"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                border border-gold-500/50
                bg-gradient-to-r from-gold-700/30 to-gold-500/20
                px-8 py-3.5
                text-sm font-semibold text-gold-300
                transition-all duration-200
                hover:border-gold-400/80 hover:text-gold-200
              "
            >
              ✦ 無料で天職診断を受ける
            </Link>
            <p className="text-xs text-divine-300/30">
              完全無料 ・ 登録不要 ・ 約10分
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
