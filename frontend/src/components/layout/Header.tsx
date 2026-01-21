'use client'

/**
 * Header Component
 * 
 * Global navigation header for public pages.
 * Features:
 * - Logo and title (home link)
 * - Navigation links to public pages
 * - Theme toggle
 * - Auth buttons (Sign In / Begin Session)
 * 
 * Follows Seshio design principles: calm, clear, minimal.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored || (prefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-6 md:px-8 max-w-7xl h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-3xl">📒</span>
          <span className="text-xl font-medium">Seshio</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors relative ${
                isActive(link.href)
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                  transition={{ duration: 0.15 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side: Theme Toggle + Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Auth Buttons */}
          <Link href="/auth?mode=signin">
            <Button variant="ghost" size="sm" className="hover:bg-muted hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/auth?mode=signup">
            <Button size="sm">
              Begin Session
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="container mx-auto px-6 md:px-8 max-w-7xl py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm transition-colors ${
                  isActive(link.href)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              
              <Link href="/auth?mode=signin" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?mode=signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Begin Session
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
