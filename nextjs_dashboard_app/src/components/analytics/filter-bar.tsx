"use client"

import { useState } from "react"
import { Calendar, Filter, X, ChevronDown, Save, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useBrand } from "@/brand"

interface FilterOption {
  id: string
  label: string
  value: string
}

interface ActiveFilter {
  id: string
  type: string
  label: string
  value: string
}

interface FilterBarProps {
  onFiltersChange?: (filters: ActiveFilter[]) => void
  onSaveView?: (name: string) => void
  className?: string
}

const dateRangeOptions = [
  { id: "today", label: "Hoje", value: "today" },
  { id: "yesterday", label: "Ontem", value: "yesterday" },
  { id: "7d", label: "Últimos 7 dias", value: "7d" },
  { id: "30d", label: "Últimos 30 dias", value: "30d" },
  { id: "90d", label: "Últimos 90 dias", value: "90d" },
  { id: "custom", label: "Personalizado", value: "custom" },
]

const statusOptions = [
  { id: "active", label: "Ativo", value: "active" },
  { id: "pending", label: "Pendente", value: "pending" },
  { id: "completed", label: "Concluído", value: "completed" },
  { id: "cancelled", label: "Cancelado", value: "cancelled" },
]

const categoryOptions = [
  { id: "sales", label: "Vendas", value: "sales" },
  { id: "marketing", label: "Marketing", value: "marketing" },
  { id: "support", label: "Suporte", value: "support" },
  { id: "product", label: "Produto", value: "product" },
]

export function FilterBar({ onFiltersChange, onSaveView, className }: FilterBarProps) {
  const { locale } = useBrand()
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [dateRange, setDateRange] = useState("30d")

  const addFilter = (filter: ActiveFilter) => {
    const newFilters = [...activeFilters.filter(f => f.id !== filter.id), filter]
    setActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const removeFilter = (filterId: string) => {
    const newFilters = activeFilters.filter(f => f.id !== filterId)
    setActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters([])
    setDateRange("30d")
    onFiltersChange?.([])
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Date Range Selector */}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {locale === "pt" ? "Status" : "Status"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={activeFilters.some(f => f.id === `status-${option.id}`)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addFilter({
                          id: `status-${option.id}`,
                          type: "status",
                          label: option.label,
                          value: option.value,
                        })
                      } else {
                        removeFilter(`status-${option.id}`)
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {locale === "pt" ? "Categoria" : "Category"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              {categoryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={activeFilters.some(f => f.id === `category-${option.id}`)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addFilter({
                          id: `category-${option.id}`,
                          type: "category",
                          label: option.label,
                          value: option.value,
                        })
                      } else {
                        removeFilter(`category-${option.id}`)
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        {/* Save View Button */}
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          {locale === "pt" ? "Salvar Visão" : "Save View"}
        </Button>

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {locale === "pt" ? "Limpar" : "Clear"}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="gap-1 pl-2 pr-1"
            >
              <span className="text-xs text-muted-foreground">{filter.type}:</span>
              {filter.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
