"use client"

import { useRouter, useParams } from "next/navigation"
import { useBrand } from "@/brand"
import { EntityForm } from "@/components/entities"
import type { Entity } from "@/components/entities"

// Mock data - in a real app this would come from an API
const mockEntity: Entity = {
  id: "1",
  name: "Produto Premium",
  description: "Produto de alta qualidade com garantia estendida",
  status: "active",
  category: "products",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T14:30:00Z",
}

export default function EditEntityPage() {
  const router = useRouter()
  const params = useParams()
  const { locale } = useBrand()

  // In a real app, you would fetch the entity by ID
  const entity = { ...mockEntity, id: params.id as string }

  const handleSubmit = async (data: Partial<Entity>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would update the entity here
    console.log("Updating entity:", { id: params.id, ...data })

    // Redirect to entities list
    router.push("/entities")
  }

  const handleCancel = () => {
    router.push("/entities")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "pt" ? "Editar Entidade" : "Edit Entity"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "pt"
            ? "Atualize os dados da entidade"
            : "Update the entity details"}
        </p>
      </div>

      <EntityForm entity={entity} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}
