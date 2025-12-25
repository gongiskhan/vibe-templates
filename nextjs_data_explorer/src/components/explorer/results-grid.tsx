"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export interface Column {
  id: string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

export interface SortConfig {
  column: string
  direction: "asc" | "desc"
}

interface ResultsGridProps {
  columns: Column[]
  data: Record<string, unknown>[]
  isLoading?: boolean
  sort?: SortConfig
  onSortChange?: (sort: SortConfig | undefined) => void
  selectedRows?: string[]
  onSelectionChange?: (ids: string[]) => void
  onRowClick?: (row: Record<string, unknown>) => void
  onRowAction?: (action: string, row: Record<string, unknown>) => void
  page?: number
  pageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
}

export function ResultsGrid({
  columns,
  data,
  isLoading = false,
  sort,
  onSortChange,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  onRowAction,
  page = 1,
  pageSize = 20,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  className,
}: ResultsGridProps) {
  const { locale } = useBrand()
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  const handleSort = (columnId: string) => {
    if (!onSortChange) return

    if (sort?.column === columnId) {
      if (sort.direction === "asc") {
        onSortChange({ column: columnId, direction: "desc" })
      } else {
        onSortChange(undefined)
      }
    } else {
      onSortChange({ column: columnId, direction: "asc" })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange(data.map((row) => String(row.id)))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange([...selectedRows, id])
    } else {
      onSelectionChange(selectedRows.filter((r) => r !== id))
    }
  }

  const getSortIcon = (columnId: string) => {
    if (sort?.column !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
    }
    return sort.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  const allSelected = data.length > 0 && selectedRows.length === data.length
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {onSelectionChange && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(column.sortable && "cursor-pointer select-none")}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && getSortIcon(column.id)}
                  </div>
                </TableHead>
              ))}
              {onRowAction && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {onSelectionChange && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  {onRowAction && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (onSelectionChange ? 1 : 0) +
                    (onRowAction ? 1 : 0)
                  }
                  className="h-32 text-center text-muted-foreground"
                >
                  {t(locale, "common.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => {
                const rowId = String(row.id)
                const isSelected = selectedRows.includes(rowId)

                return (
                  <motion.tr
                    key={rowId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    className={cn(
                      "border-b transition-colors",
                      isSelected && "bg-primary/5",
                      onRowClick && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {onSelectionChange && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowId, !!checked)
                          }
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.render
                          ? column.render(row[column.id], row)
                          : String(row[column.id] ?? "")}
                      </TableCell>
                    ))}
                    {onRowAction && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onRowAction("view", row)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t(locale, "explorer.viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRowAction("copy", row)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              {t(locale, "explorer.copyRow")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onRowAction("delete", row)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t(locale, "common.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </motion.tr>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {t(locale, "explorer.showing")} {startItem}-{endItem}{" "}
              {t(locale, "explorer.of")} {totalItems}
            </span>
            {onPageSizeChange && (
              <Select
                value={String(pageSize)}
                onValueChange={(v) => onPageSizeChange(Number(v))}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {t(locale, "explorer.page")} {page} {t(locale, "explorer.of")}{" "}
              {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
