import { pt } from "./pt"
import { en } from "./en"

export type Locale = "pt" | "en"

const translations = { pt, en }

type TranslationKeys = typeof pt

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }

  return typeof current === "string" ? current : path
}

export function t(locale: Locale, key: string): string {
  return getNestedValue(translations[locale], key)
}

export { pt, en }
