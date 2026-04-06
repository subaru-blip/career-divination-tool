// お試し版: 認証ミドルウェア無効化（全ルート公開）
// 本番版ではClerkミドルウェアを有効化する

export default function middleware() {
  // no-op
}

export const config = {
  matcher: [],
};
