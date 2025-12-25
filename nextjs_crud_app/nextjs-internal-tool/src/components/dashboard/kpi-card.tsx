"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { KPIData } from "@/lib/mock-data"

interface KPICardProps {
  data: KPIData
  index?: number
}

export function KPICard({ data, index = 0 }: KPICardProps) {
  const TrendIcon =
    data.trend === "up"
      ? TrendingUp
      : data.trend === "down"
        ? TrendingDown
        : Minus

  const trendColor =
    data.trend === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : data.trend === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {data.label}
            </p>
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>
                {data.change > 0 && "+"}
                {data.change}%
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold tracking-tight">{data.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.changeLabel}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
