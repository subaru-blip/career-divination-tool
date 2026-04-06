'use client';

import { useState, useCallback } from 'react';

interface ShareButtonProps {
  archetypeName: string;
  archetypeId: string;
  occupationName: string;
  divineMessage: string;
  resultId?: string;
}

export function ShareButton({
  archetypeName,
  archetypeId,
  occupationName,
  divineMessage,
  resultId,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `私の天職は「${occupationName}」でした！\nアーキタイプは「${archetypeName}」\n\n#天職神託`;

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin;
    if (resultId) {
      return `${base}/result/${resultId}`;
    }
    // 短いパラメータでURLを構築（Base64は長すぎて壊れるので廃止）
    const params = new URLSearchParams({
      a: archetypeId,
      o: occupationName,
    });
    return `${base}/result/share?${params.toString()}`;
  }, [archetypeId, occupationName, resultId]);

  const handleCopyLink = useCallback(async () => {
    const url = getShareUrl();
    const fullText = `${shareText}\n${url}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard APIが使えない環境
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [shareText, getShareUrl]);

  const handleXShare = useCallback(() => {
    const url = getShareUrl();
    const text = `私の天職は「${occupationName}」でした！アーキタイプは「${archetypeName}」✦ #天職神託`;
    const tweetUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  }, [archetypeName, occupationName, getShareUrl]);

  const handleLineShare = useCallback(() => {
    const url = getShareUrl();
    const text = `私の天職は「${occupationName}」でした！アーキタイプは「${archetypeName}」✦\n${url}`;
    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  }, [archetypeName, occupationName, getShareUrl]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* リンクコピーボタン */}
      <button
        onClick={handleCopyLink}
        className="
          inline-flex items-center justify-center gap-2
          rounded-xl
          border border-gold-500/50
          bg-gradient-to-r from-gold-700/30 to-gold-500/20
          px-6 py-3
          text-sm font-semibold text-gold-300
          transition-all duration-200
          hover:border-gold-400/80 hover:bg-gradient-to-r hover:from-gold-600/40 hover:to-gold-400/30 hover:text-gold-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-oracle-950
          active:scale-95
        "
        aria-label="結果をリンクでコピー"
      >
        <span aria-hidden="true">✦</span>
        <span>
          {copied ? 'コピーしました！' : 'リンクをコピー'}
        </span>
        <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
      </button>

      {/* X / LINE ボタン */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleXShare}
          className="
            inline-flex items-center gap-1.5
            rounded-lg
            border border-divine-200/10
            bg-oracle-800/40
            px-4 py-2
            text-xs text-divine-200/60
            transition-all duration-200
            hover:border-divine-200/30 hover:text-divine-200/90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-divine-200/30
            active:scale-95
          "
          aria-label="X（旧Twitter）でシェア"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X でシェア</span>
        </button>

        <button
          onClick={handleLineShare}
          className="
            inline-flex items-center gap-1.5
            rounded-lg
            border border-divine-200/10
            bg-oracle-800/40
            px-4 py-2
            text-xs text-divine-200/60
            transition-all duration-200
            hover:border-divine-200/30 hover:text-divine-200/90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-divine-200/30
            active:scale-95
          "
          aria-label="LINEでシェア"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.037 2 11.01c0 3.424 1.978 6.434 4.94 8.174-.069.462-.446 2.302-.513 2.653-.082.43.147.425.309.31.124-.088 2.02-1.372 2.837-1.93.462.065.934.1 1.427.1 5.52 0 10-4.037 10-9.007C22 6.037 17.52 2 12 2zm4.914 6.617l-2.14 3.368a.446.446 0 01-.609.122l-1.718-1.194-1.668 1.263c-.232.175-.554-.068-.439-.336l2.14-3.368a.446.446 0 01.609-.122l1.718 1.194 1.668-1.263c.232-.175.554.068.439.336z" />
          </svg>
          <span>LINE でシェア</span>
        </button>
      </div>
    </div>
  );
}
