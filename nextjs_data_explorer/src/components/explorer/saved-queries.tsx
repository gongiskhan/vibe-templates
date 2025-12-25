"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Clock,
  Star,
  StarOff,
  Play,
  Trash2,
  ChevronRight,
  BookMarked,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export interface SavedQuery {
  id: string
  name: string
  description?: string
  filters: unknown[]
  createdAt: string
  lastUsed?: string
  isFavorite: boolean
  resultCount?: number
}

interface SavedQueriesProps {
  queries: SavedQuery[]
  onRunQuery: (query: SavedQuery) => void
  onDeleteQuery: (id: string) => void
  onToggleFavorite: (id: string) => void
  className?: string
}

export function SavedQueries({
  queries,
  onRunQuery,
  onDeleteQuery,
  onToggleFavorite,
  className,
}: SavedQueriesProps) {
  const { locale } = useBrand()
  const [search, setSearch] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const filteredQueries = queries
    .filter((q) => {
      if (showFavoritesOnly && !q.isFavorite) return false
      if (search) {
        const searchLower = search.toLowerCase()
        return (
          q.name.toLowerCase().includes(searchLower) ||
          q.description?.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
    .sort((a, b) => {
      // Favorites first, then by last used
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
      return new Date(b.lastUsed || b.createdAt).getTime() -
        new Date(a.lastUsed || a.createdAt).getTime()
    })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
    })
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookMarked className="h-4 w-4" />
          {t(locale, "explorer.savedQueries")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search and filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(locale, "common.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showFavoritesOnly ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    showFavoritesOnly && "fill-current text-yellow-500"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t(locale, "explorer.favoritesOnly")}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Query list */}
        <ScrollArea className="h-[400px] -mx-3 px-3">
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredQueries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground text-sm"
                >
                  {t(locale, "explorer.noSavedQueries")}
                </motion.div>
              ) : (
                filteredQueries.map((query) => (
                  <motion.div
                    key={query.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    layout
                    className="group relative rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => onRunQuery(query)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm line-clamp-1">
                            {query.name}
                          </span>
                          {query.isFavorite && (
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          )}
                        </div>
                        {query.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {query.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(query.lastUsed || query.createdAt)}
                          </span>
                          {query.resultCount !== undefined && (
                            <Badge variant="outline" className="text-xs h-5">
                              {query.resultCount} {t(locale, "explorer.results")}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onToggleFavorite(query.id)}
                            >
                              {query.isFavorite ? (
                                <StarOff className="h-3.5 w-3.5" />
                              ) : (
                                <Star className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {query.isFavorite
                              ? t(locale, "explorer.removeFavorite")
                              : t(locale, "explorer.addFavorite")}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onRunQuery(query)}
                            >
                              <Play className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t(locale, "explorer.runQuery")}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => onDeleteQuery(query.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t(locale, "common.delete")}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
