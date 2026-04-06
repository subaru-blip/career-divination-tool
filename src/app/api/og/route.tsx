import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const archetype = searchParams.get('archetype') ?? '天職の持ち主';
    const occupation = searchParams.get('occupation') ?? '運命の職業';
    const rawMessage = searchParams.get('message') ?? '';

    // 神様の言葉を短縮（50文字以内）
    const message =
      rawMessage.length > 50 ? rawMessage.slice(0, 47) + '…' : rawMessage;

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #050b14 0%, #0a1628 50%, #1e2d60 100%)',
            padding: '60px 80px',
            position: 'relative',
            fontFamily: 'serif',
          }}
        >
          {/* 星の装飾 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              color: 'rgba(255,255,255,0.15)',
              fontSize: '14px',
              letterSpacing: '80px',
              flexWrap: 'wrap',
              overflow: 'hidden',
              padding: '20px',
              lineHeight: '50px',
            }}
          >
            {'✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦'}
          </div>

          {/* 上部: アーキタイプ名 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#d4a853',
                letterSpacing: '6px',
                textTransform: 'uppercase',
              }}
            >
              ✦ TENSHOKU SHINTAKU ✦
            </div>
            <div
              style={{
                fontSize: '52px',
                fontWeight: 'bold',
                color: '#fde08a',
                textShadow: '0 0 40px rgba(212,168,83,0.6)',
                letterSpacing: '4px',
              }}
            >
              {archetype}
            </div>
          </div>

          {/* 中央: 天職 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,168,83,0.3)',
              borderRadius: '16px',
              padding: '28px 60px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                color: 'rgba(238,240,252,0.6)',
                letterSpacing: '4px',
              }}
            >
              あなたの天職は
            </div>
            <div
              style={{
                fontSize: '44px',
                fontWeight: 'bold',
                color: '#f8f9ff',
                letterSpacing: '3px',
              }}
            >
              {occupation}
            </div>
            {message && (
              <div
                style={{
                  fontSize: '18px',
                  color: 'rgba(238,240,252,0.7)',
                  textAlign: 'center',
                  marginTop: '8px',
                  fontStyle: 'italic',
                  letterSpacing: '1px',
                  maxWidth: '800px',
                }}
              >
                「{message}」
              </div>
            )}
          </div>

          {/* フッター */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: 'rgba(212,168,83,0.5)',
              fontSize: '16px',
              letterSpacing: '4px',
            }}
          >
            <span style={{ fontSize: '20px' }}>✦</span>
            <span>天職神託</span>
            <span style={{ fontSize: '20px' }}>✦</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=86400',
        },
      }
    );
  } catch (e) {
    console.error('OG image generation failed:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
