/**
 * Mock Data System
 *
 * This file provides realistic mock data for the internal tool template.
 * In a real application, this would be replaced with actual API calls.
 */

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "member" | "viewer"
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "completed" | "archived"
  priority: "low" | "medium" | "high" | "critical"
  owner: User
  members: User[]
  createdAt: string
  updatedAt: string
  progress: number
  tags: string[]
}

export interface ActivityItem {
  id: string
  type: "project.created" | "project.updated" | "user.joined" | "task.completed" | "comment.added" | "file.uploaded" | "settings.changed"
  title: string
  description: string
  user: User
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface KPIData {
  label: string
  value: string | number
  change: number
  changeLabel: string
  trend: "up" | "down" | "neutral"
}

export interface ChartDataPoint {
  name: string
  value: number
  secondary?: number
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "admin",
  },
  {
    id: "user-2",
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    role: "member",
  },
  {
    id: "user-3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    role: "member",
  },
  {
    id: "user-4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "viewer",
  },
  {
    id: "user-5",
    name: "Alex Thompson",
    email: "alex.t@example.com",
    role: "member",
  },
]

export const currentUser = mockUsers[0]

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Platform Migration",
    description: "Migrate legacy systems to the new cloud infrastructure",
    status: "active",
    priority: "critical",
    owner: mockUsers[0],
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z",
    progress: 67,
    tags: ["infrastructure", "cloud", "migration"],
  },
  {
    id: "proj-2",
    name: "Q4 Analytics Dashboard",
    description: "Build comprehensive analytics dashboard for quarterly reports",
    status: "active",
    priority: "high",
    owner: mockUsers[1],
    members: [mockUsers[1], mockUsers[3]],
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-12-19T16:45:00Z",
    progress: 89,
    tags: ["analytics", "reporting", "dashboard"],
  },
  {
    id: "proj-3",
    name: "Security Audit",
    description: "Annual security compliance audit and remediation",
    status: "active",
    priority: "high",
    owner: mockUsers[0],
    members: [mockUsers[0], mockUsers[4]],
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-18T11:20:00Z",
    progress: 34,
    tags: ["security", "compliance", "audit"],
  },
  {
    id: "proj-4",
    name: "Mobile App v2.0",
    description: "Major version update with redesigned UI and new features",
    status: "paused",
    priority: "medium",
    owner: mockUsers[2],
    members: [mockUsers[2], mockUsers[1], mockUsers[4]],
    createdAt: "2024-09-15T14:00:00Z",
    updatedAt: "2024-11-30T09:15:00Z",
    progress: 45,
    tags: ["mobile", "app", "redesign"],
  },
  {
    id: "proj-5",
    name: "API Documentation",
    description: "Comprehensive API documentation and developer portal",
    status: "completed",
    priority: "medium",
    owner: mockUsers[3],
    members: [mockUsers[3]],
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2024-10-15T17:00:00Z",
    progress: 100,
    tags: ["documentation", "api", "developer-experience"],
  },
  {
    id: "proj-6",
    name: "Data Pipeline Optimization",
    description: "Optimize ETL pipelines for better performance",
    status: "active",
    priority: "medium",
    owner: mockUsers[4],
    members: [mockUsers[4], mockUsers[0]],
    createdAt: "2024-11-01T11:00:00Z",
    updatedAt: "2024-12-17T13:30:00Z",
    progress: 52,
    tags: ["data", "optimization", "etl"],
  },
  {
    id: "proj-7",
    name: "Customer Portal Redesign",
    description: "Modernize the customer-facing portal with improved UX",
    status: "archived",
    priority: "low",
    owner: mockUsers[1],
    members: [mockUsers[1], mockUsers[2]],
    createdAt: "2024-05-01T09:00:00Z",
    updatedAt: "2024-08-30T16:00:00Z",
    progress: 100,
    tags: ["customer", "portal", "ux"],
  },
]

// Mock Activity
export const mockActivity: ActivityItem[] = [
  {
    id: "act-1",
    type: "project.updated",
    title: "Platform Migration updated",
    description: "Progress increased to 67%",
    user: mockUsers[0],
    timestamp: "2024-12-20T14:30:00Z",
    metadata: { projectId: "proj-1", field: "progress", oldValue: 65, newValue: 67 },
  },
  {
    id: "act-2",
    type: "task.completed",
    title: "Database schema migration completed",
    description: "All tables successfully migrated to new schema",
    user: mockUsers[1],
    timestamp: "2024-12-20T13:15:00Z",
    metadata: { projectId: "proj-1", taskId: "task-42" },
  },
  {
    id: "act-3",
    type: "comment.added",
    title: "New comment on Q4 Analytics Dashboard",
    description: "Reviewed the latest metrics implementation",
    user: mockUsers[3],
    timestamp: "2024-12-20T11:45:00Z",
    metadata: { projectId: "proj-2" },
  },
  {
    id: "act-4",
    type: "file.uploaded",
    title: "Security audit report uploaded",
    description: "Q4 preliminary findings document",
    user: mockUsers[4],
    timestamp: "2024-12-20T10:30:00Z",
    metadata: { projectId: "proj-3", fileName: "security-audit-q4-2024.pdf" },
  },
  {
    id: "act-5",
    type: "user.joined",
    title: "Alex Thompson joined Security Audit",
    description: "Added as a team member",
    user: mockUsers[4],
    timestamp: "2024-12-19T16:00:00Z",
    metadata: { projectId: "proj-3" },
  },
  {
    id: "act-6",
    type: "project.created",
    title: "New project created",
    description: "Data Pipeline Optimization project initialized",
    user: mockUsers[4],
    timestamp: "2024-12-19T14:20:00Z",
    metadata: { projectId: "proj-6" },
  },
  {
    id: "act-7",
    type: "settings.changed",
    title: "Project settings updated",
    description: "Changed notification preferences for Mobile App v2.0",
    user: mockUsers[2],
    timestamp: "2024-12-19T11:00:00Z",
    metadata: { projectId: "proj-4" },
  },
  {
    id: "act-8",
    type: "task.completed",
    title: "API endpoint documentation completed",
    description: "All 47 endpoints documented with examples",
    user: mockUsers[3],
    timestamp: "2024-12-18T17:30:00Z",
    metadata: { projectId: "proj-5" },
  },
  {
    id: "act-9",
    type: "project.updated",
    title: "Q4 Analytics Dashboard updated",
    description: "Added new chart components",
    user: mockUsers[1],
    timestamp: "2024-12-18T15:45:00Z",
    metadata: { projectId: "proj-2" },
  },
  {
    id: "act-10",
    type: "comment.added",
    title: "New comment on Platform Migration",
    description: "Discussed rollback strategy",
    user: mockUsers[0],
    timestamp: "2024-12-18T14:00:00Z",
    metadata: { projectId: "proj-1" },
  },
]

// Mock KPIs
export const mockKPIs: KPIData[] = [
  {
    label: "Active Projects",
    value: 4,
    change: 12,
    changeLabel: "vs last month",
    trend: "up",
  },
  {
    label: "Tasks Completed",
    value: 128,
    change: 23,
    changeLabel: "vs last week",
    trend: "up",
  },
  {
    label: "Team Members",
    value: 5,
    change: 0,
    changeLabel: "no change",
    trend: "neutral",
  },
  {
    label: "Avg. Completion Rate",
    value: "87%",
    change: -3,
    changeLabel: "vs last month",
    trend: "down",
  },
]

// Mock Chart Data
export const mockChartData: ChartDataPoint[] = [
  { name: "Mon", value: 12, secondary: 8 },
  { name: "Tue", value: 19, secondary: 14 },
  { name: "Wed", value: 15, secondary: 11 },
  { name: "Thu", value: 22, secondary: 18 },
  { name: "Fri", value: 28, secondary: 21 },
  { name: "Sat", value: 8, secondary: 5 },
  { name: "Sun", value: 6, secondary: 4 },
]

export const mockMonthlyData: ChartDataPoint[] = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 72 },
  { name: "Mar", value: 68 },
  { name: "Apr", value: 85 },
  { name: "May", value: 78 },
  { name: "Jun", value: 92 },
  { name: "Jul", value: 88 },
  { name: "Aug", value: 95 },
  { name: "Sep", value: 102 },
  { name: "Oct", value: 98 },
  { name: "Nov", value: 110 },
  { name: "Dec", value: 125 },
]

// Notification types
export interface Notification {
  id: string
  title: string
  description: string
  read: boolean
  timestamp: string
  type: "info" | "warning" | "success" | "error"
}

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Platform Migration at 67%",
    description: "Great progress on the migration project",
    read: false,
    timestamp: "2024-12-20T14:30:00Z",
    type: "success",
  },
  {
    id: "notif-2",
    title: "Security audit reminder",
    description: "Quarterly review due in 5 days",
    read: false,
    timestamp: "2024-12-20T10:00:00Z",
    type: "warning",
  },
  {
    id: "notif-3",
    title: "New team member",
    description: "Alex Thompson joined your project",
    read: true,
    timestamp: "2024-12-19T16:00:00Z",
    type: "info",
  },
]

// Helper functions
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id)
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function getActivityForProject(projectId: string): ActivityItem[] {
  return mockActivity.filter(
    (a) => a.metadata?.projectId === projectId
  )
}

export function getProjectsByStatus(status: Project["status"]): Project[] {
  return mockProjects.filter((p) => p.status === status)
}

export function searchProjects(query: string): Project[] {
  const lowercaseQuery = query.toLowerCase()
  return mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowercaseQuery))
  )
}
