"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

const footerLinks = {
  product: [
    { label: "landing.footer.product.features", href: "#features" },
    { label: "landing.footer.product.pricing", href: "#pricing" },
    { label: "landing.footer.product.integrations", href: "/integrations" },
    { label: "landing.footer.product.changelog", href: "/changelog" },
  ],
  company: [
    { label: "landing.footer.company.about", href: "/about" },
    { label: "landing.footer.company.blog", href: "/blog" },
    { label: "landing.footer.company.careers", href: "/careers" },
    { label: "landing.footer.company.contact", href: "/contact" },
  ],
  resources: [
    { label: "landing.footer.resources.docs", href: "/docs" },
    { label: "landing.footer.resources.help", href: "/help" },
    { label: "landing.footer.resources.community", href: "/community" },
    { label: "landing.footer.resources.status", href: "/status" },
  ],
  legal: [
    { label: "landing.footer.legal.privacy", href: "/privacy" },
    { label: "landing.footer.legal.terms", href: "/terms" },
    { label: "landing.footer.legal.cookies", href: "/cookies" },
  ],
}

export function Footer() {
  const { brand, locale, resolvedTheme } = useBrand()

  const logoSrc =
    resolvedTheme === "dark"
      ? brand.logo.fullDark || brand.logo.full
      : brand.logo.full

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand and newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/">
              <img
                src={logoSrc}
                alt={brand.appName}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t(locale, "landing.footer.description")}
            </p>

            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {t(locale, "landing.footer.newsletter")}
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t(locale, "landing.footer.emailPlaceholder")}
                  className="max-w-[240px]"
                />
                <Button>{t(locale, "landing.footer.subscribe")}</Button>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com" target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com" target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://linkedin.com" target="_blank">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:contato@exemplo.com">
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            <div>
              <h4 className="font-medium mb-3">
                {t(locale, "landing.footer.product.title")}
              </h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(locale, link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">
                {t(locale, "landing.footer.company.title")}
              </h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(locale, link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">
                {t(locale, "landing.footer.resources.title")}
              </h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(locale, link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">
                {t(locale, "landing.footer.legal.title")}
              </h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(locale, link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {brand.name}. {t(locale, "landing.footer.rights")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(locale, "landing.footer.madeWith")} ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}
