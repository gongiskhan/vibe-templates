# UI Components Guidelines

This document outlines the component patterns and guidelines used across all templates.

## Component Categories

### Layout Components

| Component | Purpose | Used In |
|-----------|---------|---------|
| `AppShell` | Main app wrapper with sidebar | Internal apps |
| `Sidebar` | Navigation sidebar | Internal apps |
| `Header` | Top navigation bar | All apps |
| `MobileSidebar` | Responsive sidebar for mobile | Internal apps |

### Navigation Components

| Component | Purpose |
|-----------|---------|
| `CommandPalette` | Keyboard-driven command search |
| `Breadcrumbs` | Page hierarchy navigation |
| `Tabs` | Section switching |

### Data Display Components

| Component | Purpose |
|-----------|---------|
| `DataTable` | Sortable, filterable tables |
| `KPICard` | Metric display cards |
| `Chart` | Data visualizations |
| `Badge` | Status indicators |
| `Avatar` | User representations |

### Form Components

| Component | Purpose |
|-----------|---------|
| `Input` | Text input fields |
| `Select` | Dropdown selections |
| `Checkbox` | Toggle options |
| `Switch` | Binary toggles |
| `Textarea` | Multi-line text |
| `DatePicker` | Date selection |

### Feedback Components

| Component | Purpose |
|-----------|---------|
| `Toast` | Temporary notifications |
| `Alert` | Inline messages |
| `Dialog` | Modal dialogs |
| `Drawer` | Side panel overlays |
| `Skeleton` | Loading placeholders |

### Action Components

| Component | Purpose |
|-----------|---------|
| `Button` | Primary actions |
| `DropdownMenu` | Action menus |
| `Tooltip` | Hover information |

## Component Patterns

### Naming Conventions

- Use PascalCase for component names
- Prefix feature-specific components: `ProjectCard`, `AgentPicker`
- Use descriptive suffixes: `Modal`, `Drawer`, `Panel`, `List`

### File Structure

```
src/components/
├── ui/                 # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── layout/             # Layout components
│   ├── app-shell.tsx
│   ├── sidebar.tsx
│   └── header.tsx
├── [feature]/          # Feature-specific components
│   ├── index.ts        # Barrel exports
│   └── [component].tsx
└── shared/             # Cross-feature components
    ├── data-table.tsx
    └── empty-state.tsx
```

### Component Template

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { t } from "@/i18n"
import { useBrand } from "@/brand"

interface MyComponentProps {
  className?: string
  children?: React.ReactNode
}

export function MyComponent({
  className,
  children,
}: MyComponentProps) {
  const { locale } = useBrand()

  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  )
}
```

## Accessibility Guidelines

### Keyboard Navigation

- All interactive elements must be focusable
- Use proper focus indicators
- Support Escape to close modals/dropdowns
- Command palette: Cmd/Ctrl + K

### Screen Readers

- Use semantic HTML elements
- Provide aria-labels for icon buttons
- Include alt text for images
- Use role attributes appropriately

### Color Contrast

- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Don't rely solely on color to convey meaning

## Animation Guidelines

Using Framer Motion for animations:

### Entry Animations

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
```

### Exit Animations

```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
```

### Performance

- Use `layout` prop sparingly
- Prefer `transform` and `opacity` animations
- Set `initial={false}` for state-driven animations
- Use `AnimatePresence` for exit animations

## Responsive Design

### Breakpoints

| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Common Patterns

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Hide/show elements
<div className="hidden md:block">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

## Dark Mode

All components must support dark mode via the branding tokens:

```tsx
// Use semantic color classes
<div className="bg-card text-card-foreground">

// Use brand variables
<div className="text-[hsl(var(--brand-primary))]">
```

Never hardcode colors. Always use tokens or semantic classes.
