'use client';

// Phase5で実装予定。現在はプレースホルダー。
export function ShareButton() {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-xl border border-divine-200/20 bg-oracle-800/40 px-5 py-2.5 text-sm text-divine-200/50 cursor-not-allowed"
      disabled
      aria-label="SNS共有（近日公開）"
    >
      <span>🔗</span>
      <span>結果をシェア（近日公開）</span>
    </button>
  );
}
