import type { Run, StreamEvent } from '../types/index.js'

/**
 * Mock Agent Runner
 *
 * This service simulates agent execution. In a real implementation,
 * this would be replaced with actual LLM calls or agent runtime integration.
 */
export class MockRunner {
  private eventHandlers: Map<string, (event: StreamEvent) => void> = new Map()
  private activeRuns: Map<string, NodeJS.Timeout[]> = new Map()

  async startRun(run: Run, onEvent: (event: StreamEvent) => void): Promise<void> {
    this.eventHandlers.set(run.run_id, onEvent)
    this.activeRuns.set(run.run_id, [])

    const timeouts = this.activeRuns.get(run.run_id)!

    // Simulate agent steps
    const steps = [
      { delay: 100, message: 'Initializing agent...' },
      { delay: 500, message: 'Loading instructions...' },
      { delay: 1000, message: `Processing "${run.instructions.substring(0, 50)}..."` },
      { delay: 1500, message: 'Analyzing inputs...' },
      { delay: 2000, message: 'Executing task...' },
      { delay: 2500, message: 'Generating results...' },
    ]

    // Send progress events
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const timeout = setTimeout(() => {
        onEvent({
          type: 'log',
          timestamp: new Date().toISOString(),
          data: { message: step.message }
        })
        onEvent({
          type: 'progress',
          timestamp: new Date().toISOString(),
          data: { progress: Math.round(((i + 1) / steps.length) * 100) }
        })
      }, step.delay)
      timeouts.push(timeout)
    }

    // Send completion event
    const completionTimeout = setTimeout(() => {
      if (run.mode === 'dry_run') {
        onEvent({
          type: 'complete',
          timestamp: new Date().toISOString(),
          data: {
            result: {
              summary: 'Dry run completed successfully. No actual actions were performed.',
              artifacts: []
            }
          }
        })
      } else {
        onEvent({
          type: 'complete',
          timestamp: new Date().toISOString(),
          data: {
            result: {
              summary: `Agent completed task: "${run.instructions.substring(0, 100)}"`,
              artifacts: [
                {
                  id: 'artifact-1',
                  name: 'result.json',
                  type: 'application/json',
                  size: 1024
                },
                {
                  id: 'artifact-2',
                  name: 'summary.md',
                  type: 'text/markdown',
                  size: 512
                }
              ]
            }
          }
        })
      }
      this.cleanup(run.run_id)
    }, 3000)
    timeouts.push(completionTimeout)
  }

  async cancelRun(runId: string): Promise<void> {
    const handler = this.eventHandlers.get(runId)
    if (handler) {
      handler({
        type: 'error',
        timestamp: new Date().toISOString(),
        data: { error: 'Run cancelled by user' }
      })
    }
    this.cleanup(runId)
  }

  private cleanup(runId: string): void {
    const timeouts = this.activeRuns.get(runId)
    if (timeouts) {
      timeouts.forEach(t => clearTimeout(t))
      this.activeRuns.delete(runId)
    }
    this.eventHandlers.delete(runId)
  }
}
