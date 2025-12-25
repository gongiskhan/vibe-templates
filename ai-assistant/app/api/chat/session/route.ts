import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession } from '@/lib/storage/sessions';

/**
 * GET /api/chat/session?id=xxx
 * Get session by ID or create a new one
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get existing session
      const session = await getSession(id);

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ session });
    }

    // Create new session
    const session = await createSession();

    return NextResponse.json({
      session,
      isNew: true
    });

  } catch (error) {
    console.error('[SESSION ROUTE] Error:', error);

    return NextResponse.json(
      { error: 'Failed to get/create session' },
      { status: 500 }
    );
  }
}
