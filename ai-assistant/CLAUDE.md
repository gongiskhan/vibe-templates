# AI Assistant Template - Developer Guide

## Overview

This is a generic AI assistant template that integrates with the Maestric API for agent execution. It's designed to be easily customizable for different use cases.

## Architecture

### Core Components

1. **Maestric Client** (`lib/maestric/client.ts`)
   - Default URL: `http://100.89.148.53:3232` (configurable via `MAESTRIC_API_URL`)
   - Handles execute requests and job polling
   - **Mock Mode**: Runs automatically when `MAESTRIC_API_TOKEN` is not set
   - JWT authentication required for real API calls

2. **File-Based Storage** (`lib/storage/`)
   - `sessions.ts` - Session CRUD operations (JSON files in `data/sessions/`)
   - `uploads.ts` - File upload handling (files in `data/uploads/<sessionId>/`)

3. **Chat Flow**
   - User sends message -> `/api/chat/send` -> Maestric execute
   - Frontend polls `/api/chat/poll` until job completes
   - Response saved to session and returned to client

4. **RAG System** (`app/api/rag/`)
   - Basic keyword matching implementation
   - Documents stored in `data/docs/`
   - Ready for LanceDB/vector search upgrade

5. **Vision** (`app/api/vision/`)
   - Attempts Maestric-based vision processing
   - Falls back to placeholder if unavailable

## Key Files

| File | Purpose |
|------|---------|
| `lib/maestric/client.ts` | Maestric API client (change URL here) |
| `lib/hooks/use-chat.ts` | Chat state management, greeting message |
| `lib/storage/sessions.ts` | Session file operations |
| `app/api/chat/send/route.ts` | Main message handling |
| `data/instructions/assistant.md` | System prompt |
| `data/flows/onboarding-flow.json` | Example flow structure |

## Message Flow

```
User Input
    ↓
useChat hook (lib/hooks/use-chat.ts)
    ↓
/api/chat/send (creates Maestric job)
    ↓
Poll /api/chat/poll (until job completes)
    ↓
Save to session (lib/storage/sessions.ts)
    ↓
Return response to UI
```

## Customization Points

### 1. Greeting Message
Edit `lib/hooks/use-chat.ts`:
```typescript
const GREETING_MESSAGE = 'Hi! How can I help you today?'
```

### 2. System Instructions
Edit `data/instructions/assistant.md` to change assistant behavior.

### 3. Maestric URL
Edit `lib/maestric/client.ts`:
```typescript
const MAESTRIC_API_URL = 'http://your-maestric-url:port'
```

### 4. Session Storage Location
Edit `lib/storage/sessions.ts`:
```typescript
const SESSIONS_DIR = path.join(process.cwd(), 'data', 'sessions')
```

## Common Tasks

### Adding a New Flow
1. Create JSON file in `data/flows/`
2. Follow structure from `onboarding-flow.json`
3. Reference in assistant instructions if needed

### Adding Knowledge Base Documents
1. Add `.md`, `.txt`, or `.json` files to `data/docs/`
2. Call `POST /api/rag/index` to re-index
3. Query with `POST /api/rag/query`

### Upgrading RAG to Vector Search
1. Implement embeddings in `lib/rag/embeddings.ts`
2. Create LanceDB store in `lib/rag/vector-store.ts`
3. Update `api/rag/query/route.ts` to use vector similarity

## Dependencies

Key packages:
- `next` 15.5.2 - Framework
- `@lancedb/lancedb` - Vector database (for RAG upgrade)
- `@xenova/transformers` - Local embeddings (for RAG upgrade)
- `framer-motion` - Animations
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Data Directories

| Directory | Purpose | Gitignored |
|-----------|---------|------------|
| `data/sessions/` | Session JSON files | Yes |
| `data/uploads/` | Uploaded files | Yes |
| `data/docs/` | RAG documents | No |
| `data/flows/` | Flow definitions | No |
| `data/instructions/` | System prompts | No |

## API Response Patterns

All API routes follow this pattern:
```typescript
// Success
return NextResponse.json({ success: true, data: ... })

// Error
return NextResponse.json({ error: 'message' }, { status: 4xx/5xx })
```

## Notes

- **No .env file required for development** - runs in mock mode automatically
- For production, set `MAESTRIC_API_TOKEN` environment variable
- Sessions persist as JSON files, not database
- Vision processing deferred to Maestric (stub returns placeholder if unavailable)
- RAG uses keyword matching (vector search can be added later)

## Mock Mode

When `MAESTRIC_API_TOKEN` is not set, the assistant runs in mock mode:
- Responses are simulated based on simple pattern matching
- No actual AI processing occurs
- Useful for UI development and testing
- Messages indicate mock mode status to users
