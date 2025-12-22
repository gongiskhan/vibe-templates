import type { Metadata } from 'next'
import { BrandProvider, brandConfig } from '@/brand'
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <BrandProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </BrandProvider>
      </body>
    </html>
  )
}
