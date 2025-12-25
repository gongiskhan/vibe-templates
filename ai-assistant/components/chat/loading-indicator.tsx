"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingIndicatorProps {
  text?: string
}

export function LoadingIndicator({ text }: LoadingIndicatorProps) {
  return (
    <div className="w-full bg-transparent">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          {/* Animated spinner */}
          <motion.div
            className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Loading text */}
          {text && (
            <span className="text-sm text-gray-600">{text}</span>
          )}
        </div>
      </div>
    </div>
  )
}
