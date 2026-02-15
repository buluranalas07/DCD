import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LabButton } from './LabButton'

export const Hero: React.FC = () => {
  // --- State ---
  const [typewriterIndex, setTypewriterIndex] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [startWordLoop, setStartWordLoop] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // --- Configuration ---
  const line1 = 'TALENT IS CHEAP,'
  const line2End = ' IS COSTLY.'
  const words = ['DISCIPLINE', 'COMMITMENT', 'DEDICATION']
  const fullText = line1 + ' ' + words[0] + line2End

  const images = [
    'https://plus.unsplash.com/premium_photo-1664304770925-6f9a1386d7b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UnVubmVyfGVufDB8fDB8fHww',
    'https://media.istockphoto.com/id/498426111/photo/volleyball-action.webp?a=1&b=1&s=612x612&w=0&k=20&c=Vq9bwEzkXB-HhjNd7r4TPc0EeW1PWBcEVuBNcFQgTAo=',
    'https://plus.unsplash.com/premium_photo-1676634832130-a539dc7893e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D',
  ]

  // --- Effects ---
  useEffect(() => {
    const typeInterval = setInterval(() => {
      if (typewriterIndex <= fullText.length) {
        setTypewriterIndex(prev => prev + 1)
      } else {
        clearInterval(typeInterval)
        setTimeout(() => setShowContent(true), 300)
        setTimeout(() => {
          setStartWordLoop(true)
          setCurrentWordIndex(1)
        }, 1500)
      }
    }, 60)
    return () => clearInterval(typeInterval)
  }, [typewriterIndex, fullText.length])

  useEffect(() => {
    if (!startWordLoop) return
    const wordInterval = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(wordInterval)
  }, [startWordLoop, words.length])

  useEffect(() => {
    if (!startWordLoop) return
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(imageInterval)
  }, [startWordLoop, images.length])

  // --- Render Helpers ---
  const getTypewriterText = () => {
    const currentText = fullText.slice(0, typewriterIndex)
    const dedicationStart = line1.length + 1
    const dedicationEnd = dedicationStart + words[0].length

    if (typewriterIndex <= line1.length) {
      return (
        <div className="flex flex-col items-center">
          <div>
            {currentText}
            <span className="animate-pulse ml-1">|</span>
          </div>
          <div className="opacity-0">{words[0]}</div>
        </div>
      )
    } else if (typewriterIndex <= dedicationEnd) {
      const wordTyped = currentText.slice(dedicationStart)
      return (
        <div className="flex flex-col items-center">
          <div>{line1}</div>
          <div>
            <span className="text-orange-500">{wordTyped}</span>
            <span className="animate-pulse ml-1">|</span>
          </div>
        </div>
      )
    } else {
      const remainingText = currentText.slice(dedicationEnd)
      return (
        <div className="flex flex-col items-center">
          <div>{line1}</div>
          <div>
            <span className="text-orange-500">{words[0]}</span>
            {remainingText}
            <span className="animate-pulse ml-1">|</span>
          </div>
        </div>
      )
    }
  }

  const getFinalText = () => {
    return (
      <div className="flex flex-col items-center">
        <div>{line1}</div>
        <div className="flex flex-wrap items-baseline justify-center gap-2 md:gap-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={words[currentWordIndex]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-orange-500 font-bold whitespace-nowrap"
            >
              {words[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="whitespace-nowrap">{line2End}</span>
        </div>
      </div>
    )
  }

  // --- Main Render ---
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={images[currentImageIndex]}
              alt="Hero Background"
              className="w-full h-full object-cover object-center grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <span className="text-zinc-400 uppercase tracking-[0.2em] text-sm font-medium">
            Hybrid Performance System
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-zinc-50">
          {startWordLoop ? getFinalText() : getTypewriterText()}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-zinc-400 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          The elite athlete's toolkit for extreme consistency. Track what matters, ignore the noise,
          and bridge the gap between potential and performance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/signup">
            <LabButton className="bg-orange-500 text-black border-none hover:bg-orange-400">
              Get Started
            </LabButton>
          </Link>
          <LabButton className="bg-transparent border border-zinc-700 text-zinc-50 hover:bg-zinc-900">
            Learn More
          </LabButton>
        </motion.div>
      </div>
    </section>
  )
}
