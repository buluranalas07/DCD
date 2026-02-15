import type { Sex } from '../schemas/user'

/**
 * Mifflin-St Jeor Equation for Basal Metabolic Rate.
 * Returns BMR in kcal/day.
 */
export function calculateBMR(params: {
  sex: Sex
  weight_kg: number
  height_cm: number
  age_years: number
}): number {
  const { sex, weight_kg, height_cm, age_years } = params
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age_years
  return Math.round(sex === 'male' ? base + 5 : base - 161)
}

/** Calculate age in full years from a YYYY-MM-DD date string. */
export function calculateAge(dob: string): number {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}
