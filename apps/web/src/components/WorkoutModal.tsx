import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, getDocs, addDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { getMusclesForExercise } from '@repo/shared'
import { LabButton } from './LabButton'
import { LabCard } from './LabCard'

interface WorkoutModalProps {
  isOpen: boolean
  onClose: () => void
}

type WorkoutType = 'strength' | 'skill' | null
type Step = 1 | 2 | 3

interface Exercise {
  id: string
  name: string
  category: 'strength' | 'skill' | 'food'
  ownerId: string
  muscleGroup?: string
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth()
  const [step, setStep] = useState<Step>(1)
  const [workoutType, setWorkoutType] = useState<WorkoutType>(null)
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loadingExercises, setLoadingExercises] = useState(false)

  // Create custom exercise fields
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customCategory, setCustomCategory] = useState<'strength' | 'skill' | ''>('')
  const [customMuscleGroup, setCustomMuscleGroup] = useState('')
  const [savingCustom, setSavingCustom] = useState(false)

  // Strength fields
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')

  // Skill fields
  const [attempts, setAttempts] = useState('')
  const [made, setMade] = useState('')

  // Error state
  const [error, setError] = useState('')

  // Fetch system + user exercises from Firestore
  useEffect(() => {
    const fetchExercises = async () => {
      if (!currentUser) return
      setLoadingExercises(true)
      try {
        const exercisesRef = collection(db, 'exercises')

        const [systemSnapshot, userSnapshot] = await Promise.all([
          getDocs(query(exercisesRef, where('ownerId', '==', 'system'))),
          getDocs(query(exercisesRef, where('ownerId', '==', currentUser.uid))),
        ])

        const fetchedExercises: Exercise[] = []
        systemSnapshot.forEach(doc => {
          fetchedExercises.push({ id: doc.id, ...doc.data() } as Exercise)
        })
        userSnapshot.forEach(doc => {
          fetchedExercises.push({ id: doc.id, ...doc.data() } as Exercise)
        })

        setExercises(fetchedExercises)
      } catch (error) {
        console.error('Error fetching exercises:', error)
      } finally {
        setLoadingExercises(false)
      }
    }

    if (isOpen) {
      fetchExercises()
    }
  }, [isOpen, currentUser])

  // Filter exercises based on search and type
  const filteredExercises = useMemo(() => {
    return exercises.filter(
      (ex: Exercise) =>
        ex.category === workoutType && ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [workoutType, searchQuery, exercises])

  // Calculate success percentage
  const successPercentage = useMemo(() => {
    const attemptsNum = parseFloat(attempts)
    const madeNum = parseFloat(made)
    if (attemptsNum > 0 && madeNum >= 0 && madeNum <= attemptsNum) {
      return ((madeNum / attemptsNum) * 100).toFixed(1)
    }
    return '0'
  }, [attempts, made])

  const resetCreateForm = () => {
    setShowCreateForm(false)
    setCustomName('')
    setCustomCategory('')
    setCustomMuscleGroup('')
  }

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !customCategory) return

    setSavingCustom(true)
    try {
      const docRef = await addDoc(collection(db, 'exercises'), {
        name: customName,
        category: customCategory,
        muscleGroup: customMuscleGroup,
        ownerId: currentUser.uid,
      })

      const newExercise: Exercise = {
        id: docRef.id,
        name: customName,
        category: customCategory,
        muscleGroup: customMuscleGroup,
        ownerId: currentUser.uid,
      }

      setExercises(prev => [...prev, newExercise])
      resetCreateForm()
      handleExerciseSelect(docRef.id)
    } catch (error) {
      console.error('Error creating exercise:', error)
    } finally {
      setSavingCustom(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setWorkoutType(null)
    setSelectedExercise('')
    setSearchQuery('')
    resetCreateForm()
    setSets('')
    setReps('')
    setAttempts('')
    setMade('')
    setError('')
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const handleTypeSelect = (type: WorkoutType) => {
    setWorkoutType(type)
    setStep(2)
  }

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId)
    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!currentUser) return

    const now = new Date()
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const exerciseName = exercises.find((ex: Exercise) => ex.id === selectedExercise)?.name
    if (!exerciseName) {
      setError('No exercise selected.')
      return
    }

    const parsedSets = parseInt(sets)
    const parsedReps = parseInt(reps)
    const parsedAttempts = parseInt(attempts)
    const parsedMade = parseInt(made)

    if (workoutType === 'strength' && (isNaN(parsedSets) || isNaN(parsedReps))) {
      setError('Please enter valid sets and reps.')
      return
    }
    if (workoutType === 'skill' && (isNaN(parsedAttempts) || isNaN(parsedMade))) {
      setError('Please enter valid attempts and made.')
      return
    }

    const workoutLog = {
      type: workoutType,
      exercise: exerciseName,
      ...(workoutType === 'strength'
        ? {
            sets: parsedSets,
            reps: parsedReps,
          }
        : {
            attempts: parsedAttempts,
            made: parsedMade,
            percentage: parseFloat(successPercentage),
          }),
      dateKey,
      timestamp: new Date().toISOString(),
    }

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'activityLogs'), workoutLog)

      // Update muscle recovery timestamps
      const muscles = getMusclesForExercise(exerciseName)
      if (muscles.length > 0) {
        const now = new Date().toISOString()
        const recoveryUpdate: Record<string, string> = {}
        muscles.forEach(m => {
          recoveryUpdate[m] = now
        })
        await setDoc(doc(db, 'users', currentUser.uid, 'meta', 'muscleRecovery'), recoveryUpdate, {
          merge: true,
        })
      }

      handleClose()
    } catch (err) {
      console.error('Error saving workout log:', err)
      setError('Failed to save workout. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <LabCard className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-50">Log Workout</h2>
                    <p className="text-sm text-zinc-400 mt-1">Step {step} of 3</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-zinc-50 transition-colors"
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

                {/* Step 1: Type Selection */}
                {step === 1 && (
                  <div className="space-y-4">
                    <p className="text-zinc-300 mb-4">Select workout type:</p>

                    <button
                      onClick={() => handleTypeSelect('strength')}
                      className="w-full p-6 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-orange-500 rounded-lg transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                          <span className="text-2xl font-bold text-orange-500">[S]</span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-zinc-50">Strength</h3>
                          <p className="text-sm text-zinc-400">Sets, Reps</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleTypeSelect('skill')}
                      className="w-full p-6 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-orange-500 rounded-lg transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                          <span className="text-xl font-bold text-orange-500">[SK]</span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-zinc-50">Skill</h3>
                          <p className="text-sm text-zinc-400">Attempts, Made</p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Step 2: Exercise Selection */}
                {step === 2 && (
                  <div className="space-y-4">
                    {showCreateForm ? (
                      <form onSubmit={handleCreateCustom} className="space-y-4">
                        <p className="text-zinc-300">Create a new exercise:</p>

                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={customName}
                            onChange={e => setCustomName(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="e.g., Barbell Curl"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Category
                          </label>
                          <select
                            required
                            value={customCategory}
                            onChange={e =>
                              setCustomCategory(e.target.value as 'strength' | 'skill')
                            }
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 focus:outline-none focus:border-orange-500 transition-colors"
                          >
                            <option value="" disabled>
                              Select category
                            </option>
                            <option value="strength">Strength</option>
                            <option value="skill">Skill</option>
                          </select>
                        </div>

                        {/* Muscle Group */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Muscle Group
                          </label>
                          <select
                            required
                            value={customMuscleGroup}
                            onChange={e => setCustomMuscleGroup(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 focus:outline-none focus:border-orange-500 transition-colors"
                          >
                            <option value="" disabled>
                              Select muscle group
                            </option>
                            <option value="push">Push</option>
                            <option value="pull">Pull</option>
                            <option value="legs">Legs</option>
                            <option value="core">Core</option>
                            <option value="skill">Skill</option>
                          </select>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex gap-3 mt-6">
                          <LabButton
                            type="button"
                            onClick={resetCreateForm}
                            className="flex-1 bg-transparent border border-zinc-700 text-zinc-50 hover:bg-zinc-900"
                          >
                            Cancel
                          </LabButton>
                          <LabButton
                            type="submit"
                            disabled={savingCustom}
                            className="flex-1 bg-orange-500 text-black border-none hover:bg-orange-400 disabled:opacity-50"
                          >
                            {savingCustom ? 'Saving...' : 'Create'}
                          </LabButton>
                        </div>
                      </form>
                    ) : (
                      <>
                        {/* Search */}
                        <div>
                          <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>

                        {/* Exercise List */}
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {loadingExercises ? (
                            <div className="text-center py-8 text-zinc-400">
                              Loading exercises...
                            </div>
                          ) : filteredExercises.length > 0 ? (
                            filteredExercises.map((exercise: Exercise) => (
                              <button
                                key={exercise.id}
                                onClick={() => handleExerciseSelect(exercise.id!)}
                                className="w-full p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500 rounded transition-all text-left"
                              >
                                <span className="text-zinc-50 font-medium">{exercise.name}</span>
                              </button>
                            ))
                          ) : (
                            <div className="text-center py-8 text-zinc-400">No exercises found</div>
                          )}
                        </div>

                        {/* Create Custom Button */}
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="w-full p-4 bg-zinc-900 hover:bg-zinc-800 border-2 border-dashed border-zinc-700 hover:border-orange-500 rounded transition-all"
                        >
                          <span className="text-orange-500 font-medium">
                            + Create Custom Exercise
                          </span>
                        </button>

                        {/* Back Button */}
                        <LabButton
                          onClick={() => setStep(1)}
                          className="w-full bg-transparent border border-zinc-700 text-zinc-50 hover:bg-zinc-900"
                        >
                          Back
                        </LabButton>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Data Entry */}
                {step === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-4 bg-zinc-900 rounded border border-zinc-800 mb-4">
                      <p className="text-sm text-zinc-400">Exercise</p>
                      <p className="text-lg font-bold text-zinc-50">
                        {exercises.find((ex: Exercise) => ex.id === selectedExercise)?.name}
                      </p>
                    </div>

                    {workoutType === 'strength' ? (
                      <>
                        {/* Sets */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Sets
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={sets}
                            onChange={e => setSets(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="3"
                          />
                        </div>

                        {/* Reps */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Reps
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={reps}
                            onChange={e => setReps(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="12"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Attempts */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Attempts
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={attempts}
                            onChange={e => setAttempts(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="10"
                          />
                        </div>

                        {/* Made */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Made
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            max={attempts || undefined}
                            value={made}
                            onChange={e => setMade(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="8"
                          />
                        </div>

                        {/* Success Percentage */}
                        {attempts && made && (
                          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded">
                            <p className="text-sm text-zinc-400">Success Rate</p>
                            <p className="text-3xl font-black text-orange-500">
                              {successPercentage}%
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                        {error}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                      <LabButton
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-transparent border border-zinc-700 text-zinc-50 hover:bg-zinc-900"
                      >
                        Back
                      </LabButton>
                      <LabButton
                        type="submit"
                        className="flex-1 bg-orange-500 text-black border-none hover:bg-orange-400"
                      >
                        Save Log
                      </LabButton>
                    </div>
                  </form>
                )}
              </LabCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
