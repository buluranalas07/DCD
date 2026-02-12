import React from 'react'
import { motion } from 'framer-motion'

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 pb-40 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 uppercase tracking-wider"
        >
          About
        </motion.h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary uppercase tracking-wide border-b-2 border-primary/30 pb-2 inline-block">
              Mission
            </h3>
            <p className="text-zinc-300 text-lg leading-relaxed mt-6">
              Help athletes build discipline through simple daily action — tracking food, training,
              and skills without distraction.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary uppercase tracking-wide border-b-2 border-primary/30 pb-2 inline-block">
              Vision
            </h3>
            <div className="mt-6 space-y-4">
              <p className="text-zinc-300 text-lg">Consistency beats talent.</p>
              <p className="text-zinc-300 text-lg">Discipline builds greatness.</p>
              <p className="text-zinc-300 text-lg">Progress is earned daily.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
