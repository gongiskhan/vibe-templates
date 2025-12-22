/**
 * Brand Configuration
 *
 * This file contains all brand-specific metadata for the application.
 * To rebrand, update these values along with tokens.css and logo assets.
 *
 * Required changes for rebranding:
 * 1. Update this config file
 * 2. Update src/brand/tokens.css for colors
 * 3. Replace logo files in src/brand/assets/
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
}

export const brandConfig: BrandConfig = {
  name: "Acme Corp",
  appName: "Command Center",
  defaultTitle: "Command Center | Internal Tools",
  description: "Enterprise-grade internal tools platform for modern teams",
  logo: {
    full: "/brand/logo-full.svg",
    icon: "/brand/logo-icon.svg",
    fullDark: "/brand/logo-full-dark.svg",
    iconDark: "/brand/logo-icon-dark.svg",
  },
  links: {
    support: "mailto:support@example.com",
    documentation: "/docs",
    privacy: "/privacy",
    terms: "/terms",
  },
  features: {
    showPoweredBy: false,
    allowThemeToggle: true,
  },
}

export default brandConfig
