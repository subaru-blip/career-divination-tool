'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'ホーム' },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-oracle-800/60 bg-oracle-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-gold-500 text-lg group-hover:text-gold-400 transition-colors" aria-hidden>✦</span>
          <span className="font-serif font-bold text-lg text-gold-gradient">天職神託</span>
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-gold-400'
                    : 'text-divine-300/70 hover:text-divine-200',
                ].join(' ')}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
