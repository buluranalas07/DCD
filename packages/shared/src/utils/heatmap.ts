import type { MuscleId } from '../constants/muscles'
import type { MuscleRecovery } from '../schemas/muscle-state'

export type HeatmapColor = 'red' | 'yellow' | 'green'

/**
 * Get recovery color for a single muscle.
 * - <24h since last trained → red (sore)
 * - 24-48h → yellow (recovering)
 * - >48h or never trained → green (ready)
 */
export function getHeatmapColor(
  muscleId: MuscleId,
  muscleRecovery: MuscleRecovery,
  now: Date = new Date()
): HeatmapColor {
  const lastTrained = muscleRecovery[muscleId]
  if (!lastTrained) return 'green'

  const hoursSince = (now.getTime() - new Date(lastTrained).getTime()) / (1000 * 60 * 60)

  if (hoursSince < 24) return 'red'
  if (hoursSince < 48) return 'yellow'
  return 'green'
}

/** Get recovery colors for all muscles at once. */
export function getAllHeatmapColors(
  muscleRecovery: MuscleRecovery,
  muscleIds: readonly MuscleId[],
  now: Date = new Date()
): Record<MuscleId, HeatmapColor> {
  const result = {} as Record<MuscleId, HeatmapColor>
  for (const id of muscleIds) {
    result[id] = getHeatmapColor(id, muscleRecovery, now)
  }
  return result
}
