"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileBarChart,
  Plus,
  Clock,
  Download,
  Share2,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  Copy,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBrand } from "@/brand"
import { t } from "@/i18n"

interface Report {
  id: string
  name: string
  description: string
  type: "saved" | "scheduled" | "template"
  createdAt: string
  lastRun?: string
  schedule?: string
  status?: "active" | "paused"
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Relatório Mensal de Vendas",
    description: "Análise completa de vendas com métricas de conversão",
    type: "saved",
    createdAt: "2024-01-15",
    lastRun: "2024-01-20",
  },
  {
    id: "2",
    name: "Dashboard de Performance",
    description: "KPIs principais e tendências",
    type: "saved",
    createdAt: "2024-01-10",
    lastRun: "2024-01-19",
  },
  {
    id: "3",
    name: "Relatório Semanal",
    description: "Resumo automático das atividades da semana",
    type: "scheduled",
    createdAt: "2024-01-01",
    schedule: "Toda segunda às 9h",
    status: "active",
  },
  {
    id: "4",
    name: "Alerta de Métricas",
    description: "Notificação quando métricas atingem limites",
    type: "scheduled",
    createdAt: "2024-01-05",
    schedule: "Diariamente às 8h",
    status: "active",
  },
  {
    id: "5",
    name: "Template de Vendas",
    description: "Template padrão para relatórios de vendas",
    type: "template",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "Template de Marketing",
    description: "Template padrão para campanhas de marketing",
    type: "template",
    createdAt: "2024-01-01",
  },
]

export default function ReportsPage() {
  const { locale } = useBrand()
  const [reports] = useState(mockReports)

  const savedReports = reports.filter((r) => r.type === "saved")
  const scheduledReports = reports.filter((r) => r.type === "scheduled")
  const templates = reports.filter((r) => r.type === "template")

  const ReportCard = ({ report }: { report: Report }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileBarChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{report.name}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {report.description}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  {locale === "pt" ? "Visualizar" : "View"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  {locale === "pt" ? "Baixar" : "Download"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  {locale === "pt" ? "Compartilhar" : "Share"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  {locale === "pt" ? "Duplicar" : "Duplicate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {locale === "pt" ? "Excluir" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {report.lastRun && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {locale === "pt" ? "Última execução:" : "Last run:"} {report.lastRun}
                </span>
              )}
              {report.schedule && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {report.schedule}
                </span>
              )}
            </div>
            {report.status && (
              <Badge variant={report.status === "active" ? "default" : "secondary"}>
                {report.status === "active"
                  ? locale === "pt"
                    ? "Ativo"
                    : "Active"
                  : locale === "pt"
                  ? "Pausado"
                  : "Paused"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t(locale, "reports.title")}</h1>
          <p className="text-muted-foreground">{t(locale, "reports.subtitle")}</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t(locale, "reports.createReport")}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="saved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saved">
            {t(locale, "reports.savedViews")} ({savedReports.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            {t(locale, "reports.scheduled")} ({scheduledReports.length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            {t(locale, "reports.templates")} ({templates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          {savedReports.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <FileBarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">{t(locale, "reports.noReports")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t(locale, "reports.createFirst")}
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t(locale, "reports.createReport")}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scheduledReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
