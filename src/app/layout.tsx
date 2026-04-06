import type { Metadata } from 'next';
import { DiagnosisProvider } from '@/store/diagnosisStore';
import './globals.css';

export const metadata: Metadata = {
  title: '天職神託',
  description:
    'あなたの魂が求める天職を、星の導きとAIの知恵で見つけ出す',
  openGraph: {
    title: '天職神託',
    description: 'あなたの魂が求める天職を、星の導きとAIの知恵で見つけ出す',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <DiagnosisProvider>{children}</DiagnosisProvider>
      </body>
    </html>
  );
}
