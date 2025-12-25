"use client"

import { motion } from "framer-motion"
import { Clock, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useBrand } from "@/brand"
import { t } from "@/i18n"

interface DataFreshnessProps {
  lastUpdated: Date
  isRefreshing?: boolean
  onRefresh?: () => void
  className?: string
}

export function DataFreshness({
  lastUpdated,
  isRefreshing = false,
  onRefresh,
  className,
}: DataFreshnessProps) {
  const { locale } = useBrand()

  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - lastUpdated.getTime()) / 60000)

  const getStatus = () => {
    if (diffMinutes < 5) return { status: "fresh", color: "text-green-500", bg: "bg-green-500/10" }
    if (diffMinutes < 30) return { status: "recent", color: "text-yellow-500", bg: "bg-yellow-500/10" }
    return { status: "stale", color: "text-red-500", bg: "bg-red-500/10" }
  }

  const { status, color, bg } = getStatus()

  const getTimeText = () => {
    if (diffMinutes < 1) return locale === "pt" ? "agora mesmo" : "just now"
    if (diffMinutes < 60) return locale === "pt" ? `${diffMinutes} min atrás` : `${diffMinutes} min ago`
    const hours = Math.floor(diffMinutes / 60)
    return locale === "pt" ? `${hours}h atrás` : `${hours}h ago`
  }

  const StatusIcon = status === "fresh" ? CheckCircle2 : status === "recent" ? Clock : AlertCircle

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", bg, color)}>
            <StatusIcon className="h-3 w-3" />
            <span>{getTimeText()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {locale === "pt" ? "Última atualização" : "Last updated"}: {lastUpdated.toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}
        </TooltipContent>
      </Tooltip>

      {onRefresh && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </motion.div>
        </Button>
      )}
    </div>
  )
}
