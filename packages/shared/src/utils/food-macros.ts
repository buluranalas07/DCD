export interface Macros {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

/**
 * Estimates macros based on total weight of food logs.
 * Current logic (from legacy Dashboard/Diary):
 * - Calories = weight (1:1 ratio)
 * - Protein = weight * 0.15
 * - Carbs = weight * 0.5
 * - Fat = weight * 0.05
 */
export const sumEstimatedMacros = (weights: number[]): Macros => {
  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0

  weights.forEach(w => {
    calories += w
    protein += Math.round(w * 0.15)
    carbs += Math.round(w * 0.5)
    fat += Math.round(w * 0.05)
  })

  return {
    calories,
    protein_g: protein,
    carbs_g: carbs,
    fat_g: fat,
  }
}
