import { pt } from './pt'
import { en } from './en'

export type Locale = 'pt' | 'en'

export type TranslationKeys = typeof pt

const translations = {
  pt,
  en,
} as const

/**
 * Get a translation by key path
 * Supports nested keys like 'dashboard.title' or 'common.save'
 */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = translations[locale]

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      // Fallback to Portuguese if key not found
      result = translations.pt
      for (const fallbackKey of keys) {
        if (result && typeof result === 'object' && fallbackKey in result) {
          result = result[fallbackKey]
        } else {
          return key // Return key if translation not found
        }
      }
      break
    }
  }

  if (typeof result !== 'string') {
    return key
  }

  // Replace parameters like {{count}}
  if (params) {
    return result.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
      return String(params[paramKey] ?? `{{${paramKey}}}`)
    })
  }

  return result
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale]
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale === 'pt' || locale === 'en'
}

export { pt, en }
