import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import { LabCard } from '../components/LabCard'
import { WorkoutModal } from '../components/WorkoutModal'
import { FoodModal } from '../components/FoodModal'

export const DashboardPage: React.FC = () => {
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false)
  const [foodModalOpen, setFoodModalOpen] = useState(false)
  const { currentUser } = useAuth()

  return (
    <Layout>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-zinc-50">
                Welcome back, {currentUser?.displayName || 'Athlete'}!
              </h1>
              <p className="text-zinc-400 mt-1">Let's track your progress today</p>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
              </svg>
              <span className="text-sm font-bold text-zinc-50">0</span>
            </div>
          </motion.div>

          {/* Today's Overview Section */}
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-zinc-50">Today's Overview</h2>
              <p className="text-zinc-400 mt-1">Track your daily progress</p>
            </div>

            {/* Calories Card - Coming Soon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <LabCard className="relative p-6 overflow-hidden">
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs font-medium rounded-full">
                    Coming Soon
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-zinc-400">
                    <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-50 mb-2">Calories</h3>
                <p className="text-3xl font-black text-zinc-300 opacity-30">2450 / 3000</p>
              </LabCard>
            </motion.div>

            {/* Workouts and Nutrition Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {/* Workouts Card */}
              <LabCard
                hover
                className="p-6 cursor-pointer group"
                onClick={() => setWorkoutModalOpen(true)}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-50">Workouts</h3>
                </div>
              </LabCard>

              {/* Nutrition Card */}
              <LabCard
                hover
                className="p-6 cursor-pointer group"
                onClick={() => setFoodModalOpen(true)}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21V3h2v18H3zM19 21V3h2v18h-2zM9 13v8H7v-8h2zM9 3v7H7V3h2zM15 13v8h-2v-8h2zM15 3v7h-2V3h2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8h18M3 16h18"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-50">Nutrition Log</h3>
                </div>
              </LabCard>
            </motion.div>
          </motion.section>

          {/* Discover Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-zinc-50">Discover</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DiscoverCard
                icon={
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                }
                label="Recipes"
              />
              <DiscoverCard
                icon={
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
                label="Routines"
              />
              <DiscoverCard
                icon={
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
                label="Workouts"
              />
              <DiscoverCard
                icon={
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
                label="Community"
              />
            </div>
          </motion.section>
        </div>

        {/* Modals */}
        <WorkoutModal isOpen={workoutModalOpen} onClose={() => setWorkoutModalOpen(false)} />
        <FoodModal isOpen={foodModalOpen} onClose={() => setFoodModalOpen(false)} />
      </main>
    </Layout>
  )
}

// DiscoverCard Component
interface DiscoverCardProps {
  icon: React.ReactNode
  label: string
}

const DiscoverCard: React.FC<DiscoverCardProps> = ({ icon, label }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
    >
      <LabCard hover className="p-8 text-center group">
        <div className="flex justify-center mb-4 text-zinc-400 group-hover:text-orange-500 transition-colors">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-zinc-300">{label}</h3>
      </LabCard>
    </motion.div>
  )
}
