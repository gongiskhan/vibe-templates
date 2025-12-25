"use client"

import { useRouter } from "next/navigation"
import { useBrand } from "@/brand"
import { EntityForm } from "@/components/entities"
import type { Entity } from "@/components/entities"

export default function NewEntityPage() {
  const router = useRouter()
  const { locale } = useBrand()

  const handleSubmit = async (data: Partial<Entity>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would create the entity here
    console.log("Creating entity:", data)

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
          {locale === "pt" ? "Nova Entidade" : "New Entity"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "pt"
            ? "Preencha os dados para criar uma nova entidade"
            : "Fill in the details to create a new entity"}
        </p>
      </div>

      <EntityForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}
