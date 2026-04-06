import type { Metadata } from 'next';
import Link from 'next/link';
import { archetypes } from '@/data/archetypes';

// URLに埋め込まれた結果データの型
interface SharedResult {
  a: string;  // archetypeId
  o: string;  // occupationName
  m: string;  // divineMessage（短縮版）
}

interface PageProps {
  params: Promise<{ resultId: string }>;
}

function decodeResultId(resultId: string): SharedResult | null {
  try {
    const decoded = decodeURIComponent(atob(resultId));
    return JSON.parse(decoded) as SharedResult;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { resultId } = await params;
  const shared = decodeResultId(resultId);

  if (!shared) {
    return {
      title: '天職神託 - 天職診断',
      description: 'あなたの天職を神話的アーキタイプで診断する、占いと心理学が融合した天職診断ツール。',
    };
  }

  const archetype = archetypes.find((a) => a.id === shared.a);
  const archetypeName = archetype?.name ?? shared.a;
  const occupation = shared.o;
  const message = shared.m;

  const title = `${archetypeName} - 天職神託`;
  const description = `あなたの天職は「${occupation}」。${message}`;

  const ogImageParams = new URLSearchParams({
    archetype: archetypeName,
    occupation,
    message,
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

export default async function SharedResultPage({ params }: PageProps) {
  const { resultId } = await params;
  const shared = decodeResultId(resultId);

  if (!shared) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-2xl text-gold-300">神託の解読に失敗しました</p>
        <p className="text-sm text-divine-200/50">
          共有リンクが無効か、期限が切れている可能性があります。
        </p>
        <Link
          href="/"
          className="rounded-xl border border-gold-500/40 bg-gold-700/20 px-6 py-3 text-sm text-gold-300 transition-colors hover:border-gold-400/70 hover:text-gold-200"
        >
          自分でも診断してみる
        </Link>
      </main>
    );
  }

  const archetype = archetypes.find((a) => a.id === shared.a);
  const archetypeName = archetype?.name ?? shared.a;
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
              {shared.o}
            </p>
            {shared.m && (
              <p className="mt-4 text-sm italic text-divine-200/70">
                「{shared.m}」
              </p>
            )}
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
              ✦ 天職診断を受ける
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
