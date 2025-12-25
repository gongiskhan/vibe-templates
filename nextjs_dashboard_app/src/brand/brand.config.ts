/**
 * Brand Configuration
 *
 * This file contains all brand-specific metadata for the application.
 * To rebrand, update these values along with tokens.css and logo assets.
 */

export interface BrandConfig {
  name: string
  appName: string
  defaultTitle: string
  description: string
  slogan?: string
  logo: {
    full: string
    icon: string
    fullDark?: string
    iconDark?: string
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

export const brandConfig: BrandConfig = {
  name: "Acme Analytics",
  appName: "Painel de Controle",
  defaultTitle: "Painel de Controle | Analytics",
  description: "Plataforma de analytics e business intelligence para tomada de decisões",
  slogan: "Dados que impulsionam decisões.",
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
