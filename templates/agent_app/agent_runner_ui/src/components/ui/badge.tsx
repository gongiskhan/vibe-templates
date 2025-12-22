import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary-foreground))] shadow",
        secondary:
          "border-transparent bg-[hsl(var(--brand-bg-secondary))] text-[hsl(var(--brand-fg))]",
        destructive:
          "border-transparent bg-[hsl(var(--brand-error))] text-white shadow",
        success:
          "border-transparent bg-[hsl(var(--brand-success))] text-white shadow",
        warning:
          "border-transparent bg-[hsl(var(--brand-warning))] text-white shadow",
        outline: "text-[hsl(var(--brand-fg))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
