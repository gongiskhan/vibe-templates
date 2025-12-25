import pt from './pt.json' assert { type: 'json' }
import en from './en.json' assert { type: 'json' }

export type Locale = 'pt' | 'en'

const translations: Record<Locale, typeof pt> = { pt, en }

export function t(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: unknown = translations[locale]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

export default translations
