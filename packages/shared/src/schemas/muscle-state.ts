import { z } from 'zod'

export const MuscleRecoverySchema = z.record(z.string(), z.string())

export type MuscleRecovery = z.infer<typeof MuscleRecoverySchema>
