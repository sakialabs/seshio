'use client'

/**
 * App Sidebar Component
 * 
 * Collapsible sidebar for authenticated users.
 * Features:
 * - Logo and title at top
 * - Profile section with theme toggle
 * - Main navigation links (Notebooks, Settings)
 * - Logout button at bottom
 * 
 * Follows Seshio design principles: minimal, calm, clear.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  User
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Persist sidebar state in localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebarCollapsed')
      return stored === 'true'
    }
    return false
  })
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Initialize theme
  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored || (prefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isCollapsed))
  }, [isCollapsed])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth?mode=signin')
  }

  const navLinks = [
    { href: '/notebooks', label: 'Notebooks', icon: BookOpen },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname.startsWith(href)
  const isProfileActive = pathname === '/profile'

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-50"
      >
        {/* Header: Logo + Title */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link href="/notebooks" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">📒</span>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-lg font-medium whitespace-nowrap overflow-hidden"
                >
                  Seshio
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-4 py-4 border-b border-border">
          {isCollapsed ? (
            // Collapsed: Stack vertically
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/profile"
                className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors ${
                  isProfileActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''
                }`}
              >
                <User className="h-5 w-5 text-primary" />
              </Link>
              
              {/* Theme Toggle Below Avatar */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-card border border-border hover:bg-foreground/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            </div>
          ) : (
            // Expanded: Horizontal layout with rounded border container
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Link
                href="/profile"
                className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors ${
                  isProfileActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                }`}
              >
                <User className="h-5 w-5 text-primary" />
              </Link>
              
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-medium truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Theme Toggle - Compact Icon Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-card border border-border hover:bg-foreground/10 transition-colors flex-shrink-0"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Spacer to prevent content from going under sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        className="flex-shrink-0"
      />
    </>
  )
}
