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

// Workflow Types
export interface Approval {
  id: string
  title: string
  description: string
  requestedBy: User
  requestedAt: string
  dueDate?: string
  status: "pending" | "approved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  details: Record<string, string | number>
}

export interface WorkflowStep {
  id: string
  title: string
  description?: string
  status: "pending" | "current" | "completed" | "error"
  timestamp?: string
  assignee?: string
}

export interface TimelineEvent {
  id: string
  type: "created" | "submitted" | "approved" | "rejected" | "comment" | "assigned" | "updated" | "completed" | "cancelled" | "reopened"
  title: string
  description?: string
  user: User
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt?: string
  replies?: Comment[]
  isEdited?: boolean
}

// Mock Approvals
export const mockApprovals: Approval[] = [
  {
    id: "appr-1",
    title: "Solicitação de Orçamento - Marketing Q1",
    description: "Aprovação de orçamento para campanha de marketing do primeiro trimestre de 2025",
    requestedBy: mockUsers[1],
    requestedAt: "2024-12-20T09:00:00Z",
    dueDate: "2024-12-27T18:00:00Z",
    status: "pending",
    priority: "high",
    category: "Orçamento",
    details: {
      valor: "R$ 150.000,00",
      departamento: "Marketing",
      centro_custo: "MKT-001",
      periodo: "Jan-Mar 2025",
    },
  },
  {
    id: "appr-2",
    title: "Férias - Carlos Silva",
    description: "Solicitação de férias para o período de 15/01 a 30/01/2025",
    requestedBy: mockUsers[2],
    requestedAt: "2024-12-19T14:30:00Z",
    dueDate: "2024-12-24T18:00:00Z",
    status: "pending",
    priority: "medium",
    category: "RH",
    details: {
      funcionario: "Carlos Silva",
      inicio: "15/01/2025",
      fim: "30/01/2025",
      dias: 15,
    },
  },
  {
    id: "appr-3",
    title: "Contratação - Desenvolvedor Senior",
    description: "Aprovação para abertura de vaga de desenvolvedor senior na equipe de produto",
    requestedBy: mockUsers[0],
    requestedAt: "2024-12-18T10:00:00Z",
    status: "pending",
    priority: "urgent",
    category: "RH",
    details: {
      cargo: "Desenvolvedor Senior",
      salario: "R$ 18.000,00",
      equipe: "Produto",
      inicio_previsto: "Fev 2025",
    },
  },
  {
    id: "appr-4",
    title: "Compra de Equipamentos",
    description: "Aquisição de notebooks para nova equipe de suporte",
    requestedBy: mockUsers[3],
    requestedAt: "2024-12-17T16:00:00Z",
    status: "approved",
    priority: "medium",
    category: "TI",
    details: {
      quantidade: 5,
      modelo: "MacBook Pro 14",
      valor_unitario: "R$ 15.000,00",
      valor_total: "R$ 75.000,00",
    },
  },
  {
    id: "appr-5",
    title: "Viagem Corporativa - Conferência Tech",
    description: "Participação na conferência de tecnologia em São Paulo",
    requestedBy: mockUsers[4],
    requestedAt: "2024-12-15T11:00:00Z",
    status: "rejected",
    priority: "low",
    category: "Viagem",
    details: {
      destino: "São Paulo",
      data_ida: "20/01/2025",
      data_volta: "23/01/2025",
      custo_estimado: "R$ 5.000,00",
    },
  },
]

// Mock Workflow Steps
export const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: "step-1",
    title: "Solicitação Enviada",
    description: "Pedido criado pelo solicitante",
    status: "completed",
    timestamp: "2024-12-20T09:00:00Z",
    assignee: "Marcus Johnson",
  },
  {
    id: "step-2",
    title: "Análise Gerente",
    description: "Revisão pelo gerente direto",
    status: "completed",
    timestamp: "2024-12-20T11:30:00Z",
    assignee: "Sarah Chen",
  },
  {
    id: "step-3",
    title: "Aprovação Diretoria",
    description: "Aprovação final pela diretoria",
    status: "current",
    assignee: "David Kim",
  },
  {
    id: "step-4",
    title: "Execução",
    description: "Implementação do pedido aprovado",
    status: "pending",
  },
]

// Mock Timeline Events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "evt-1",
    type: "created",
    title: "Solicitação criada",
    description: "Nova solicitação de orçamento iniciada",
    user: mockUsers[1],
    timestamp: "2024-12-20T09:00:00Z",
  },
  {
    id: "evt-2",
    type: "submitted",
    title: "Enviado para aprovação",
    description: "Solicitação enviada para análise do gerente",
    user: mockUsers[1],
    timestamp: "2024-12-20T09:05:00Z",
  },
  {
    id: "evt-3",
    type: "comment",
    title: "Comentário adicionado",
    user: mockUsers[0],
    timestamp: "2024-12-20T10:30:00Z",
    metadata: {
      content: "Por favor, adicionar detalhamento das campanhas previstas para cada mês.",
    },
  },
  {
    id: "evt-4",
    type: "updated",
    title: "Solicitação atualizada",
    description: "Documentos anexados com detalhamento",
    user: mockUsers[1],
    timestamp: "2024-12-20T11:00:00Z",
  },
  {
    id: "evt-5",
    type: "approved",
    title: "Aprovado pelo Gerente",
    description: "Análise concluída, encaminhado para diretoria",
    user: mockUsers[0],
    timestamp: "2024-12-20T11:30:00Z",
  },
  {
    id: "evt-6",
    type: "assigned",
    title: "Atribuído para aprovação final",
    description: "Aguardando aprovação da diretoria",
    user: mockUsers[3],
    timestamp: "2024-12-20T11:35:00Z",
  },
]

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: "cmt-1",
    content: "Por favor, adicionar detalhamento das campanhas previstas para cada mês.",
    author: mockUsers[0],
    createdAt: "2024-12-20T10:30:00Z",
    replies: [
      {
        id: "cmt-1-1",
        content: "Documentos adicionados em anexo com o planejamento completo.",
        author: mockUsers[1],
        createdAt: "2024-12-20T11:00:00Z",
      },
    ],
  },
  {
    id: "cmt-2",
    content: "Orçamento está dentro do previsto para o período. Aprovado pela minha parte.",
    author: mockUsers[0],
    createdAt: "2024-12-20T11:30:00Z",
  },
]

// Helper functions for workflow
export function getApprovalById(id: string): Approval | undefined {
  return mockApprovals.find((a) => a.id === id)
}

export function getApprovalsByStatus(status: Approval["status"]): Approval[] {
  return mockApprovals.filter((a) => a.status === status)
}

export function getPendingApprovalsCount(): number {
  return mockApprovals.filter((a) => a.status === "pending").length
}
