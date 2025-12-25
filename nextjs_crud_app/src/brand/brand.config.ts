/**
 * Brand Configuration
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
  name: "Acme Data",
  appName: "Gerenciador de Dados",
  defaultTitle: "Gerenciador de Dados | Admin",
  description: "Plataforma de gerenciamento de dados com CRUD completo",
  slogan: "Organize. Gerencie. Controle.",
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
