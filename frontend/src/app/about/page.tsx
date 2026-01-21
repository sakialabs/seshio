'use client'

/**
 * About Page
 * 
 * Explains Seshio's vision, mission, and philosophy.
 * Content based on vision.md document.
 * 
 * Follows Seshio design principles: calm, clear, grounded.
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
              About Seshio
            </h1>
            <p className="text-xl text-muted-foreground">
              Learning should not feel like a constant race.
            </p>
          </motion.div>
        </section>

        {/* Vision */}
        <section className="border-t border-border">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-medium">Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To make learning feel lighter, clearer, and more human.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Seshio envisions a world where understanding is not rushed, 
                  where curiosity is supported instead of pressured, 
                  and where people feel capable of learning deeply without burning out.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Learning should feel like progress that makes sense.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-medium">Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Seshio's mission is to help people make sense of what they're learning 
                  and study more effectively.
                </p>
              </div>

              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">It does this by:</p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">
                    • Grounding understanding in the learner's own materials
                  </li>
                  <li className="leading-relaxed">
                    • Helping turn raw information into clear explanations and notes
                  </li>
                  <li className="leading-relaxed">
                    • Supporting practice through reflection, questions, and feedback
                  </li>
                  <li className="leading-relaxed">
                    • Encouraging steady progress through small, focused sessions
                  </li>
                </ul>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Seshio exists to help people <strong className="text-foreground">understand before they memorize</strong>, 
                and to support learning that lasts beyond the next test or deadline.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Beliefs */}
        <section className="border-t border-border">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <h2 className="text-3xl font-medium text-center mb-12">
                What we believe
              </h2>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Learning should not feel heavy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Not everything needs to be optimized. Not every moment needs to be measured. 
                    Not every learner needs to be pushed. Most people are not lazy. They are overwhelmed.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Understanding comes before performance</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Before grades. Before scores. Before outcomes. When understanding is strong, 
                    performance follows naturally. When it isn't, no amount of pressure helps.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Tools should reduce friction</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Learning already asks enough of people. The tools meant to help should not 
                    demand attention, discipline, or constant interaction. Good tools stay out of the way.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Progress is built quietly</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    In revisiting an idea. In seeing a connection. In noticing that something makes 
                    more sense than it did before. Real progress doesn't always look impressive. 
                    It just feels right.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-medium">AI should assist, not overwhelm</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI should clarify, guide, support, and adapt. It should never rush, judge, 
                    or replace the learner. Intelligence is most useful when it is humble.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Learning is personal</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Some people learn through structure. Some through exploration. 
                    Some through deep focus over time. There is no single correct way to learn. 
                    Good systems adapt without asking learners to explain themselves.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Rest is part of learning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Stepping away is not failure. Returning with fresh eyes is not weakness. 
                    Understanding often arrives after space.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Trust matters</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Trust in the learner. Trust in the process. Trust that people want to understand, 
                    not just finish. Seshio earns trust by being transparent, grounded, 
                    and respectful of attention.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <p className="text-xl text-muted-foreground leading-relaxed">
                Seshio exists to make learning feel possible again.
              </p>
              
              <p className="text-lg text-muted-foreground">
                If the product helps someone think more clearly, reduces pressure, 
                supports curiosity, and leaves the learner feeling capable, then it is succeeding.
              </p>

              <p className="text-lg text-muted-foreground">
                Everything else is secondary.
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
