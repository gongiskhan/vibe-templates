"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBrand } from "@/brand"

export interface Entity {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "pending"
  category: string
  createdAt: string
  updatedAt: string
}

interface EntityTableProps {
  entities: Entity[]
  onView?: (entity: Entity) => void
  onEdit?: (entity: Entity) => void
  onDelete?: (entity: Entity) => void
  onBulkDelete?: (ids: string[]) => void
  className?: string
}

export function EntityTable({
  entities,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  className,
}: EntityTableProps) {
  const { locale } = useBrand()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Entity>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const toggleSort = (field: keyof Entity) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedEntities = [...entities].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const direction = sortDirection === "asc" ? 1 : -1
    return aValue < bValue ? -direction : direction
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === entities.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(entities.map((e) => e.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const getStatusBadge = (status: Entity["status"]) => {
    const variants = {
      active: { label: locale === "pt" ? "Ativo" : "Active", className: "bg-green-500/10 text-green-600" },
      inactive: { label: locale === "pt" ? "Inativo" : "Inactive", className: "bg-gray-500/10 text-gray-600" },
      pending: { label: locale === "pt" ? "Pendente" : "Pending", className: "bg-yellow-500/10 text-yellow-600" },
    }
    const { label, className } = variants[status]
    return <Badge variant="outline" className={className}>{label}</Badge>
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-lg bg-muted p-3"
          >
            <span className="text-sm font-medium">
              {selectedIds.length} {locale === "pt" ? "selecionados" : "selected"}
            </span>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              <X className="mr-2 h-4 w-4" />
              {locale === "pt" ? "Limpar" : "Clear"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onBulkDelete?.(selectedIds)
                setSelectedIds([])
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {locale === "pt" ? "Excluir" : "Delete"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === entities.length && entities.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("name")}
                >
                  {locale === "pt" ? "Nome" : "Name"}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>{locale === "pt" ? "Categoria" : "Category"}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("status")}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => toggleSort("updatedAt")}
                >
                  {locale === "pt" ? "Atualizado" : "Updated"}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntities.map((entity) => (
              <TableRow
                key={entity.id}
                className={cn(selectedIds.includes(entity.id) && "bg-muted/50")}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(entity.id)}
                    onCheckedChange={() => toggleSelect(entity.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{entity.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {entity.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{entity.category}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(entity.status)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(entity.updatedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(entity)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {locale === "pt" ? "Visualizar" : "View"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(entity)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {locale === "pt" ? "Editar" : "Edit"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete?.(entity)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {locale === "pt" ? "Excluir" : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
