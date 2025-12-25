"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBrand } from "@/brand"
import type { Entity } from "./entity-table"

interface EntityFormProps {
  entity?: Entity
  onSubmit: (data: Partial<Entity>) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  name?: string
  description?: string
  category?: string
}

export function EntityForm({ entity, onSubmit, onCancel }: EntityFormProps) {
  const { locale } = useBrand()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    name: entity?.name || "",
    description: entity?.description || "",
    status: entity?.status || "pending",
    category: entity?.category || "",
  })

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = locale === "pt" ? "Nome é obrigatório" : "Name is required"
    } else if (formData.name.length < 3) {
      newErrors.name = locale === "pt" ? "Nome deve ter pelo menos 3 caracteres" : "Name must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = locale === "pt" ? "Descrição é obrigatória" : "Description is required"
    }

    if (!formData.category) {
      newErrors.category = locale === "pt" ? "Categoria é obrigatória" : "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: "products", label: locale === "pt" ? "Produtos" : "Products" },
    { value: "services", label: locale === "pt" ? "Serviços" : "Services" },
    { value: "customers", label: locale === "pt" ? "Clientes" : "Customers" },
    { value: "suppliers", label: locale === "pt" ? "Fornecedores" : "Suppliers" },
    { value: "other", label: locale === "pt" ? "Outros" : "Other" },
  ]

  const statuses = [
    { value: "active", label: locale === "pt" ? "Ativo" : "Active" },
    { value: "inactive", label: locale === "pt" ? "Inativo" : "Inactive" },
    { value: "pending", label: locale === "pt" ? "Pendente" : "Pending" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              {entity
                ? locale === "pt"
                  ? "Editar Entidade"
                  : "Edit Entity"
                : locale === "pt"
                ? "Nova Entidade"
                : "New Entity"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {locale === "pt" ? "Nome" : "Name"} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={locale === "pt" ? "Digite o nome" : "Enter name"}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {locale === "pt" ? "Descrição" : "Description"} *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={locale === "pt" ? "Digite a descrição" : "Enter description"}
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Category and Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  {locale === "pt" ? "Categoria" : "Category"} *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder={locale === "pt" ? "Selecione" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Entity["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                {locale === "pt" ? "Cancelar" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {locale === "pt" ? "Salvar" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}
