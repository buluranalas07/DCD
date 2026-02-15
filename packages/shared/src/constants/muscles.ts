export type MuscleId =
  | 'chest'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'upper_back'
  | 'lats'
  | 'lower_back'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'hip_flexors'

export const MUSCLE_IDS: readonly MuscleId[] = [
  'chest',
  'front_delts',
  'side_delts',
  'rear_delts',
  'biceps',
  'triceps',
  'forearms',
  'upper_back',
  'lats',
  'lower_back',
  'abs',
  'obliques',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'hip_flexors',
] as const

export const EXERCISE_MUSCLE_MAP: Record<string, MuscleId[]> = {
  // Seed exercises
  'Bench Press': ['chest', 'triceps', 'front_delts'],
  Squat: ['quads', 'glutes', 'hamstrings', 'lower_back'],
  Deadlift: ['hamstrings', 'glutes', 'lower_back', 'upper_back', 'forearms'],
  'Pull-ups': ['lats', 'biceps', 'upper_back', 'forearms'],
  'Push-ups': ['chest', 'triceps', 'front_delts'],
  Running: ['quads', 'hamstrings', 'calves', 'hip_flexors'],
  Plank: ['abs', 'obliques', 'lower_back'],
  'Free Throws': [],
  'Jump Shot': [],
  Swimming: ['lats', 'upper_back', 'front_delts', 'quads'],

  // Common extras
  'Overhead Press': ['front_delts', 'side_delts', 'triceps'],
  'Barbell Row': ['upper_back', 'lats', 'biceps', 'rear_delts'],
  'Lateral Raise': ['side_delts'],
  'Bicep Curl': ['biceps', 'forearms'],
  'Tricep Pushdown': ['triceps'],
  'Leg Press': ['quads', 'glutes'],
  'Romanian Deadlift': ['hamstrings', 'glutes', 'lower_back'],
  'Calf Raise': ['calves'],
  'Sit-ups': ['abs', 'hip_flexors'],
  'Hip Thrust': ['glutes', 'hamstrings'],
  'Dumbbell Fly': ['chest', 'front_delts'],
  'Face Pull': ['rear_delts', 'upper_back'],
  Lunges: ['quads', 'glutes', 'hamstrings'],
  Dips: ['chest', 'triceps', 'front_delts'],
  'Chin-ups': ['lats', 'biceps', 'upper_back'],
}

// Case-insensitive lookup. Returns [] for unknown exercises.
export function getMusclesForExercise(exerciseName: string): MuscleId[] {
  const lower = exerciseName.toLowerCase()
  for (const [name, muscles] of Object.entries(EXERCISE_MUSCLE_MAP)) {
    if (name.toLowerCase() === lower) {
      return muscles
    }
  }
  return []
}
