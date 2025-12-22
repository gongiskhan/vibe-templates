"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FolderPlus,
  FileEdit,
  UserPlus,
  CheckCircle,
  MessageSquare,
  Upload,
  Settings,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { mockActivity, mockUsers, type ActivityItem } from "@/lib/mock-data"
import { formatDateTime, formatRelativeTime, cn } from "@/lib/utils"

const activityIcons: Record<ActivityItem["type"], typeof FolderPlus> = {
  "project.created": FolderPlus,
  "project.updated": FileEdit,
  "user.joined": UserPlus,
  "task.completed": CheckCircle,
  "comment.added": MessageSquare,
  "file.uploaded": Upload,
  "settings.changed": Settings,
}

const activityColors: Record<ActivityItem["type"], string> = {
  "project.created": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "project.updated": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "user.joined": "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "task.completed": "bg-green-500/15 text-green-600 dark:text-green-400",
  "comment.added": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "file.uploaded": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  "settings.changed": "bg-gray-500/15 text-gray-600 dark:text-gray-400",
}

const activityTypeLabels: Record<ActivityItem["type"], string> = {
  "project.created": "Project Created",
  "project.updated": "Project Updated",
  "user.joined": "User Joined",
  "task.completed": "Task Completed",
  "comment.added": "Comment Added",
  "file.uploaded": "File Uploaded",
  "settings.changed": "Settings Changed",
}

function ActivityCard({
  activity,
  index,
}: {
  activity: ActivityItem
  index: number
}) {
  const [expanded, setExpanded] = React.useState(false)
  const Icon = activityIcons[activity.type]
  const colorClass = activityColors[activity.type]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            className={cn(
              "flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-muted/50",
              expanded && "bg-muted/30"
            )}
            onClick={() => setExpanded(!expanded)}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                colorClass
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium leading-tight">{activity.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {activityTypeLabels[activity.type]}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[9px]">
                      {getInitials(activity.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{activity.user.name}</span>
                </div>
                <span>{formatRelativeTime(activity.timestamp)}</span>
              </div>
            </div>

            {/* Expand Icon */}
            <Button variant="ghost" size="icon" className="shrink-0">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Separator />
                <div className="p-4 bg-muted/20 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Timestamp
                      </p>
                      <p className="text-sm mt-1">
                        {formatDateTime(activity.timestamp)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actor
                      </p>
                      <p className="text-sm mt-1">{activity.user.email}</p>
                    </div>
                  </div>
                  {activity.metadata && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Metadata
                      </p>
                      <pre className="text-xs mt-1 p-2 bg-muted rounded-md overflow-x-auto">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ActivityPage() {
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [userFilter, setUserFilter] = React.useState<string>("all")
  const [displayCount, setDisplayCount] = React.useState(10)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Filter activities
  const filteredActivities = React.useMemo(() => {
    return mockActivity.filter((activity) => {
      const matchesType =
        typeFilter === "all" || activity.type === typeFilter
      const matchesUser =
        userFilter === "all" || activity.user.id === userFilter
      return matchesType && matchesUser
    })
  }, [typeFilter, userFilter])

  const displayedActivities = filteredActivities.slice(0, displayCount)
  const hasMore = displayCount < filteredActivities.length

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
          <p className="text-muted-foreground">
            Track all actions and changes across your workspace.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <p className="text-sm text-muted-foreground">
              Date range filter would go here (e.g., react-day-picker)
            </p>
          </PopoverContent>
        </Popover>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="project.created">Project Created</SelectItem>
            <SelectItem value="project.updated">Project Updated</SelectItem>
            <SelectItem value="user.joined">User Joined</SelectItem>
            <SelectItem value="task.completed">Task Completed</SelectItem>
            <SelectItem value="comment.added">Comment Added</SelectItem>
            <SelectItem value="file.uploaded">File Uploaded</SelectItem>
            <SelectItem value="settings.changed">Settings Changed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {mockUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(typeFilter !== "all" || userFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTypeFilter("all")
              setUserFilter("all")
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {displayedActivities.length} of {filteredActivities.length}{" "}
        activities
      </p>

      {/* Activity List */}
      <div className="space-y-3">
        {displayedActivities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No activities found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </CardContent>
          </Card>
        ) : (
          displayedActivities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleLoadMore}>
            Load more activities
          </Button>
        </div>
      )}
    </div>
  )
}
