import { NextResponse } from 'next/server'
import { hasCredentials } from '@/lib/storage/credentials'

/**
 * GET /api/setup/status
 * Check if Maestric credentials are configured
 */
export async function GET() {
  try {
    const configured = await hasCredentials()

    return NextResponse.json({
      configured,
    })

  } catch (error) {
    console.error('[SETUP STATUS] Error:', error)

    return NextResponse.json({
      configured: false,
    })
  }
}
