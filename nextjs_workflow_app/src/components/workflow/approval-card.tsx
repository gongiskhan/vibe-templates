"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Clock, User, Calendar, MessageSquare, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export interface Approval {
  id: string
  title: string
  description: string
  requestedBy: {
    name: string
    avatar?: string
    email: string
  }
  requestedAt: string
  dueDate?: string
  status: "pending" | "approved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  category?: string
  details?: Record<string, string | number>
}

interface ApprovalCardProps {
  approval: Approval
  onApprove?: (id: string, comment: string) => void
  onReject?: (id: string, comment: string) => void
  showActions?: boolean
  className?: string
}

const priorityStyles: Record<Approval["priority"], string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

const statusStyles: Record<Approval["status"], { bg: string; icon: typeof Check }> = {
  pending: { bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: Clock },
  approved: { bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", icon: Check },
  rejected: { bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", icon: X },
}

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  showActions = true,
  className,
}: ApprovalCardProps) {
  const { locale } = useBrand()
  const [comment, setComment] = useState("")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const StatusIcon = statusStyles[approval.status].icon

  const handleApprove = async () => {
    if (!onApprove) return
    setIsSubmitting(true)
    await onApprove(approval.id, comment)
    setIsSubmitting(false)
    setComment("")
  }

  const handleReject = async () => {
    if (!onReject) return
    setIsSubmitting(true)
    await onReject(approval.id, comment)
    setIsSubmitting(false)
    setComment("")
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      locale === "pt" ? "pt-BR" : "en-US",
      { day: "2-digit", month: "short", year: "numeric" }
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base font-semibold">
                {approval.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {approval.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={priorityStyles[approval.priority]}>
                {t(locale, `workflow.priority.${approval.priority}`)}
              </Badge>
              <Badge className={statusStyles[approval.status].bg}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {t(locale, `workflow.status.${approval.status}`)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Requester info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium text-sm">
                {approval.requestedBy.name.charAt(0)}
              </div>
            </Avatar>
            <div className="flex-1 text-sm">
              <p className="font-medium">{approval.requestedBy.name}</p>
              <p className="text-muted-foreground">{approval.requestedBy.email}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {t(locale, "workflow.requestedAt")}: {formatDate(approval.requestedAt)}
              </span>
            </div>
            {approval.dueDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {t(locale, "workflow.dueDate")}: {formatDate(approval.dueDate)}
                </span>
              </div>
            )}
          </div>

          {/* Details expandable */}
          {approval.details && Object.keys(approval.details).length > 0 && (
            <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  {t(locale, "workflow.viewDetails")}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isDetailsOpen && "rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-lg border bg-muted/50 p-3">
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(approval.details).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </dt>
                        <dd className="font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Comment input for pending approvals */}
          {approval.status === "pending" && showActions && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                {t(locale, "workflow.addComment")}
              </div>
              <Textarea
                placeholder={t(locale, "workflow.commentPlaceholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          )}
        </CardContent>

        {/* Action buttons */}
        {approval.status === "pending" && showActions && (
          <CardFooter className="gap-2 border-t bg-muted/30 px-4 py-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              <X className="mr-1.5 h-4 w-4" />
              {t(locale, "workflow.reject")}
            </Button>
            <Button
              className="flex-1"
              onClick={handleApprove}
              disabled={isSubmitting}
            >
              <Check className="mr-1.5 h-4 w-4" />
              {t(locale, "workflow.approve")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
