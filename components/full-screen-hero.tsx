"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function FullScreenHero() {

  return (
    <section className="relative h-screen w-full flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/aurora_hero.png"
          alt="Aurora borealis with vibrant green and purple lights against a starry night sky"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        <div className="aurora-glow"></div>
      </div>

      {/* Content - Added padding-top to ensure it's not hidden by the fixed header */}
      <div className="container mx-auto px-4 z-10 pt-16 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Exploring the Depths of{" "}
            <motion.span
              initial={{ opacity: 0.8 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="text-purple-500"
            >
              Cognition
            </motion.span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mt-6">
            Quantum AI, GenAI, and Cognitive Computing on a budget.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
