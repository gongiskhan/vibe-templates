"use client"

import { motion } from "framer-motion"
import { X, Pencil, Trash2, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useBrand } from "@/brand"
import type { Entity } from "./entity-table"

interface EntityDrawerProps {
  entity: Entity | null
  open: boolean
  onClose: () => void
  onEdit?: (entity: Entity) => void
  onDelete?: (entity: Entity) => void
}

export function EntityDrawer({
  entity,
  open,
  onClose,
  onEdit,
  onDelete,
}: EntityDrawerProps) {
  const { locale } = useBrand()

  if (!entity) return null

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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{entity.name}</SheetTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(entity.status)}
                <Badge variant="secondary">
                  <Tag className="mr-1 h-3 w-3" />
                  {entity.category}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              {locale === "pt" ? "Detalhes" : "Details"}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              {locale === "pt" ? "Atividade" : "Activity"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                {locale === "pt" ? "Descrição" : "Description"}
              </h4>
              <p className="text-sm">{entity.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {locale === "pt" ? "Criado em" : "Created at"}
                </h4>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(entity.createdAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {locale === "pt" ? "Atualizado em" : "Updated at"}
                </h4>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(entity.updatedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit?.(entity)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {locale === "pt" ? "Editar" : "Edit"}
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onDelete?.(entity)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {locale === "pt" ? "Excluir" : "Delete"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="space-y-4">
              {/* Mock activity items */}
              {[
                { action: locale === "pt" ? "Criado" : "Created", time: entity.createdAt },
                { action: locale === "pt" ? "Atualizado" : "Updated", time: entity.updatedAt },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.time).toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
