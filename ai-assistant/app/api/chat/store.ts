/**
 * Response Store
 * In-memory storage for async callback responses
 * Provides TTL-based cleanup to prevent memory leaks
 */

export interface StoredResponse {
  requestId: string;
  sessionId: string;
  status: 'pending' | 'ready' | 'error';
  message?: string;
  error?: string;
  timestamp: number;
}

class ResponseStore {
  private store: Map<string, StoredResponse>;
  private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.store = new Map();
    this.startCleanup();
  }

  /**
   * Generate storage key from sessionId and requestId
   */
  private getKey(sessionId: string, requestId: string): string {
    return `${sessionId}:${requestId}`;
  }

  /**
   * Store a response
   */
  set(response: StoredResponse): void {
    const key = this.getKey(response.sessionId, response.requestId);
    this.store.set(key, {
      ...response,
      timestamp: Date.now()
    });

    console.log(`[STORE] Stored response for ${key}`, {
      status: response.status,
      hasMessage: !!response.message
    });
  }

  /**
   * Get a response
   */
  get(sessionId: string, requestId: string): StoredResponse | null {
    const key = this.getKey(sessionId, requestId);
    const response = this.store.get(key);

    if (!response) {
      return null;
    }

    // Check if expired
    if (Date.now() - response.timestamp > this.TTL_MS) {
      this.store.delete(key);
      console.log(`[STORE] Response expired for ${key}`);
      return null;
    }

    return response;
  }

  /**
   * Delete a response (optional - for cleanup after consumption)
   */
  delete(sessionId: string, requestId: string): void {
    const key = this.getKey(sessionId, requestId);
    this.store.delete(key);
  }

  /**
   * Get latest response for a session (without requestId)
   */
  getLatestForSession(sessionId: string): StoredResponse | null {
    let latestResponse: StoredResponse | null = null;
    let latestTimestamp = 0;

    for (const [key, response] of this.store.entries()) {
      if (key.startsWith(`${sessionId}:`)) {
        if (response.timestamp > latestTimestamp) {
          latestTimestamp = response.timestamp;
          latestResponse = response;
        }
      }
    }

    return latestResponse;
  }

  /**
   * Start automatic cleanup of expired responses
   */
  private startCleanup(): void {
    // Run cleanup every 60 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * Clean up expired responses
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, response] of this.store.entries()) {
      if (now - response.timestamp > this.TTL_MS) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[STORE] Cleaned up ${cleaned} expired responses. Store size: ${this.store.size}`);
    }
  }

  /**
   * Clear all responses (for testing)
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Stop cleanup interval (for graceful shutdown)
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Create singleton instance
const responseStore = new ResponseStore();

// Export the singleton
export default responseStore;
