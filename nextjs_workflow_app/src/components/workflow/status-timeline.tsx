"use client"

import { motion } from "framer-motion"
import {
  Check,
  X,
  Clock,
  MessageSquare,
  FileText,
  User,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  LucideIcon,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export interface TimelineEvent {
  id: string
  type:
    | "created"
    | "submitted"
    | "approved"
    | "rejected"
    | "comment"
    | "assigned"
    | "updated"
    | "completed"
    | "cancelled"
    | "reopened"
  title: string
  description?: string
  user: {
    name: string
    avatar?: string
  }
  timestamp: string
  metadata?: Record<string, unknown>
}

interface StatusTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const eventIcons: Record<TimelineEvent["type"], LucideIcon> = {
  created: FileText,
  submitted: ArrowRight,
  approved: Check,
  rejected: X,
  comment: MessageSquare,
  assigned: User,
  updated: RefreshCw,
  completed: Check,
  cancelled: X,
  reopened: RefreshCw,
}

const eventColors: Record<TimelineEvent["type"], string> = {
  created: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  submitted: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  approved: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  comment: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  assigned: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  updated: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  reopened: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
}

export function StatusTimeline({ events, className }: StatusTimelineProps) {
  const { locale } = useBrand()

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      if (diffInMinutes < 1) return t(locale, "activity.timeAgo.justNow")
      return t(locale, "activity.timeAgo.minutesAgo").replace("{{count}}", String(diffInMinutes))
    }

    if (diffInHours < 24) {
      return t(locale, "activity.timeAgo.hoursAgo").replace("{{count}}", String(diffInHours))
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return t(locale, "activity.timeAgo.daysAgo").replace("{{count}}", String(diffInDays))
    }

    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(locale === "pt" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={cn("relative space-y-0", className)}>
      {/* Vertical line */}
      <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />

      {events.map((event, index) => {
        const Icon = eventIcons[event.type]

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {/* Icon */}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                eventColors[event.type]
              )}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {event.description}
                    </p>
                  )}
                </div>
                <time
                  className="text-xs text-muted-foreground whitespace-nowrap"
                  title={formatFullDate(event.timestamp)}
                >
                  {formatTime(event.timestamp)}
                </time>
              </div>

              {/* User info */}
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-5 w-5">
                  {event.user.avatar ? (
                    <img src={event.user.avatar} alt={event.user.name} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-[10px] font-medium">
                      {event.user.name.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {event.user.name}
                </span>
              </div>

              {/* Comment content if it's a comment event */}
              {event.type === "comment" && event.metadata?.content && (
                <div className="mt-2 rounded-lg border bg-muted/50 p-3 text-sm">
                  {String(event.metadata.content)}
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
