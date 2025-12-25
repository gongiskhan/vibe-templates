# AI Assistant Template

A generic AI assistant template built with Next.js 15, designed for easy customization and deployment. This template provides a complete chat interface with document upload, RAG (Retrieval-Augmented Generation), and integration with the Maestric API for agent execution.

## Features

- **Chat Interface**: Clean, responsive chat UI with markdown support
- **Document Upload**: Support for PDF, Word, images, and text files
- **RAG System**: Knowledge base with document indexing and retrieval
- **Session Management**: File-based session storage (no database required)
- **Maestric Integration**: Uses Maestric API for AI agent execution
- **Dark/Light Theme**: Built-in theme support
- **Example Flows**: Pre-built onboarding flow template

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-assistant/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── chat/                 # Chat API routes
│   │   │   ├── send/             # Send messages to Maestric
│   │   │   ├── poll/             # Poll job status
│   │   │   ├── session/          # Session management
│   │   │   ├── history/          # Chat history
│   │   │   └── upload/           # Document uploads
│   │   ├── rag/                  # RAG API routes
│   │   │   ├── query/            # Query knowledge base
│   │   │   └── index/            # Index documents
│   │   └── vision/               # Vision processing
│   │       └── process/          # Process uploaded images
│   ├── chat/[sessionId]/         # Chat page
│   └── page.tsx                  # Home (redirects to chat)
├── components/
│   ├── chat/                     # Chat UI components
│   ├── providers/                # Theme provider
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── hooks/                    # React hooks
│   ├── maestric/                 # Maestric API client
│   ├── storage/                  # File-based storage
│   └── utils/                    # Utility functions
├── data/
│   ├── flows/                    # Conversation flows
│   ├── instructions/             # Assistant instructions
│   ├── docs/                     # Knowledge base documents
│   ├── sessions/                 # Session storage (gitignored)
│   └── uploads/                  # Uploaded files (gitignored)
└── README.md
```

## Configuration

### Environment Variables (Optional)

The template works out of the box in **mock mode** without any configuration. For production use with a real Maestric API, create a `.env.local` file:

```bash
# Optional: Maestric API configuration
MAESTRIC_API_URL=http://your-maestric-url:port  # Default: http://100.89.148.53:3232
MAESTRIC_API_TOKEN=your-jwt-token               # Required for real API calls
```

**Mock Mode**: When `MAESTRIC_API_TOKEN` is not set, the assistant runs in mock mode with simulated responses. This is useful for development and testing.

### Maestric API

The default Maestric API URL is `http://100.89.148.53:3232`. To change it:
1. Set the `MAESTRIC_API_URL` environment variable, or
2. Edit `lib/maestric/client.ts` directly

### Assistant Instructions

Customize the assistant's behavior by editing `data/instructions/assistant.md`. This file contains the system prompt that guides the assistant's responses.

### Flows

Create custom conversation flows by adding JSON files to `data/flows/`. See `onboarding-flow.json` for an example structure.

### Knowledge Base

Add documents to `data/docs/` for the RAG system. Supported formats:
- Markdown (.md)
- Text files (.txt)
- JSON (.json)

After adding documents, re-index by calling `POST /api/rag/index`.

## API Endpoints

### Chat

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/send` | POST | Send a message to the assistant |
| `/api/chat/poll` | GET | Poll for job completion |
| `/api/chat/session` | GET/POST | Get or create a session |
| `/api/chat/history` | GET | Get chat history |
| `/api/chat/upload` | POST | Upload a document |

### RAG

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rag/query` | POST | Query the knowledge base |
| `/api/rag/index` | GET/POST | Get index status or re-index |

### Vision

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vision/process` | POST | Process an uploaded document |

## Customization

### Changing the Greeting

Edit `lib/hooks/use-chat.ts` and modify the `GREETING_MESSAGE` constant:

```typescript
const GREETING_MESSAGE = 'Hi! How can I help you today?'
```

### Adding UI Components

This template uses [shadcn/ui](https://ui.shadcn.com/) components. Add new components to `components/ui/`.

### Styling

Edit `app/globals.css` to customize the theme. The template uses Tailwind CSS v4.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## File Storage

Sessions and uploads are stored in the `data/` directory:

- `data/sessions/*.json` - Chat session data
- `data/uploads/<sessionId>/*` - Uploaded files

These directories are gitignored by default.

## Extending the Template

### Adding New API Routes

Create new route files in `app/api/`. Follow the existing patterns for error handling and response formatting.

### Implementing Vector Search

The current RAG implementation uses basic keyword matching. For production:

1. Uncomment LanceDB dependencies in `package.json`
2. Implement embeddings using `@xenova/transformers`
3. Update `api/rag/query/route.ts` to use vector similarity search

### Adding Authentication

This template has no built-in authentication. To add auth:

1. Install an auth library (e.g., NextAuth.js)
2. Create auth middleware
3. Protect API routes as needed

## License

MIT
