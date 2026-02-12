import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Failed to log out', err)
    }
  }

  const isActive = (path: string) => location.pathname === path

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    setSidebarOpen(false)
  }

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-black text-zinc-50">DCD Lab</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-zinc-400 hover:text-zinc-50 transition-colors md:hidden"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavItem
          icon={<HomeIcon />}
          label="Dashboard"
          to="/dashboard"
          active={isActive('/dashboard')}
          onClick={handleNavClick}
        />
        <NavItem
          icon={<DiaryIcon />}
          label="Diary"
          to="/diary"
          active={isActive('/diary')}
          onClick={handleNavClick}
        />
        <NavItem
          icon={<ProgressIcon />}
          label="Progress"
          to="/progress"
          active={isActive('/progress')}
          onClick={handleNavClick}
        />
        <NavItem
          icon={<ProfileIcon />}
          label="Profile"
          to="/profile"
          active={isActive('/profile')}
          onClick={handleNavClick}
        />
      </nav>

      {/* Logout Button */}
      <div className="p-4 pb-6 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 py-3 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-zinc-400 hover:text-zinc-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-black text-zinc-50">DCD Lab</h1>
        <div className="w-6" /> {/* Spacer for centering */}
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex w-64 bg-zinc-900 border-r border-zinc-800 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex-1 pt-14 md:pt-0">{children}</div>
    </div>
  )
}

// Nav icons extracted for readability
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const DiaryIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const ProgressIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

// NavItem Component
interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  to?: string
  onClick?: () => void
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, to, onClick }) => {
  const className = `w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
    active
      ? 'bg-orange-500/10 text-orange-500'
      : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800'
  }`

  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </Link>
    )
  }

  return (
    <button className={className} onClick={onClick}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
