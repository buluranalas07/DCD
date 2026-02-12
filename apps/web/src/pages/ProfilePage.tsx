import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { updateProfile } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import { LabCard } from '../components/LabCard'

const ATHLETE_QUOTES = [
  {
    quote: "The only way to prove that you're a good sport is to lose.",
    author: 'Ernie Banks',
  },
  {
    quote: "Hard work beats talent when talent doesn't work hard.",
    author: 'Tim Notke',
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: 'Wayne Gretzky',
  },
  {
    quote: 'Champions keep playing until they get it right.',
    author: 'Billie Jean King',
  },
  {
    quote:
      "The difference between the impossible and the possible lies in a person's determination.",
    author: 'Tommy Lasorda',
  },
]

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth()
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
  const [saving, setSaving] = useState(false)
  const [selectedQuote] = useState(
    ATHLETE_QUOTES[Math.floor(Math.random() * ATHLETE_QUOTES.length)]
  )

  const handleSaveProfile = async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      await updateProfile(currentUser, { displayName: displayName.trim() })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Implement profile picture upload to Firebase Storage
      console.log('Selected file:', file)
    }
  }

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-2xl font-bold text-zinc-50">Profile</h1>
            <p className="text-zinc-400 mt-1">Manage your account settings</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <LabCard className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-black">
                      {currentUser?.displayName?.charAt(0).toUpperCase() || 'A'}
                    </div>

                    {/* Upload Button */}
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-zinc-800 hover:bg-orange-500 border-2 border-zinc-900 rounded-full flex items-center justify-center cursor-pointer transition-colors group">
                      <svg
                        className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* User Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-50">
                      {currentUser?.displayName || 'Athlete'}
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">{currentUser?.email}</p>
                  </div>

                  <div className="w-full grid grid-cols-3 gap-4 pt-6 pb-14 border-t border-zinc-800">
                    <div></div>
                  </div>
                </div>
              </LabCard>
            </motion.div>

            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <LabCard className="p-8">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-orange-500 mb-4">Daily Motivation</h3>
                    <blockquote className="text-xl font-medium text-zinc-50 leading-relaxed">
                      "{selectedQuote.quote}"
                    </blockquote>
                    <p className="text-sm text-zinc-400 mt-4">— {selectedQuote.author}</p>
                  </div>

                  {/* Additional Quotes */}
                  <div className="mt-8 space-y-3">
                    {ATHLETE_QUOTES.filter(q => q !== selectedQuote)
                      .slice(0, 2)
                      .map((quote, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-zinc-900 rounded-lg border border-zinc-800"
                        >
                          <p className="text-sm text-zinc-300 italic">"{quote.quote}"</p>
                          <p className="text-xs text-zinc-500 mt-1">— {quote.author}</p>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </LabCard>
            </motion.div>
          </div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
          >
            <LabCard className="p-8">
              <h3 className="text-xl font-bold text-zinc-50 mb-6">Account Settings</h3>

              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 cursor-not-allowed"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </LabCard>
          </motion.div>

          {/* DCD Lab Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative py-16 overflow-hidden"
          >
            <div className="flex items-center justify-center">
              <h1 className="text-9xl font-black text-zinc-800">DCD Lab</h1>
            </div>
          </motion.div>
        </div>
      </main>
    </Layout>
  )
}
