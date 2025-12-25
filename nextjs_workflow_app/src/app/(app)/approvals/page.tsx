"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, CheckCircle2, XCircle, Clock, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApprovalCard } from "@/components/workflow"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"
import { mockApprovals, type Approval } from "@/lib/mock-data"

type FilterStatus = "all" | "pending" | "approved" | "rejected"

export default function ApprovalsPage() {
  const { locale } = useBrand()
  const [filter, setFilter] = useState<FilterStatus>("all")

  const filteredApprovals = mockApprovals.filter((approval) => {
    if (filter === "all") return true
    return approval.status === filter
  })

  const counts = {
    all: mockApprovals.length,
    pending: mockApprovals.filter((a) => a.status === "pending").length,
    approved: mockApprovals.filter((a) => a.status === "approved").length,
    rejected: mockApprovals.filter((a) => a.status === "rejected").length,
  }

  const handleApprove = async (id: string, comment: string) => {
    console.log("Approve", id, comment)
    // API call here
  }

  const handleReject = async (id: string, comment: string) => {
    console.log("Reject", id, comment)
    // API call here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t(locale, "workflow.approvals")}
        </h1>
        <p className="text-muted-foreground">
          {t(locale, "workflow.subtitle")}
        </p>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Filter className="h-4 w-4" />
            {t(locale, "workflow.filters.all")}
            <Badge variant="secondary" className="ml-1">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            {t(locale, "workflow.filters.pending")}
            <Badge variant="secondary" className="ml-1">
              {counts.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {t(locale, "workflow.filters.approved")}
            <Badge variant="secondary" className="ml-1">
              {counts.approved}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="h-4 w-4" />
            {t(locale, "workflow.filters.rejected")}
            <Badge variant="secondary" className="ml-1">
              {counts.rejected}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Approvals Grid */}
      {filteredApprovals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApprovals.map((approval, index) => (
            <motion.div
              key={approval.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ApprovalCard
                approval={{
                  ...approval,
                  requestedBy: {
                    name: approval.requestedBy.name,
                    email: approval.requestedBy.email,
                    avatar: approval.requestedBy.avatar,
                  },
                }}
                onApprove={handleApprove}
                onReject={handleReject}
                showActions={approval.status === "pending"}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="rounded-full bg-muted p-4 mb-4">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">
            {t(locale, "workflow.noApprovals")}
          </h3>
          <p className="text-muted-foreground mt-1">
            {t(locale, "workflow.noApprovalsDesc")}
          </p>
        </motion.div>
      )}
    </div>
  )
}
