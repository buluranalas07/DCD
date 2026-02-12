import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LabButton } from './LabButton'

export const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          to="/"
          className="text-zinc-50 text-xl font-bold hover:text-orange-500 transition-colors"
        >
          DCD Lab
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#tracking"
            className="text-zinc-50 hover:text-primary transition-colors text-sm font-medium uppercase"
          >
            TRACKING
          </a>
          <a
            href="#about"
            className="text-zinc-50 hover:text-primary transition-colors text-sm font-medium uppercase"
          >
            ABOUT
          </a>
          <a
            href="#contact"
            className="text-zinc-50 hover:text-primary transition-colors text-sm font-medium uppercase"
          >
            CONTACT
          </a>
          <Link to="/signin">
            <LabButton variant="ghost" className="text-sm">
              SIGN IN
            </LabButton>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-zinc-400 hover:text-zinc-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-xl px-6 py-4 space-y-3">
          <a
            href="#tracking"
            onClick={() => setMenuOpen(false)}
            className="block text-zinc-50 hover:text-primary transition-colors text-sm font-medium uppercase"
          >
            TRACKING
          </a>
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="block text-zinc-50 hover:text-primary transition-colors text-sm font-medium uppercase"
          >
            ABOUT
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block text-zinc-50 hover:text-primary transition-colors text-sm font-medium uppercase"
          >
            CONTACT
          </a>
          <Link to="/signin" onClick={() => setMenuOpen(false)}>
            <LabButton variant="ghost" className="text-sm w-full mt-2">
              SIGN IN
            </LabButton>
          </Link>
        </div>
      )}
    </nav>
  )
}
