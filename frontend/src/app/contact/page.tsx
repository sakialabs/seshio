'use client'

/**
 * Contact Page
 * 
 * Allows users to reach out to the team.
 * Shows appropriate header/footer for guests vs authenticated users.
 * 
 * Follows Seshio design principles: clear, accessible, minimal.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Mail, Send } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppFooter } from '@/components/layout/AppFooter'

export default function ContactPage() {
  const { user, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const content = (
    <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-medium">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions, feedback, or ideas? We'd like to hear from you.
            </p>
          </motion.div>
        </section>

        {/* Contact Options */}
        <section className="container mx-auto px-6 md:px-8 max-w-7xl pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <h2 className="text-2xl font-medium mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={submitted}
                >
                  {submitted ? (
                    'Message Sent'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {submitted && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground text-center"
                  >
                    Thanks for reaching out. We'll get back to you soon.
                  </motion.p>
                )}
              </form>
            </motion.div>

            {/* Other Contact Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Email */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">Email</h3>
                    <p className="text-muted-foreground mb-3">
                      Prefer email? Send us a message directly.
                    </p>
                    <a
                      href="mailto:hello@seshio.app"
                      className="text-primary hover:underline"
                    >
                      hello@seshio.app
                    </a>
                  </div>
                </div>
              </div>

              {/* GitHub */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Github className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">GitHub</h3>
                    <p className="text-muted-foreground mb-3">
                      Found a bug or want to contribute? Check out our repository.
                    </p>
                    <a
                      href="https://github.com/sakialabs/seshio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-2"
                    >
                      View Repository
                      <span className="text-muted-foreground">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-muted/50 border border-border rounded-2xl p-8">
                <h3 className="text-lg font-medium mb-3">Response Time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We typically respond within 24-48 hours. For urgent issues, 
                  please include "Urgent" in your subject line.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
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
