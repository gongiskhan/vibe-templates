/**
 * Brand Configuration Reference
 *
 * Copy this file to src/brand/brand.config.ts in each template
 * and customize the values for your brand.
 *
 * Required changes for rebranding:
 * 1. Update this config file
 * 2. Update src/brand/tokens.css for colors
 * 3. Replace logo files in public/brand/
 */

export interface BrandConfig {
  /** Company or organization name */
  name: string
  /** Application name (shown in sidebar/header) */
  appName: string
  /** Default page title suffix */
  defaultTitle: string
  /** Brief description for SEO */
  description: string
  /** Optional slogan/tagline */
  slogan?: string
  /** Logo paths relative to public folder */
  logo: {
    /** Full logo with text (used in expanded sidebar) */
    full: string
    /** Icon-only logo (used in collapsed sidebar, favicon) */
    icon: string
    /** Logo for dark backgrounds (optional) */
    fullDark?: string
    iconDark?: string
  }
  /** Support/contact links */
  links: {
    support?: string
    documentation?: string
    privacy?: string
    terms?: string
  }
  /** Feature flags for optional brand features */
  features: {
    /** Show "Powered by" footer text */
    showPoweredBy: boolean
    /** Enable theme toggle */
    allowThemeToggle: boolean
  }
  /** Localization settings */
  localization: {
    /** Default locale (pt = Portuguese, en = English) */
    defaultLocale: 'pt' | 'en'
    /** Supported locales */
    supportedLocales: ('pt' | 'en')[]
  }
}

export const brandConfig: BrandConfig = {
  name: "Acme Corp",
  appName: "Command Center",
  defaultTitle: "Command Center | Ferramentas Internas",
  description: "Plataforma de ferramentas internas de nível empresarial para equipes modernas",
  slogan: "Construa. Execute. Escale.",
  logo: {
    full: "/brand/logo-full.svg",
    icon: "/brand/logo-icon.svg",
    fullDark: "/brand/logo-full-dark.svg",
    iconDark: "/brand/logo-icon-dark.svg",
  },
  links: {
    support: "mailto:suporte@exemplo.com",
    documentation: "/docs",
    privacy: "/privacidade",
    terms: "/termos",
  },
  features: {
    showPoweredBy: false,
    allowThemeToggle: true,
  },
  localization: {
    defaultLocale: 'pt',
    supportedLocales: ['pt', 'en'],
  },
}

export default brandConfig
