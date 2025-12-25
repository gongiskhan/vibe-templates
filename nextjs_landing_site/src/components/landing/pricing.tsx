"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

interface PricingTier {
  nameKey: string
  priceMonthly: number
  priceYearly: number
  descriptionKey: string
  featuresKeys: string[]
  highlighted?: boolean
  ctaKey: string
}

const tiers: PricingTier[] = [
  {
    nameKey: "landing.pricing.starter.name",
    priceMonthly: 29,
    priceYearly: 290,
    descriptionKey: "landing.pricing.starter.description",
    featuresKeys: [
      "landing.pricing.starter.features.f1",
      "landing.pricing.starter.features.f2",
      "landing.pricing.starter.features.f3",
      "landing.pricing.starter.features.f4",
    ],
    ctaKey: "landing.pricing.starter.cta",
  },
  {
    nameKey: "landing.pricing.pro.name",
    priceMonthly: 79,
    priceYearly: 790,
    descriptionKey: "landing.pricing.pro.description",
    featuresKeys: [
      "landing.pricing.pro.features.f1",
      "landing.pricing.pro.features.f2",
      "landing.pricing.pro.features.f3",
      "landing.pricing.pro.features.f4",
      "landing.pricing.pro.features.f5",
      "landing.pricing.pro.features.f6",
    ],
    highlighted: true,
    ctaKey: "landing.pricing.pro.cta",
  },
  {
    nameKey: "landing.pricing.enterprise.name",
    priceMonthly: 199,
    priceYearly: 1990,
    descriptionKey: "landing.pricing.enterprise.description",
    featuresKeys: [
      "landing.pricing.enterprise.features.f1",
      "landing.pricing.enterprise.features.f2",
      "landing.pricing.enterprise.features.f3",
      "landing.pricing.enterprise.features.f4",
      "landing.pricing.enterprise.features.f5",
      "landing.pricing.enterprise.features.f6",
      "landing.pricing.enterprise.features.f7",
    ],
    ctaKey: "landing.pricing.enterprise.cta",
  },
]

export function Pricing() {
  const { locale } = useBrand()
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-sm font-medium text-primary">
            {t(locale, "landing.pricing.label")}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            {t(locale, "landing.pricing.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t(locale, "landing.pricing.subtitle")}
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <span
            className={cn(
              "text-sm",
              !isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {t(locale, "landing.pricing.monthly")}
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span
            className={cn(
              "text-sm",
              isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {t(locale, "landing.pricing.yearly")}
            <span className="ml-1 text-xs text-primary">
              ({t(locale, "landing.pricing.save20")})
            </span>
          </span>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "h-full flex flex-col",
                  tier.highlighted &&
                    "border-primary shadow-lg scale-105 relative"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {t(locale, "landing.pricing.popular")}
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-0">
                  <h3 className="text-lg font-semibold">
                    {t(locale, tier.nameKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(locale, tier.descriptionKey)}
                  </p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      R$ {isYearly ? tier.priceYearly : tier.priceMonthly}
                    </span>
                    <span className="text-muted-foreground">
                      /{isYearly ? t(locale, "landing.pricing.year") : t(locale, "landing.pricing.month")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                  <ul className="space-y-3">
                    {tier.featuresKeys.map((featureKey) => (
                      <li key={featureKey} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{t(locale, featureKey)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {t(locale, tier.ctaKey)}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
