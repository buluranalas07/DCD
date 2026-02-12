import React from 'react'
import { NavBar } from '../components/NavBar'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { About } from '../components/About'
import { PreFooter } from '../components/PreFooter'
import { Footer } from '../components/Footer'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <Features />
      <About />
      <PreFooter />
      <Footer />
    </div>
  )
}
