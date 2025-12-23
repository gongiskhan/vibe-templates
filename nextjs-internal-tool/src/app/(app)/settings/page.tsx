"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sun, Moon, Monitor, ExternalLink, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBrand } from "@/brand"
import { useTranslation } from "@/i18n"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { brand, theme, setTheme, resolvedTheme } = useBrand()
  const { t } = useTranslation()
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    marketing: false,
  })

  const logoSrc =
    resolvedTheme === "dark"
      ? brand.logo.fullDark || brand.logo.full
      : brand.logo.full

  const handleSaveProfile = () => {
    toast({
      title: t("settings.saveChanges"),
      description: t("settings.profileDescription"),
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Brand Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.brand")}</CardTitle>
              <CardDescription>
                {t("settings.brandDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="rounded-lg border bg-muted/50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoSrc}
                    alt={brand.appName}
                    className="h-10 w-auto"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{brand.appName}</p>
                  <p className="text-sm text-muted-foreground">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {brand.description}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Theme Selection */}
              {brand.features.allowThemeToggle && (
                <div className="space-y-4">
                  <Label>{t("settings.themeLabel")}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      {t("common.light")}
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      {t("common.dark")}
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      {t("common.system")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Brand Customization Note */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  {t("settings.brandCustomization")}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile")}</CardTitle>
              <CardDescription>
                {t("settings.profileDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("settings.firstName")}</Label>
                  <Input id="firstName" defaultValue="Sarah" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("settings.lastName")}</Label>
                  <Input id="lastName" defaultValue="Chen" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("settings.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="sarah.chen@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">{t("settings.timezone")}</Label>
                <Select defaultValue="utc-8">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder={t("settings.timezone")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">
                      {t("timezones.pacificTime")}
                    </SelectItem>
                    <SelectItem value="utc-5">
                      {t("timezones.easternTime")}
                    </SelectItem>
                    <SelectItem value="utc+0">{t("timezones.utc")}</SelectItem>
                    <SelectItem value="utc+1">
                      {t("timezones.centralEuropean")}
                    </SelectItem>
                    <SelectItem value="utc+8">
                      {t("timezones.britishTime")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveProfile}>{t("settings.saveChanges")}</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications")}</CardTitle>
              <CardDescription>
                {t("settings.notificationsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.emailNotifications")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.emailNotificationsHelp")}
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.pushNotifications")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.pushNotificationsHelp")}
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.marketingEmails")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.marketingEmailsHelp")}
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.integrations")}</CardTitle>
              <CardDescription>
                {t("settings.integrationsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("settings.connectSlack")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("settings.connectGitHub")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("settings.connectJira")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">{t("settings.dangerZone")}</CardTitle>
              </div>
              <CardDescription>
                {t("projects.deleteWarning")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                <div>
                  <p className="font-medium">{t("settings.exportData")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.exportData")}
                  </p>
                </div>
                <Button variant="outline">{t("settings.exportData")}</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                <div>
                  <p className="font-medium">{t("settings.deleteAccount")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.deleteAccount")}
                  </p>
                </div>
                <Button variant="destructive">{t("common.delete")}</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
