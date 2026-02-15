import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
})

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

// --- Onboarding / Profile Schemas ---

export const SexEnum = z.enum(['male', 'female'])

export const ActivityLevelEnum = z.enum([
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extremely_active',
])

export const GoalEnum = z.enum(['cut', 'maintain', 'bulk'])

export const MacrosTargetSchema = z.object({
  daily_calories: z.number(),
  protein_g: z.number(),
  carbs_g: z.number(),
  fat_g: z.number(),
})

export const UserProfileSchema = z.object({
  sex: SexEnum,
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  height_cm: z.number().min(50).max(300),
  weight_kg: z.number().min(20).max(500),
  activity_level: ActivityLevelEnum,
  goal: GoalEnum,
  bmr: z.number().optional(),
  tdee: z.number().optional(),
  macros_target: MacrosTargetSchema.optional(),
  program_id: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type Sex = z.infer<typeof SexEnum>
export type ActivityLevel = z.infer<typeof ActivityLevelEnum>
export type Goal = z.infer<typeof GoalEnum>
export type MacrosTarget = z.infer<typeof MacrosTargetSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
