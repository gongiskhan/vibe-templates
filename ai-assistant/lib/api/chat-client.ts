/**
 * Chat API Client
 * Handles all communication with the Next.js API routes
 */

export interface SendMessageResponse {
  success: boolean;
  requestId: string;
  sessionId: string;
  status: 'processing';
}

export interface PollResponse {
  status: 'pending' | 'ready' | 'error';
  message?: string;
  error?: string;
}

export interface SessionResponse {
  sessionId: string;
  isNew: boolean;
}

export class ChatApiClient {
  private baseUrl: string;
  private pollCache: Map<string, { timestamp: number; response: PollResponse }>;
  private readonly CACHE_TTL_MS = 100; // 100ms cache to prevent duplicate polls

  constructor(baseUrl: string = '') {
    // Empty string uses relative URLs for same-origin requests
    this.baseUrl = baseUrl;
    this.pollCache = new Map();
  }

  /**
   * Clear expired poll cache entries
   */
  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.pollCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL_MS) {
        this.pollCache.delete(key);
      }
    }
  }

  /**
   * Get or create a session
   */
  async getOrCreateSession(existingSessionId?: string): Promise<SessionResponse> {
    const url = existingSessionId
      ? `${this.baseUrl}/api/chat/session?id=${existingSessionId}`
      : `${this.baseUrl}/api/chat/session`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    return response.json();
  }

  /**
   * Send a message to the chat API
   */
  async sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        message
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  }

  /**
   * Poll for response updates (with caching to prevent duplicate requests)
   */
  async poll(sessionId: string, requestId?: string): Promise<PollResponse> {
    // Clear expired cache entries
    this.clearExpiredCache();

    // Check cache
    const cacheKey = `${sessionId}-${requestId || 'none'}`;
    const cached = this.pollCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.response;
    }

    const url = requestId
      ? `${this.baseUrl}/api/chat/poll?sessionId=${sessionId}&requestId=${requestId}`
      : `${this.baseUrl}/api/chat/poll?sessionId=${sessionId}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Failed to poll');
    }

    const data = await response.json();

    // Cache the response
    this.pollCache.set(cacheKey, {
      timestamp: Date.now(),
      response: data
    });

    return data;
  }

  /**
   * Poll with retry logic
   * Keeps polling until a response is ready or max attempts reached
   */
  async pollUntilReady(
    sessionId: string,
    requestId: string,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onProgress?: (attempt: number) => void;
    } = {}
  ): Promise<PollResponse> {
    const {
      maxAttempts = 120, // 120 attempts (2 minutes total)
      intervalMs = 1000, // 1 second between attempts
      onProgress
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (onProgress) {
        onProgress(attempt);
      }

      const result = await this.poll(sessionId, requestId);

      if (result.status === 'ready' || result.status === 'error') {
        return result;
      }

      // Wait before next poll
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    // Max attempts reached
    return {
      status: 'error',
      error: 'Response timeout - please try again'
    };
  }
}

// Default client instance
export const chatClient = new ChatApiClient();
