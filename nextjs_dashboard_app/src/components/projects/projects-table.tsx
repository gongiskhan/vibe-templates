"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Pause,
  Play,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import type { Project } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

const statusColors: Record<Project["status"], "default" | "success" | "warning" | "secondary"> = {
  active: "success",
  paused: "warning",
  completed: "default",
  archived: "secondary",
}

const priorityColors: Record<Project["priority"], "default" | "destructive" | "warning" | "secondary"> = {
  critical: "destructive",
  high: "warning",
  medium: "default",
  low: "secondary",
}

interface ProjectsTableProps {
  projects: Project[]
  onSelect: (project: Project) => void
}

type SortField = "name" | "status" | "priority" | "progress" | "updatedAt"
type SortDirection = "asc" | "desc"

const columnLabels: Record<string, string> = {
  name: "Name",
  status: "Status",
  priority: "Priority",
  owner: "Owner",
  progress: "Progress",
  updatedAt: "Updated",
}

export function ProjectsTable({ projects, onSelect }: ProjectsTableProps) {
  const [sortField, setSortField] = React.useState<SortField>("updatedAt")
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc")
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(["name", "status", "priority", "owner", "progress", "updatedAt"])
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "priority": {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        }
        case "progress":
          comparison = a.progress - b.progress
          break
        case "updatedAt":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [projects, sortField, sortDirection])

  const toggleSelectAll = () => {
    if (selectedRows.size === projects.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(projects.map((p) => p.id)))
    }
  }

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const toggleColumn = (column: string) => {
    const newVisible = new Set(visibleColumns)
    if (newVisible.has(column)) {
      newVisible.delete(column)
    } else {
      newVisible.add(column)
    }
    setVisibleColumns(newVisible)
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  return (
    <div className="space-y-4">
      {/* Column visibility toggle */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(columnLabels).map(([key, label]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={visibleColumns.has(key)}
                onCheckedChange={() => toggleColumn(key)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === projects.length && projects.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              {visibleColumns.has("name") && (
                <TableHead>
                  <SortableHeader field="name">Name</SortableHeader>
                </TableHead>
              )}
              {visibleColumns.has("status") && (
                <TableHead>
                  <SortableHeader field="status">Status</SortableHeader>
                </TableHead>
              )}
              {visibleColumns.has("priority") && (
                <TableHead>
                  <SortableHeader field="priority">Priority</SortableHeader>
                </TableHead>
              )}
              {visibleColumns.has("owner") && <TableHead>Owner</TableHead>}
              {visibleColumns.has("progress") && (
                <TableHead>
                  <SortableHeader field="progress">Progress</SortableHeader>
                </TableHead>
              )}
              {visibleColumns.has("updatedAt") && (
                <TableHead>
                  <SortableHeader field="updatedAt">Updated</SortableHeader>
                </TableHead>
              )}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.size + 2}
                  className="h-24 text-center text-muted-foreground"
                >
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              sortedProjects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                  onClick={() => onSelect(project)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedRows.has(project.id)}
                      onCheckedChange={() => toggleSelectRow(project.id)}
                      aria-label={`Select ${project.name}`}
                    />
                  </TableCell>
                  {visibleColumns.has("name") && (
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.has("status") && (
                    <TableCell>
                      <Badge variant={statusColors[project.status]}>
                        {project.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.has("priority") && (
                    <TableCell>
                      <Badge variant={priorityColors[project.priority]}>
                        {project.priority}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.has("owner") && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px]">
                            {getInitials(project.owner.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{project.owner.name}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.has("progress") && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.has("updatedAt") && (
                    <TableCell className="text-muted-foreground">
                      {formatDate(project.updatedAt)}
                    </TableCell>
                  )}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onSelect(project)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {project.status === "active" ? (
                          <DropdownMenuItem>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                        ) : project.status === "paused" ? (
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
