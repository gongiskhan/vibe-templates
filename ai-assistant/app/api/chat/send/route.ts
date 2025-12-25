import { NextRequest, NextResponse } from 'next/server';
import { maestricClient, NotConfiguredError } from '@/lib/maestric/client';
import { getOrCreateSession, addMessage } from '@/lib/storage/sessions';
import responseStore from '../store';

/**
 * POST /api/chat/send
 * Send a message to Maestric API and initiate processing
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = await request.json();

    // Validate input
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    console.log('[SEND ROUTE] Sending message to Maestric', {
      sessionId,
      messagePreview: message.substring(0, 50)
    });

    // Get session for context
    const session = await getOrCreateSession(sessionId);

    // Save user message to session
    await addMessage(sessionId, 'user', message);

    // Execute via Maestric API
    const { jobId } = await maestricClient.execute({
      prompt: message,
      context: {
        sessionId,
        messages: session.messages.slice(-10), // Last 10 messages for context
        flowState: session.flowState,
      },
      metadata: {
        sessionId,
        source: 'ai-assistant',
      }
    });

    console.log('[SEND ROUTE] Request initiated', {
      jobId,
      sessionId,
    });

    // Create pending entry in store
    responseStore.set({
      requestId: jobId,
      sessionId,
      status: 'pending',
      timestamp: Date.now()
    });

    return NextResponse.json({
      success: true,
      requestId: jobId,
      sessionId,
      status: 'processing'
    });

  } catch (error) {
    console.error('[SEND ROUTE] Error:', error);

    // Handle not configured error
    if (error instanceof NotConfiguredError) {
      return NextResponse.json(
        { error: 'not_configured' },
        { status: 503 }
      );
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - please try again' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
