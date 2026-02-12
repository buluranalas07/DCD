import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import { LabCard } from '../components/LabCard'
import { Calendar } from '../components/Calendar'

type MealType = 'breakfast' | 'lunch' | 'dinner'
type ActivityType = 'strength' | 'skill'

interface FoodLog {
  id: string
  description: string
  weight: number
  unit: string
  mealType: MealType
}

interface ActivityLog {
  id: string
  type: ActivityType
  exercise: string
  sets?: number
  reps?: number
  weight?: number
  attempts?: number
  made?: number
  percentage?: number
}

const normalizeDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const DiaryPage: React.FC = () => {
  const { currentUser } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const dateKey = normalizeDateKey(selectedDate)

  // Fetch logs for selected date
  const fetchLogs = useCallback(async () => {
    if (!currentUser) return

    try {
      // Fetch food logs
      const foodRef = collection(db, 'users', currentUser.uid, 'foodLogs')
      const foodQuery = query(foodRef, where('dateKey', '==', dateKey))
      const foodSnapshot = await getDocs(foodQuery)
      const fetchedFood: FoodLog[] = []
      foodSnapshot.forEach(d => {
        const data = d.data()
        fetchedFood.push({
          id: d.id,
          description: data.description,
          weight: data.weight,
          unit: data.unit,
          mealType: data.mealType,
        })
      })
      setFoodLogs(fetchedFood)

      // Fetch activity logs
      const activityRef = collection(db, 'users', currentUser.uid, 'activityLogs')
      const activityQuery = query(activityRef, where('dateKey', '==', dateKey))
      const activitySnapshot = await getDocs(activityQuery)
      const fetchedActivities: ActivityLog[] = []
      activitySnapshot.forEach(d => {
        const data = d.data()
        fetchedActivities.push({
          id: d.id,
          type: data.type,
          exercise: data.exercise,
          sets: data.sets,
          reps: data.reps,
          weight: data.weight,
          attempts: data.attempts,
          made: data.made,
          percentage: data.percentage,
        })
      })
      setActivityLogs(fetchedActivities)
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }, [currentUser, dateKey])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

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
      day: 'numeric',
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setCalendarOpen(false)
    }
  }

  const handleDeleteFood = async (logId: string) => {
    if (!currentUser) return
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'foodLogs', logId))
      setFoodLogs(prev => prev.filter(log => log.id !== logId))
    } catch (error) {
      console.error('Error deleting food log:', error)
    }
  }

  const handleDeleteActivity = async (logId: string) => {
    if (!currentUser) return
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'activityLogs', logId))
      setActivityLogs(prev => prev.filter(log => log.id !== logId))
    } catch (error) {
      console.error('Error deleting activity log:', error)
    }
  }

  const handleEditFood = async (logId: string, updates: Partial<FoodLog>) => {
    if (!currentUser) return
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'foodLogs', logId), updates)
      setFoodLogs(prev => prev.map(log => (log.id === logId ? { ...log, ...updates } : log)))
    } catch (error) {
      console.error('Error updating food log:', error)
    }
  }

  const handleEditActivity = async (logId: string, updates: Partial<ActivityLog>) => {
    if (!currentUser) return
    try {
      const firestoreUpdates = { ...updates } as Record<string, number | string | undefined>
      if (updates.attempts !== undefined && updates.made !== undefined) {
        firestoreUpdates.percentage =
          updates.attempts > 0 ? (updates.made / updates.attempts) * 100 : 0
      }
      await updateDoc(doc(db, 'users', currentUser.uid, 'activityLogs', logId), firestoreUpdates)
      setActivityLogs(prev =>
        prev.map(log => (log.id === logId ? ({ ...log, ...firestoreUpdates } as ActivityLog) : log))
      )
    } catch (error) {
      console.error('Error updating activity log:', error)
    }
  }

  const groupFoodByMeal = (logs: FoodLog[]) => {
    return {
      breakfast: logs.filter(log => log.mealType === 'breakfast'),
      lunch: logs.filter(log => log.mealType === 'lunch'),
      dinner: logs.filter(log => log.mealType === 'dinner'),
    }
  }

  const groupActivityByType = (logs: ActivityLog[]) => {
    return {
      strength: logs.filter(log => log.type === 'strength'),
      skill: logs.filter(log => log.type === 'skill'),
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
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
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
                        <Calendar selected={selectedDate} onSelect={handleDateSelect} />
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
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
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
                    onDelete={handleDeleteFood}
                    onEdit={handleEditFood}
                  />

                  {/* Lunch */}
                  <MealCategory
                    title="Lunch"
                    logs={foodByMeal.lunch}
                    onDelete={handleDeleteFood}
                    onEdit={handleEditFood}
                  />

                  {/* Dinner */}
                  <MealCategory
                    title="Dinner"
                    logs={foodByMeal.dinner}
                    onDelete={handleDeleteFood}
                    onEdit={handleEditFood}
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
                    onDelete={handleDeleteActivity}
                    onEdit={handleEditActivity}
                  />

                  {/* Skill */}
                  <ActivityCategory
                    title="Skill"
                    logs={activityByType.skill}
                    type="skill"
                    onDelete={handleDeleteActivity}
                    onEdit={handleEditActivity}
                  />
                </div>
              </section>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </Layout>
  )
}

// Meal Category Component
interface MealCategoryProps {
  title: string
  logs: FoodLog[]
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<FoodLog>) => void
}

const MealCategory: React.FC<MealCategoryProps> = ({ title, logs, onDelete, onEdit }) => {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-lg font-bold text-zinc-50">{title}</h3>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">
          No food logged for {title.toLowerCase()}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map(log => (
            <FoodCard key={log.id} log={log} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

// Food Card Component
interface FoodCardProps {
  log: FoodLog
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<FoodLog>) => void
}

const FoodCard: React.FC<FoodCardProps> = ({ log, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(log.description)
  const [wt, setWt] = useState(String(log.weight))

  const handleSave = () => {
    onEdit(log.id, { description: desc, weight: parseFloat(wt) || log.weight })
    setEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <LabCard className="p-3 border-l-4 border-l-orange-500/50 transition-all">
        {editing ? (
          <div className="space-y-2">
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-50 focus:outline-none focus:border-orange-500"
            />
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={wt}
                onChange={e => setWt(e.target.value)}
                className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-50 focus:outline-none focus:border-orange-500"
              />
              <span className="text-xs text-zinc-400">{log.unit}</span>
              <div className="flex-1" />
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-orange-500 text-black text-xs font-semibold rounded hover:bg-orange-400 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setDesc(log.description)
                  setWt(String(log.weight))
                }}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-bold text-zinc-50">{log.description}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {log.weight} {log.unit}
              </p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-zinc-400 hover:text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(log.id)}
                className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-zinc-400 hover:text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </LabCard>
    </motion.div>
  )
}

// Activity Category Component
interface ActivityCategoryProps {
  title: string
  logs: ActivityLog[]
  type: ActivityType
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<ActivityLog>) => void
}

const ActivityCategory: React.FC<ActivityCategoryProps> = ({
  title,
  logs,
  type,
  onDelete,
  onEdit,
}) => {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-lg font-bold text-zinc-50">{title}</h3>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">
          No {title.toLowerCase()} activities logged
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map(log =>
            type === 'strength' ? (
              <StrengthCard key={log.id} log={log} onDelete={onDelete} onEdit={onEdit} />
            ) : (
              <SkillCard key={log.id} log={log} onDelete={onDelete} onEdit={onEdit} />
            )
          )}
        </div>
      )}
    </div>
  )
}

// Strength Card Component
interface StrengthCardProps {
  log: ActivityLog
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<ActivityLog>) => void
}

const StrengthCard: React.FC<StrengthCardProps> = ({ log, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false)
  const [sets, setSets] = useState(String(log.sets || ''))
  const [reps, setReps] = useState(String(log.reps || ''))

  const handleSave = () => {
    onEdit(log.id, { sets: parseInt(sets) || 0, reps: parseInt(reps) || 0 })
    setEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <LabCard className="p-3">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-base font-bold text-zinc-50">{log.exercise}</h4>

          <div className="flex gap-1">
            <button
              onClick={() => setEditing(!editing)}
              className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-4 h-4 text-zinc-400 hover:text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(log.id)}
              className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-4 h-4 text-zinc-400 hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {editing ? (
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Sets:</span>
              <input
                type="number"
                value={sets}
                onChange={e => setSets(e.target.value)}
                className="w-14 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-50 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Reps:</span>
              <input
                type="number"
                value={reps}
                onChange={e => setReps(e.target.value)}
                className="w-14 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-50 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex-1" />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-orange-500 text-black text-xs font-semibold rounded hover:bg-orange-400 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setSets(String(log.sets || ''))
                setReps(String(log.reps || ''))
              }}
              className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              <span className="text-xs text-zinc-400">Sets: </span>
              <span className="text-sm font-bold text-zinc-50">{log.sets}</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              <span className="text-xs text-zinc-400">Reps: </span>
              <span className="text-sm font-bold text-zinc-50">{log.reps}</span>
            </div>
          </div>
        )}
      </LabCard>
    </motion.div>
  )
}

// Skill Card Component
interface SkillCardProps {
  log: ActivityLog
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<ActivityLog>) => void
}

const SkillCard: React.FC<SkillCardProps> = ({ log, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false)
  const [attempts, setAttempts] = useState(String(log.attempts || ''))
  const [made, setMade] = useState(String(log.made || ''))
  const successRate = log.percentage || 0

  const handleSave = () => {
    const a = parseInt(attempts) || 0
    const m = parseInt(made) || 0
    onEdit(log.id, { attempts: a, made: m })
    setEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <LabCard className="p-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-base font-bold text-zinc-50">{log.exercise}</h4>
            {!editing && (
              <p className="text-xs text-zinc-400 mt-0.5">
                {log.made} / {log.attempts} attempts
              </p>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setEditing(!editing)}
              className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-4 h-4 text-zinc-400 hover:text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(log.id)}
              className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-4 h-4 text-zinc-400 hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {editing ? (
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Attempts:</span>
              <input
                type="number"
                value={attempts}
                onChange={e => setAttempts(e.target.value)}
                className="w-14 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-50 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Made:</span>
              <input
                type="number"
                value={made}
                onChange={e => setMade(e.target.value)}
                className="w-14 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-50 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex-1" />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-orange-500 text-black text-xs font-semibold rounded hover:bg-orange-400 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setAttempts(String(log.attempts || ''))
                setMade(String(log.made || ''))
              }}
              className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Success Rate</span>
              <span className="text-base font-bold text-orange-500">{successRate.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${successRate}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
              />
            </div>
          </div>
        )}
      </LabCard>
    </motion.div>
  )
}
