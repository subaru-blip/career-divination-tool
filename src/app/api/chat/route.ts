import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt, type DiagnosisContext } from '@/lib/ai/systemPrompt';
import { incrementTurnCount, isLimitReached, MAX_TURNS } from '@/lib/ai/sessionCounter';
import { sanitizeText } from '@/lib/security/sanitize';
import { checkRateLimit } from '@/lib/security/rateLimit';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context: DiagnosisContext;
  sessionId: string;
  turnCount: number;
}

export async function POST(request: NextRequest) {
  // IPベースのレート制限チェック（1分あたり20リクエスト）
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let body: ChatRequest;
  try {
    body = await request.json() as ChatRequest;
  } catch {
    return NextResponse.json({ error: 'リクエストのパースに失敗しました' }, { status: 400 });
  }

  const { messages, context, sessionId, turnCount } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messagesが不正です' }, { status: 400 });
  }

  if (!context?.result || !context?.basicInfo) {
    return NextResponse.json({ error: 'contextが不正です' }, { status: 400 });
  }

  // サーバー側でも制限チェック（クライアントのturnCountを参照）
  if (turnCount >= MAX_TURNS || isLimitReached(sessionId)) {
    return NextResponse.json(
      { error: '相談回数の上限（10回）に達しました。診断をやり直すと新たにご相談いただけます。' },
      { status: 429 },
    );
  }

  incrementTurnCount(sessionId);

  const systemPrompt = buildSystemPrompt(context);

  // ユーザーメッセージをサニタイズ（assistant メッセージは自前の出力なのでそのまま）
  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.role === 'user' ? sanitizeText(m.content, 2000) : m.content,
  }));

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('[/api/chat] Anthropic error:', err);
    return NextResponse.json(
      { error: 'AI応答の生成中にエラーが発生しました' },
      { status: 500 },
    );
  }
}
