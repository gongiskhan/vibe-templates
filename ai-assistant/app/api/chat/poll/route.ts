import { NextRequest, NextResponse } from 'next/server';
import { maestricClient } from '@/lib/maestric/client';
import { addMessage } from '@/lib/storage/sessions';
import responseStore from '../store';

/**
 * GET /api/chat/poll?sessionId=xxx&requestId=xxx
 * Poll Maestric job status and return response when ready
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const requestId = searchParams.get('requestId');

    // Validate input
    if (!sessionId || !requestId) {
      return NextResponse.json(
        { error: 'sessionId and requestId are required' },
        { status: 400 }
      );
    }

    // First check local store for cached response
    const storedResponse = responseStore.get(sessionId, requestId);

    // If we already have a ready response, return it
    if (storedResponse && storedResponse.status === 'ready') {
      console.log('[POLL ROUTE] Returning cached response:', {
        sessionId,
        requestId,
        status: storedResponse.status
      });

      return NextResponse.json({
        status: storedResponse.status,
        message: storedResponse.message,
        error: storedResponse.error
      });
    }

    // If we already have an error, return it
    if (storedResponse && storedResponse.status === 'error') {
      return NextResponse.json({
        status: 'error',
        error: storedResponse.error || 'Unknown error'
      });
    }

    // Poll Maestric for job status
    try {
      const job = await maestricClient.getJobStatus(requestId);

      console.log('[POLL ROUTE] Maestric job status:', {
        sessionId,
        requestId,
        status: job.status
      });

      if (job.status === 'completed' && job.result) {
        // Save assistant message to session
        await addMessage(sessionId, 'assistant', job.result);

        // Update store with ready response
        responseStore.set({
          requestId,
          sessionId,
          status: 'ready',
          message: job.result,
          timestamp: Date.now()
        });

        return NextResponse.json({
          status: 'ready',
          message: job.result
        });
      }

      if (job.status === 'failed') {
        responseStore.set({
          requestId,
          sessionId,
          status: 'error',
          error: job.error || 'Job failed',
          timestamp: Date.now()
        });

        return NextResponse.json({
          status: 'error',
          error: job.error || 'Job failed'
        });
      }

      // Still pending or running
      return NextResponse.json({
        status: 'pending',
        message: null
      });

    } catch (maestricError) {
      console.error('[POLL ROUTE] Maestric error:', maestricError);

      // If Maestric fails, return pending and let client retry
      return NextResponse.json({
        status: 'pending',
        message: null
      });
    }

  } catch (error) {
    console.error('[POLL ROUTE] Error:', error);

    return NextResponse.json(
      { error: 'Failed to poll for updates' },
      { status: 500 }
    );
  }
}
