'use client'

/**
 * App Footer Component
 * 
 * Compact footer for authenticated users.
 * Minimal design with essential links only.
 * 
 * Follows Seshio design principles: unobtrusive, clear.
 */

import Link from 'next/link'

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Seshio. Built with 💖 for learners everywhere.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/contact" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
