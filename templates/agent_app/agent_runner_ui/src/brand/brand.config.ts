export interface BrandConfig {
  name: string
  appName: string
  defaultTitle: string
  description: string
  logo: {
    full: string
    icon: string
    fullDark: string
    iconDark: string
  }
  links: {
    docs?: string
    support?: string
    privacy?: string
    terms?: string
  }
}

export const brandConfig: BrandConfig = {
  name: "Maestric",
  appName: "Agent Runner",
  defaultTitle: "Agent Runner | Maestric",
  description: "Run AI agents on demand with streaming output and integrations",
  logo: {
    full: "/brand/logo-full.svg",
    icon: "/brand/logo-icon.svg",
    fullDark: "/brand/logo-full-dark.svg",
    iconDark: "/brand/logo-icon-dark.svg",
  },
  links: {
    docs: "https://docs.maestric.io",
    support: "mailto:support@maestric.io",
  },
}

export default brandConfig
