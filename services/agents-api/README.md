# Agents API

A generic Node.js/TypeScript API service for running agents on demand.

## Overview

This service provides a REST API for:
- Listing available agents
- Listing configured integrations
- Creating and managing agent runs
- Streaming run output in real-time

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The server will start at http://localhost:3001
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Agents
```bash
# List all agents
GET /agents

# Get agent details
GET /agents/:agent_id
```

### Integrations
```bash
# List all integrations
GET /integrations

# Get integration details
GET /integrations/:integration_id
```

### Runs
```bash
# Create a new run
POST /runs
Content-Type: application/json

{
  "agent_id": "agent-research",
  "instructions": "Research AI trends",
  "inputs": {
    "files": [{"file_id": "...", "name": "..."}],
    "links": ["https://..."],
    "notes": "Additional context"
  },
  "integrations": ["web-search"],
  "mode": "run"  // or "dry_run"
}

# Get run status
GET /runs/:run_id

# Stream run output (SSE)
GET /runs/:run_id/stream

# Cancel a run
DELETE /runs/:run_id
```

## Example Usage

### Create and Monitor a Run

```bash
# Create a run
curl -X POST http://localhost:3001/runs \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent-research",
    "instructions": "Research the latest AI developments",
    "mode": "run"
  }'

# Response: {"run_id": "abc-123", "status": "running"}

# Stream output (keep connection open)
curl -N http://localhost:3001/runs/abc-123/stream

# Get final status
curl http://localhost:3001/runs/abc-123
```

### Using from JavaScript

```javascript
// Create a run
const response = await fetch('http://localhost:3001/runs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agent_id: 'agent-research',
    instructions: 'Research AI trends',
    mode: 'run'
  })
})
const { run_id } = await response.json()

// Stream output
const eventSource = new EventSource(`http://localhost:3001/runs/${run_id}/stream`)

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log(data.type, data.data)

  if (data.type === 'complete' || data.type === 'error') {
    eventSource.close()
  }
}
```

## Authentication

For local development, no authentication is required.

In production, set the `API_KEY` environment variable and include the header:
```bash
curl -H "X-API-Key: your-api-key" http://localhost:3001/agents
```

## Data Storage

Runs are stored as JSON files in `data/runs/`. Each run creates a file:
```
data/runs/{run_id}.json
```

## Extending

### Adding a Real Agent Runtime

Replace the `MockRunner` in `src/services/mock-runner.ts` with your actual agent implementation:

```typescript
import { Anthropic } from '@anthropic-ai/sdk'

export class RealRunner {
  private client = new Anthropic()

  async startRun(run: Run, onEvent: (event: StreamEvent) => void) {
    // Implement actual agent logic here
    const stream = await this.client.messages.stream({...})

    for await (const event of stream) {
      onEvent({
        type: 'log',
        timestamp: new Date().toISOString(),
        data: { message: event.content }
      })
    }
  }
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `API_KEY` | - | API key for production auth |
