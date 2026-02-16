import { describe, it, expect } from 'vitest'
import { formatDateKey } from './date'

describe('formatDateKey', () => {
  it('should format a date correctly as YYYY-MM-DD', () => {
    const date = new Date(2024, 0, 1) // Jan 1st, 2024
    expect(formatDateKey(date)).toBe('2024-01-01')
  })

  it('should pad single digit month and day with zero', () => {
    const date = new Date(2024, 8, 9) // Sep 9th, 2024
    expect(formatDateKey(date)).toBe('2024-09-09')
  })

  it('should handle Dec 31st correctly', () => {
    const date = new Date(2024, 11, 31) // Dec 31st, 2024
    expect(formatDateKey(date)).toBe('2024-12-31')
  })
})
