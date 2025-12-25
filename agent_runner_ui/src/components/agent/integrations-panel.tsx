'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plug,
  Search,
  Database,
  FileText,
  Mail,
  MessageSquare,
  Globe,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { listIntegrations } from '@/lib/api-client'
import type { Integration } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Globe,
  github: Globe,
  slack: MessageSquare,
  'file-text': FileText,
  database: Database,
  mail: Mail,
  'message-square': MessageSquare,
}

interface IntegrationsPanelProps {
  selectedIntegrations: string[]
  onSelectionChange: (ids: string[]) => void
  allowedIntegrations?: string[]
}

export function IntegrationsPanel({
  selectedIntegrations,
  onSelectionChange,
  allowedIntegrations,
}: IntegrationsPanelProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadIntegrations()
  }, [])

  async function loadIntegrations() {
    try {
      setLoading(true)
      const data = await listIntegrations()
      setIntegrations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(search.toLowerCase()) ||
      integration.description.toLowerCase().includes(search.toLowerCase())

    const isAllowed =
      !allowedIntegrations || allowedIntegrations.includes(integration.id)

    return matchesSearch && isAllowed
  })

  const toggleIntegration = (id: string) => {
    if (selectedIntegrations.includes(id)) {
      onSelectionChange(selectedIntegrations.filter((i) => i !== id))
    } else {
      onSelectionChange([...selectedIntegrations, id])
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-[hsl(var(--brand-border))] p-3"
          >
            <div className="h-8 w-8 animate-pulse rounded-md bg-[hsl(var(--brand-bg-secondary))]" />
            <div className="flex-1 space-y-1">
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
      <div className="rounded-lg border border-[hsl(var(--brand-error))]/30 bg-[hsl(var(--brand-error))]/10 p-4 text-sm text-[hsl(var(--brand-error))]">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Plug className="h-4 w-4 text-[hsl(var(--brand-fg-muted))]" />
        <Label className="text-sm font-medium">Integrations</Label>
        {selectedIntegrations.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedIntegrations.length} selected
          </Badge>
        )}
      </div>

      {integrations.length > 4 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--brand-fg-muted))]" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      )}

      <ScrollArea className="max-h-48">
        <div className="space-y-2">
          {filteredIntegrations.length === 0 ? (
            <div className="py-4 text-center text-sm text-[hsl(var(--brand-fg-muted))]">
              No integrations available
            </div>
          ) : (
            filteredIntegrations.map((integration) => {
              const Icon = iconMap[integration.icon || 'plug'] || Plug
              const isSelected = selectedIntegrations.includes(integration.id)
              const isActive = integration.status === 'active'

              return (
                <motion.div
                  key={integration.id}
                  onClick={() => isActive && toggleIntegration(integration.id)}
                  onKeyDown={(e) => {
                    if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      toggleIntegration(integration.id)
                    }
                  }}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-disabled={!isActive}
                  whileTap={isActive ? { scale: 0.98 } : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                    isActive
                      ? 'hover:bg-[hsl(var(--brand-bg-secondary))] cursor-pointer'
                      : 'opacity-50 cursor-not-allowed',
                    isSelected
                      ? 'border-[hsl(var(--brand-primary))] bg-[hsl(var(--brand-primary))]/5'
                      : 'border-[hsl(var(--brand-border))]'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md',
                      isSelected
                        ? 'bg-[hsl(var(--brand-primary))] text-white'
                        : 'bg-[hsl(var(--brand-bg-secondary))] text-[hsl(var(--brand-fg-muted))]'
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{integration.name}</span>
                      {!isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-[hsl(var(--brand-fg-muted))] line-clamp-1">
                      {integration.description}
                    </div>
                  </div>
                  {isActive && (
                    <Switch
                      checked={isSelected}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
