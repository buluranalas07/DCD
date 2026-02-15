import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { LabCard } from '../LabCard'

interface DayData {
  day: string
  calories: number
}

interface MacroAdherenceChartProps {
  data: DayData[]
  targetCalories: number
}

export const MacroAdherenceChart: React.FC<MacroAdherenceChartProps> = ({
  data,
  targetCalories,
}) => {
  if (data.length === 0) {
    return (
      <LabCard className="p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Calorie Intake (7 Days)</h3>
        <div className="text-center py-8 text-zinc-500 text-sm">
          Log your first meal to see your trends!
        </div>
      </LabCard>
    )
  }

  return (
    <LabCard className="p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Calorie Intake (7 Days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="day"
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
          />
          <ReferenceLine
            y={targetCalories}
            stroke="#f97316"
            strokeDasharray="4 4"
            label={{ value: 'Target', fill: '#f97316', fontSize: 10, position: 'right' }}
          />
          <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </LabCard>
  )
}
