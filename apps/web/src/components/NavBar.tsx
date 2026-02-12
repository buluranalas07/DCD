import React from 'react'
import { Link } from 'react-router-dom'
import { LabButton } from './LabButton'

export const NavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="text-zinc-50 text-xl font-bold hover:text-orange-500 transition-colors">
          DCD Lab
        </Link>

        {/* Navigation Section */}
        <div className="flex items-center gap-8">
          {/* Navigation Links */}
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

          {/* Sign In Button */}
          <Link to="/signin">
            <LabButton variant="ghost" className="text-sm">
              SIGN IN
            </LabButton>
          </Link>
        </div>
      </div>
    </nav>
  )
}
