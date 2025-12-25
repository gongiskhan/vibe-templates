"use client"

import * as React from "react"
import { brandConfig, type BrandConfig } from "./brand.config"
import type { Locale } from "@/i18n"

interface BrandContextValue {
  brand: BrandConfig
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  resolvedTheme: "light" | "dark"
  locale: Locale
  setLocale: (locale: Locale) => void
}

const BrandContext = React.createContext<BrandContextValue | undefined>(
  undefined
)

export function useBrand() {
  const context = React.useContext(BrandContext)
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider")
  }
  return context
}

interface BrandProviderProps {
  children: React.ReactNode
  defaultTheme?: "light" | "dark" | "system"
  defaultLocale?: Locale
}

export function BrandProvider({
  children,
  defaultTheme = "system",
  defaultLocale,
}: BrandProviderProps) {
  const [theme, setThemeState] = React.useState<"light" | "dark" | "system">(
    defaultTheme
  )
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light"
  )
  const [locale, setLocaleState] = React.useState<Locale>(
    defaultLocale ?? brandConfig.localization?.defaultLocale ?? "pt"
  )

  // Initialize theme from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null
    if (stored) {
      setThemeState(stored)
    }
  }, [])

  // Initialize locale from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null
    if (stored && (stored === "pt" || stored === "en")) {
      setLocaleState(stored)
    }
  }, [])

  // Resolve system theme and apply
  React.useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = () => {
      let resolved: "light" | "dark" = "light"

      if (theme === "system") {
        resolved = mediaQuery.matches ? "dark" : "light"
      } else {
        resolved = theme
      }

      setResolvedTheme(resolved)
      root.classList.remove("light", "dark")
      root.classList.add(resolved)
      root.setAttribute("data-theme", resolved)
    }

    applyTheme()

    // Listen for system theme changes
    const handleChange = () => {
      if (theme === "system") {
        applyTheme()
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  // Apply locale to document
  React.useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setTheme = React.useCallback((newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
  }, [])

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }, [])

  const value = React.useMemo(
    () => ({
      brand: brandConfig,
      theme,
      setTheme,
      resolvedTheme,
      locale,
      setLocale,
    }),
    [theme, setTheme, resolvedTheme, locale, setLocale]
  )

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

// Export brand config for static access
export { brandConfig }
