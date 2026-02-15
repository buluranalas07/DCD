import React from 'react'
import { motion } from 'framer-motion'
import { LabCard } from './LabCard'

interface MacroBarProps {
  label: string
  current: number
  target: number
  color: string
  unit?: string
}

const MacroBar: React.FC<MacroBarProps> = ({ label, current, target, color, unit = 'g' }) => {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="text-xs text-zinc-500">
          {Math.round(current)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

interface MacrosCardProps {
  current: {
    calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }
  target: {
    daily_calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }
}

export const MacrosCard: React.FC<MacrosCardProps> = ({ current, target }) => {
  return (
    <LabCard className="p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Daily Macros</h3>
      <div className="space-y-3">
        <MacroBar
          label="Calories"
          current={current.calories}
          target={target.daily_calories}
          color="#f97316"
          unit="kcal"
        />
        <MacroBar
          label="Protein"
          current={current.protein_g}
          target={target.protein_g}
          color="#3b82f6"
        />
        <MacroBar label="Carbs" current={current.carbs_g} target={target.carbs_g} color="#22c55e" />
        <MacroBar label="Fat" current={current.fat_g} target={target.fat_g} color="#eab308" />
      </div>
    </LabCard>
  )
}
