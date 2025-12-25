/**
 * Demo script to test the Agents API
 *
 * Run with: npm run demo
 */

const API_BASE = 'http://localhost:3001'

async function demo() {
  console.log('\\n=== Agents API Demo ===\\n')

  // 1. List agents
  console.log('1. Listing available agents...')
  const agentsRes = await fetch(`${API_BASE}/agents`)
  const agents = await agentsRes.json()
  console.log(`   Found ${agents.length} agents:`)
  agents.forEach((a: { name: string; id: string }) => {
    console.log(`   - ${a.name} (${a.id})`)
  })

  // 2. List integrations
  console.log('\\n2. Listing integrations...')
  const integrationsRes = await fetch(`${API_BASE}/integrations`)
  const integrations = await integrationsRes.json()
  console.log(`   Found ${integrations.length} integrations:`)
  integrations.forEach((i: { name: string; status: string }) => {
    console.log(`   - ${i.name} [${i.status}]`)
  })

  // 3. Create a run
  console.log('\\n3. Creating a new run...')
  const createRes = await fetch(`${API_BASE}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: 'agent-research',
      instructions: 'Research the latest trends in artificial intelligence',
      inputs: {
        notes: 'Focus on LLMs and multimodal models'
      },
      integrations: ['web-search'],
      mode: 'run'
    })
  })
  const run = await createRes.json()
  console.log(`   Created run: ${run.run_id}`)

  // 4. Stream output
  console.log('\\n4. Streaming output...')
  const eventSource = new EventSource(`${API_BASE}/runs/${run.run_id}/stream`)

  await new Promise<void>((resolve) => {
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'log') {
        console.log(`   [LOG] ${data.data.message}`)
      } else if (data.type === 'progress') {
        console.log(`   [PROGRESS] ${data.data.progress}%`)
      } else if (data.type === 'complete') {
        console.log(`   [COMPLETE] ${data.data.result.summary}`)
        console.log(`   Artifacts: ${data.data.result.artifacts.length}`)
        eventSource.close()
        resolve()
      } else if (data.type === 'error') {
        console.log(`   [ERROR] ${data.data.error}`)
        eventSource.close()
        resolve()
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
      resolve()
    }
  })

  // 5. Get final run status
  console.log('\\n5. Final run status...')
  const statusRes = await fetch(`${API_BASE}/runs/${run.run_id}`)
  const finalRun = await statusRes.json()
  console.log(`   Status: ${finalRun.status}`)
  console.log(`   Started: ${finalRun.started_at}`)
  console.log(`   Finished: ${finalRun.finished_at}`)

  console.log('\\n=== Demo Complete ===\\n')
}

// Check if EventSource is available (Node 18+)
if (typeof EventSource === 'undefined') {
  console.log(`
Note: This demo requires Node.js 18+ for EventSource support.
Alternatively, you can use curl commands:

# List agents
curl http://localhost:3001/agents

# Create a run
curl -X POST http://localhost:3001/runs \\
  -H "Content-Type: application/json" \\
  -d '{"agent_id":"agent-research","instructions":"Research AI trends","mode":"run"}'

# Stream output (replace RUN_ID with actual ID)
curl -N http://localhost:3001/runs/RUN_ID/stream
`)
} else {
  demo().catch(console.error)
}
