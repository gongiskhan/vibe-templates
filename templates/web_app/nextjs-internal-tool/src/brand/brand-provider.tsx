"use client"

import * as React from "react"
import { brandConfig, type BrandConfig } from "./brand.config"

interface BrandContextValue {
  brand: BrandConfig
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  resolvedTheme: "light" | "dark"
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
}

export function BrandProvider({
  children,
  defaultTheme = "system",
}: BrandProviderProps) {
  const [theme, setThemeState] = React.useState<"light" | "dark" | "system">(
    defaultTheme
  )
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light"
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

  const setTheme = React.useCallback((newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
  }, [])

  const value = React.useMemo(
    () => ({
      brand: brandConfig,
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme]
  )

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

// Export brand config for static access
export { brandConfig }
