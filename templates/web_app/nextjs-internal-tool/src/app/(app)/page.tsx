"use client"

import { mockKPIs } from "@/lib/mock-data"
import { KPICard, ActivityChart, RecentActivity, QuickActions } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your projects.
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
