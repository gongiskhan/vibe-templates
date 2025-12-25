"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Play, Save, RotateCcw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export interface QueryFilter {
  id: string
  field: string
  operator: string
  value: string
}

export interface QueryBuilderField {
  id: string
  label: string
  type: "string" | "number" | "date" | "boolean" | "select"
  options?: string[]
}

interface QueryBuilderProps {
  fields: QueryBuilderField[]
  filters: QueryFilter[]
  onFiltersChange: (filters: QueryFilter[]) => void
  onRun: () => void
  onSave?: () => void
  onReset: () => void
  isLoading?: boolean
  className?: string
}

const stringOperators = [
  { value: "contains", label: "contém" },
  { value: "equals", label: "igual a" },
  { value: "starts_with", label: "começa com" },
  { value: "ends_with", label: "termina com" },
  { value: "not_contains", label: "não contém" },
]

const numberOperators = [
  { value: "equals", label: "igual a" },
  { value: "not_equals", label: "diferente de" },
  { value: "greater_than", label: "maior que" },
  { value: "less_than", label: "menor que" },
  { value: "between", label: "entre" },
]

const dateOperators = [
  { value: "equals", label: "igual a" },
  { value: "before", label: "antes de" },
  { value: "after", label: "depois de" },
  { value: "between", label: "entre" },
  { value: "last_days", label: "últimos N dias" },
]

const booleanOperators = [
  { value: "is_true", label: "é verdadeiro" },
  { value: "is_false", label: "é falso" },
]

function getOperatorsForType(type: QueryBuilderField["type"]) {
  switch (type) {
    case "number":
      return numberOperators
    case "date":
      return dateOperators
    case "boolean":
      return booleanOperators
    default:
      return stringOperators
  }
}

export function QueryBuilder({
  fields,
  filters,
  onFiltersChange,
  onRun,
  onSave,
  onReset,
  isLoading = false,
  className,
}: QueryBuilderProps) {
  const { locale } = useBrand()
  const [isExpanded, setIsExpanded] = useState(true)

  const addFilter = () => {
    const newFilter: QueryFilter = {
      id: `filter-${Date.now()}`,
      field: fields[0]?.id || "",
      operator: "contains",
      value: "",
    }
    onFiltersChange([...filters, newFilter])
  }

  const updateFilter = (id: string, updates: Partial<QueryFilter>) => {
    onFiltersChange(
      filters.map((f) => (f.id === id ? { ...f, ...updates } : f))
    )
  }

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter((f) => f.id !== id))
  }

  const getFieldById = (id: string) => fields.find((f) => f.id === id)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div
        className="flex items-center justify-between px-4 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{t(locale, "explorer.queryBuilder")}</h3>
          {filters.length > 0 && (
            <Badge variant="secondary">{filters.length}</Badge>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-4">
              <div className="space-y-3">
                {/* Filters */}
                <AnimatePresence mode="popLayout">
                  {filters.map((filter, index) => {
                    const field = getFieldById(filter.field)
                    const operators = field
                      ? getOperatorsForType(field.type)
                      : stringOperators

                    return (
                      <motion.div
                        key={filter.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                        className="flex items-end gap-2"
                      >
                        {index > 0 && (
                          <span className="text-sm text-muted-foreground px-2 pb-2">
                            {t(locale, "common.and")}
                          </span>
                        )}

                        {/* Field select */}
                        <div className="flex-1 min-w-[150px]">
                          {index === 0 && (
                            <Label className="text-xs mb-1 block">
                              {t(locale, "explorer.field")}
                            </Label>
                          )}
                          <Select
                            value={filter.field}
                            onValueChange={(v) =>
                              updateFilter(filter.id, { field: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fields.map((f) => (
                                <SelectItem key={f.id} value={f.id}>
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Operator select */}
                        <div className="flex-1 min-w-[140px]">
                          {index === 0 && (
                            <Label className="text-xs mb-1 block">
                              {t(locale, "explorer.operator")}
                            </Label>
                          )}
                          <Select
                            value={filter.operator}
                            onValueChange={(v) =>
                              updateFilter(filter.id, { operator: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Value input */}
                        <div className="flex-[2] min-w-[200px]">
                          {index === 0 && (
                            <Label className="text-xs mb-1 block">
                              {t(locale, "explorer.value")}
                            </Label>
                          )}
                          {field?.type === "select" && field.options ? (
                            <Select
                              value={filter.value}
                              onValueChange={(v) =>
                                updateFilter(filter.id, { value: v })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(locale, "common.select")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field?.type === "date" ? (
                            <Input
                              type="date"
                              value={filter.value}
                              onChange={(e) =>
                                updateFilter(filter.id, { value: e.target.value })
                              }
                            />
                          ) : field?.type === "number" ? (
                            <Input
                              type="number"
                              value={filter.value}
                              onChange={(e) =>
                                updateFilter(filter.id, { value: e.target.value })
                              }
                              placeholder="0"
                            />
                          ) : (
                            <Input
                              value={filter.value}
                              onChange={(e) =>
                                updateFilter(filter.id, { value: e.target.value })
                              }
                              placeholder={t(locale, "explorer.valuePlaceholder")}
                            />
                          )}
                        </div>

                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFilter(filter.id)}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {/* Add filter button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFilter}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {t(locale, "explorer.addFilter")}
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  disabled={filters.length === 0}
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" />
                  {t(locale, "common.reset")}
                </Button>

                <div className="flex gap-2">
                  {onSave && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onSave}
                      disabled={filters.length === 0}
                    >
                      <Save className="mr-1.5 h-4 w-4" />
                      {t(locale, "explorer.saveQuery")}
                    </Button>
                  )}
                  <Button size="sm" onClick={onRun} disabled={isLoading}>
                    <Play className="mr-1.5 h-4 w-4" />
                    {isLoading
                      ? t(locale, "common.loading")
                      : t(locale, "explorer.runQuery")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
