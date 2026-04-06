/**
 * IPベースのインメモリレート制限ミドルウェア
 *
 * 設定: 1分あたり最大20リクエスト
 * サーバーレス環境ではプロセス再起動でリセットされるが、
 * 短期的な乱用防止として十分機能する。
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  /** 現在のウィンドウ内のリクエスト数 */
  count: number;
  /** ウィンドウのリセット時刻（Unix ms） */
  resetAt: number;
}

/** レート制限の設定値 */
const RATE_LIMIT_CONFIG = {
  /** ウィンドウサイズ（ミリ秒）: 1分 */
  windowMs: 60 * 1000,
  /** ウィンドウあたりの最大リクエスト数 */
  maxRequests: 20,
};

/** IPアドレスごとのレート制限状態を保持するMap */
const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * 古いエントリのクリーンアップ（メモリリーク防止）
 * リクエストのたびに期限切れエントリを掃除する。
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * リクエストからIPアドレスを取得する。
 * Vercel / Cloudflare / Nginx のヘッダーを順に確認する。
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for は "client, proxy1, proxy2" 形式
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  // フォールバック（ローカル開発環境等）
  return '127.0.0.1';
}

/**
 * レート制限チェックを実行する。
 *
 * @returns 制限内であれば null、超過していれば 429 レスポンスを返す。
 */
export function checkRateLimit(request: NextRequest): NextResponse | null {
  // 定期的に古いエントリを削除（全リクエストの1/10の確率で実行してオーバーヘッドを抑制）
  if (Math.random() < 0.1) {
    cleanupExpiredEntries();
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const { windowMs, maxRequests } = RATE_LIMIT_CONFIG;

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // 新しいウィンドウを開始
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      {
        error: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      },
    );
  }

  // カウントをインクリメント
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return null;
}
