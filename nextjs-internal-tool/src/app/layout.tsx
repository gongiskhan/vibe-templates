import type { Metadata } from "next"
import { BrandProvider, brandConfig } from "@/brand"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: brandConfig.defaultTitle,
  description: brandConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <BrandProvider defaultTheme="system">
          <TooltipProvider delayDuration={0}>
            {children}
            <Toaster />
          </TooltipProvider>
        </BrandProvider>
      </body>
    </html>
  )
}
