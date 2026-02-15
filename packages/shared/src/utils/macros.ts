import type { Goal, MacrosTarget } from '../schemas/user'

/**
 * Calculate daily macro targets based on TDEE, goal, and body weight.
 *
 * - Cut:      TDEE - 500 kcal. High protein.
 * - Bulk:     TDEE + 300 kcal. High carbs.
 * - Maintain: TDEE as-is.
 *
 * Macro split: Protein 2g/kg, Fat 25% of calories, Carbs remainder.
 */
export function getTargetMacros(tdee: number, goal: Goal, weight_kg: number): MacrosTarget {
  let daily_calories: number

  switch (goal) {
    case 'cut':
      daily_calories = Math.round(tdee - 500)
      break
    case 'bulk':
      daily_calories = Math.round(tdee + 300)
      break
    case 'maintain':
    default:
      daily_calories = tdee
  }

  const protein_g = Math.round(weight_kg * 2)
  const proteinCals = protein_g * 4
  const fatCals = Math.round(daily_calories * 0.25)
  const fat_g = Math.round(fatCals / 9)
  const carbs_g = Math.round((daily_calories - proteinCals - fatCals) / 4)

  return { daily_calories, protein_g, carbs_g, fat_g }
}
