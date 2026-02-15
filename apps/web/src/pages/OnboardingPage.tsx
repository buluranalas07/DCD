import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { setDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { LabCard } from '../components/LabCard'
import { LabButton } from '../components/LabButton'
import { LabInput } from '../components/LabInput'
import {
  calculateBMR,
  calculateAge,
  calculateTDEE,
  getTargetMacros,
  getProgramForLevel,
} from '@repo/shared'
import type { Goal, ActivityLevel } from '@repo/shared'

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Office job, little exercise' },
  { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  {
    value: 'moderately_active',
    label: 'Moderately Active',
    desc: 'Moderate exercise 3-5 days/week',
  },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', desc: 'Athlete / physical job' },
]

const GOAL_OPTIONS: { value: Goal; label: string; desc: string }[] = [
  { value: 'cut', label: 'Cut', desc: 'Lose fat while preserving muscle' },
  { value: 'maintain', label: 'Maintain', desc: 'Stay at current weight' },
  { value: 'bulk', label: 'Bulk', desc: 'Build muscle and gain strength' },
]

export const OnboardingPage: React.FC = () => {
  const { currentUser, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1 fields
  const [goal, setGoal] = useState<Goal | ''>('')

  // Step 2 fields
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('')

  // Step 3 fields
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [dob, setDob] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')

  const age = dob ? calculateAge(dob) : 0

  const computed = useMemo(() => {
    if (!goal || !activityLevel || !dob || !heightCm || !weightKg) return null
    const h = parseFloat(heightCm)
    const w = parseFloat(weightKg)
    if (!h || !w || age <= 0) return null

    const bmr = calculateBMR({ sex, weight_kg: w, height_cm: h, age_years: age })
    const tdee = calculateTDEE(bmr, activityLevel as ActivityLevel)
    const macros = getTargetMacros(tdee, goal as Goal, w)
    const program = getProgramForLevel(activityLevel as ActivityLevel)

    return { bmr, tdee, macros, program }
  }, [sex, dob, heightCm, weightKg, activityLevel, goal, age])

  const canProceedStep1 = goal !== ''
  const canProceedStep2 = activityLevel !== ''
  const canSave = computed !== null

  const handleSave = async () => {
    if (!currentUser || !computed) return
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'profile', 'data'), {
        sex,
        dob,
        height_cm: parseFloat(heightCm),
        weight_kg: parseFloat(weightKg),
        activity_level: activityLevel,
        goal,
        bmr: computed.bmr,
        tdee: computed.tdee,
        macros_target: computed.macros,
        program_id: computed.program.id,
      })
      await refreshProfile()
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? 'bg-orange-500' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Goal */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <LabCard className="p-8">
                <h1 className="text-2xl font-bold text-zinc-50 mb-2">Set Your Goal</h1>
                <p className="text-zinc-400 mb-6">What do you want to achieve?</p>

                <div className="space-y-3">
                  {GOAL_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setGoal(opt.value)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        goal === opt.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-base font-semibold text-zinc-50">{opt.label}</span>
                      <p className="text-sm text-zinc-400 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <LabButton disabled={!canProceedStep1} onClick={() => setStep(2)}>
                    Next
                  </LabButton>
                </div>
              </LabCard>
            </motion.div>
          )}

          {/* STEP 2: Activity Level */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <LabCard className="p-8">
                <h1 className="text-2xl font-bold text-zinc-50 mb-2">Activity Level</h1>
                <p className="text-zinc-400 mb-6">How active are you on a typical week?</p>

                <div className="space-y-3">
                  {ACTIVITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setActivityLevel(opt.value)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        activityLevel === opt.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-base font-semibold text-zinc-50">{opt.label}</span>
                      <p className="text-sm text-zinc-400 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <LabButton variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </LabButton>
                  <LabButton disabled={!canProceedStep2} onClick={() => setStep(3)}>
                    Next
                  </LabButton>
                </div>
              </LabCard>
            </motion.div>
          )}

          {/* STEP 3: Biometrics + Summary */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <LabCard className="p-8">
                <h1 className="text-2xl font-bold text-zinc-50 mb-2">Your Biometrics</h1>
                <p className="text-zinc-400 mb-6">We'll calculate your daily targets.</p>

                {/* Sex toggle */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Sex</label>
                  <div className="flex gap-2">
                    {(['male', 'female'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setSex(s)}
                        className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                          sex === s
                            ? 'bg-orange-500 text-black'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <LabInput
                    label="Date of Birth"
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <LabInput
                    label="Height (cm)"
                    type="number"
                    placeholder="175"
                    min={50}
                    max={300}
                    value={heightCm}
                    onChange={e => setHeightCm(e.target.value)}
                  />
                  <LabInput
                    label="Weight (kg)"
                    type="number"
                    placeholder="75"
                    min={20}
                    max={500}
                    value={weightKg}
                    onChange={e => setWeightKg(e.target.value)}
                  />
                </div>

                {/* Computed Summary */}
                {computed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-lg bg-zinc-900 border border-zinc-800"
                  >
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3">Your Daily Targets</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-zinc-500">BMR</p>
                        <p className="text-lg font-bold text-zinc-50">{computed.bmr} kcal</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">TDEE</p>
                        <p className="text-lg font-bold text-zinc-50">{computed.tdee} kcal</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Target Calories</p>
                        <p className="text-lg font-bold text-orange-500">
                          {computed.macros.daily_calories} kcal
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Program</p>
                        <p className="text-sm font-bold text-zinc-50">{computed.program.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-zinc-800">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-zinc-500">Protein</p>
                        <p className="text-sm font-bold text-blue-400">
                          {computed.macros.protein_g}g
                        </p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-xs text-zinc-500">Carbs</p>
                        <p className="text-sm font-bold text-green-400">
                          {computed.macros.carbs_g}g
                        </p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-xs text-zinc-500">Fat</p>
                        <p className="text-sm font-bold text-yellow-400">
                          {computed.macros.fat_g}g
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-between">
                  <LabButton variant="ghost" onClick={() => setStep(2)}>
                    Back
                  </LabButton>
                  <LabButton disabled={!canSave || saving} onClick={handleSave}>
                    {saving ? 'Saving...' : 'Save Profile'}
                  </LabButton>
                </div>
              </LabCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
