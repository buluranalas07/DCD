import { z } from 'zod'

// 1. Strength Payload (for weight training)
export const StrengthPayload = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(), // Cached for display speed
  sets: z.array(
    z.object({
      weight: z.number().min(0),
      reps: z.number().min(0),
    })
  ),
})

// 2. Skill Payload (for skill work like basketball shots)
export const SkillPayload = z
  .object({
    drillName: z.string(),
    attempts: z.number().min(1),
    made: z.number().min(0),
  })
  .refine(data => data.made <= data.attempts, {
    message: 'Made cannot exceed Attempts',
  })

// 3. Food Payload (for nutrition tracking)
export const FoodPayload = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  foodName: z.string(),
  weight: z.number(), // in grams
})

// 4. The Main Activity Log Schema (Discriminated Union)
export const ActivityLogSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    type: z.literal('strength'),
    payload: StrengthPayload,
    createdAt: z.any().optional(), // Firestore timestamp
  }),
  z.object({
    id: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    type: z.literal('skill'),
    payload: SkillPayload,
    createdAt: z.any().optional(), // Firestore timestamp
  }),
  z.object({
    id: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    type: z.literal('food'),
    payload: FoodPayload,
    createdAt: z.any().optional(), // Firestore timestamp
  }),
])

// Export TypeScript types
export type StrengthLog = z.infer<typeof StrengthPayload>
export type SkillLog = z.infer<typeof SkillPayload>
export type FoodLog = z.infer<typeof FoodPayload>
export type ActivityLog = z.infer<typeof ActivityLogSchema>
