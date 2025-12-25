import { Router, Request, Response } from 'express'
import { mockIntegrations } from '../services/store.js'

const router = Router()

/**
 * GET /integrations
 * List all configured integrations
 */
router.get('/', (req: Request, res: Response) => {
  res.json(mockIntegrations)
})

/**
 * GET /integrations/:integration_id
 * Get integration details
 */
router.get('/:integration_id', (req: Request, res: Response) => {
  const integration = mockIntegrations.find(i => i.id === req.params.integration_id)

  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' })
  }

  res.json(integration)
})

export default router
