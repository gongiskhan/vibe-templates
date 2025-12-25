"use client"

import { motion } from "framer-motion"
import { Check, Circle, Clock, AlertCircle, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export interface WorkflowStep {
  id: string
  title: string
  description?: string
  status: "pending" | "current" | "completed" | "error"
  timestamp?: string
  assignee?: string
}

interface WorkflowStepperProps {
  steps: WorkflowStep[]
  orientation?: "horizontal" | "vertical"
  onStepClick?: (step: WorkflowStep, index: number) => void
  className?: string
}

const statusIcons: Record<WorkflowStep["status"], LucideIcon> = {
  pending: Circle,
  current: Clock,
  completed: Check,
  error: AlertCircle,
}

const statusColors: Record<WorkflowStep["status"], string> = {
  pending: "text-muted-foreground bg-muted",
  current: "text-primary bg-primary/10 border-2 border-primary",
  completed: "text-primary-foreground bg-primary",
  error: "text-destructive-foreground bg-destructive",
}

export function WorkflowStepper({
  steps,
  orientation = "horizontal",
  onStepClick,
  className,
}: WorkflowStepperProps) {
  const { locale } = useBrand()
  const isVertical = orientation === "vertical"

  return (
    <div
      className={cn(
        "flex gap-4",
        isVertical ? "flex-col" : "flex-row items-center",
        className
      )}
    >
      {steps.map((step, index) => {
        const Icon = statusIcons[step.status]
        const isLast = index === steps.length - 1

        return (
          <div
            key={step.id}
            className={cn(
              "flex gap-3",
              isVertical ? "flex-row" : "flex-col items-center flex-1"
            )}
          >
            {/* Step indicator and connector */}
            <div
              className={cn(
                "flex items-center",
                isVertical ? "flex-col" : "flex-row w-full"
              )}
            >
              {/* Step circle */}
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onStepClick?.(step, index)}
                disabled={!onStepClick}
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
                  statusColors[step.status],
                  onStepClick && "cursor-pointer hover:ring-2 hover:ring-primary/20"
                )}
              >
                <Icon className="h-5 w-5" />
                {step.status === "current" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "bg-border",
                    isVertical ? "h-8 w-0.5 my-1" : "h-0.5 flex-1 mx-2"
                  )}
                >
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ [isVertical ? "height" : "width"]: "0%" }}
                    animate={{
                      [isVertical ? "height" : "width"]:
                        step.status === "completed" ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    style={isVertical ? { width: "100%" } : { height: "100%" }}
                  />
                </div>
              )}
            </div>

            {/* Step content */}
            <div
              className={cn(
                "flex flex-col",
                isVertical ? "flex-1 pb-4" : "text-center mt-2"
              )}
            >
              <span
                className={cn(
                  "font-medium text-sm",
                  step.status === "current"
                    ? "text-primary"
                    : step.status === "completed"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </span>
              )}
              {step.timestamp && (
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(step.timestamp).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                    { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
                  )}
                </span>
              )}
              {step.assignee && (
                <span className="text-xs text-muted-foreground">
                  {t(locale, "workflow.assignedTo")}: {step.assignee}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
