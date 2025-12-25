import { Router, Request, Response } from 'express'
import { mockAgents } from '../services/store.js'

const router = Router()

/**
 * GET /agents
 * List all available agents
 */
router.get('/', (req: Request, res: Response) => {
  res.json(mockAgents)
})

/**
 * GET /agents/:agent_id
 * Get agent details
 */
router.get('/:agent_id', (req: Request, res: Response) => {
  const agent = mockAgents.find(a => a.id === req.params.agent_id)

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' })
  }

  res.json(agent)
})

export default router
