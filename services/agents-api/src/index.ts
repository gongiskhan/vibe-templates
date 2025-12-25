import express from 'express'
import cors from 'cors'
import runsRouter from './routes/runs.js'
import agentsRouter from './routes/agents.js'
import integrationsRouter from './routes/integrations.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Simple API key auth for local dev
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key']

  // Skip auth for health check
  if (req.path === '/health') {
    return next()
  }

  // In development, allow requests without API key
  // In production, you would enforce this
  if (process.env.NODE_ENV === 'production' && apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' })
  }

  next()
})

// Routes
app.use('/runs', runsRouter)
app.use('/agents', agentsRouter)
app.use('/integrations', integrationsRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Agents API',
    version: '1.0.0',
    description: 'Run agents on demand',
    endpoints: {
      'GET /health': 'Health check',
      'GET /agents': 'List available agents',
      'GET /agents/:id': 'Get agent details',
      'GET /integrations': 'List configured integrations',
      'POST /runs': 'Create a new run',
      'GET /runs/:id': 'Get run status',
      'GET /runs/:id/stream': 'Stream run output (SSE)',
      'DELETE /runs/:id': 'Cancel a run'
    }
  })
})

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║           Agents API Server               ║
╠═══════════════════════════════════════════╣
║  Running on: http://localhost:${PORT}        ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(23)}║
╚═══════════════════════════════════════════╝
  `)
})

export default app
