'use client'

/**
 * Privacy Policy Page
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

export default function PrivacyPage() {
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
            <h1 className="text-4xl md:text-5xl font-medium mb-4">Privacy Policy</h1>
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
              <h2 className="text-2xl font-medium mb-4">Our Approach to Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                This policy explains what data we collect, why we collect it, and how we protect it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">What We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3 mt-6">Account Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you create an account, we collect:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Email address</li>
                <li className="leading-relaxed">• Password (encrypted)</li>
                <li className="leading-relaxed">• Account preferences (archetype, settings)</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">Learning Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To provide the service, we store:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Materials you upload (PDFs, documents, notes)</li>
                <li className="leading-relaxed">• Questions you ask</li>
                <li className="leading-relaxed">• Conversations with the AI</li>
                <li className="leading-relaxed">• Study session data (quiz responses, progress)</li>
                <li className="leading-relaxed">• Notebooks and organization</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect anonymous usage data to improve the service:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Feature usage patterns</li>
                <li className="leading-relaxed">• Error logs and diagnostics</li>
                <li className="leading-relaxed">• Performance metrics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">How We Use Your Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use your data to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Provide and improve the service</li>
                <li className="leading-relaxed">• Answer your questions using your materials</li>
                <li className="leading-relaxed">• Generate study content (summaries, quizzes)</li>
                <li className="leading-relaxed">• Track your learning progress</li>
                <li className="leading-relaxed">• Send important service updates</li>
                <li className="leading-relaxed">• Improve our AI models and features</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not sell your data. We do not use your content to train public AI models. 
                We do not share your materials with other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">AI Processing</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Seshio uses AI services (Google Gemini) to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Generate embeddings from your materials</li>
                <li className="leading-relaxed">• Answer questions based on your content</li>
                <li className="leading-relaxed">• Create summaries, outlines, and quizzes</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Your content is sent to these services only to provide the features you use. 
                We use enterprise agreements that prohibit using your data for model training.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Data Storage & Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Your data is stored securely using:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Encryption at rest and in transit (TLS/SSL)</li>
                <li className="leading-relaxed">• Secure authentication via Supabase</li>
                <li className="leading-relaxed">• Regular security audits</li>
                <li className="leading-relaxed">• Access controls and monitoring</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                While we take security seriously, no system is 100% secure. 
                Please use a strong, unique password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We keep your data as long as your account is active.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When you delete your account, we delete your personal data and materials within 30 days. 
                Some anonymized usage data may be retained for analytics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Access your data</li>
                <li className="leading-relaxed">• Export your data</li>
                <li className="leading-relaxed">• Correct inaccurate data</li>
                <li className="leading-relaxed">• Delete your account and data</li>
                <li className="leading-relaxed">• Opt out of non-essential emails</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@seshio.app" className="text-primary hover:underline">
                  privacy@seshio.app
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Cookies & Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use essential cookies to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• Keep you signed in</li>
                <li className="leading-relaxed">• Remember your preferences</li>
                <li className="leading-relaxed">• Ensure security</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not use advertising or tracking cookies. We do not sell data to advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Seshio uses these third-party services:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">
                  • <strong className="text-foreground">Supabase</strong> - Authentication and file storage
                </li>
                <li className="leading-relaxed">
                  • <strong className="text-foreground">Google Gemini</strong> - AI processing
                </li>
                <li className="leading-relaxed">
                  • <strong className="text-foreground">Netlify</strong> - Hosting
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These services have their own privacy policies. We choose partners who respect user privacy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Seshio is not intended for children under 13. We do not knowingly collect data from 
                children under 13. If you believe a child has created an account, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">International Users</h2>
              <p className="text-muted-foreground leading-relaxed">
                Seshio is operated from the United States. If you&apos;re using Seshio from outside the US, 
                your data may be transferred to and processed in the US.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this policy occasionally. If we make significant changes, 
                we&apos;ll notify you via email or in-app notification.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Continuing to use Seshio after changes means you accept the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about privacy? Contact us at{' '}
                <a href="mailto:privacy@seshio.app" className="text-primary hover:underline">
                  privacy@seshio.app
                </a>
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-medium mb-4">Summary</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                In plain terms:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="leading-relaxed">• We collect only what&apos;s needed to provide the service</li>
                <li className="leading-relaxed">• We don&apos;t sell your data</li>
                <li className="leading-relaxed">• We don&apos;t use your content to train public AI models</li>
                <li className="leading-relaxed">• We encrypt your data</li>
                <li className="leading-relaxed">• You can delete your account anytime</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Your learning is yours. We&apos;re just here to help.
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
