import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { LabButton } from './LabButton'
import { LabCard } from './LabCard'

interface FoodModalProps {
  isOpen: boolean
  onClose: () => void
}

export const FoodModal: React.FC<FoodModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth()
  const [mealType, setMealType] = useState('')
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState('g')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setSaving(true)
    try {
      const now = new Date()
      const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      await addDoc(collection(db, 'users', currentUser.uid, 'foodLogs'), {
        mealType,
        description,
        weight: parseFloat(weight),
        unit,
        dateKey,
        createdAt: serverTimestamp(),
      })

      // Reset form
      setMealType('')
      setDescription('')
      setWeight('')
      setUnit('g')
      onClose()
    } catch (error) {
      console.error('Error saving food log:', error)
    } finally {
      setSaving(false)
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
            onClick={onClose}
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
                  <h2 className="text-2xl font-bold text-zinc-50">Log Nutrition</h2>
                  <button
                    onClick={onClose}
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Meal Type */}
                  <div>
                    <label
                      htmlFor="mealType"
                      className="block text-sm font-medium text-zinc-300 mb-2"
                    >
                      Meal
                    </label>
                    <select
                      id="mealType"
                      required
                      value={mealType}
                      onChange={e => setMealType(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 focus:outline-none focus:border-orange-500 transition-colors"
                    >
                      <option value="" disabled>
                        Select a meal
                      </option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-zinc-300 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      placeholder="e.g., Grilled chicken breast with vegetables"
                      rows={3}
                    />
                  </div>

                  {/* Weight and Unit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-zinc-300 mb-2"
                      >
                        Weight
                      </label>
                      <input
                        id="weight"
                        type="number"
                        required
                        step="0.1"
                        min="0"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="250"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="unit"
                        className="block text-sm font-medium text-zinc-300 mb-2"
                      >
                        Unit
                      </label>
                      <select
                        id="unit"
                        value={unit}
                        onChange={e => setUnit(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-50 focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="g">g (grams)</option>
                        <option value="oz">oz (ounces)</option>
                        <option value="lbs">lbs (pounds)</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <LabButton
                    type="submit"
                    disabled={saving}
                    className="w-full bg-orange-500 text-black border-none hover:bg-orange-400 mt-6 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Log'}
                  </LabButton>
                </form>
              </LabCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
