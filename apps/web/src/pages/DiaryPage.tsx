import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import { LabCard } from '../components/LabCard'
import { WorkoutModal } from '../components/WorkoutModal'
import { FoodModal } from '../components/FoodModal'
import { Calendar } from '../components/Calendar'

type MealType = 'breakfast' | 'lunch' | 'dinner'
type ActivityType = 'strength' | 'skill'

interface FoodLog {
  id: string
  description: string
  weight: number
  unit: string
  mealType: MealType
  timestamp: string
}

interface ActivityLog {
  id: string
  type: ActivityType
  exercise: string
  // Strength fields
  sets?: number
  reps?: number
  weight?: number
  // Skill fields
  attempts?: number
  made?: number
  percentage?: number
  timestamp: string
}

export const DiaryPage: React.FC = () => {
  const { currentUser } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false)
  const [foodModalOpen, setFoodModalOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null)
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Fetch logs for selected date
  useEffect(() => {
    if (!currentUser) return

    const fetchLogs = async () => {
      // TODO: Implement Firestore queries to fetch logs for selectedDate
      // For now, using mock data
      console.log('Fetching logs for:', selectedDate)
    }

    fetchLogs()
  }, [selectedDate, currentUser])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false)
      }
    }

    if (calendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [calendarOpen])

  const handlePreviousDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  const handleNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAddFood = (mealType: MealType) => {
    setSelectedMealType(mealType)
    setFoodModalOpen(true)
  }

  const handleAddActivity = (activityType: ActivityType) => {
    setSelectedActivityType(activityType)
    setWorkoutModalOpen(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setCalendarOpen(false)
    }
  }

  const groupFoodByMeal = (logs: FoodLog[]) => {
    return {
      breakfast: logs.filter(log => log.mealType === 'breakfast'),
      lunch: logs.filter(log => log.mealType === 'lunch'),
      dinner: logs.filter(log => log.mealType === 'dinner')
    }
  }

  const groupActivityByType = (logs: ActivityLog[]) => {
    return {
      strength: logs.filter(log => log.type === 'strength'),
      skill: logs.filter(log => log.type === 'skill')
    }
  }

  const foodByMeal = groupFoodByMeal(foodLogs)
  const activityByType = groupActivityByType(activityLogs)

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto">
        {/* Sticky Date Navigation Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800"
        >
          <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-4">
            {/* Previous Day Button */}
            <button
              onClick={handlePreviousDay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 transition-all"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Date Display */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="text-xl font-bold text-zinc-50 hover:text-orange-500 transition-colors cursor-pointer min-w-[400px] text-center"
              >
                {formatDate(selectedDate)}
              </button>

              {/* Calendar Popover */}
              <AnimatePresence>
                {calendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50"
                  >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next Day Button */}
            <button
              onClick={handleNextDay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 transition-all"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Food Section */}
            <section>
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-zinc-50">Nutrition</h2>
                <p className="text-sm text-zinc-400 mt-0.5">Track your meals</p>
              </div>

              <div className="space-y-6">
                {/* Breakfast */}
                <MealCategory
                  title="Breakfast"
                  logs={foodByMeal.breakfast}
                  onAdd={() => handleAddFood('breakfast')}
                />

                {/* Lunch */}
                <MealCategory
                  title="Lunch"
                  logs={foodByMeal.lunch}
                  onAdd={() => handleAddFood('lunch')}
                />

                {/* Dinner */}
                <MealCategory
                  title="Dinner"
                  logs={foodByMeal.dinner}
                  onAdd={() => handleAddFood('dinner')}
                />
              </div>
            </section>

            {/* Activities Section */}
            <section>
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-zinc-50">Activities</h2>
                <p className="text-sm text-zinc-400 mt-0.5">Track your training</p>
              </div>

              <div className="space-y-6">
                {/* Strength */}
                <ActivityCategory
                  title="Strength"
                  logs={activityByType.strength}
                  type="strength"
                  onAdd={() => handleAddActivity('strength')}
                />

                {/* Skill */}
                <ActivityCategory
                  title="Skill"
                  logs={activityByType.skill}
                  type="skill"
                  onAdd={() => handleAddActivity('skill')}
                />
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* Modals */}
        <WorkoutModal isOpen={workoutModalOpen} onClose={() => setWorkoutModalOpen(false)} />
        <FoodModal isOpen={foodModalOpen} onClose={() => setFoodModalOpen(false)} />
      </div>
    </main>
    </Layout>
  )
}

// Meal Category Component
interface MealCategoryProps {
  title: string
  logs: FoodLog[]
  onAdd: () => void
}

const MealCategory: React.FC<MealCategoryProps> = ({ title, logs, onAdd }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-zinc-50">{title}</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500 transition-all"
        >
          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-medium text-zinc-50">Add</span>
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">No food logged for {title.toLowerCase()}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map((log) => (
            <FoodCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}

// Food Card Component
interface FoodCardProps {
  log: FoodLog
}

const FoodCard: React.FC<FoodCardProps> = ({ log }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="relative"
    >
      <LabCard
        hover
        className="p-3 cursor-pointer border-l-4 border-l-orange-500/50 hover:border-l-orange-500 transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-base font-bold text-zinc-50">{log.description}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {log.weight} {log.unit}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors">
              <svg className="w-4 h-4 text-zinc-400 hover:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors">
              <svg className="w-4 h-4 text-zinc-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </LabCard>
    </motion.div>
  )
}

// Activity Category Component
interface ActivityCategoryProps {
  title: string
  logs: ActivityLog[]
  type: ActivityType
  onAdd: () => void
}

const ActivityCategory: React.FC<ActivityCategoryProps> = ({ title, logs, type, onAdd }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-zinc-50">{title}</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500 transition-all"
        >
          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-medium text-zinc-50">Add</span>
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">No {title.toLowerCase()} activities logged</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map((log) => (
            type === 'strength' ? (
              <StrengthCard key={log.id} log={log} />
            ) : (
              <SkillCard key={log.id} log={log} />
            )
          ))}
        </div>
      )}
    </div>
  )
}

// Strength Card Component
interface StrengthCardProps {
  log: ActivityLog
}

const StrengthCard: React.FC<StrengthCardProps> = ({ log }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="relative"
    >
      <LabCard hover className="p-3 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-base font-bold text-zinc-50">{log.exercise}</h4>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors">
              <svg className="w-4 h-4 text-zinc-400 hover:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors">
              <svg className="w-4 h-4 text-zinc-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stat Badges */}
        <div className="flex gap-2">
          <div className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="text-xs text-zinc-400">Sets: </span>
            <span className="text-sm font-bold text-zinc-50">{log.sets}</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="text-xs text-zinc-400">Reps: </span>
            <span className="text-sm font-bold text-zinc-50">{log.reps}</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="text-xs text-zinc-400">Weight: </span>
            <span className="text-sm font-bold text-zinc-50">{log.weight} lbs</span>
          </div>
        </div>
      </LabCard>
    </motion.div>
  )
}

// Skill Card Component
interface SkillCardProps {
  log: ActivityLog
}

const SkillCard: React.FC<SkillCardProps> = ({ log }) => {
  const successRate = log.percentage || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="relative"
    >
      <LabCard hover className="p-3 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-base font-bold text-zinc-50">{log.exercise}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {log.made} / {log.attempts} attempts
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors">
              <svg className="w-4 h-4 text-zinc-400 hover:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors">
              <svg className="w-4 h-4 text-zinc-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Success Percentage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Success Rate</span>
            <span className="text-base font-bold text-orange-500">{successRate.toFixed(1)}%</span>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            />
          </div>
        </div>
      </LabCard>
    </motion.div>
  )
}