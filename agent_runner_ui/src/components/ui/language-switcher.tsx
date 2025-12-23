'use client'

import { Languages } from 'lucide-react'
import { useI18n, locales, type Locale } from '@/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline'
  showLabel?: boolean
  className?: string
}

export function LanguageSwitcher({
  variant = 'ghost',
  showLabel = false,
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()

  const currentLocale = locales.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={showLabel ? 'default' : 'icon'} className={className}>
          <Languages className="h-4 w-4" />
          {showLabel && (
            <span className="ml-2">{currentLocale?.flag} {currentLocale?.name}</span>
          )}
          <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code as Locale)}
            className={locale === l.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{l.flag}</span>
            {l.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
