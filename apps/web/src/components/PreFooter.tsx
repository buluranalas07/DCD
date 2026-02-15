import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LabButton } from './LabButton'

export const PreFooter: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const words = ['DISCIPLINE', 'COMMITMENT', 'DEDICATION']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale"
        >
          <source
            src="https://videos.pexels.com/video-files/5586521/5586521-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
      </div>

      {/* Main Content (Centered) */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-bold mb-10 text-zinc-50 tracking-tight"
        >
          READY TO <span className="text-orange-500">OUTWORK</span> YOUR{' '}
          <span className="text-zinc-500/60">TALENT?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <Link to="/signup">
            <LabButton className="bg-orange-500 text-black border-none hover:bg-orange-400 text-lg px-10 py-4 font-bold uppercase tracking-wider">
              Start your journey
            </LabButton>
          </Link>
        </motion.div>
      </div>

      {/* Dynamic Text (Pinned to Bottom) */}
      <div className="absolute bottom-12 left-0 w-full z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          // ADDED: 'translate-x-12' to move the whole block to the right
          className="flex justify-center items-center gap-4 text-xl md:text-2xl font-bold tracking-widest translate-x-12"
        >
          {/* Dynamic Word */}
          <div className="text-right w-[200px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[currentWordIndex]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-orange-500 block"
              >
                {words[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Separator */}
          <span className="text-zinc-700 text-lg">&gt;</span>

          {/* Static Word */}
          <div className="text-left w-[200px] text-zinc-500">TALENT</div>
        </motion.div>
      </div>
    </section>
  )
}
