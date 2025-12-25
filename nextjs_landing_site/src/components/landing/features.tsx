"use client"

import { motion } from "framer-motion"
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Globe,
  Sparkles,
  LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

interface Feature {
  icon: LucideIcon
  titleKey: string
  descriptionKey: string
}

const features: Feature[] = [
  {
    icon: Zap,
    titleKey: "landing.features.speed.title",
    descriptionKey: "landing.features.speed.description",
  },
  {
    icon: Shield,
    titleKey: "landing.features.security.title",
    descriptionKey: "landing.features.security.description",
  },
  {
    icon: BarChart3,
    titleKey: "landing.features.analytics.title",
    descriptionKey: "landing.features.analytics.description",
  },
  {
    icon: Users,
    titleKey: "landing.features.collaboration.title",
    descriptionKey: "landing.features.collaboration.description",
  },
  {
    icon: Globe,
    titleKey: "landing.features.global.title",
    descriptionKey: "landing.features.global.description",
  },
  {
    icon: Sparkles,
    titleKey: "landing.features.ai.title",
    descriptionKey: "landing.features.ai.description",
  },
]

export function Features() {
  const { locale } = useBrand()

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary">
            {t(locale, "landing.features.label")}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            {t(locale, "landing.features.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t(locale, "landing.features.subtitle")}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t(locale, feature.titleKey)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(locale, feature.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
