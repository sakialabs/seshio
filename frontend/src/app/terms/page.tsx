'use client'

/**
 * Terms of Service Page
 * 
 * Shows appropriate header/footer for guests vs authenticated users.
 * Follows Seshio design principles: clear, transparent, respectful.
 */

import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppFooter } from '@/components/layout/AppFooter'

export default function TermsPage() {
  const { user, loading } = useAuth()
  const content = (
    <main className="flex-1">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl mb-6"
            >
              📒
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-medium mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: January 20, 2026
            </p>
          </div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-8 md:p-12 space-y-10"
          >
              <section>
                <h2 className="text-2xl font-medium mb-4">Welcome to Seshio</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These terms outline how Seshio works and what we expect from each other.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using Seshio, you agree to these terms. If something here doesn't work for you, 
                  please don't use the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">What Seshio Does</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Seshio helps you make sense of what you're learning by:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="leading-relaxed">• Storing your learning materials securely</li>
                  <li className="leading-relaxed">• Answering questions grounded in your materials</li>
                  <li className="leading-relaxed">• Generating study content like summaries and quizzes</li>
                  <li className="leading-relaxed">• Tracking your learning progress privately</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">Your Account</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You're responsible for:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="leading-relaxed">• Keeping your password secure</li>
                  <li className="leading-relaxed">• All activity that happens under your account</li>
                  <li className="leading-relaxed">• Letting us know if your account is compromised</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You must be at least 13 years old to use Seshio. If you're under 18, 
                  please get permission from a parent or guardian.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">Your Content</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The materials you upload remain yours. We don't claim ownership of your content.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  By uploading content, you confirm that:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="leading-relaxed">• You have the right to upload it</li>
                  <li className="leading-relaxed">• It doesn't violate anyone else's rights</li>
                  <li className="leading-relaxed">• It's not illegal or harmful</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We process your content to provide the service (answering questions, generating summaries, etc.). 
                  We don't share it with third parties or use it to train public AI models.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">What We Don't Allow</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Please don't:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="leading-relaxed">• Share your account with others</li>
                  <li className="leading-relaxed">• Try to break or abuse the service</li>
                  <li className="leading-relaxed">• Upload illegal, harmful, or infringing content</li>
                  <li className="leading-relaxed">• Use Seshio to cheat on exams or assignments</li>
                  <li className="leading-relaxed">• Scrape or copy our service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We work hard to keep Seshio running smoothly, but we can't guarantee it will always 
                  be available or error-free.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We may need to update, modify, or temporarily suspend the service for maintenance. 
                  We'll try to give you notice when possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">AI-Generated Content</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Seshio uses AI to answer questions and generate study content. 
                  While we work to make responses accurate and helpful:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="leading-relaxed">• AI can make mistakes</li>
                  <li className="leading-relaxed">• Responses should be verified against your source materials</li>
                  <li className="leading-relaxed">• Seshio is a study tool, not a replacement for learning</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">Cancellation</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can stop using Seshio anytime by deleting your account in settings.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We may suspend or terminate accounts that violate these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Seshio is provided "as is." We're not liable for:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="leading-relaxed">• Lost data or content</li>
                  <li className="leading-relaxed">• Incorrect AI responses</li>
                  <li className="leading-relaxed">• Academic consequences from using the service</li>
                  <li className="leading-relaxed">• Service interruptions or errors</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">Changes to These Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may update these terms occasionally. If we make significant changes, 
                  we'll let you know via email or in-app notification.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Continuing to use Seshio after changes means you accept the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium mb-4">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Questions about these terms? Reach out at{' '}
                  <a href="mailto:support@seshio.app" className="text-primary hover:underline">
                    support@seshio.app
                  </a>
                </p>
              </section>
            </motion.div>
          </motion.div>
        </div>
      </main>
    )

  // Guest layout
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        {content}
        <Footer />
      </div>
    )
  }

  // Authenticated layout
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {content}
        <AppFooter />
      </div>
    </div>
  )
}
