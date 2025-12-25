"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  Settings,
  Puzzle,
  Plus,
  FileText,
  Zap,
  Search,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useBrand } from "@/brand"
import { searchProjects } from "@/lib/mock-data"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const { brand } = useBrand()
  const [search, setSearch] = React.useState("")

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange]
  )

  // Search projects dynamically
  const matchingProjects = React.useMemo(() => {
    if (search.length < 2) return []
    return searchProjects(search).slice(0, 5)
  }, [search])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={`Search ${brand.appName}...`}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // This would open a create project modal in a real app
                router.push("/projects?action=create")
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create new project
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Simulated action
                console.log("Running quick task...")
              })
            }
          >
            <Zap className="mr-2 h-4 w-4" />
            Run quick task
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Simulated action
                console.log("Generating report...")
              })
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate report
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigate">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/projects"))}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            Projects
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/activity"))}
          >
            <Activity className="mr-2 h-4 w-4" />
            Activity
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
            <CommandShortcut>⌘4</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/playground"))}
          >
            <Puzzle className="mr-2 h-4 w-4" />
            Playground
            <CommandShortcut>⌘5</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {/* Search Results */}
        {matchingProjects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {matchingProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() =>
                    runCommand(() =>
                      router.push(`/projects?selected=${project.id}`)
                    )
                  }
                >
                  <Search className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{project.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {project.status} • {project.progress}% complete
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
