import React from 'react'
import { motion } from 'framer-motion'
import { LabCard } from './LabCard'

export const Features: React.FC = () => {
  // Animation variants for scroll-triggered pop-up
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="tracking" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 uppercase tracking-wider"
        >
          What You Can Track
        </motion.h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Feature Card 1: FOOD */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.1, scale: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            className="h-full"
          >
            <LabCard hover className="h-full">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-bold mb-4 text-primary">FOOD</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>• Breakfast</li>
                <li>• Lunch</li>
                <li>• Dinner</li>
                <li>• Name + Weight</li>
              </ul>
            </LabCard>
          </motion.div>

          {/* Feature Card 2: EXERCISES */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.2, scale: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            className="h-full"
          >
            <LabCard hover className="h-full">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-bold mb-4 text-primary">EXERCISES</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>• Strength Training</li>
                <li>• Custom Exercises</li>
                <li>• Reusable Logs</li>
                <li>• Quick Selection</li>
              </ul>
            </LabCard>
          </motion.div>

          {/* Feature Card 3: DRILLS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.3, scale: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            className="h-full"
          >
            <LabCard hover className="h-full">
              <div className="text-4xl mb-4">🏀</div>
              <h3 className="text-xl font-bold mb-4 text-primary">DRILLS</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>• Shots Attempted</li>
                <li>• Shots Made</li>
                <li>• Misses + %</li>
                <li>• Skill Tracking</li>
              </ul>
            </LabCard>
          </motion.div>
        </div>

        {/* Second Row - 2 Cards Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Feature Card 4: CONSISTENCY */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.4, scale: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            className="h-full"
          >
            <LabCard hover className="h-full">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-4 text-primary">CONSISTENCY</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>• Daily Logs</li>
                <li>• Show Up Daily</li>
                <li>• Build Streaks</li>
              </ul>
            </LabCard>
          </motion.div>

          {/* Feature Card 5: PROGRESS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.5, scale: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            className="h-full"
          >
            <LabCard hover className="h-full">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-4 text-primary">PROGRESS</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>• Monthly Calendar</li>
                <li>• Strength = Red</li>
                <li>• Drills = Blue</li>
                <li>• Both = Orange</li>
              </ul>
            </LabCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
