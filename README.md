# Vibe Templates

A collection of production-ready templates for building applications with modern web technologies.

## Templates

### Web Apps

| Template | Description | Stack |
|----------|-------------|-------|
| [Next.js Internal Tool](./templates/web_app/nextjs-internal-tool) | Enterprise-ready internal tool with dashboard, projects, activity trail | Next.js, TypeScript, Tailwind, shadcn/ui |

### Agent Apps

| Template | Description | Stack |
|----------|-------------|-------|
| [Agent Runner UI](./templates/agent_app/agent_runner_ui) | UI for running AI agents with streaming output, file uploads, and integrations | Next.js, TypeScript, Tailwind, shadcn/ui, Framer Motion |

## Usage

Each template is a standalone project. Navigate to the template directory and follow the README instructions.

```bash
# Example: Use the internal tool template
cd templates/web_app/nextjs-internal-tool
npm install
npm run dev
```

## Template Structure

Each template contains:
- `template.manifest.json` - Template metadata and configuration
- `README.md` - Setup and usage instructions
- Full source code ready to run

## Branding Contract

All templates follow a consistent branding contract:

1. **Design Tokens** (`src/brand/tokens.css`) - CSS variables for colors, typography, spacing
2. **Brand Config** (`src/brand/brand.config.ts`) - App metadata, logos, links
3. **Logo Assets** (`public/brand/`) - SVG logo files for light/dark modes

This ensures consistent customization across all templates.

## Contributing

1. Create a new template in the appropriate category folder
2. Include a `template.manifest.json` with metadata
3. Follow the branding contract
4. Add comprehensive README

## License

MIT License
