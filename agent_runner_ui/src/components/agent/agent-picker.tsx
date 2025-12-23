'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ChevronDown, Search, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { listAgents } from '@/lib/api-client'
import type { Agent } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AgentPickerProps {
  selectedAgent: Agent | null
  onSelect: (agent: Agent) => void
}

export function AgentPicker({ selectedAgent, onSelect }: AgentPickerProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadAgents()
  }, [])

  async function loadAgents() {
    try {
      setLoading(true)
      const data = await listAgents()
      setAgents(data)
      if (data.length > 0 && !selectedAgent) {
        onSelect(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase()) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="rounded-lg border border-[hsl(var(--brand-border))] p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-[hsl(var(--brand-bg-secondary))]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-[hsl(var(--brand-bg-secondary))]" />
            <div className="h-3 w-48 animate-pulse rounded bg-[hsl(var(--brand-bg-secondary))]" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[hsl(var(--brand-error))]/30 bg-[hsl(var(--brand-error))]/10 p-4 text-sm text-[hsl(var(--brand-error))]">
        {error}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full rounded-lg border border-[hsl(var(--brand-border))] p-4 text-left transition-colors hover:bg-[hsl(var(--brand-bg-secondary))]',
          isOpen && 'ring-2 ring-[hsl(var(--brand-primary))]'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--brand-primary))]/10 text-[hsl(var(--brand-primary))]">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">
              {selectedAgent?.name || 'Select an agent'}
            </div>
            <div className="truncate text-sm text-[hsl(var(--brand-fg-muted))]">
              {selectedAgent?.description || 'Choose an agent to run'}
            </div>
          </div>
          <ChevronDown
            className={cn(
              'h-5 w-5 text-[hsl(var(--brand-fg-muted))] transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-bg))] shadow-lg"
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--brand-fg-muted))]" />
                <Input
                  placeholder="Search agents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
            </div>
            <ScrollArea className="max-h-80">
              <div className="p-2 pt-0 space-y-1">
                {filteredAgents.length === 0 ? (
                  <div className="py-6 text-center text-sm text-[hsl(var(--brand-fg-muted))]">
                    No agents found
                  </div>
                ) : (
                  filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        onSelect(agent)
                        setIsOpen(false)
                        setSearch('')
                      }}
                      className={cn(
                        'w-full rounded-md p-3 text-left transition-colors hover:bg-[hsl(var(--brand-bg-secondary))]',
                        selectedAgent?.id === agent.id &&
                          'bg-[hsl(var(--brand-primary))]/10'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--brand-primary))]/10 text-[hsl(var(--brand-primary))]">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{agent.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              v{agent.version}
                            </Badge>
                          </div>
                          <div className="mt-0.5 text-sm text-[hsl(var(--brand-fg-muted))] line-clamp-2">
                            {agent.description}
                          </div>
                          {agent.tags.length > 0 && (
                            <div className="mt-2 flex items-center gap-1 flex-wrap">
                              <Tag className="h-3 w-3 text-[hsl(var(--brand-fg-muted))]" />
                              {agent.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {agent.tags.length > 3 && (
                                <span className="text-xs text-[hsl(var(--brand-fg-muted))]">
                                  +{agent.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
