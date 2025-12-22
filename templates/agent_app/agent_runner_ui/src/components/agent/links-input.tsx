'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, Plus, X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface LinksInputProps {
  links: string[]
  onLinksChange: (links: string[]) => void
  maxLinks?: number
}

export function LinksInput({ links, onLinksChange, maxLinks = 10 }: LinksInputProps) {
  const [newLink, setNewLink] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const addLink = () => {
    const trimmedLink = newLink.trim()

    if (!trimmedLink) return

    // Auto-add https if no protocol
    let finalLink = trimmedLink
    if (!/^https?:\/\//i.test(finalLink)) {
      finalLink = `https://${finalLink}`
    }

    if (!isValidUrl(finalLink)) {
      setError('Please enter a valid URL')
      return
    }

    if (links.includes(finalLink)) {
      setError('This link has already been added')
      return
    }

    if (links.length >= maxLinks) {
      setError(`Maximum ${maxLinks} links allowed`)
      return
    }

    onLinksChange([...links, finalLink])
    setNewLink('')
    setError(null)
  }

  const removeLink = (index: number) => {
    onLinksChange(links.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLink()
    }
  }

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Links</Label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--brand-fg-muted))]" />
          <Input
            placeholder="Enter a URL..."
            value={newLink}
            onChange={(e) => {
              setNewLink(e.target.value)
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              'pl-9',
              error && 'border-[hsl(var(--brand-error))] focus-visible:ring-[hsl(var(--brand-error))]'
            )}
            disabled={links.length >= maxLinks}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={addLink}
          disabled={!newLink.trim() || links.length >= maxLinks}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <p className="text-xs text-[hsl(var(--brand-error))]">{error}</p>
      )}

      <AnimatePresence mode="popLayout">
        {links.map((link, index) => (
          <motion.div
            key={link}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-md border border-[hsl(var(--brand-border))] p-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--brand-bg-secondary))]">
              <Link2 className="h-4 w-4 text-[hsl(var(--brand-fg-muted))]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">
                {getDomainFromUrl(link)}
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[hsl(var(--brand-primary))] hover:underline"
              >
                <span className="truncate">{link}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeLink(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {links.length === 0 && (
        <p className="text-xs text-[hsl(var(--brand-fg-muted))]">
          Add URLs for the agent to reference
        </p>
      )}
    </div>
  )
}
