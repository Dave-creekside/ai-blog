"use client"

import { useEffect } from "react"

export function ViewportFix() {
  useEffect(() => {
    // Fix for mobile viewport height issues
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    setVh()
    window.addEventListener("resize", setVh)
    return () => window.removeEventListener("resize", setVh)
  }, [])

  return null
}
