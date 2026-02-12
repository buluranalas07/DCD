import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import { Calendar } from '../components/Calendar'
import { LabCard } from '../components/LabCard'

type ActivityType = 'workout' | 'skill'

interface ActivityLog {
  id: string
  date: Date
  type: ActivityType
  exercise?: string
  // Additional fields from your schema
  sets?: number
  reps?: number
  weight?: number
  attempts?: number
  made?: number
}

export const ProgressPage: React.FC = () => {
  const { currentUser } = useAuth()
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  // Fetch activity logs from Firestore
  useEffect(() => {
    if (!currentUser) return

    const fetchLogs = async () => {
      try {
        const logsRef = collection(db, 'users', currentUser.uid, 'activityLogs')
        const snapshot = await getDocs(logsRef)
        const logs: ActivityLog[] = snapshot.docs.map(doc => {
          const data = doc.data()
          const [y, m, d] = data.dateKey.split('-').map(Number)
          return {
            id: doc.id,
            date: new Date(y, m - 1, d),
            type:
              data.type === 'strength' ? ('workout' as ActivityType) : ('skill' as ActivityType),
            exercise: data.exercise,
            sets: data.sets,
            reps: data.reps,
            attempts: data.attempts,
            made: data.made,
          }
        })
        setActivityLogs(logs)
      } catch (error) {
        console.error('Error fetching activity logs:', error)
      }
    }

    fetchLogs()
  }, [currentUser])

  // Helper: Normalize date to YYYY-MM-DD string
  const normalizeDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Step A: Create lookup map with O(1) performance
  const activityMap = useMemo(() => {
    const map: Record<string, Set<ActivityType>> = {}

    activityLogs.forEach(log => {
      const dateKey = normalizeDate(log.date)
      if (!map[dateKey]) {
        map[dateKey] = new Set()
      }
      map[dateKey].add(log.type)
    })

    return map
  }, [activityLogs])

  // Step B: Categorize dates into mutually exclusive arrays
  const categorizedDates = useMemo(() => {
    const both: Date[] = []
    const workoutOnly: Date[] = []
    const skillOnly: Date[] = []

    Object.entries(activityMap).forEach(([dateKey, types]) => {
      const [year, month, day] = dateKey.split('-').map(Number)
      const date = new Date(year, month - 1, day)

      if (types.has('workout') && types.has('skill')) {
        both.push(date)
      } else if (types.has('workout')) {
        workoutOnly.push(date)
      } else if (types.has('skill')) {
        skillOnly.push(date)
      }
    })

    return { both, workoutOnly, skillOnly }
  }, [activityMap])

  // Step C: Get activities for a specific date
  const getActivitiesForDate = (date: Date): ActivityLog[] => {
    const dateKey = normalizeDate(date)
    return activityLogs.filter(log => normalizeDate(log.date) === dateKey)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const selectedActivities = selectedDate ? getActivitiesForDate(selectedDate) : []

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
            <h1 className="text-2xl font-bold text-zinc-50">Progress</h1>
            <p className="text-zinc-400 mt-1">Track your activity history</p>
          </motion.div>

          {/* Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <LabCard className="p-6">
                <h2 className="text-xl font-bold text-zinc-50 mb-4">Activity Calendar</h2>

                <div className="flex justify-center">
                  <Calendar
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    modifiers={{
                      both: categorizedDates.both,
                      workoutOnly: categorizedDates.workoutOnly,
                      skillOnly: categorizedDates.skillOnly,
                    }}
                    modifiersClassNames={{
                      both: 'progress-day-both',
                      workoutOnly: 'progress-day-workout',
                      skillOnly: 'progress-day-skill',
                    }}
                  />
                </div>

                <style>{`
                  .progress-day-both {
                    background-color: rgb(249 115 22 / 0.3) !important;
                    color: rgb(249 115 22) !important;
                    font-weight: 600;
                    border-radius: 0.375rem;
                  }
                  .progress-day-workout {
                    background-color: rgb(59 130 246 / 0.3) !important;
                    color: rgb(59 130 246) !important;
                    font-weight: 600;
                    border-radius: 0.375rem;
                  }
                  .progress-day-skill {
                    background-color: rgb(168 85 247 / 0.3) !important;
                    color: rgb(168 85 247) !important;
                    font-weight: 600;
                    border-radius: 0.375rem;
                  }
                `}</style>

                {/* Legend */}
                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-2">Legend</h3>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                    <span className="text-sm text-zinc-400">Workout & Skill</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-sm text-zinc-400">Workout Only</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="w-4 h-4 rounded bg-purple-500"></div>
                    <span className="text-sm text-zinc-400">Skill Only</span>
                  </motion.div>
                </div>
              </LabCard>
            </motion.div>

            {/* Selected Day Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <LabCard className="p-6">
                <motion.h2
                  key={selectedDate?.toISOString() || 'no-date'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold text-zinc-50 mb-4"
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Select a Date'}
                </motion.h2>

                {selectedActivities.length > 0 ? (
                  <div className="space-y-4">
                    {selectedActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-zinc-900 rounded-lg border border-zinc-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              activity.type === 'workout'
                                ? 'bg-blue-500/20 text-blue-500'
                                : 'bg-purple-500/20 text-purple-500'
                            }`}
                          >
                            {activity.type.toUpperCase()}
                          </span>
                        </div>

                        {activity.exercise && (
                          <p className="text-sm font-medium text-zinc-50">{activity.exercise}</p>
                        )}

                        {activity.type === 'workout' && (
                          <p className="text-xs text-zinc-400 mt-1">
                            {activity.sets} sets × {activity.reps} reps @ {activity.weight} lbs
                          </p>
                        )}

                        {activity.type === 'skill' && (
                          <p className="text-xs text-zinc-400 mt-1">
                            {activity.made}/{activity.attempts} made (
                            {((activity.made! / activity.attempts!) * 100).toFixed(1)}%)
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center py-12 text-zinc-500"
                  >
                    {selectedDate
                      ? 'No activities logged for this day'
                      : 'Click on a date to view activities'}
                  </motion.div>
                )}
              </LabCard>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
            >
              <LabCard className="p-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Workouts</h3>
                <p className="text-3xl font-bold text-zinc-50">
                  {activityLogs.filter(log => log.type === 'workout').length}
                </p>
              </LabCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
            >
              <LabCard className="p-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Skills</h3>
                <p className="text-3xl font-bold text-zinc-50">
                  {activityLogs.filter(log => log.type === 'skill').length}
                </p>
              </LabCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.25 }}
            >
              <LabCard className="p-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Active Days</h3>
                <p className="text-3xl font-bold text-zinc-50">{Object.keys(activityMap).length}</p>
              </LabCard>
            </motion.div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
