"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileJson, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export type ExportFormat = "csv" | "xlsx" | "json"

interface ExportMenuProps {
  onExport: (format: ExportFormat) => Promise<void>
  disabled?: boolean
  itemCount?: number
}

export function ExportMenu({ onExport, disabled = false, itemCount }: ExportMenuProps) {
  const { locale } = useBrand()
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(format)
    try {
      await onExport(format)
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || !!isExporting}>
          {isExporting ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-1.5 h-4 w-4" />
          )}
          {t(locale, "common.export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {itemCount !== undefined && (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {itemCount} {t(locale, "explorer.itemsToExport")}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          disabled={!!isExporting}
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>{t(locale, "explorer.exportCSV")}</span>
          {isExporting === "csv" && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("xlsx")}
          disabled={!!isExporting}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>{t(locale, "explorer.exportExcel")}</span>
          {isExporting === "xlsx" && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("json")}
          disabled={!!isExporting}
        >
          <FileJson className="mr-2 h-4 w-4" />
          <span>{t(locale, "explorer.exportJSON")}</span>
          {isExporting === "json" && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
