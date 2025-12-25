# Vibe Templates

A comprehensive collection of production-ready templates for building applications with modern web technologies. All templates follow a **Branding Contract** for easy customization and support **i18n** (Portuguese default, English).

## Quick Start

```bash
# Clone the repository
git clone https://github.com/gongiskhan/vibe-templates.git

# Navigate to any template
cd vibe-templates/nextjs_dashboard_app

# Install dependencies and run
npm install
npm run dev
```

## Templates Overview

### Web Apps (Next.js)

| Template | Description | Key Features |
|----------|-------------|--------------|
| [Internal Tool](./nextjs-internal-tool) | Enterprise internal tool template | Dashboard, Projects, Settings, Activity Trail |
| [Dashboard App](./nextjs_dashboard_app) | Analytics dashboard | KPIs, Charts, Reports, Data Freshness, Insights |
| [CRUD App](./nextjs_crud_app) | Entity management | Tables, Forms, Validation, Bulk Actions |
| [Workflow App](./nextjs_workflow_app) | Workflow management | Stepper, Approvals, Timeline, Comments |
| [Data Explorer](./nextjs_data_explorer) | Data exploration tool | Query Builder, Results Grid, Saved Queries, Export |
| [Landing Site](./nextjs_landing_site) | Marketing site | Hero, Features, Pricing, Footer |
| [Agent Runner UI](./agent_runner_ui) | AI agent interface | Agent Selection, Streaming Output, File Uploads |

### Presentations

| Template | Description | Key Features |
|----------|-------------|--------------|
| [HTML Deck](./presentation/html_deck) | Slide presentation | Keyboard Nav, Touch Support, PDF Export, Speaker Notes |

### Landing Pages

| Template | Description | Key Features |
|----------|-------------|--------------|
| [Campaign Launch](./landing_pages/campaign_launch) | Product launch | Countdown, Features Grid, Email Capture |
| [Event/Webinar](./landing_pages/event_webinar) | Event registration | Speakers, Agenda, Registration Form |
| [Recruitment](./landing_pages/recruitment_brand) | Employer branding | Culture, Benefits, Open Positions, Testimonials |
| [Product Story](./landing_pages/product_story) | Case study | Problem, Solution, Results, Quote |

### Reports

| Template | Description | Key Features |
|----------|-------------|--------------|
| [Excel Report](./reports/excel_guided_report) | Excel generator | Template-based, Charts, Conditional Formatting |
| [Interactive Report](./reports/interactive_report_web) | Web report | Filters, Charts, Drill-down, Export |

### Services

| Service | Description | Stack |
|---------|-------------|-------|
| [Agents API](./services/agents-api) | Agent execution API | Node.js, TypeScript, Express, SSE |

## Core Features

### Branding Contract

All templates are **rebrandable** by changing only 3 files:

1. **`tokens.css`** - CSS variables for colors, typography, spacing
2. **`brand.config.ts`** - App name, logos, navigation links
3. **`public/brand/`** - Logo assets (SVG for light/dark modes)

See [BRANDING_CONTRACT.md](./shared/brand/BRANDING_CONTRACT.md) for details.

### Internationalization (i18n)

All templates support **Portuguese (default)** and **English**:

```typescript
// Using translations in components
import { t } from '@/i18n'
import { useBrand } from '@/brand/brand-provider'

function MyComponent() {
  const { locale } = useBrand()
  return <h1>{t(locale, 'page.title')}</h1>
}
```

Translation files are in `src/i18n/`:
- `pt.ts` - Portuguese translations
- `en.ts` - English translations

### Theme Support

Light and dark themes via CSS variables:

```typescript
const { theme, setTheme } = useBrand()
// theme: 'light' | 'dark' | 'system'
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts / Chart.js |
| Icons | Lucide React |
| Excel | ExcelJS |
| PDF Export | Playwright |

## Project Structure

```
vibe-templates/
├── templates.index.json      # Master index of all templates
├── shared/
│   └── brand/                # Branding documentation
├── nextjs-internal-tool/     # Base internal tool template
├── nextjs_dashboard_app/     # Dashboard with analytics
├── nextjs_crud_app/          # CRUD operations
├── nextjs_workflow_app/      # Workflow management
├── nextjs_data_explorer/     # Data exploration
├── nextjs_landing_site/      # Marketing landing site
├── agent_runner_ui/          # AI agent interface
├── presentation/
│   └── html_deck/            # Slide presentations
├── landing_pages/
│   ├── campaign_launch/      # Product launch
│   ├── event_webinar/        # Events/webinars
│   ├── recruitment_brand/    # Employer branding
│   └── product_story/        # Case studies
├── reports/
│   ├── excel_guided_report/  # Excel generation
│   └── interactive_report_web/ # Interactive web reports
└── services/
    └── agents-api/           # Agent execution API
```

## Template Manifest

Each template includes a `manifest.json` with metadata:

```json
{
  "id": "template-id",
  "name": "Template Name",
  "version": "1.0.0",
  "category": "web-app",
  "description": "Template description",
  "features": ["feature1", "feature2"],
  "branding": {
    "tokens": "./src/brand/tokens.css",
    "config": "./src/brand/brand.config.ts"
  },
  "i18n": {
    "default": "pt",
    "supported": ["pt", "en"]
  }
}
```

## Usage Examples

### Using a Next.js Template

```bash
# Copy the template
cp -r nextjs_dashboard_app my-dashboard

# Install and run
cd my-dashboard
npm install
npm run dev
```

### Running the Agents API

```bash
cd services/agents-api
npm install
npm run dev
# API running at http://localhost:3001
```

### Generating an Excel Report

```bash
cd reports/excel_guided_report
npm install
npm run example
# Output: ./output/sales-report.xlsx
```

### Viewing a Presentation

```bash
cd presentation/html_deck
npm run dev
# Open http://localhost:3000
# Use arrow keys to navigate
```

### Exporting Presentation to PDF

```bash
cd presentation/html_deck
npm run dev &
npm run export:pdf
# Output: ./output/deck-pt.pdf
```

## Customization Guide

### Changing Brand Colors

Edit `src/brand/tokens.css`:

```css
:root {
  --brand-primary: #your-color;
  --brand-secondary: #your-color;
  --brand-accent: #your-color;
}
```

### Adding a New Language

1. Create `src/i18n/es.ts` with translations
2. Update `src/i18n/index.ts` to include Spanish
3. Add `'es'` to `Locale` type

### Creating a New Template

1. Copy an existing template as base
2. Update `manifest.json` with new ID and metadata
3. Customize components and translations
4. Add to `templates.index.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the branding contract
4. Add comprehensive documentation
5. Submit a pull request

## License

MIT License - See [LICENSE](./LICENSE) for details
