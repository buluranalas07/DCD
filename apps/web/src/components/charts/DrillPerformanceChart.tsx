import React, { useState, useMemo, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { LabCard } from '../LabCard'

interface LogEntry {
  date: string
  exercise: string
  sets?: number
  reps?: number
  weight?: number
  attempts?: number
  made?: number
}

interface DrillPerformanceChartProps {
  logs: LogEntry[]
}

export const DrillPerformanceChart: React.FC<DrillPerformanceChartProps> = ({ logs }) => {
  const exercises = useMemo(() => {
    const names = new Set(logs.map(l => l.exercise))
    return Array.from(names).sort()
  }, [logs])

  const [selected, setSelected] = useState(exercises[0] || '')

  // Sync selected exercise when exercise list changes
  useEffect(() => {
    if (exercises.length > 0 && !exercises.includes(selected)) {
      setSelected(exercises[0])
    } else if (exercises.length === 0 && selected !== '') {
      setSelected('')
    }
  }, [exercises, selected])

  const chartData = useMemo(() => {
    if (!selected) return []

    const filtered = logs
      .filter(l => l.exercise === selected)
      .sort((a, b) => a.date.localeCompare(b.date))

    return filtered.map(l => ({
      date: l.date.slice(5), // MM-DD
      volume: (l.sets || 0) * (l.reps || 0) * (l.weight || 1),
      percentage: l.attempts && l.made ? Math.round((l.made / l.attempts) * 100) : undefined,
    }))
  }, [selected, logs])

  if (exercises.length === 0) {
    return (
      <LabCard className="p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Exercise Performance</h3>
        <div className="text-center py-8 text-zinc-500 text-sm">
          Log workouts to track exercise performance over time!
        </div>
      </LabCard>
    )
  }

  const hasPercentage = chartData.some(d => d.percentage !== undefined)
  const dataKey = hasPercentage ? 'percentage' : 'volume'
  const label = hasPercentage ? 'Success %' : 'Volume'

  return (
    <LabCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300">Exercise Performance</h3>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
        >
          {exercises.map(ex => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              color: '#fafafa',
              fontSize: 12,
            }}
            formatter={(value: number | undefined) => [value ?? 0, label]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: '#f97316', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </LabCard>
  )
}
