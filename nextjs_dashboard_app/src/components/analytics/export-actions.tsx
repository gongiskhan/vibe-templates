"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText, Image, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBrand } from "@/brand"

interface ExportActionsProps {
  onExport?: (format: "csv" | "xlsx" | "pdf" | "png") => Promise<void>
  disabled?: boolean
  className?: string
}

export function ExportActions({ onExport, disabled, className }: ExportActionsProps) {
  const { locale } = useBrand()
  const [isExporting, setIsExporting] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<string | null>(null)

  const handleExport = async (format: "csv" | "xlsx" | "pdf" | "png") => {
    if (onExport) {
      setIsExporting(true)
      setExportingFormat(format)
      try {
        await onExport(format)
      } finally {
        setIsExporting(false)
        setExportingFormat(null)
      }
    } else {
      // Mock export - simulate download
      const mockData = "id,name,value\n1,Item A,100\n2,Item B,200\n3,Item C,300"
      const blob = new Blob([mockData], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `export-${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const exportOptions = [
    {
      format: "csv" as const,
      label: "CSV",
      description: locale === "pt" ? "Dados em texto simples" : "Plain text data",
      icon: FileText,
    },
    {
      format: "xlsx" as const,
      label: "Excel",
      description: locale === "pt" ? "Planilha formatada" : "Formatted spreadsheet",
      icon: FileSpreadsheet,
    },
    {
      format: "pdf" as const,
      label: "PDF",
      description: locale === "pt" ? "Relatório para impressão" : "Printable report",
      icon: FileText,
    },
    {
      format: "png" as const,
      label: locale === "pt" ? "Imagem" : "Image",
      description: locale === "pt" ? "Captura do gráfico" : "Chart snapshot",
      icon: Image,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting} className={className}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {locale === "pt" ? "Exportar" : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {exportOptions.map((option, index) => (
          <div key={option.format}>
            <DropdownMenuItem
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className="flex items-start gap-3 py-2"
            >
              <option.icon className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
              {exportingFormat === option.format && (
                <Loader2 className="h-4 w-4 animate-spin ml-auto" />
              )}
            </DropdownMenuItem>
            {index < exportOptions.length - 1 && index === 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
