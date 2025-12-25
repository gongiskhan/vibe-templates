import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/storage/sessions';

/**
 * GET /api/chat/history?sessionId=xxx
 * Get chat history for a session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const session = await getSession(sessionId);

    if (!session) {
      return NextResponse.json({
        messages: [],
        sessionId,
        isNew: true
      });
    }

    // Transform messages to the format expected by the frontend
    const messages = session.messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));

    return NextResponse.json({
      messages,
      sessionId,
      flowState: session.flowState,
      metadata: session.metadata
    });

  } catch (error) {
    console.error('[HISTORY ROUTE] Error:', error);

    return NextResponse.json(
      { error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}
