// セッションごとの往復回数をメモリ上で管理する。
// サーバーレス環境ではプロセス再起動でリセットされるが、
// クライアント側でも turnCount を管理するため実用上問題ない。

const sessionTurnMap = new Map<string, number>();

export const MAX_TURNS = 10;

export function getTurnCount(sessionId: string): number {
  return sessionTurnMap.get(sessionId) ?? 0;
}

export function incrementTurnCount(sessionId: string): number {
  const current = getTurnCount(sessionId);
  const next = current + 1;
  sessionTurnMap.set(sessionId, next);
  return next;
}

export function isLimitReached(sessionId: string): boolean {
  return getTurnCount(sessionId) >= MAX_TURNS;
}
