/**
 * 職業データのメモリキャッシュ
 *
 * sample-occupations.ts のデータは静的なので、
 * 初回アクセス時にロードしてモジュールスコープでキャッシュする。
 * サーバー起動中は同一インスタンスが使い回され、
 * 繰り返しのimportコストを排除する。
 */

import type { Occupation } from '@/types/occupation';

/** キャッシュ本体 */
let cache: Occupation[] | null = null;

/**
 * 職業データを取得する。
 * 初回呼び出し時に sample-occupations.ts をインポートしてキャッシュに格納し、
 * 2回目以降はキャッシュから即座に返す。
 */
export function getOccupations(): Occupation[] {
  if (cache !== null) {
    return cache;
  }

  // 動的インポートではなく同期importで取得（Node.js環境のサーバーサイドのみで使用）
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { sampleOccupations } = require('@/data/sample-occupations') as {
    sampleOccupations: Occupation[];
  };

  cache = sampleOccupations;
  return cache;
}

/**
 * キャッシュを無効化する（テスト用・開発用）
 */
export function invalidateOccupationCache(): void {
  cache = null;
}
