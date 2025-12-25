"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBrand } from "@/brand"
import { t } from "@/i18n"
import { EntityTable, EntityDrawer, type Entity } from "@/components/entities"

// Mock data
const mockEntities: Entity[] = [
  {
    id: "1",
    name: "Produto Premium",
    description: "Produto de alta qualidade com garantia estendida",
    status: "active",
    category: "Produtos",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Serviço de Consultoria",
    description: "Consultoria especializada em transformação digital",
    status: "active",
    category: "Serviços",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
  {
    id: "3",
    name: "Cliente Corporativo",
    description: "Cliente do segmento enterprise com contrato anual",
    status: "pending",
    category: "Clientes",
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
  },
  {
    id: "4",
    name: "Fornecedor Internacional",
    description: "Fornecedor de componentes eletrônicos da Ásia",
    status: "inactive",
    category: "Fornecedores",
    createdAt: "2024-01-01T07:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "5",
    name: "Produto Básico",
    description: "Produto de entrada para novos clientes",
    status: "active",
    category: "Produtos",
    createdAt: "2024-01-12T12:00:00Z",
    updatedAt: "2024-01-21T09:00:00Z",
  },
]

export default function EntitiesPage() {
  const router = useRouter()
  const { locale } = useBrand()
  const [entities, setEntities] = useState(mockEntities)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || entity.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (entity: Entity) => {
    setSelectedEntity(entity)
    setDrawerOpen(true)
  }

  const handleEdit = (entity: Entity) => {
    router.push(`/entities/${entity.id}`)
  }

  const handleDelete = (entity: Entity) => {
    setEntities((prev) => prev.filter((e) => e.id !== entity.id))
    setDrawerOpen(false)
  }

  const handleBulkDelete = (ids: string[]) => {
    setEntities((prev) => prev.filter((e) => !ids.includes(e.id)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {locale === "pt" ? "Entidades" : "Entities"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "pt"
              ? "Gerencie suas entidades com operações CRUD completas"
              : "Manage your entities with full CRUD operations"}
          </p>
        </div>
        <Button onClick={() => router.push("/entities/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {locale === "pt" ? "Nova Entidade" : "New Entity"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={locale === "pt" ? "Pesquisar entidades..." : "Search entities..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === "pt" ? "Todos" : "All"}</SelectItem>
                <SelectItem value="active">{locale === "pt" ? "Ativo" : "Active"}</SelectItem>
                <SelectItem value="inactive">{locale === "pt" ? "Inativo" : "Inactive"}</SelectItem>
                <SelectItem value="pending">{locale === "pt" ? "Pendente" : "Pending"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {filteredEntities.length > 0 ? (
          <EntityTable
            entities={filteredEntities}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
          />
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === "pt" ? "Nenhuma entidade encontrada" : "No entities found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? locale === "pt"
                    ? "Tente ajustar os filtros"
                    : "Try adjusting your filters"
                  : locale === "pt"
                  ? "Crie sua primeira entidade para começar"
                  : "Create your first entity to get started"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={() => router.push("/entities/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  {locale === "pt" ? "Nova Entidade" : "New Entity"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Details Drawer */}
      <EntityDrawer
        entity={selectedEntity}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
