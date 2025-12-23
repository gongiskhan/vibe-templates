'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, FileText, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { StreamEvent, Run, Artifact } from '@/lib/types'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StreamingOutputProps {
  run: Run | null
  events: StreamEvent[]
  isStreaming: boolean
}

export function StreamingOutput({ run, events, isStreaming }: StreamingOutputProps) {
  const [activeTab, setActiveTab] = useState('output')
  const outputRef = useRef<HTMLDivElement>(null)
  const logsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight
    }
  }, [events])

  const outputContent = events
    .filter((e) => e.type === 'output')
    .map((e) => e.data.output || '')
    .join('')

  const logEvents = events.filter((e) => e.type === 'log' || e.type === 'progress')

  const latestProgress =
    events
      .filter((e) => e.type === 'progress')
      .pop()?.data.progress || run?.progress || 0

  const completeEvent = events.find((e) => e.type === 'complete')
  const errorEvent = events.find((e) => e.type === 'error')

  const artifacts: Artifact[] = completeEvent?.data.result?.artifacts || run?.artifacts || []

  const getStatusIcon = () => {
    if (errorEvent || run?.status === 'failed') {
      return <XCircle className="h-5 w-5 text-[hsl(var(--brand-error))]" />
    }
    if (completeEvent || run?.status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-[hsl(var(--brand-success))]" />
    }
    if (isStreaming || run?.status === 'running') {
      return <Loader2 className="h-5 w-5 animate-spin text-[hsl(var(--brand-primary))]" />
    }
    return <Clock className="h-5 w-5 text-[hsl(var(--brand-fg-muted))]" />
  }

  const getStatusText = () => {
    if (errorEvent || run?.status === 'failed') return 'Failed'
    if (completeEvent || run?.status === 'completed') return 'Completed'
    if (isStreaming || run?.status === 'running') return 'Running'
    if (run?.status === 'pending') return 'Pending'
    return 'Ready'
  }

  if (!run && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[hsl(var(--brand-border))] p-12 text-center">
        <Terminal className="h-12 w-12 text-[hsl(var(--brand-fg-muted))]" />
        <h3 className="mt-4 text-lg font-medium">No output yet</h3>
        <p className="mt-1 text-sm text-[hsl(var(--brand-fg-muted))]">
          Configure your agent and click Run to see output here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{getStatusText()}</span>
              {run && (
                <Badge variant="secondary" className="text-xs">
                  {run.run_id.slice(0, 12)}
                </Badge>
              )}
            </div>
            {run?.started_at && (
              <div className="text-xs text-[hsl(var(--brand-fg-muted))]">
                Started {formatDate(run.started_at)}
              </div>
            )}
          </div>
        </div>
        {(isStreaming || run?.status === 'running') && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[hsl(var(--brand-fg-muted))]">
              {latestProgress}%
            </span>
            <Progress value={latestProgress} className="w-32" />
          </div>
        )}
      </div>

      {/* Error message */}
      {(errorEvent || run?.error) && (
        <div className="rounded-lg border border-[hsl(var(--brand-error))]/30 bg-[hsl(var(--brand-error))]/10 p-4">
          <p className="text-sm text-[hsl(var(--brand-error))]">
            {errorEvent?.data.error || run?.error}
          </p>
        </div>
      )}

      {/* Tabs for output views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="output">
            <FileText className="mr-2 h-4 w-4" />
            Output
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Terminal className="mr-2 h-4 w-4" />
            Logs ({logEvents.length})
          </TabsTrigger>
          <TabsTrigger value="artifacts">
            Artifacts ({artifacts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="output" className="mt-4">
          <ScrollArea className="h-96 rounded-lg border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-bg-secondary))]">
            <div ref={outputRef} className="p-4 font-mono text-sm whitespace-pre-wrap">
              {outputContent || (
                <span className="text-[hsl(var(--brand-fg-muted))]">
                  Waiting for output...
                </span>
              )}
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-[hsl(var(--brand-primary))] ml-1"
                />
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <ScrollArea className="h-96 rounded-lg border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-bg-secondary))]">
            <div ref={logsRef} className="p-4 space-y-2">
              <AnimatePresence mode="popLayout">
                {logEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="shrink-0 text-xs text-[hsl(var(--brand-fg-muted))] font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={cn(
                        event.type === 'progress'
                          ? 'text-[hsl(var(--brand-primary))]'
                          : 'text-[hsl(var(--brand-fg))]'
                      )}
                    >
                      {event.data.message}
                    </span>
                    {event.type === 'progress' && (
                      <Badge variant="secondary" className="text-xs">
                        {event.data.progress}%
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {logEvents.length === 0 && (
                <span className="text-[hsl(var(--brand-fg-muted))]">
                  No logs yet...
                </span>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="artifacts" className="mt-4">
          <div className="rounded-lg border border-[hsl(var(--brand-border))]">
            {artifacts.length === 0 ? (
              <div className="p-8 text-center text-sm text-[hsl(var(--brand-fg-muted))]">
                No artifacts generated yet
              </div>
            ) : (
              <div className="divide-y divide-[hsl(var(--brand-border))]">
                {artifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    className="flex items-center gap-3 p-4 hover:bg-[hsl(var(--brand-bg-secondary))] transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--brand-bg-secondary))]">
                      <FileText className="h-5 w-5 text-[hsl(var(--brand-fg-muted))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{artifact.name}</div>
                      <div className="text-sm text-[hsl(var(--brand-fg-muted))]">
                        {artifact.type} - {(artifact.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    {artifact.url && (
                      <a
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[hsl(var(--brand-primary))] hover:underline"
                      >
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Result summary */}
      {(completeEvent?.data.result?.summary || run?.result_summary) && (
        <div className="rounded-lg border border-[hsl(var(--brand-success))]/30 bg-[hsl(var(--brand-success))]/10 p-4">
          <h4 className="font-medium text-[hsl(var(--brand-success))]">Result Summary</h4>
          <p className="mt-1 text-sm">
            {completeEvent?.data.result?.summary || run?.result_summary}
          </p>
        </div>
      )}
    </div>
  )
}
