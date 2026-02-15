import React, { useState } from 'react'
import type { MuscleId, HeatmapColor } from '@repo/shared'

const COLOR_MAP: Record<HeatmapColor, string> = {
  red: '#ef4444',
  yellow: '#eab308',
  green: '#22c55e',
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Chest',
  front_delts: 'Front Delts',
  side_delts: 'Side Delts',
  rear_delts: 'Rear Delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  upper_back: 'Upper Back',
  lats: 'Lats',
  lower_back: 'Lower Back',
  abs: 'Abs',
  obliques: 'Obliques',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  hip_flexors: 'Hip Flexors',
}

interface BodyHeatmapProps {
  muscleColors: Record<MuscleId, HeatmapColor>
}

interface MuscleRegion {
  id: MuscleId
  d: string
}

// Simplified front-view muscle paths (stylized body outline)
const FRONT_MUSCLES: MuscleRegion[] = [
  // Chest (two pec shapes)
  { id: 'chest', d: 'M85,95 Q100,88 115,95 L115,115 Q100,120 85,115 Z' },
  // Front Delts (shoulder caps)
  { id: 'front_delts', d: 'M72,82 Q78,75 85,82 L85,98 Q78,95 72,98 Z' },
  { id: 'front_delts', d: 'M115,82 Q122,75 128,82 L128,98 Q122,95 115,98 Z' },
  // Side Delts
  { id: 'side_delts', d: 'M68,78 Q72,72 72,82 L72,98 Q68,95 65,90 Z' },
  { id: 'side_delts', d: 'M132,78 Q128,72 128,82 L128,98 Q132,95 135,90 Z' },
  // Biceps
  { id: 'biceps', d: 'M65,100 Q68,98 72,100 L72,135 Q68,138 65,135 Z' },
  { id: 'biceps', d: 'M128,100 Q132,98 135,100 L135,135 Q132,138 128,135 Z' },
  // Forearms
  { id: 'forearms', d: 'M63,137 Q67,135 71,137 L69,170 Q66,172 63,170 Z' },
  { id: 'forearms', d: 'M129,137 Q133,135 137,137 L137,170 Q134,172 131,170 Z' },
  // Abs (center torso)
  { id: 'abs', d: 'M90,118 L110,118 L110,158 Q100,162 90,158 Z' },
  // Obliques (sides of torso)
  { id: 'obliques', d: 'M80,115 L90,118 L90,155 Q85,158 80,152 Z' },
  { id: 'obliques', d: 'M120,115 L110,118 L110,155 Q115,158 120,152 Z' },
  // Hip Flexors
  { id: 'hip_flexors', d: 'M88,158 L100,162 L100,175 Q94,178 88,175 Z' },
  { id: 'hip_flexors', d: 'M112,158 L100,162 L100,175 Q106,178 112,175 Z' },
  // Quads
  { id: 'quads', d: 'M82,172 Q88,168 94,172 L92,225 Q87,228 82,225 Z' },
  { id: 'quads', d: 'M106,172 Q112,168 118,172 L118,225 Q113,228 108,225 Z' },
  // Calves (front view, inner)
  { id: 'calves', d: 'M84,230 Q88,228 92,230 L90,270 Q87,272 84,270 Z' },
  { id: 'calves', d: 'M108,230 Q112,228 116,230 L116,270 Q112,272 110,270 Z' },
]

// Simplified back-view muscle paths
const BACK_MUSCLES: MuscleRegion[] = [
  // Upper Back (trapezius area)
  { id: 'upper_back', d: 'M88,82 Q100,78 112,82 L112,105 Q100,100 88,105 Z' },
  // Lats (wide back)
  { id: 'lats', d: 'M78,100 L88,105 L88,140 Q83,142 78,138 Z' },
  { id: 'lats', d: 'M122,100 L112,105 L112,140 Q117,142 122,138 Z' },
  // Rear Delts
  { id: 'rear_delts', d: 'M72,82 Q78,75 85,82 L85,98 Q78,95 72,98 Z' },
  { id: 'rear_delts', d: 'M115,82 Q122,75 128,82 L128,98 Q122,95 115,98 Z' },
  // Side Delts (visible from back too)
  { id: 'side_delts', d: 'M68,78 Q72,72 72,82 L72,98 Q68,95 65,90 Z' },
  { id: 'side_delts', d: 'M132,78 Q128,72 128,82 L128,98 Q132,95 135,90 Z' },
  // Triceps
  { id: 'triceps', d: 'M65,100 Q68,98 72,100 L72,135 Q68,138 65,135 Z' },
  { id: 'triceps', d: 'M128,100 Q132,98 135,100 L135,135 Q132,138 128,135 Z' },
  // Lower Back
  { id: 'lower_back', d: 'M88,140 Q100,136 112,140 L112,160 Q100,164 88,160 Z' },
  // Glutes
  { id: 'glutes', d: 'M82,160 Q91,156 100,162 L100,182 Q91,186 82,182 Z' },
  { id: 'glutes', d: 'M118,160 Q109,156 100,162 L100,182 Q109,186 118,182 Z' },
  // Hamstrings
  { id: 'hamstrings', d: 'M82,184 Q88,180 94,184 L92,230 Q87,233 82,230 Z' },
  { id: 'hamstrings', d: 'M106,184 Q112,180 118,184 L118,230 Q113,233 108,230 Z' },
  // Calves
  { id: 'calves', d: 'M84,232 Q88,230 92,232 L90,270 Q87,272 84,270 Z' },
  { id: 'calves', d: 'M108,232 Q112,230 116,232 L116,270 Q112,272 110,270 Z' },
  // Forearms (back view)
  { id: 'forearms', d: 'M63,137 Q67,135 71,137 L69,170 Q66,172 63,170 Z' },
  { id: 'forearms', d: 'M129,137 Q133,135 137,137 L137,170 Q134,172 131,170 Z' },
]

export const BodyHeatmap: React.FC<BodyHeatmapProps> = ({ muscleColors }) => {
  const [view, setView] = useState<'front' | 'back'>('front')
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null)

  const muscles = view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES

  return (
    <div className="flex flex-col items-center">
      {/* Toggle */}
      <div className="flex gap-1 mb-4 p-1 bg-zinc-900 rounded-lg">
        <button
          onClick={() => setView('front')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            view === 'front' ? 'bg-orange-500 text-black' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setView('back')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            view === 'back' ? 'bg-orange-500 text-black' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Back
        </button>
      </div>

      {/* SVG Body */}
      <div className="relative">
        <svg viewBox="55 55 90 235" className="w-48 h-auto">
          {/* Body outline */}
          <ellipse
            cx="100"
            cy="65"
            rx="15"
            ry="18"
            fill="#3f3f46"
            stroke="#52525b"
            strokeWidth="0.5"
          />
          <line x1="100" y1="83" x2="100" y2="83" stroke="#52525b" strokeWidth="0.5" />

          {/* Muscle regions */}
          {muscles.map((region, i) => (
            <path
              key={`${region.id}-${i}`}
              d={region.d}
              fill={COLOR_MAP[muscleColors[region.id] || 'green']}
              fillOpacity={0.7}
              stroke="#27272a"
              strokeWidth="0.5"
              className="cursor-pointer transition-opacity hover:opacity-100"
              style={{ opacity: hoveredMuscle === region.id ? 1 : 0.7 }}
              onMouseEnter={() => setHoveredMuscle(region.id)}
              onMouseLeave={() => setHoveredMuscle(null)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredMuscle && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 whitespace-nowrap pointer-events-none">
            {MUSCLE_LABELS[hoveredMuscle] || hoveredMuscle}
            <span
              className="ml-1.5 inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor: COLOR_MAP[muscleColors[hoveredMuscle as MuscleId] || 'green'],
              }}
            />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_MAP.red }} />
          <span className="text-xs text-zinc-400">&lt;24h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_MAP.yellow }} />
          <span className="text-xs text-zinc-400">24-48h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_MAP.green }} />
          <span className="text-xs text-zinc-400">Ready</span>
        </div>
      </div>
    </div>
  )
}
