'use client'

/**
 * Home Page
 * 
 * Landing page with:
 * - Hero section
 * - Features section
 * - Call to action
 * 
 * Follows Seshio design principles: calm, clear, supportive.
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  const features = [
    {
      emoji: '💬',
      title: 'Chat-First Learning',
      description: 'Ask questions, explore ideas, and build understanding through conversation grounded in your materials.',
    },
    {
      emoji: '📚',
      title: 'Your Materials, Your Way',
      description: 'Upload notes, PDFs, or articles. Seshio helps you make sense of what you\'re learning.',
    },
    {
      emoji: '🎯',
      title: 'Study Mode',
      description: 'Practice through focused sessions. Questions adapt to help you understand, not just memorize.',
    },
    {
      emoji: '✨',
      title: 'Adaptive by Design',
      description: 'Whether studying for exams or exploring ideas, Seshio meets you where you are.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-8 max-w-7xl py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h1 className="text-4xl md:text-5xl font-medium leading-tight">
              Where your notes finally click
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Seshio helps you understand what you're learning through conversation, 
              practice, and reflection. No pressure. Just progress.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link href="/auth">
                <Button size="lg" className="text-base px-8 h-12">
                  Begin Session
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 h-12 hover:bg-foreground/5 hover:text-foreground dark:hover:bg-foreground/10 transition-colors"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl py-20 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-medium mb-4">
                Learning that makes sense
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Seshio is built around how understanding actually happens.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-8 hover:border-foreground/20 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.emoji}</div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="container mx-auto px-6 md:px-8 max-w-7xl py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">
              Built on a simple belief
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Learning should not feel heavy. Not everything needs to be optimized. 
                Not every moment needs to be measured. Not every learner needs to be pushed.
              </p>
              
              <p>
                Most people are not lazy. They are overwhelmed.
              </p>
              
              <p>
                Seshio exists to make learning feel possible again. To help you understand 
                before you memorize. To support progress that's quiet but real.
              </p>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl py-20 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-medium">
                Ready to start?
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Add anything you're learning from, then ask away.
              </p>
              
              <div className="pt-2">
                <Link href="/auth">
                  <Button size="lg" className="text-base px-8 h-12">
                    Begin Session
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
