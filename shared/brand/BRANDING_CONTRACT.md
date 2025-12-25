# Branding Contract

All templates in this repository follow a consistent branding contract that enables easy rebranding without code changes.

## Overview

To rebrand any template, you only need to modify three things:
1. **tokens.css** - CSS variables for colors, typography, and spacing
2. **brand.config.ts** - Metadata like names, logos, and links
3. **assets/** - Logo SVG files

## File Structure

```
src/brand/
├── tokens.css          # CSS variables (light + dark themes)
├── brand.config.ts     # Brand metadata and configuration
├── brand-provider.tsx  # React context for brand access
├── index.ts            # Exports
└── assets/             # (optional) Brand assets if bundled

public/brand/
├── logo-full.svg       # Full logo with text
├── logo-icon.svg       # Icon-only logo
├── logo-full-dark.svg  # Full logo for dark backgrounds
└── logo-icon-dark.svg  # Icon for dark backgrounds
```

## tokens.css

Defines all brand-specific design tokens as CSS variables:

### Color Tokens

| Token | Purpose |
|-------|---------|
| `--brand-primary` | Primary brand color (CTAs, links, active states) |
| `--brand-primary-foreground` | Text on primary color |
| `--brand-accent` | Secondary highlight color |
| `--brand-accent-foreground` | Text on accent color |
| `--brand-bg` | Main background |
| `--brand-fg` | Main foreground/text |
| `--brand-card` | Card/elevated surface background |
| `--brand-muted` | Subtle backgrounds |
| `--brand-destructive` | Error/delete actions |
| `--brand-border` | Border color |
| `--brand-ring` | Focus ring color |

### Sidebar Tokens (for internal apps)

| Token | Purpose |
|-------|---------|
| `--brand-sidebar-bg` | Sidebar background |
| `--brand-sidebar-fg` | Sidebar text color |
| `--brand-sidebar-border` | Sidebar border |
| `--brand-sidebar-accent` | Active nav item |

### Chart Colors

| Token | Purpose |
|-------|---------|
| `--chart-1` through `--chart-5` | Data visualization palette |

### Typography Tokens

| Token | Purpose |
|-------|---------|
| `--brand-font-sans` | Primary font family |
| `--brand-font-mono` | Monospace font family |
| `--brand-radius` | Base border radius |

## brand.config.ts

TypeScript configuration for brand metadata:

```typescript
export interface BrandConfig {
  name: string              // Company name
  appName: string           // Application name
  defaultTitle: string      // Page title suffix
  description: string       // SEO description
  slogan?: string          // Optional tagline

  logo: {
    full: string           // Path to full logo
    icon: string           // Path to icon logo
    fullDark?: string      // Dark mode full logo
    iconDark?: string      // Dark mode icon
  }

  links: {
    support?: string
    documentation?: string
    privacy?: string
    terms?: string
  }

  features: {
    showPoweredBy: boolean
    allowThemeToggle: boolean
  }

  localization: {
    defaultLocale: 'pt' | 'en'
    supportedLocales: ('pt' | 'en')[]
  }
}
```

## brand-provider.tsx

React context that provides:
- Brand configuration access
- Theme state (light/dark/system)
- Theme switching functionality
- Locale state and switching

Usage:
```tsx
import { useBrand } from '@/brand'

function MyComponent() {
  const { brand, resolvedTheme, locale, setLocale } = useBrand()

  return <h1>{brand.appName}</h1>
}
```

## Localization

All templates support Portuguese (pt) and English (en) with Portuguese as default.

### Translation Files

```
src/i18n/
├── translations.ts     # Type-safe translation keys
├── pt.ts              # Portuguese translations
└── en.ts              # English translations
```

### Using Translations

```tsx
import { useBrand } from '@/brand'
import { t } from '@/i18n'

function MyComponent() {
  const { locale } = useBrand()

  return <button>{t(locale, 'common.save')}</button>
}
```

## Rebranding Checklist

1. [ ] Update `src/brand/tokens.css` with new colors
2. [ ] Update `src/brand/brand.config.ts` with new metadata
3. [ ] Replace logos in `public/brand/`
4. [ ] Update `src/i18n/` translations if needed
5. [ ] Test both light and dark modes
6. [ ] Verify all pages render correctly

## Design Principles

- No hardcoded brand colors in components (use tokens)
- All text should use translation keys
- Logos should be SVG for scalability
- Dark mode must be tested thoroughly
- Components should adapt to theme changes
