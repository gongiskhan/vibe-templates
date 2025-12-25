"use client"

import { motion } from 'framer-motion'

interface LoadingDotsProps {
  text?: string
}

export function LoadingDots({ text }: LoadingDotsProps) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {text && (
        <span className="text-sm text-gray-500">{text}</span>
      )}
    </div>
  )
}
