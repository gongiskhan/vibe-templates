'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import en from './locales/en.json'
import pt from './locales/pt.json'

export type Locale = 'pt' | 'en'
export type Translations = typeof pt

const translations: Record<Locale, Translations> = {
  pt,
  en,
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function useTranslation() {
  const { t, locale } = useI18n()
  return { t, locale }
}

interface I18nProviderProps {
  children: React.ReactNode
  defaultLocale?: Locale
}

export function I18nProvider({
  children,
  defaultLocale = 'pt',
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  // Initialize locale from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && (stored === 'pt' || stored === 'en')) {
      setLocaleState(stored)
    }
  }, [])

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: unknown = translations[locale]

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          // Fallback to English if key not found
          value = translations.en
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = (value as Record<string, unknown>)[fallbackKey]
            } else {
              return key // Return key if not found
            }
          }
          break
        }
      }

      if (typeof value !== 'string') {
        return key
      }

      // Replace parameters like {count} with actual values
      if (params) {
        return value.replace(/{(\w+)}/g, (_, paramKey) => {
          return params[paramKey]?.toString() ?? `{${paramKey}}`
        })
      }

      return value
    },
    [locale]
  )

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t]
  )

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  )
}

// Export available locales for use in components
export const locales: { code: Locale; name: string; flag: string }[] = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]
