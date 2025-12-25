"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Database, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  QueryBuilder,
  ResultsGrid,
  FilterChips,
  SavedQueries,
  ExportMenu,
  type QueryFilter,
  type QueryBuilderField,
  type Column,
  type SortConfig,
  type SavedQuery,
  type ExportFormat,
} from "@/components/explorer"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

// Mock data for demonstration
const mockEmployees = Array.from({ length: 150 }, (_, i) => ({
  id: `emp-${i + 1}`,
  name: [
    "Ana Silva",
    "Carlos Santos",
    "Maria Oliveira",
    "João Pereira",
    "Paula Costa",
    "Ricardo Lima",
    "Fernanda Souza",
    "Marcos Almeida",
    "Camila Ferreira",
    "Bruno Rodrigues",
  ][i % 10],
  email: `funcionario${i + 1}@empresa.com`,
  department: ["Engenharia", "Marketing", "Vendas", "RH", "Financeiro", "Operações"][i % 6],
  role: ["Analista", "Desenvolvedor", "Gerente", "Coordenador", "Diretor", "Estagiário"][i % 6],
  status: ["Ativo", "Ativo", "Ativo", "Férias", "Afastado"][i % 5],
  salary: 5000 + Math.floor(Math.random() * 15000),
  createdAt: new Date(2020 + Math.floor(i / 30), i % 12, (i % 28) + 1).toISOString(),
}))

const mockSavedQueries: SavedQuery[] = [
  {
    id: "sq-1",
    name: "Funcionários de Engenharia",
    description: "Todos os funcionários do departamento de engenharia",
    filters: [{ id: "f1", field: "department", operator: "equals", value: "Engenharia" }],
    createdAt: "2024-12-15T10:00:00Z",
    lastUsed: "2024-12-20T14:30:00Z",
    isFavorite: true,
    resultCount: 25,
  },
  {
    id: "sq-2",
    name: "Salários acima de 10k",
    description: "Funcionários com salário superior a R$ 10.000",
    filters: [{ id: "f2", field: "salary", operator: "greater_than", value: "10000" }],
    createdAt: "2024-12-10T09:00:00Z",
    lastUsed: "2024-12-18T11:00:00Z",
    isFavorite: false,
    resultCount: 45,
  },
  {
    id: "sq-3",
    name: "Contratados em 2024",
    description: "Funcionários contratados este ano",
    filters: [{ id: "f3", field: "createdAt", operator: "after", value: "2024-01-01" }],
    createdAt: "2024-12-05T15:00:00Z",
    isFavorite: true,
    resultCount: 30,
  },
]

const fields: QueryBuilderField[] = [
  { id: "name", label: "Nome", type: "string" },
  { id: "email", label: "E-mail", type: "string" },
  { id: "department", label: "Departamento", type: "select", options: ["Engenharia", "Marketing", "Vendas", "RH", "Financeiro", "Operações"] },
  { id: "role", label: "Cargo", type: "string" },
  { id: "status", label: "Status", type: "select", options: ["Ativo", "Férias", "Afastado"] },
  { id: "salary", label: "Salário", type: "number" },
  { id: "createdAt", label: "Data de Contratação", type: "date" },
]

export default function ExplorePage() {
  const { locale } = useBrand()
  const [filters, setFilters] = useState<QueryFilter[]>([])
  const [sort, setSort] = useState<SortConfig | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedQueries, setSavedQueries] = useState(mockSavedQueries)

  const columns: Column[] = [
    { id: "id", label: "ID", width: "100px" },
    { id: "name", label: t(locale, "explorer.columns.name"), sortable: true },
    { id: "email", label: t(locale, "explorer.columns.email"), sortable: true },
    { id: "department", label: t(locale, "explorer.columns.department"), sortable: true },
    { id: "role", label: t(locale, "explorer.columns.role"), sortable: true },
    {
      id: "status",
      label: t(locale, "explorer.columns.status"),
      render: (value) => (
        <Badge
          variant={value === "Ativo" ? "default" : value === "Férias" ? "secondary" : "outline"}
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      id: "salary",
      label: t(locale, "explorer.columns.salary"),
      sortable: true,
      render: (value) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
          Number(value)
        ),
    },
    {
      id: "createdAt",
      label: t(locale, "explorer.columns.createdAt"),
      sortable: true,
      render: (value) =>
        new Date(String(value)).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US"),
    },
  ]

  // Apply filters and sorting
  const filteredData = useMemo(() => {
    let result = [...mockEmployees]

    // Apply filters
    filters.forEach((filter) => {
      if (!filter.value) return

      result = result.filter((row) => {
        const fieldValue = String(row[filter.field as keyof typeof row] || "").toLowerCase()
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case "contains":
            return fieldValue.includes(filterValue)
          case "equals":
            return fieldValue === filterValue
          case "starts_with":
            return fieldValue.startsWith(filterValue)
          case "ends_with":
            return fieldValue.endsWith(filterValue)
          case "not_contains":
            return !fieldValue.includes(filterValue)
          case "greater_than":
            return Number(row[filter.field as keyof typeof row]) > Number(filter.value)
          case "less_than":
            return Number(row[filter.field as keyof typeof row]) < Number(filter.value)
          case "after":
            return new Date(String(row[filter.field as keyof typeof row])) > new Date(filter.value)
          case "before":
            return new Date(String(row[filter.field as keyof typeof row])) < new Date(filter.value)
          default:
            return true
        }
      })
    })

    // Apply sorting
    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.column as keyof typeof a]
        const bVal = b[sort.column as keyof typeof b]

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sort.direction === "asc" ? aVal - bVal : bVal - aVal
        }

        const aStr = String(aVal || "")
        const bStr = String(bVal || "")
        return sort.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr)
      })
    }

    return result
  }, [filters, sort])

  // Paginate
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

  const handleRunQuery = async () => {
    setIsLoading(true)
    setPage(1)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
  }

  const handleReset = () => {
    setFilters([])
    setSort(undefined)
    setPage(1)
  }

  const handleSaveQuery = () => {
    const newQuery: SavedQuery = {
      id: `sq-${Date.now()}`,
      name: `Consulta ${savedQueries.length + 1}`,
      filters: filters,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      resultCount: filteredData.length,
    }
    setSavedQueries([newQuery, ...savedQueries])
  }

  const handleLoadQuery = (query: SavedQuery) => {
    setFilters(query.filters as QueryFilter[])
    handleRunQuery()
  }

  const handleExport = async (format: ExportFormat) => {
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Exporting to", format, filteredData)
  }

  const handleRowAction = (action: string, row: Record<string, unknown>) => {
    console.log("Row action:", action, row)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t(locale, "explorer.title")}
            </h1>
            <p className="text-muted-foreground">
              {t(locale, "explorer.subtitle")}
            </p>
          </div>
        </div>
        <ExportMenu
          onExport={handleExport}
          disabled={filteredData.length === 0}
          itemCount={selectedRows.length > 0 ? selectedRows.length : filteredData.length}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="space-y-4">
          {/* Query Builder */}
          <QueryBuilder
            fields={fields}
            filters={filters}
            onFiltersChange={setFilters}
            onRun={handleRunQuery}
            onSave={handleSaveQuery}
            onReset={handleReset}
            isLoading={isLoading}
          />

          {/* Active filters */}
          <FilterChips
            filters={filters}
            fields={fields}
            onRemoveFilter={(id) => setFilters(filters.filter((f) => f.id !== id))}
            onClearAll={() => setFilters([])}
          />

          {/* Results summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span>
              {filteredData.length} {t(locale, "explorer.results")}
            </span>
            {selectedRows.length > 0 && (
              <Badge variant="secondary">
                {selectedRows.length} {t(locale, "common.selected") || "selecionados"}
              </Badge>
            )}
          </motion.div>

          {/* Results Grid */}
          <ResultsGrid
            columns={columns}
            data={paginatedData}
            isLoading={isLoading}
            sort={sort}
            onSortChange={setSort}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            onRowAction={handleRowAction}
            page={page}
            pageSize={pageSize}
            totalItems={filteredData.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>

        {/* Saved Queries Sidebar */}
        <SavedQueries
          queries={savedQueries}
          onRunQuery={handleLoadQuery}
          onDeleteQuery={(id) =>
            setSavedQueries(savedQueries.filter((q) => q.id !== id))
          }
          onToggleFavorite={(id) =>
            setSavedQueries(
              savedQueries.map((q) =>
                q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
              )
            )
          }
        />
      </div>
    </div>
  )
}
