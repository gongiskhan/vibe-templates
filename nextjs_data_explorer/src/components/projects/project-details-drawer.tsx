"use client"

import { motion } from "framer-motion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Edit, ExternalLink, Users } from "lucide-react"
import type { Project } from "@/lib/mock-data"
import { getActivityForProject } from "@/lib/mock-data"
import { formatDate, formatRelativeTime } from "@/lib/utils"

const statusColors: Record<Project["status"], "default" | "success" | "warning" | "secondary"> = {
  active: "success",
  paused: "warning",
  completed: "default",
  archived: "secondary",
}

const priorityColors: Record<Project["priority"], "default" | "destructive" | "warning" | "secondary"> = {
  critical: "destructive",
  high: "warning",
  medium: "default",
  low: "secondary",
}

interface ProjectDetailsDrawerProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDetailsDrawer({
  project,
  open,
  onOpenChange,
}: ProjectDetailsDrawerProps) {
  if (!project) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const projectActivity = getActivityForProject(project.id)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl">{project.name}</SheetTitle>
              <SheetDescription>{project.description}</SheetDescription>
            </div>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant={statusColors[project.status]}>{project.status}</Badge>
            <Badge variant={priorityColors[project.priority]}>
              {project.priority} priority
            </Badge>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="mx-6 w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <TabsContent value="overview" className="mt-0 p-6 space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-2 rounded-full bg-primary"
                  />
                </div>
              </div>

              <Separator />

              {/* Team */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Team</h4>
                  <Button variant="ghost" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </div>
                <div className="space-y-2">
                  {project.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Details</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd>{formatDate(project.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last updated</dt>
                    <dd>{formatDate(project.updatedAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Owner</dt>
                    <dd>{project.owner.name}</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-0 p-6">
              {projectActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No activity yet</p>
                  <p className="text-sm text-muted-foreground">
                    Activity will appear here when team members take actions.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex gap-3 rounded-lg border p-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(activity.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-0 p-6 space-y-6">
              {/* Notification Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive email updates for this project
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Get push notifications on your device
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Integrations */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Integrations</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect to Slack
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect to GitHub
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-destructive">
                  Danger Zone
                </h4>
                <div className="rounded-lg border border-destructive/50 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Archive project</p>
                    <p className="text-xs text-muted-foreground">
                      Archive this project and hide it from the main view
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Archive
                  </Button>
                </div>
                <div className="rounded-lg border border-destructive/50 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Delete project</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete this project and all its data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
