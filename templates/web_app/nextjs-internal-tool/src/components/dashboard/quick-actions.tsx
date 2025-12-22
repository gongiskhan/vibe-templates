"use client"

import { motion } from "framer-motion"
import { Plus, FileText, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
  {
    title: "New Project",
    description: "Create a new project",
    icon: Plus,
    variant: "default" as const,
  },
  {
    title: "Generate Report",
    description: "Export analytics",
    icon: FileText,
    variant: "outline" as const,
  },
  {
    title: "Invite Team",
    description: "Add team members",
    icon: Users,
    variant: "outline" as const,
  },
  {
    title: "Quick Task",
    description: "Run automation",
    icon: Zap,
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant={action.variant}
                className="h-auto w-full flex-col items-start gap-1 p-4"
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {action.description}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
