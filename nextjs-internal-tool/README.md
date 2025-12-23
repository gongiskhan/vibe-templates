# Web App Internal Tool Template

A production-grade, modern internal tool template built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. This template provides a complete foundation for building enterprise-ready internal applications.

## Features

- **Modern Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui components with custom theming
- **Branding System**: Fully customizable brand tokens and theming
- **Responsive Design**: Mobile-first with collapsible sidebar
- **Dark Mode**: System-aware with manual override
- **Motion**: Tasteful animations with Framer Motion
- **Command Palette**: Global Cmd/Ctrl+K search

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Authenticated app routes
│   │   ├── page.tsx       # Dashboard
│   │   ├── activity/      # Activity/Audit trail
│   │   ├── projects/      # Projects CRUD
│   │   ├── settings/      # Settings
│   │   └── playground/    # Component showcase
│   ├── (auth)/            # Auth routes
│   │   └── login/         # Login page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── brand/                  # Brand customization
│   ├── tokens.css         # CSS design tokens
│   ├── brand.config.ts    # Brand metadata
│   ├── brand-provider.tsx # Theme context
│   └── assets/            # Logo placeholders
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # App shell components
│   ├── dashboard/         # Dashboard components
│   └── projects/          # Project components
├── hooks/                  # Custom React hooks
└── lib/
    ├── utils.ts           # Utility functions
    └── mock-data.ts       # Mock data for demo
```

## Branding Contract

This template uses a strict branding system. To customize the look and feel:

### 1. Edit Design Tokens

Modify `src/brand/tokens.css` to change colors, typography, and spacing:

```css
:root {
  /* Primary brand color */
  --brand-primary: 222 47% 51%;
  --brand-primary-foreground: 0 0% 100%;

  /* Accent color */
  --brand-accent: 262 83% 58%;

  /* Surface colors */
  --brand-bg: 0 0% 100%;
  --brand-fg: 224 71% 4%;

  /* Typography */
  --brand-font-sans: system-ui, -apple-system, sans-serif;

  /* Shape */
  --brand-radius: 0.5rem;
}
```

Both light and dark mode tokens are defined in this file.

### 2. Update Brand Config

Edit `src/brand/brand.config.ts` to change app metadata:

```typescript
export const brandConfig: BrandConfig = {
  name: "Your Company",
  appName: "Your App",
  defaultTitle: "Your App | Tagline",
  description: "Your app description",
  logo: {
    full: "/brand/logo-full.svg",
    icon: "/brand/logo-icon.svg",
    fullDark: "/brand/logo-full-dark.svg",
    iconDark: "/brand/logo-icon-dark.svg",
  },
  // ...
}
```

### 3. Replace Logo Assets

Replace the SVG files in `public/brand/`:
- `logo-full.svg` - Full logo with text (240x40)
- `logo-icon.svg` - Icon only (32x32)
- `logo-full-dark.svg` - Full logo for dark backgrounds
- `logo-icon-dark.svg` - Icon for dark backgrounds

## Adding New Pages

1. Create a new folder in `src/app/(app)/`:

```bash
mkdir src/app/\(app\)/your-page
```

2. Create `page.tsx`:

```tsx
export default function YourPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Page</h1>
        <p className="text-muted-foreground">Page description</p>
      </div>
      {/* Your content */}
    </div>
  )
}
```

3. Add navigation in `src/components/layout/sidebar.tsx`:

```tsx
const navItems: NavItem[] = [
  // ... existing items
  {
    title: "Your Page",
    href: "/your-page",
    icon: YourIcon,
  },
]
```

## Available Components

Visit `/playground` to see all available components:

- **Buttons**: Various styles and sizes
- **Inputs**: Text, textarea, select, checkbox, switch
- **Badges**: Status indicators
- **Cards**: Content containers
- **Tabs**: Tabbed navigation
- **Dialog**: Modal dialogs
- **Sheet**: Side panels/drawers
- **Toast**: Notifications
- **Tooltip**: Contextual hints
- **Table**: Data tables with sorting
- **Command**: Command palette
- **Skeleton**: Loading placeholders

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Charts
- [Lucide React](https://lucide.dev/) - Icons

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Customization Tips

### Changing the Primary Color

1. Open `src/brand/tokens.css`
2. Modify `--brand-primary` using HSL values:
   ```css
   --brand-primary: 142 71% 45%; /* Green */
   ```

### Adding Custom Components

1. Create component in `src/components/ui/`
2. Follow shadcn/ui patterns for consistency
3. Use `cn()` utility for class merging
4. Use brand CSS variables for colors

### Connecting to Real APIs

1. Replace mock data in `src/lib/mock-data.ts`
2. Add API routes in `src/app/api/`
3. Use React Query or SWR for data fetching

## License

MIT License - feel free to use this template for any project.
