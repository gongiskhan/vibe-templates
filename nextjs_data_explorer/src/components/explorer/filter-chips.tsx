"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Filter, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"
import type { QueryFilter, QueryBuilderField } from "./query-builder"

interface FilterChipsProps {
  filters: QueryFilter[]
  fields: QueryBuilderField[]
  onRemoveFilter: (id: string) => void
  onClearAll: () => void
  className?: string
}

const operatorLabels: Record<string, string> = {
  contains: "contém",
  equals: "=",
  not_equals: "≠",
  starts_with: "começa com",
  ends_with: "termina com",
  not_contains: "não contém",
  greater_than: ">",
  less_than: "<",
  between: "entre",
  before: "antes de",
  after: "depois de",
  last_days: "últimos dias",
  is_true: "= sim",
  is_false: "= não",
}

export function FilterChips({
  filters,
  fields,
  onRemoveFilter,
  onClearAll,
  className,
}: FilterChipsProps) {
  const { locale } = useBrand()

  if (filters.length === 0) return null

  const getFieldLabel = (fieldId: string) => {
    return fields.find((f) => f.id === fieldId)?.label || fieldId
  }

  const getOperatorLabel = (operator: string) => {
    return operatorLabels[operator] || operator
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/50 border",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>{t(locale, "explorer.activeFilters")}:</span>
      </div>

      <AnimatePresence mode="popLayout">
        {filters.map((filter) => (
          <motion.div
            key={filter.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
          >
            <Badge
              variant="secondary"
              className="gap-1 pr-1 font-normal cursor-default"
            >
              <span className="font-medium">{getFieldLabel(filter.field)}</span>
              <span className="text-muted-foreground">
                {getOperatorLabel(filter.operator)}
              </span>
              <span className="text-primary">&quot;{filter.value}&quot;</span>
              <button
                onClick={() => onRemoveFilter(filter.id)}
                className="ml-1 hover:bg-muted rounded p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <XCircle className="mr-1 h-3 w-3" />
        {t(locale, "explorer.clearAll")}
      </Button>
    </motion.div>
  )
}
