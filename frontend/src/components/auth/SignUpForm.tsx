'use client'

/**
 * Sign Up Form Component
 * 
 * Enhanced with:
 * - Password visibility toggle
 * - Social auth buttons (coming soon)
 * - Framer Motion shake animation for errors
 * - Logo and welcoming copy
 * - Terms and Privacy links
 * 
 * Requirements: 1.1, 1.2, 13.3
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignUpFormProps {
  onToggleMode?: () => void
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const router = useRouter()
  const { signUp } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Password complexity validation
  const validatePassword = (pwd: string): { valid: boolean; message?: string } => {
    if (pwd.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' }
    }
    if (pwd.length > 128) {
      return { valid: false, message: 'Password must be less than 128 characters' }
    }
    if (!/[A-Z]/.test(pwd)) {
      return { valid: false, message: 'Password must include an uppercase letter' }
    }
    if (!/[a-z]/.test(pwd)) {
      return { valid: false, message: 'Password must include a lowercase letter' }
    }
    if (!/[0-9]/.test(pwd)) {
      return { valid: false, message: 'Password must include a number' }
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return { valid: false, message: 'Password must include a special character' }
    }
    return { valid: true }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message!)
      return
    }

    setLoading(true)

    try {
      const { error: signUpError } = await signUp(email, password)
      
      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists')
        } else {
          setError(signUpError.message || 'Failed to create account')
        }
        setLoading(false)
        return
      }

      // Success - redirect to onboarding
      router.push('/onboarding')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleSocialAuth = (provider: string) => {
    // Show coming soon message using the same error system
    setError(`${provider} authentication coming soon!`)
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <motion.div 
          className="text-6xl mb-6 inline-block cursor-default"
          whileHover={{
            rotate: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5 }
          }}
        >
          📒
        </motion.div>
        <h1 className="text-3xl font-medium mb-2">Begin Your Session</h1>
        <p className="text-base text-muted-foreground">
          Start building understanding
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error/Info Alert with Shake Animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ 
                  opacity: 1,
                  x: [0, -10, 10, -10, 10, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  x: { duration: 0.4 },
                  opacity: { duration: 0.2 }
                }}
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="email"
              className="h-12"
            />
          </div>

          {/* Password Field with Visibility Toggle */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="new-password"
                className="h-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              className="h-12 rounded-full border border-border bg-background hover:border-foreground/20 hover:bg-muted/50 transition-all duration-200 flex items-center justify-center"
              title="Sign up with Google"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('Apple')}
              className="h-12 rounded-full border border-border bg-background hover:border-foreground/20 hover:bg-muted/50 transition-all duration-200 flex items-center justify-center"
              title="Sign up with Apple"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('Facebook')}
              className="h-12 rounded-full border border-border bg-background hover:border-foreground/20 hover:bg-muted/50 transition-all duration-200 flex items-center justify-center"
              title="Sign up with Facebook"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('GitHub')}
              className="h-12 rounded-full border border-border bg-background hover:border-foreground/20 hover:bg-muted/50 transition-all duration-200 flex items-center justify-center"
              title="Sign up with GitHub"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
          </div>

          {/* Toggle to Sign In */}
          {onToggleMode && (
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-foreground hover:underline font-medium focus:outline-none focus:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Terms and Privacy */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          By signing up, you agree to our{' '}
          <Link 
            href="/terms" 
            className="text-foreground hover:underline"
          >
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link 
            href="/privacy" 
            className="text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
