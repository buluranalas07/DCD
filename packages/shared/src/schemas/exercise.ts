// Import zod
import { z } from 'zod'

// Define the enums first
export const ActivityTypeEnum = z.enum(['strength', 'skill', 'food'])
export const MuscleGroupEnum = z.enum(['chest', 'back', 'legs', 'core', 'cardio', 'skill'])

// Define the Exercise Schema
export const ExerciseSchema = z.object({
  id: z.string().optional(),
  ownerId: z.string().min(1, 'ownerId is required'), // 'system' or user UID
  name: z.string().min(1, 'Name is required'),
  category: ActivityTypeEnum,
  muscleGroup: MuscleGroupEnum.optional(),
})

// Export the TypeScript types
export type Exercise = z.infer<typeof ExerciseSchema>
export type ActivityType = z.infer<typeof ActivityTypeEnum>
export type MuscleGroup = z.infer<typeof MuscleGroupEnum>
