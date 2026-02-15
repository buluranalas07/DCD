import type { ActivityLevel } from '../schemas/user'

export interface ProgramDay {
  dayName: string
  exercises: {
    exerciseName: string
    sets: number
    reps: string
  }[]
}

export interface ProgramTemplate {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  description: string
  days: ProgramDay[]
}

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: 'beginner_fullbody',
    name: 'Beginner Full Body',
    level: 'beginner',
    description: '3 days/week full body routine for new lifters.',
    days: [
      {
        dayName: 'Day A',
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '8-10' },
          { exerciseName: 'Bench Press', sets: 3, reps: '8-10' },
          { exerciseName: 'Pull-ups', sets: 3, reps: '5-8' },
          { exerciseName: 'Plank', sets: 3, reps: '30s' },
        ],
      },
      {
        dayName: 'Day B',
        exercises: [
          { exerciseName: 'Deadlift', sets: 3, reps: '5-8' },
          { exerciseName: 'Overhead Press', sets: 3, reps: '8-10' },
          { exerciseName: 'Barbell Row', sets: 3, reps: '8-10' },
          { exerciseName: 'Plank', sets: 3, reps: '30s' },
        ],
      },
      {
        dayName: 'Day C',
        exercises: [
          { exerciseName: 'Lunges', sets: 3, reps: '10-12' },
          { exerciseName: 'Push-ups', sets: 3, reps: '10-15' },
          { exerciseName: 'Chin-ups', sets: 3, reps: '5-8' },
          { exerciseName: 'Sit-ups', sets: 3, reps: '15-20' },
        ],
      },
    ],
  },
  {
    id: 'intermediate_upper_lower',
    name: 'Intermediate Upper/Lower',
    level: 'intermediate',
    description: '4 days/week upper/lower split for consistent lifters.',
    days: [
      {
        dayName: 'Upper A',
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '6-8' },
          { exerciseName: 'Barbell Row', sets: 4, reps: '6-8' },
          { exerciseName: 'Overhead Press', sets: 3, reps: '8-10' },
          { exerciseName: 'Bicep Curl', sets: 3, reps: '10-12' },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12' },
        ],
      },
      {
        dayName: 'Lower A',
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '6-8' },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10' },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12' },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15' },
          { exerciseName: 'Plank', sets: 3, reps: '45s' },
        ],
      },
      {
        dayName: 'Upper B',
        exercises: [
          { exerciseName: 'Pull-ups', sets: 4, reps: '6-8' },
          { exerciseName: 'Dumbbell Fly', sets: 3, reps: '10-12' },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15' },
          { exerciseName: 'Face Pull', sets: 3, reps: '12-15' },
          { exerciseName: 'Dips', sets: 3, reps: '8-10' },
        ],
      },
      {
        dayName: 'Lower B',
        exercises: [
          { exerciseName: 'Deadlift', sets: 4, reps: '5-6' },
          { exerciseName: 'Lunges', sets: 3, reps: '10-12' },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12' },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15' },
          { exerciseName: 'Sit-ups', sets: 3, reps: '15-20' },
        ],
      },
    ],
  },
  {
    id: 'advanced_ppl',
    name: 'Advanced Push/Pull/Legs',
    level: 'advanced',
    description: '6 days/week PPL split for experienced lifters.',
    days: [
      {
        dayName: 'Push',
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '5-6' },
          { exerciseName: 'Overhead Press', sets: 4, reps: '6-8' },
          { exerciseName: 'Dumbbell Fly', sets: 3, reps: '10-12' },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15' },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12' },
          { exerciseName: 'Dips', sets: 3, reps: '8-10' },
        ],
      },
      {
        dayName: 'Pull',
        exercises: [
          { exerciseName: 'Deadlift', sets: 4, reps: '5-6' },
          { exerciseName: 'Pull-ups', sets: 4, reps: '6-8' },
          { exerciseName: 'Barbell Row', sets: 4, reps: '6-8' },
          { exerciseName: 'Face Pull', sets: 3, reps: '12-15' },
          { exerciseName: 'Bicep Curl', sets: 3, reps: '10-12' },
        ],
      },
      {
        dayName: 'Legs',
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '5-6' },
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '8-10' },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12' },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12' },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15' },
          { exerciseName: 'Plank', sets: 3, reps: '60s' },
        ],
      },
    ],
  },
]

export function getProgramForLevel(activityLevel: ActivityLevel): ProgramTemplate {
  switch (activityLevel) {
    case 'sedentary':
    case 'lightly_active':
      return PROGRAM_TEMPLATES[0] // Beginner Full Body
    case 'moderately_active':
      return PROGRAM_TEMPLATES[1] // Intermediate Upper/Lower
    case 'very_active':
    case 'extremely_active':
      return PROGRAM_TEMPLATES[2] // Advanced PPL
    default:
      // Fallback for safety, though TS should catch missing cases if ActivityLevel is exhausted
      return PROGRAM_TEMPLATES[0]
  }
}
