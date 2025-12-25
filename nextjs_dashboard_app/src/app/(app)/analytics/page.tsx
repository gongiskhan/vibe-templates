"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, LineChart, PieChart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBrand } from "@/brand"
import { t } from "@/i18n"
import { FilterBar, ExportActions, DataFreshness } from "@/components/analytics"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

const lineData = [
  { name: "Jan", value: 4000, previous: 2400 },
  { name: "Fev", value: 3000, previous: 1398 },
  { name: "Mar", value: 2000, previous: 9800 },
  { name: "Abr", value: 2780, previous: 3908 },
  { name: "Mai", value: 1890, previous: 4800 },
  { name: "Jun", value: 2390, previous: 3800 },
  { name: "Jul", value: 3490, previous: 4300 },
]

const barData = [
  { name: "Vendas", value: 4000 },
  { name: "Marketing", value: 3000 },
  { name: "Suporte", value: 2000 },
  { name: "Produto", value: 2780 },
  { name: "Engenharia", value: 1890 },
]

const pieData = [
  { name: "Desktop", value: 400, color: "hsl(var(--chart-1))" },
  { name: "Mobile", value: 300, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 200, color: "hsl(var(--chart-3))" },
  { name: "Outros", value: 100, color: "hsl(var(--chart-4))" },
]

const metrics = [
  { label: "Taxa de Conversão", value: "3.24%", change: 12.5, trend: "up" },
  { label: "Receita Média", value: "R$ 2.450", change: -2.3, trend: "down" },
  { label: "Tempo na Página", value: "4m 32s", change: 8.1, trend: "up" },
  { label: "Taxa de Rejeição", value: "42.1%", change: -5.2, trend: "down" },
]

export default function AnalyticsPage() {
  const { locale } = useBrand()
  const [lastUpdated] = useState(new Date(Date.now() - 5 * 60 * 1000))
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t(locale, "analytics.title")}</h1>
          <p className="text-muted-foreground">{t(locale, "analytics.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <DataFreshness
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
          <ExportActions />
        </div>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{metric.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends" className="gap-2">
            <LineChart className="h-4 w-4" />
            {t(locale, "analytics.trends")}
          </TabsTrigger>
          <TabsTrigger value="comparisons" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t(locale, "analytics.comparisons")}
          </TabsTrigger>
          <TabsTrigger value="segments" className="gap-2">
            <PieChart className="h-4 w-4" />
            {t(locale, "analytics.segments")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>{t(locale, "analytics.trends")}</CardTitle>
              <CardDescription>
                {locale === "pt" ? "Comparativo de desempenho ao longo do tempo" : "Performance comparison over time"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))" }}
                      name={locale === "pt" ? "Atual" : "Current"}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(var(--chart-2))" }}
                      name={locale === "pt" ? "Anterior" : "Previous"}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparisons">
          <Card>
            <CardHeader>
              <CardTitle>{t(locale, "analytics.comparisons")}</CardTitle>
              <CardDescription>
                {locale === "pt" ? "Comparação entre departamentos" : "Department comparison"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>{t(locale, "analytics.segments")}</CardTitle>
              <CardDescription>
                {locale === "pt" ? "Distribuição por segmento" : "Distribution by segment"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
