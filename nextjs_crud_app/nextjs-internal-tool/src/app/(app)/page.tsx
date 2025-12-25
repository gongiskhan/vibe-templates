"use client"

import { mockKPIs } from "@/lib/mock-data"
import { KPICard, ActivityChart, RecentActivity, QuickActions } from "@/components/dashboard"
import { useBrand } from "@/brand"
import { t } from "@/i18n"

export default function DashboardPage() {
  const { locale } = useBrand()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t(locale, "dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t(locale, "dashboard.subtitle")}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.map((kpi, index) => (
          <KPICard key={kpi.label} data={kpi} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart - Takes up more space */}
        <div className="lg:col-span-4">
          <ActivityChart />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity - Full width */}
      <div>
        <RecentActivity />
      </div>
    </div>
  )
}
