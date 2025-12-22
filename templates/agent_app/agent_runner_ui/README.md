# Agent Runner UI Template

A modern, production-ready UI template for running AI agents on demand with real-time streaming output. Designed to integrate with the Maestric platform API.

## Features

- **Agent Selection**: Browse and select from available agents
- **Integrations Panel**: Enable/disable integrations for agent runs
- **File Upload**: Drag-and-drop file uploads with progress
- **Links Input**: Add multiple URLs for agent reference
- **Streaming Output**: Real-time SSE streaming of agent output
- **Run History**: View and replay previous runs
- **Dark Mode**: System-aware with manual override
- **Mock Mode**: Works standalone with mock data for development

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_MAESTRIC_API_BASE_URL` | Maestric platform API base URL | No (uses mock data if not set) |
| `NEXT_PUBLIC_MAESTRIC_API_KEY` | API key for development | No |

Create a `.env.local` file:

```bash
NEXT_PUBLIC_MAESTRIC_API_BASE_URL=https://api.maestric.io
NEXT_PUBLIC_MAESTRIC_API_KEY=your-dev-api-key
```

### Mock Mode

When `MAESTRIC_API_BASE_URL` is not set, the template runs in mock mode with simulated data and streaming. This is useful for:

- Local development without API access
- Demos and presentations
- Testing UI components

## API Integration

This template expects the following Maestric platform API endpoints:

### List Agents
```
GET /api/agents
Response: [{ id, name, description, version, tags, input_schema, allowed_integrations }]
```

### List Active Integrations
```
GET /api/integrations/active
Response: [{ id, name, description, status, capabilities }]
```

### Upload File
```
POST /api/files
Content-Type: multipart/form-data
Response: { file_id, name, size, content_type }
```

### Create Run
```
POST /api/agents/runs
Body: {
  agent_id: string,
  instructions: string,
  inputs: { files?, links?, notes? },
  integrations?: string[],
  mode?: "run" | "dry_run"
}
Response: { run_id, status }
```

### Stream Run Output (SSE)
```
GET /api/agents/runs/:run_id/stream
Events: log, output, progress, error, complete
```

### List Runs
```
GET /api/agents/runs?agent_id=...
Response: [{ run_id, agent_id, status, started_at, finished_at, ... }]
```

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles + brand tokens import
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Main agent runner page
├── brand/
│   ├── tokens.css        # CSS design tokens
│   ├── brand.config.ts   # Brand metadata
│   └── brand-provider.tsx # Theme context
├── components/
│   ├── ui/               # Base shadcn/ui components
│   └── agent/            # Agent-specific components
│       ├── agent-picker.tsx
│       ├── integrations-panel.tsx
│       ├── file-upload.tsx
│       ├── links-input.tsx
│       ├── streaming-output.tsx
│       └── run-history.tsx
├── hooks/                # Custom React hooks
└── lib/
    ├── utils.ts          # Utility functions
    ├── types.ts          # TypeScript types
    ├── api-client.ts     # API client with mock fallback
    └── mock-data.ts      # Mock data for development
```

## Branding

Customize the look and feel by editing:

1. **Design Tokens** (`src/brand/tokens.css`):
   ```css
   @theme {
     --brand-primary: 262 83% 58%;  /* Purple */
     --brand-accent: 222 47% 51%;   /* Blue */
     /* ... */
   }
   ```

2. **Brand Config** (`src/brand/brand.config.ts`):
   ```typescript
   export const brandConfig = {
     name: "Your Company",
     appName: "Your Agent Runner",
     // ...
   }
   ```

3. **Logos** (`public/brand/`):
   - `logo-full.svg` (240x40)
   - `logo-icon.svg` (32x32)
   - `logo-full-dark.svg`
   - `logo-icon-dark.svg`

## Embedding in Maestric

When embedded in the Maestric platform:

1. Cookie/session auth is used automatically (no API key needed)
2. Set `NEXT_PUBLIC_MAESTRIC_API_BASE_URL` to the platform API
3. The template inherits user context and org scoping

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons

## License

MIT License
