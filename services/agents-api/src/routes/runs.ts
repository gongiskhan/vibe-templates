import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import type { CreateRunRequest, Run, StreamEvent } from '../types/index.js'
import { RunStore } from '../services/store.js'
import { MockRunner } from '../services/mock-runner.js'

const router = Router()
const store = new RunStore()
const runner = new MockRunner()

// Active SSE connections
const sseConnections: Map<string, Response[]> = new Map()

/**
 * POST /runs
 * Create a new run
 */
router.post('/', async (req: Request, res: Response) => {
  const body = req.body as CreateRunRequest

  // Validate request
  if (!body.agent_id || !body.instructions) {
    return res.status(400).json({
      error: 'Missing required fields: agent_id and instructions'
    })
  }

  const run: Run = {
    run_id: uuidv4(),
    agent_id: body.agent_id,
    status: 'pending',
    mode: body.mode || 'run',
    instructions: body.instructions,
    inputs: body.inputs || {},
    integrations: body.integrations || [],
    started_at: new Date().toISOString()
  }

  await store.saveRun(run)

  // Start the run asynchronously
  run.status = 'running'
  await store.saveRun(run)

  runner.startRun(run, async (event: StreamEvent) => {
    store.appendEvent(run.run_id, event)

    // Update run status based on events
    if (event.type === 'complete') {
      await store.updateRun(run.run_id, {
        status: 'completed',
        finished_at: new Date().toISOString(),
        result: event.data.result as Run['result']
      })
    } else if (event.type === 'error') {
      await store.updateRun(run.run_id, {
        status: 'failed',
        finished_at: new Date().toISOString(),
        error: event.data.error as string
      })
    } else if (event.type === 'progress') {
      await store.updateRun(run.run_id, {
        progress: event.data.progress as number
      })
    }

    // Send to SSE connections
    const connections = sseConnections.get(run.run_id)
    if (connections) {
      connections.forEach(conn => {
        conn.write(`data: ${JSON.stringify(event)}\n\n`)
        if (event.type === 'complete' || event.type === 'error') {
          conn.end()
        }
      })
    }
  })

  res.status(201).json({
    run_id: run.run_id,
    status: run.status
  })
})

/**
 * GET /runs/:run_id
 * Get run status and metadata
 */
router.get('/:run_id', async (req: Request, res: Response) => {
  const run = await store.getRun(req.params.run_id)

  if (!run) {
    return res.status(404).json({ error: 'Run not found' })
  }

  res.json(run)
})

/**
 * GET /runs/:run_id/stream
 * Stream run output via SSE
 */
router.get('/:run_id/stream', async (req: Request, res: Response) => {
  const run = await store.getRun(req.params.run_id)

  if (!run) {
    return res.status(404).json({ error: 'Run not found' })
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  // Send existing events first
  const existingEvents = store.getEvents(run.run_id)
  for (const event of existingEvents) {
    res.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  // If run is already complete, end the stream
  if (run.status === 'completed' || run.status === 'failed') {
    res.end()
    return
  }

  // Register this connection for future events
  if (!sseConnections.has(run.run_id)) {
    sseConnections.set(run.run_id, [])
  }
  sseConnections.get(run.run_id)!.push(res)

  // Cleanup on close
  req.on('close', () => {
    const connections = sseConnections.get(run.run_id)
    if (connections) {
      const index = connections.indexOf(res)
      if (index > -1) {
        connections.splice(index, 1)
      }
    }
  })
})

/**
 * DELETE /runs/:run_id
 * Cancel a running run
 */
router.delete('/:run_id', async (req: Request, res: Response) => {
  const run = await store.getRun(req.params.run_id)

  if (!run) {
    return res.status(404).json({ error: 'Run not found' })
  }

  if (run.status !== 'running') {
    return res.status(400).json({ error: 'Run is not running' })
  }

  await runner.cancelRun(run.run_id)
  await store.updateRun(run.run_id, {
    status: 'failed',
    finished_at: new Date().toISOString(),
    error: 'Cancelled by user'
  })

  res.json({ status: 'cancelled' })
})

export default router
