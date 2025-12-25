"use client"

import * as React from "react"
import { Search, Bell, Menu, Sun, Moon, Monitor, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBrand } from "@/brand"
import { currentUser, mockNotifications, type Notification } from "@/lib/mock-data"
import { formatRelativeTime } from "@/lib/utils"

interface HeaderProps {
  onMenuClick: () => void
  onSearchClick: () => void
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const { brand, theme, setTheme } = useBrand()
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-500"
      case "warning":
        return "bg-amber-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-[hsl(239_84%_67%)]"
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(239_84%_67%/0.2)] to-transparent" />

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden hover:bg-primary/10"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Search */}
      <Button
        variant="outline"
        className="relative h-10 w-full max-w-sm justify-start gap-3 rounded-xl border-border/50 bg-muted/30 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm md:w-72 lg:w-96"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4 text-muted-foreground/70" />
        <span className="hidden sm:inline-flex">Search anything...</span>
        <kbd className="pointer-events-none absolute right-3 hidden h-6 select-none items-center gap-1 rounded-md border border-border/50 bg-background/80 px-2 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          <span className="text-xs">Cmd</span>K
        </kbd>
      </Button>

      <div className="flex-1" />

      {/* Theme toggle */}
      {brand.features.allowThemeToggle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative overflow-hidden rounded-xl hover:bg-primary/10"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="gap-3 rounded-lg"
            >
              <Sun className="h-4 w-4" />
              Light
              {theme === "light" && (
                <Sparkles className="ml-auto h-3 w-3 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="gap-3 rounded-lg"
            >
              <Moon className="h-4 w-4" />
              Dark
              {theme === "dark" && (
                <Sparkles className="ml-auto h-3 w-3 text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="gap-3 rounded-lg"
            >
              <Monitor className="h-4 w-4" />
              System
              {theme === "system" && (
                <Sparkles className="ml-auto h-3 w-3 text-primary" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-primary/10"
          >
            <Bell className="h-5 w-5" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[hsl(239_84%_67%)] to-[hsl(330_81%_60%)] text-[10px] font-bold text-white shadow-lg shadow-primary/30"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
          <DropdownMenuLabel className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-[hsl(239_84%_67%)] to-[hsl(280_75%_60%)] text-white border-0"
              >
                {unreadCount} new
              </Badge>
            )}
          </DropdownMenuLabel>
          <ScrollArea className="h-80">
            {mockNotifications.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <Bell className="h-8 w-8 opacity-30" />
                <span>No notifications</span>
              </div>
            ) : (
              <div className="p-2">
                {mockNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem className="flex flex-col items-start gap-2 rounded-xl p-3 cursor-pointer">
                      <div className="flex w-full items-start gap-3">
                        <div className="relative mt-1">
                          <span
                            className={`block h-2 w-2 rounded-full ${getNotificationIcon(
                              notification.type
                            )} ${notification.read ? "opacity-30" : ""}`}
                          />
                          {!notification.read && (
                            <span
                              className={`absolute inset-0 h-2 w-2 rounded-full ${getNotificationIcon(
                                notification.type
                              )} animate-ping opacity-75`}
                            />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p
                            className={`text-sm leading-tight ${
                              notification.read
                                ? "text-muted-foreground"
                                : "font-medium text-foreground"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/70">
                            {formatRelativeTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full ring-2 ring-transparent transition-all hover:ring-primary/20"
          >
            <Avatar className="h-9 w-9 border-2 border-transparent bg-gradient-to-br from-[hsl(239_84%_67%)] to-[hsl(280_75%_60%)]">
              <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-3 rounded-lg">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 rounded-lg">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 rounded-lg">
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-3 rounded-lg text-destructive focus:text-destructive">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
