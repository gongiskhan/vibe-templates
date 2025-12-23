'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { cn, formatDate, formatDuration } from '@/lib/utils'
import { listRuns } from '@/lib/api-client'
import type { Run, Agent } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

interface RunHistoryProps {
  agent: Agent | null
  onSelectRun?: (run: Run) => void
}

export function RunHistory({ agent, onSelectRun }: RunHistoryProps) {
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)

  useEffect(() => {
    if (agent) {
      loadRuns()
    }
  }, [agent?.id])

  async function loadRuns() {
    if (!agent) return

    try {
      setLoading(true)
      const data = await listRuns(agent.id)
      setRuns(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load run history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Run['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-[hsl(var(--brand-success))]" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-[hsl(var(--brand-error))]" />
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--brand-primary))]" />
      case 'pending':
        return <Clock className="h-4 w-4 text-[hsl(var(--brand-warning))]" />
      default:
        return <Clock className="h-4 w-4 text-[hsl(var(--brand-fg-muted))]" />
    }
  }

  const getStatusBadge = (status: Run['status']) => {
    const variants: Record<Run['status'], 'success' | 'destructive' | 'default' | 'warning' | 'secondary'> = {
      completed: 'success',
      failed: 'destructive',
      running: 'default',
      pending: 'warning',
      cancelled: 'secondary',
    }
    return variants[status] || 'secondary'
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[hsl(var(--brand-border))] p-8 text-center">
        <History className="h-8 w-8 text-[hsl(var(--brand-fg-muted))]" />
        <p className="mt-2 text-sm text-[hsl(var(--brand-fg-muted))]">
          Select an agent to view run history
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-[hsl(var(--brand-border))] p-4"
          >
            <div className="h-8 w-8 animate-pulse rounded-full bg-[hsl(var(--brand-bg-secondary))]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-[hsl(var(--brand-bg-secondary))]" />
              <div className="h-3 w-40 animate-pulse rounded bg-[hsl(var(--brand-bg-secondary))]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[hsl(var(--brand-error))]/30 bg-[hsl(var(--brand-error))]/10 p-4 text-center">
        <p className="text-sm text-[hsl(var(--brand-error))]">{error}</p>
        <Button variant="outline" size="sm" onClick={loadRuns} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[hsl(var(--brand-border))] p-8 text-center">
        <History className="h-8 w-8 text-[hsl(var(--brand-fg-muted))]" />
        <p className="mt-2 text-sm text-[hsl(var(--brand-fg-muted))]">
          No runs yet for this agent
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[hsl(var(--brand-fg-muted))]" />
          <span className="text-sm font-medium">Run History</span>
          <Badge variant="secondary" className="text-xs">
            {runs.length}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={loadRuns}>
          Refresh
        </Button>
      </div>

      <ScrollArea className="h-72">
        <AnimatePresence mode="popLayout">
          {runs.map((run, index) => {
            const duration =
              run.finished_at && run.started_at
                ? new Date(run.finished_at).getTime() - new Date(run.started_at).getTime()
                : null

            return (
              <motion.button
                key={run.run_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedRunId(run.run_id)
                  onSelectRun?.(run)
                }}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg border p-4 text-left transition-colors mb-2',
                  selectedRunId === run.run_id
                    ? 'border-[hsl(var(--brand-primary))] bg-[hsl(var(--brand-primary))]/5'
                    : 'border-[hsl(var(--brand-border))] hover:bg-[hsl(var(--brand-bg-secondary))]'
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--brand-bg-secondary))]">
                  {getStatusIcon(run.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadge(run.status)} className="text-xs capitalize">
                      {run.status}
                    </Badge>
                    {duration && (
                      <span className="text-xs text-[hsl(var(--brand-fg-muted))]">
                        {formatDuration(duration)}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-[hsl(var(--brand-fg-muted))] truncate">
                    {run.instructions || 'No instructions'}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[hsl(var(--brand-fg-muted))]">
                    <span>{formatDate(run.started_at)}</span>
                    {run.artifacts && run.artifacts.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {run.artifacts.length} artifact{run.artifacts.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[hsl(var(--brand-fg-muted))]" />
              </motion.button>
            )
          })}
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
}
