"use client"

import { motion } from "framer-motion"
import {
  FolderPlus,
  FileEdit,
  UserPlus,
  CheckCircle,
  MessageSquare,
  Upload,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockActivity, type ActivityItem } from "@/lib/mock-data"
import { formatRelativeTime } from "@/lib/utils"

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
  "project.created": "text-emerald-500",
  "project.updated": "text-blue-500",
  "user.joined": "text-violet-500",
  "task.completed": "text-green-500",
  "comment.added": "text-amber-500",
  "file.uploaded": "text-cyan-500",
  "settings.changed": "text-gray-500",
}

export function RecentActivity() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates across your projects</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 px-6 pb-6">
            {mockActivity.slice(0, 8).map((activity, index) => {
              const Icon = activityIcons[activity.type]
              const iconColor = activityColors[activity.type]

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className={`mt-0.5 ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-tight">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-muted text-[10px]">
                        {getInitials(activity.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
