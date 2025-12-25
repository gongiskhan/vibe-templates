"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Check, X, Clock, MessageSquare, History, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { WorkflowStepper, StatusTimeline, CommentThread } from "@/components/workflow"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"
import {
  getApprovalById,
  mockWorkflowSteps,
  mockTimelineEvents,
  mockComments,
  currentUser,
} from "@/lib/mock-data"

interface PageProps {
  params: Promise<{ id: string }>
}

const priorityStyles = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

export default function ApprovalDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { locale } = useBrand()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const approval = getApprovalById(id)

  if (!approval) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold">{t(locale, "errors.notFound")}</h2>
        <Link href="/approvals">
          <Button variant="link" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t(locale, "common.back")}
          </Button>
        </Link>
      </div>
    )
  }

  const handleApprove = async () => {
    setIsSubmitting(true)
    // API call here
    console.log("Approve with comment:", comment)
    setIsSubmitting(false)
  }

  const handleReject = async () => {
    setIsSubmitting(true)
    // API call here
    console.log("Reject with comment:", comment)
    setIsSubmitting(false)
  }

  const handleAddComment = async (content: string, parentId?: string) => {
    console.log("Add comment:", content, parentId)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/approvals">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t(locale, "common.back")}
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{approval.title}</h1>
            <Badge className={statusStyles[approval.status]}>
              {t(locale, `workflow.status.${approval.status}`)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{approval.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {t(locale, "workflow.requestedAt")}: {formatDate(approval.requestedAt)}
            </span>
            <Badge className={priorityStyles[approval.priority]}>
              {t(locale, `workflow.priority.${approval.priority}`)}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        {approval.status === "pending" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReject} disabled={isSubmitting}>
              <X className="mr-1.5 h-4 w-4" />
              {t(locale, "workflow.reject")}
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              <Check className="mr-1.5 h-4 w-4" />
              {t(locale, "workflow.approve")}
            </Button>
          </div>
        )}
      </div>

      {/* Workflow Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="h-5 w-5" />
            {t(locale, "workflow.steps.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowStepper steps={mockWorkflowSteps} orientation="horizontal" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t(locale, "projects.details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(approval.details).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t(locale, "projects.owner")}
                  </dt>
                  <dd className="font-medium">{approval.requestedBy.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t(locale, "projects.tags")}
                  </dt>
                  <dd>
                    <Badge variant="outline">{approval.category}</Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Tabs for Comments and History */}
          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t(locale, "workflow.comments.title")}
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                {t(locale, "workflow.timeline.title")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <CommentThread
                    comments={mockComments.map((c) => ({
                      ...c,
                      author: {
                        id: c.author.id,
                        name: c.author.name,
                        avatar: c.author.avatar,
                      },
                      replies: c.replies?.map((r) => ({
                        ...r,
                        author: {
                          id: r.author.id,
                          name: r.author.name,
                          avatar: r.author.avatar,
                        },
                      })),
                    }))}
                    currentUserId={currentUser.id}
                    onAddComment={handleAddComment}
                    onEditComment={(id, content) => console.log("Edit", id, content)}
                    onDeleteComment={(id) => console.log("Delete", id)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <StatusTimeline
                    events={mockTimelineEvents.map((e) => ({
                      ...e,
                      user: {
                        name: e.user.name,
                        avatar: e.user.avatar,
                      },
                    }))}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick comment for pending */}
          {approval.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t(locale, "workflow.addComment")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={t(locale, "workflow.commentPlaceholder")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requester info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t(locale, "projects.owner")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  {approval.requestedBy.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{approval.requestedBy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {approval.requestedBy.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Due date */}
          {approval.dueDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  {t(locale, "workflow.dueDate")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{formatDate(approval.dueDate)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
