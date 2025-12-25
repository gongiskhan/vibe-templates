"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  Settings,
  Puzzle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useBrand } from "@/brand"
import { t } from "@/i18n"

interface NavItem {
  titleKey: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    titleKey: "nav.dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    titleKey: "nav.projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    titleKey: "nav.activity",
    href: "/activity",
    icon: Activity,
  },
  {
    titleKey: "nav.settings",
    href: "/settings",
    icon: Settings,
  },
  {
    titleKey: "nav.playground",
    href: "/playground",
    icon: Puzzle,
  },
]

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()
  const { brand, resolvedTheme, locale } = useBrand()

  const logoSrc = collapsed
    ? resolvedTheme === "dark"
      ? brand.logo.iconDark || brand.logo.icon
      : brand.logo.icon
    : resolvedTheme === "dark"
      ? brand.logo.fullDark || brand.logo.full
      : brand.logo.full

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen",
        "bg-sidebar text-sidebar-foreground",
        "flex flex-col",
        "border-r border-sidebar-border/50"
      )}
    >
      {/* Gradient glow effect at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(239_84%_67%/0.5)] to-transparent" />

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border/30 px-4">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <motion.div
            initial={false}
            animate={{ width: collapsed ? 40 : 180 }}
            className="relative h-9"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={brand.appName}
              className="h-9 w-auto object-contain object-left transition-transform duration-200 group-hover:scale-105"
            />
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const title = t(locale, item.titleKey)

            const navLink = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-muted/50",
                  collapsed && "justify-center px-2"
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Active state gradient background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[hsl(239_84%_67%)] to-[hsl(280_75%_60%)]"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                {/* Hover glow effect */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200",
                    "bg-gradient-to-r from-[hsl(239_84%_67%/0.1)] to-[hsl(188_94%_43%/0.1)]",
                    !isActive && "group-hover:opacity-100"
                  )}
                />

                {/* Icon with glow on active */}
                <div className="relative z-10">
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-200",
                      isActive && "drop-shadow-[0_0_8px_hsl(239_84%_67%/0.5)]"
                    )}
                  />
                </div>

                {/* Label */}
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10 truncate"
                    >
                      {title}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator dot for collapsed state */}
                {isActive && collapsed && (
                  <motion.div
                    className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_hsl(239_84%_67%)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="bg-sidebar text-sidebar-foreground border-sidebar-border/50 shadow-xl"
                  >
                    {title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navLink
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="border-t border-sidebar-border/30 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn(
            "w-full justify-center",
            "text-sidebar-foreground/70 hover:text-sidebar-foreground",
            "hover:bg-sidebar-muted/50",
            "transition-all duration-200"
          )}
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="ml-2"
              >
                {t(locale, "nav.collapse")}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Bottom gradient glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[hsl(188_94%_43%/0.3)] to-transparent" />
    </motion.aside>
  )
}
