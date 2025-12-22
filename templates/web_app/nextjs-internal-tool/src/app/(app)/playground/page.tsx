"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Check,
  ChevronRight,
  Copy,
  Info,
  AlertCircle,
  XCircle,
  Inbox,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

function ComponentSection({
  title,
  description,
  children,
  index = 0,
}: {
  title: string
  description: string
  children: React.ReactNode
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

export default function PlaygroundPage() {
  const [isLoading, setIsLoading] = React.useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
        <p className="text-muted-foreground">
          A showcase of all available components and patterns in this template.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Buttons */}
        <ComponentSection
          title="Buttons"
          description="Various button styles and states"
          index={0}
        >
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Check className="h-4 w-4" />
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled</Button>
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          </div>
        </ComponentSection>

        {/* Inputs */}
        <ComponentSection
          title="Inputs"
          description="Text inputs, textareas, and form controls"
          index={1}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="default-input">Default input</Label>
              <Input id="default-input" placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled-input">Disabled input</Label>
              <Input id="disabled-input" disabled value="Disabled" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="textarea">Textarea</Label>
            <Textarea id="textarea" placeholder="Enter longer text..." rows={3} />
          </div>
        </ComponentSection>

        {/* Selects & Checkboxes */}
        <ComponentSection
          title="Selects & Toggles"
          description="Dropdowns, checkboxes, and switches"
          index={2}
        >
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Option 1</SelectItem>
                  <SelectItem value="2">Option 2</SelectItem>
                  <SelectItem value="3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
          </div>
        </ComponentSection>

        {/* Badges */}
        <ComponentSection
          title="Badges"
          description="Status indicators and labels"
          index={3}
        >
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </ComponentSection>

        {/* Tabs */}
        <ComponentSection
          title="Tabs"
          description="Tabbed content navigation"
          index={4}
        >
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Overview</TabsTrigger>
              <TabsTrigger value="tab2">Details</TabsTrigger>
              <TabsTrigger value="tab3">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Overview tab content goes here. This is a simple text example.
              </p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Details tab with more specific information.
              </p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Settings tab for configuration options.
              </p>
            </TabsContent>
          </Tabs>
        </ComponentSection>

        {/* Dialog & Sheet */}
        <ComponentSection
          title="Dialog & Sheet"
          description="Modal dialogs and side panels"
          index={5}
        >
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Example Dialog</DialogTitle>
                  <DialogDescription>
                    This is a dialog component. Use it for confirmations, forms,
                    or important information.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Dialog content goes here. You can add any content including
                    forms, lists, or other components.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Example Sheet</SheetTitle>
                  <SheetDescription>
                    This is a sheet (drawer) component. Use it for details, forms,
                    or navigation.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Sheet content goes here. Sheets are great for showing details
                    without navigating away from the current page.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </ComponentSection>

        {/* Toast */}
        <ComponentSection
          title="Toast"
          description="Notification toasts"
          index={6}
        >
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Default toast",
                  description: "This is a default notification.",
                })
              }
            >
              Default Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Success!",
                  description: "Operation completed successfully.",
                  variant: "success",
                })
              }
            >
              Success Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Error",
                  description: "Something went wrong.",
                  variant: "destructive",
                })
              }
            >
              Error Toast
            </Button>
          </div>
        </ComponentSection>

        {/* Tooltips */}
        <ComponentSection
          title="Tooltips"
          description="Contextual information on hover"
          index={7}
        >
          <div className="flex flex-wrap gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Info className="mr-2 h-4 w-4" />
                  Hover me
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </ComponentSection>

        {/* Empty State */}
        <ComponentSection
          title="Empty State"
          description="Placeholder when no data is available"
          index={8}
        >
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <div className="rounded-full bg-muted p-3">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
              Get started by creating your first item. It only takes a few
              seconds.
            </p>
            <Button className="mt-4">
              Create item
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </ComponentSection>

        {/* Loading Skeletons */}
        <ComponentSection
          title="Loading Skeletons"
          description="Placeholder content during loading"
          index={9}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Button variant="outline" onClick={simulateLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Simulate loading"
              )}
            </Button>
          </div>
        </ComponentSection>

        {/* Error State */}
        <ComponentSection
          title="Error State"
          description="Display when something goes wrong"
          index={10}
        >
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-destructive">
                  Something went wrong
                </h4>
                <p className="text-sm text-muted-foreground">
                  We encountered an error while processing your request. Please
                  try again or contact support if the issue persists.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ComponentSection>

        {/* Info/Warning Cards */}
        <ComponentSection
          title="Alert Cards"
          description="Information and warning callouts"
          index={11}
        >
          <div className="space-y-4">
            <div className="flex gap-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-4">
              <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Helpful tip
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Use Cmd+K to open the command palette and quickly navigate.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Warning
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This action cannot be undone. Please proceed with caution.
                </p>
              </div>
            </div>
          </div>
        </ComponentSection>
      </div>
    </div>
  )
}
