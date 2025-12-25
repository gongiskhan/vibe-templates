import { NextRequest, NextResponse } from 'next/server'
import { saveCredentials } from '@/lib/storage/credentials'

// Maestric API URL
const MAESTRIC_API_URL = process.env.MAESTRIC_API_URL || 'http://100.89.148.53:3232'

/**
 * POST /api/setup
 * Authenticate with Maestric and save credentials
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    console.log('[SETUP] Authenticating with Maestric...')

    // Call Maestric login API
    const loginResponse = await fetch(`${MAESTRIC_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const loginData = await loginResponse.json()

    if (!loginResponse.ok || !loginData.success) {
      console.log('[SETUP] Authentication failed:', loginData)
      return NextResponse.json(
        { error: loginData.error?.message || 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Extract token from response
    const token = loginData.data?.token
    if (!token) {
      console.error('[SETUP] No token in response:', loginData)
      return NextResponse.json(
        { error: 'No token received from authentication server' },
        { status: 500 }
      )
    }

    // Save credentials to file
    await saveCredentials(token)

    console.log('[SETUP] Credentials saved successfully')

    return NextResponse.json({
      success: true,
      message: 'Setup complete',
    })

  } catch (error) {
    console.error('[SETUP] Error:', error)

    return NextResponse.json(
      { error: 'Failed to complete setup' },
      { status: 500 }
    )
  }
}
