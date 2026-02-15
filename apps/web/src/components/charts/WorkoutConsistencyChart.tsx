import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { LabCard } from '../LabCard'

interface WeekData {
  week: string
  workouts: number
}

interface WorkoutConsistencyChartProps {
  data: WeekData[]
}

export const WorkoutConsistencyChart: React.FC<WorkoutConsistencyChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <LabCard className="p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Workout Consistency</h3>
        <div className="text-center py-8 text-zinc-500 text-sm">
          Log your first workout to track consistency!
        </div>
      </LabCard>
    )
  }

  return (
    <LabCard className="p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Workout Consistency</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="week"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
            allowDecimals={false}
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
          <Bar dataKey="workouts" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </LabCard>
  )
}
