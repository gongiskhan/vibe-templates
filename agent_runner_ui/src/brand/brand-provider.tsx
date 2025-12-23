'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { brandConfig, type BrandConfig } from './brand.config'

type Theme = 'light' | 'dark' | 'system'

interface BrandContextType {
  brand: BrandConfig
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const BrandContext = createContext<BrandContextType | undefined>(undefined)

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        const isDark = e.matches
        setResolvedTheme(isDark ? 'dark' : 'light')
        root.classList.toggle('dark', isDark)
      }

      handleChange(mediaQuery)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      setResolvedTheme(theme)
      root.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  return (
    <BrandContext.Provider
      value={{
        brand: brandConfig,
        theme,
        setTheme,
        resolvedTheme,
      }}
    >
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}
