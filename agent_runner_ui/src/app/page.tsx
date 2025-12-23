'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Moon, Sun, Loader2, AlertCircle, StickyNote } from 'lucide-react'
import { useBrand } from '@/brand'
import { useTranslation } from '@/i18n'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { createRun, streamRunOutput, USE_MOCK } from '@/lib/api-client'
import type { Agent, UploadedFile, Run, StreamEvent } from '@/lib/types'
import {
  AgentPicker,
  IntegrationsPanel,
  FileUpload,
  LinksInput,
  StreamingOutput,
  RunHistory,
} from '@/components/agent'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AgentRunnerPage() {
  const { brand, theme, setTheme, resolvedTheme } = useBrand()
  const { t } = useTranslation()

  // Agent state
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  // Input state
  const [instructions, setInstructions] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  // Run state
  const [currentRun, setCurrentRun] = useState<Run | null>(null)
  const [events, setEvents] = useState<StreamEvent[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRun = useCallback(async () => {
    if (!selectedAgent || !instructions.trim()) return

    setError(null)
    setIsRunning(true)
    setEvents([])

    try {
      const response = await createRun({
        agent_id: selectedAgent.id,
        instructions: instructions.trim(),
        inputs: {
          files: files.map((f) => ({ file_id: f.file_id, name: f.name })),
          links: links.length > 0 ? links : undefined,
          notes: notes.trim() || undefined,
        },
        integrations: selectedIntegrations.length > 0 ? selectedIntegrations : undefined,
        mode: 'run',
      })

      setCurrentRun({
        run_id: response.run_id,
        agent_id: selectedAgent.id,
        status: 'running',
        started_at: new Date().toISOString(),
        instructions: instructions.trim(),
        inputs: {
          files: files.map((f) => ({ file_id: f.file_id, name: f.name })),
          links,
          notes,
        },
      })

      // Start streaming
      streamRunOutput(
        response.run_id,
        (event) => {
          setEvents((prev) => [...prev, event])

          // Update run status based on events
          if (event.type === 'complete') {
            setCurrentRun((prev) =>
              prev
                ? {
                    ...prev,
                    status: 'completed',
                    finished_at: new Date().toISOString(),
                    result_summary: event.data.result?.summary,
                    artifacts: event.data.result?.artifacts,
                  }
                : null
            )
          } else if (event.type === 'error') {
            setCurrentRun((prev) =>
              prev
                ? {
                    ...prev,
                    status: 'failed',
                    finished_at: new Date().toISOString(),
                    error: event.data.error,
                  }
                : null
            )
          } else if (event.type === 'progress') {
            setCurrentRun((prev) =>
              prev ? { ...prev, progress: event.data.progress } : null
            )
          }
        },
        (err) => {
          setError(err.message)
          setIsRunning(false)
        },
        () => {
          setIsRunning(false)
        }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t('run.failedToStart'))
      setIsRunning(false)
    }
  }, [selectedAgent, instructions, files, links, notes, selectedIntegrations, t])

  const handleSelectHistoricalRun = useCallback((run: Run) => {
    setCurrentRun(run)
    setEvents([])
    if (run.instructions) {
      setInstructions(run.instructions)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[hsl(var(--brand-bg))]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-bg))]/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--brand-primary))]">
              <Play className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">{brand.appName}</h1>
              <p className="text-xs text-[hsl(var(--brand-fg-muted))]">
                {t('header.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {USE_MOCK && (
              <Badge variant="secondary" className="text-xs">
                {t('common.mockMode')}
              </Badge>
            )}
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Left column - Configuration */}
          <div className="space-y-6">
            {/* Agent picker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('agent.selectAgent')}</CardTitle>
                  <CardDescription>
                    {t('agent.selectAgentDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AgentPicker
                    selectedAgent={selectedAgent}
                    onSelect={setSelectedAgent}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('instructions.title')}</CardTitle>
                  <CardDescription>
                    {t('instructions.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={t('instructions.placeholder')}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="mt-2 text-xs text-[hsl(var(--brand-fg-muted))]">
                    {t('instructions.helper')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Inputs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('inputs.title')}</CardTitle>
                  <CardDescription>
                    {t('inputs.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload files={files} onFilesChange={setFiles} />

                  <Separator />

                  <LinksInput links={links} onLinksChange={setLinks} />

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-4 w-4 text-[hsl(var(--brand-fg-muted))]" />
                      <Label className="text-sm font-medium">{t('inputs.notes')}</Label>
                    </div>
                    <Textarea
                      placeholder={t('inputs.notesPlaceholder')}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Integrations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('integrations.title')}</CardTitle>
                  <CardDescription>
                    {t('integrations.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IntegrationsPanel
                    selectedIntegrations={selectedIntegrations}
                    onSelectionChange={setSelectedIntegrations}
                    allowedIntegrations={selectedAgent?.allowed_integrations}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Run button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-[hsl(var(--brand-error))]/30 bg-[hsl(var(--brand-error))]/10 p-4 text-sm text-[hsl(var(--brand-error))]">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                size="lg"
                className="w-full"
                onClick={handleRun}
                disabled={!selectedAgent || !instructions.trim() || isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('run.running')}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    {t('run.runAgent')}
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Right column - Output and History */}
          <div className="space-y-6">
            {/* Streaming output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('output.title')}</CardTitle>
                  <CardDescription>
                    {t('output.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StreamingOutput
                    run={currentRun}
                    events={events}
                    isStreaming={isRunning}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Run history */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('history.title')}</CardTitle>
                  <CardDescription>{t('history.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <RunHistory
                    agent={selectedAgent}
                    onSelectRun={handleSelectHistoricalRun}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
