"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Lightbulb, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBrand } from "@/brand"
import { t } from "@/i18n"

interface Insight {
  id: string
  type: "positive" | "negative" | "neutral"
  title: string
  description: string
  metric?: string
  change?: number
  action?: {
    label: string
    href: string
  }
}

interface InsightsPanelProps {
  insights: Insight[]
  className?: string
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "positive",
    title: "Crescimento de usuários",
    description: "O número de usuários ativos aumentou 23% em relação ao mês anterior.",
    metric: "2.345",
    change: 23,
    action: { label: "Ver detalhes", href: "/analytics" },
  },
  {
    id: "2",
    type: "negative",
    title: "Taxa de conversão",
    description: "A taxa de conversão caiu 5% esta semana. Considere revisar o funil.",
    metric: "3.2%",
    change: -5,
    action: { label: "Analisar funil", href: "/analytics" },
  },
  {
    id: "3",
    type: "neutral",
    title: "Nova oportunidade",
    description: "Detectamos um segmento de mercado com alto potencial de crescimento.",
    action: { label: "Explorar", href: "/reports" },
  },
]

export function InsightsPanel({ insights = mockInsights, className }: InsightsPanelProps) {
  const { locale } = useBrand()

  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "positive":
        return TrendingUp
      case "negative":
        return TrendingDown
      default:
        return Lightbulb
    }
  }

  const getColor = (type: Insight["type"]) => {
    switch (type) {
      case "positive":
        return "text-green-500 bg-green-500/10"
      case "negative":
        return "text-red-500 bg-red-500/10"
      default:
        return "text-blue-500 bg-blue-500/10"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
          {locale === "pt" ? "Insights" : "Insights"}
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          {insights.length} {locale === "pt" ? "novos" : "new"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getIcon(insight.type)
          const colorClass = getColor(insight.type)

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex gap-3">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    {insight.change !== undefined && (
                      <span className={cn(
                        "text-sm font-medium",
                        insight.change > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {insight.change > 0 ? "+" : ""}{insight.change}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.action && (
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      {insight.action.label}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}
