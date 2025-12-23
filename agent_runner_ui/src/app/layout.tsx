import type { Metadata } from 'next'
import { BrandProvider, brandConfig } from '@/brand'
import { I18nProvider } from '@/i18n'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

export const metadata: Metadata = {
  title: brandConfig.defaultTitle,
  description: brandConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="antialiased">
        <I18nProvider defaultLocale="pt">
          <BrandProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </BrandProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
