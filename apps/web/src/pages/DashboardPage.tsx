import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/Layout'
import { LabCard } from '../components/LabCard'
import { WorkoutModal } from '../components/WorkoutModal'
import { FoodModal } from '../components/FoodModal'
import { MacrosCard } from '../components/MacrosCard'
import { BodyHeatmap } from '../components/BodyHeatmap'
import {
  getAllHeatmapColors,
  MUSCLE_IDS,
  PROGRAM_TEMPLATES,
  RECIPES,
  getTodayKey,
  getYesterdayKey,
  sumEstimatedMacros,
} from '@repo/shared'
import type { MuscleId, HeatmapColor, MuscleRecovery } from '@repo/shared'

export const DashboardPage: React.FC = () => {
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false)
  const [foodModalOpen, setFoodModalOpen] = useState(false)
  const [streak, setStreak] = useState(0)
  const [muscleRecovery, setMuscleRecovery] = useState<MuscleRecovery>({})
  const [todayCalories, setTodayCalories] = useState(0)
  const [todayProtein, setTodayProtein] = useState(0)
  const [todayCarbs, setTodayCarbs] = useState(0)
  const [todayFat, setTodayFat] = useState(0)
  const { currentUser, userProfile } = useAuth()

  const todayKey = getTodayKey()

  // Update streak on dashboard visit
  useEffect(() => {
    if (!currentUser) return

    const updateStreak = async () => {
      const streakRef = doc(db, 'users', currentUser.uid, 'meta', 'streak')
      const streakDoc = await getDoc(streakRef)
      const today = getTodayKey()
      const yesterday = getYesterdayKey()

      if (streakDoc.exists()) {
        const data = streakDoc.data()
        const lastActive: string = data.lastActiveDate

        if (lastActive === today) {
          setStreak(data.count)
        } else if (lastActive === yesterday) {
          const newCount = data.count + 1
          await setDoc(streakRef, { lastActiveDate: today, count: newCount })
          setStreak(newCount)
        } else {
          await setDoc(streakRef, { lastActiveDate: today, count: 1 })
          setStreak(1)
        }
      } else {
        await setDoc(streakRef, { lastActiveDate: today, count: 1 })
        setStreak(1)
      }
    }

    updateStreak()
  }, [currentUser])

  // Fetch muscle recovery state
  useEffect(() => {
    if (!currentUser) return

    const fetchRecovery = async () => {
      try {
        const recoveryDoc = await getDoc(
          doc(db, 'users', currentUser.uid, 'meta', 'muscleRecovery')
        )
        if (recoveryDoc.exists()) {
          setMuscleRecovery(recoveryDoc.data() as MuscleRecovery)
        }
      } catch (error) {
        console.error('Error fetching muscle recovery:', error)
      }
    }

    fetchRecovery()
  }, [currentUser])

  // Fetch today's food logs for macros card
  useEffect(() => {
    if (!currentUser) return

    const fetchFoodLogs = async () => {
      try {
        const foodRef = collection(db, 'users', currentUser.uid, 'foodLogs')
        const foodQuery = query(foodRef, where('dateKey', '==', todayKey))
        const snapshot = await getDocs(foodQuery)

        const weights: number[] = []
        snapshot.forEach(d => {
          weights.push(d.data().weight || 0)
        })
        const macros = sumEstimatedMacros(weights)

        setTodayCalories(macros.calories)
        setTodayProtein(macros.protein_g)
        setTodayCarbs(macros.carbs_g)
        setTodayFat(macros.fat_g)
      } catch (error) {
        console.error('Error fetching food logs:', error)
      }
    }

    fetchFoodLogs()
  }, [currentUser, todayKey])

  // Compute heatmap colors
  const muscleColors = useMemo(() => {
    return getAllHeatmapColors(muscleRecovery, MUSCLE_IDS)
  }, [muscleRecovery]) as Record<MuscleId, HeatmapColor>

  // Get today's program day
  const todaysPlan = useMemo(() => {
    if (!userProfile?.program_id) return null
    const program = PROGRAM_TEMPLATES.find(p => p.id === userProfile.program_id)
    if (!program) return null
    const dayIndex = new Date().getDay() % program.days.length
    return { program, day: program.days[dayIndex] }
  }, [userProfile])

  // Get recipe suggestions based on goal
  const suggestedRecipes = useMemo(() => {
    if (!userProfile?.goal) return []
    return RECIPES.filter(r => r.goal_tags.includes(userProfile.goal)).slice(0, 3)
  }, [userProfile])

  const macrosTarget = userProfile?.macros_target

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
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
              <span className="text-sm font-bold text-zinc-50">{streak}</span>
            </div>
          </motion.div>

          {/* Top Row: Macros + Heatmap */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Macros Card */}
            {macrosTarget ? (
              <MacrosCard
                current={{
                  calories: todayCalories,
                  protein_g: todayProtein,
                  carbs_g: todayCarbs,
                  fat_g: todayFat,
                }}
                target={macrosTarget}
              />
            ) : (
              <LabCard className="p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Daily Macros</h3>
                <p className="text-zinc-500 text-sm">Complete onboarding to see your targets.</p>
              </LabCard>
            )}

            {/* Muscle Recovery Heatmap */}
            <LabCard className="p-5">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">Muscle Recovery</h3>
              <BodyHeatmap muscleColors={muscleColors} />
            </LabCard>
          </motion.div>

          {/* Quick Actions Row */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Workouts Card */}
            <LabCard
              hover
              className="p-6 cursor-pointer group"
              onClick={() => setWorkoutModalOpen(true)}
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-50">Workouts Log</h3>
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

          {/* Today's Plan Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-zinc-50">Today's Plan</h2>
              <p className="text-zinc-400 mt-1">Your workout & meal suggestions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workout Plan */}
              <LabCard className="p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">
                  {todaysPlan ? todaysPlan.day.dayName : 'Workout'}
                </h3>
                {todaysPlan ? (
                  <div className="space-y-2">
                    {todaysPlan.day.exercises.map((ex, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800"
                      >
                        <span className="text-sm font-medium text-zinc-50">{ex.exerciseName}</span>
                        <span className="text-xs text-zinc-400">
                          {ex.sets} x {ex.reps}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-zinc-500 mt-2">From: {todaysPlan.program.name}</p>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm">Complete onboarding to get a program.</p>
                )}
              </LabCard>

              {/* Recipe Suggestions */}
              <LabCard className="p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">Suggested Meals</h3>
                {suggestedRecipes.length > 0 ? (
                  <div className="space-y-2">
                    {suggestedRecipes.map(recipe => (
                      <div
                        key={recipe.id}
                        className="p-3 bg-zinc-900 rounded-lg border border-zinc-800"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-zinc-50">{recipe.name}</span>
                          <span className="text-xs text-orange-500">{recipe.calories} kcal</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{recipe.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm">Complete onboarding to see suggestions.</p>
                )}
              </LabCard>
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
