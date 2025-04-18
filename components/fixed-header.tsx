"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function FixedHeader({ currentPath = "/" }: { currentPath?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // Handle scroll behavior
  useEffect(() => {
    // Set initial scrolled state based on current scroll position
    setScrolled(window.scrollY > 10)

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // Apply fixed position on all devices with consistent styling
  const headerClasses = `fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
    scrolled ? "bg-black/90 backdrop-blur-sm shadow-md shadow-purple-900/10" : "bg-black/50 backdrop-blur-sm"
  }`

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter z-20">
            Clockwork<span className="text-purple-500">.earth</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link
              href="/"
              className={`transition-colors ${
                currentPath === "/" ? "text-white border-b-2 border-purple-500 pb-1" : "text-gray-400 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/articles/"
              className={`transition-colors ${
                currentPath === "/articles/"
                  ? "text-white border-b-2 border-purple-500 pb-1"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Articles
            </Link>
            <Link
              href="/projects/"
              className={`transition-colors ${
                currentPath === "/projects/"
                  ? "text-white border-b-2 border-purple-500 pb-1"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Projects
            </Link>
            <Link
              href="/topics/"
              className={`transition-colors ${
                currentPath === "/topics/"
                  ? "text-white border-b-2 border-purple-500 pb-1"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Topics
            </Link>
            <Link
              href="/about/"
              className={`transition-colors ${
                currentPath === "/about/"
                  ? "text-white border-b-2 border-purple-500 pb-1"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button - Always visible on mobile */}
          <button
            className={`md:hidden z-20 text-white focus:outline-none p-2 rounded-md transition-colors ${
              mobileMenuOpen ? "bg-gray-800" : "bg-black/20 hover:bg-gray-800/50"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Popup Card */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop for closing the menu when clicking outside */}
          <div className="md:hidden fixed inset-0 z-10" onClick={() => setMobileMenuOpen(false)}></div>

          {/* Popup Menu Card with enhanced visual effects */}
          <div className="md:hidden absolute top-16 right-4 z-20 w-56 bg-gray-900 border border-gray-800 overflow-hidden mobile-menu-popup menu-arrow menu-glow-effect">
            <nav className="flex flex-col py-2">
              <Link
                href="/"
                className={`px-4 py-3 hover:bg-gray-800 transition-colors ${
                  currentPath === "/" ? "text-purple-500 font-semibold" : "text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles/"
                className={`px-4 py-3 hover:bg-gray-800 transition-colors ${
                  currentPath === "/articles/" ? "text-purple-500 font-semibold" : "text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/projects/"
                className={`px-4 py-3 hover:bg-gray-800 transition-colors ${
                  currentPath === "/projects/" ? "text-purple-500 font-semibold" : "text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/topics/"
                className={`px-4 py-3 hover:bg-gray-800 transition-colors ${
                  currentPath === "/topics/" ? "text-purple-500 font-semibold" : "text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Topics
              </Link>
              <Link
                href="/about/"
                className={`px-4 py-3 hover:bg-gray-800 transition-colors ${
                  currentPath === "/about/" ? "text-purple-500 font-semibold" : "text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
