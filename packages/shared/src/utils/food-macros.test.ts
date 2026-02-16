import { describe, it, expect } from 'vitest'
import { sumEstimatedMacros } from './food-macros'

describe('sumEstimatedMacros', () => {
  it('should return zeros for an empty array of weights', () => {
    const result = sumEstimatedMacros([])
    expect(result).toEqual({
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
    })
  })

  it('should calculate macros correctly for a single weight', () => {
    const weight = 100
    const result = sumEstimatedMacros([weight])
    expect(result).toEqual({
      calories: 100,
      protein_g: 15, // 100 * 0.15
      carbs_g: 50, // 100 * 0.5
      fat_g: 5, // 100 * 0.05
    })
  })

  it('should sum macros correctly for multiple weights', () => {
    const weights = [100, 200]
    const result = sumEstimatedMacros(weights)
    // 100 -> 100, 15, 50, 5
    // 200 -> 200, 30, 100, 10
    // Total -> 300, 45, 150, 15
    expect(result).toEqual({
      calories: 300,
      protein_g: 45,
      carbs_g: 150,
      fat_g: 15,
    })
  })

  it('should handle rounding correctly', () => {
    const weights = [33]
    const result = sumEstimatedMacros(weights)
    // calories: 33
    // protein: 33 * 0.15 = 4.95 -> 5
    // carbs: 33 * 0.5 = 16.5 -> 17
    // fat: 33 * 0.05 = 1.65 -> 2
    expect(result).toEqual({
      calories: 33,
      protein_g: 5,
      carbs_g: 17,
      fat_g: 2,
    })
  })
})
