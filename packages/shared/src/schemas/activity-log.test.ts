import { describe, it, expect } from 'vitest'
import { SkillPayload, StrengthPayload, FoodPayload, ActivityLogSchema } from './activity-log'

describe('SkillPayload', () => {
  it('should fail if made > attempts', () => {
    const invalid = { drillName: 'Free Throws', attempts: 10, made: 15 }
    const result = SkillPayload.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Made cannot exceed Attempts')
    }
  })

  it('should pass if made <= attempts', () => {
    const valid = { drillName: 'Free Throws', attempts: 10, made: 8 }
    const result = SkillPayload.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should pass if made = attempts', () => {
    const valid = { drillName: 'Free Throws', attempts: 10, made: 10 }
    const result = SkillPayload.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should fail if made is negative', () => {
    const invalid = { drillName: 'Free Throws', attempts: 10, made: -5 }
    const result = SkillPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if attempts is less than 1', () => {
    const invalid = { drillName: 'Free Throws', attempts: 0, made: 0 }
    const result = SkillPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if drillName is missing', () => {
    const invalid = { attempts: 10, made: 8 }
    const result = SkillPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})

describe('StrengthPayload', () => {
  it('should pass with valid sets array', () => {
    const valid = {
      exerciseId: 'exercise-1',
      exerciseName: 'Bench Press',
      sets: [
        { weight: 135, reps: 10 },
        { weight: 155, reps: 8 },
        { weight: 185, reps: 5 },
      ],
    }
    const result = StrengthPayload.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should pass with empty sets array', () => {
    const valid = {
      exerciseId: 'exercise-1',
      exerciseName: 'Bench Press',
      sets: [],
    }
    const result = StrengthPayload.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should fail if weight is negative', () => {
    const invalid = {
      exerciseId: 'exercise-1',
      exerciseName: 'Bench Press',
      sets: [{ weight: -10, reps: 10 }],
    }
    const result = StrengthPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if reps is negative', () => {
    const invalid = {
      exerciseId: 'exercise-1',
      exerciseName: 'Bench Press',
      sets: [{ weight: 135, reps: -5 }],
    }
    const result = StrengthPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if exerciseId is missing', () => {
    const invalid = {
      exerciseName: 'Bench Press',
      sets: [{ weight: 135, reps: 10 }],
    }
    const result = StrengthPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if exerciseName is missing', () => {
    const invalid = {
      exerciseId: 'exercise-1',
      sets: [{ weight: 135, reps: 10 }],
    }
    const result = StrengthPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})

describe('FoodPayload', () => {
  it('should pass with valid breakfast meal', () => {
    const valid = {
      mealType: 'breakfast',
      foodName: 'Oatmeal',
      weight: 150,
    }
    const result = FoodPayload.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should pass with valid lunch meal', () => {
    const valid = {
      mealType: 'lunch',
      foodName: 'Chicken Breast',
      weight: 200,
    }
    const result = FoodPayload.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should pass with valid dinner meal', () => {
    const valid = {
      mealType: 'dinner',
      foodName: 'Salmon',
      weight: 180,
    }
    const result = FoodPayload.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should fail with invalid meal type', () => {
    const invalid = {
      mealType: 'snack',
      foodName: 'Apple',
      weight: 100,
    }
    const result = FoodPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if foodName is missing', () => {
    const invalid = {
      mealType: 'breakfast',
      weight: 150,
    }
    const result = FoodPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if weight is missing', () => {
    const invalid = {
      mealType: 'breakfast',
      foodName: 'Oatmeal',
    }
    const result = FoodPayload.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})

describe('ActivityLogSchema', () => {
  it('should pass with valid strength log', () => {
    const valid = {
      date: '2024-01-15',
      type: 'strength',
      payload: {
        exerciseId: 'exercise-1',
        exerciseName: 'Bench Press',
        sets: [{ weight: 135, reps: 10 }],
      },
    }
    const result = ActivityLogSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should pass with valid skill log', () => {
    const valid = {
      date: '2024-01-15',
      type: 'skill',
      payload: {
        drillName: 'Free Throws',
        attempts: 20,
        made: 18,
      },
    }
    const result = ActivityLogSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should pass with valid food log', () => {
    const valid = {
      date: '2024-01-15',
      type: 'food',
      payload: {
        mealType: 'breakfast',
        foodName: 'Oatmeal',
        weight: 150,
      },
    }
    const result = ActivityLogSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should fail with invalid date format (missing leading zeros)', () => {
    const invalid = {
      date: '2024-1-5',
      type: 'strength',
      payload: {
        exerciseId: 'exercise-1',
        exerciseName: 'Bench Press',
        sets: [{ weight: 135, reps: 10 }],
      },
    }
    const result = ActivityLogSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail with invalid date format (wrong separator)', () => {
    const invalid = {
      date: '2024/01/15',
      type: 'strength',
      payload: {
        exerciseId: 'exercise-1',
        exerciseName: 'Bench Press',
        sets: [{ weight: 135, reps: 10 }],
      },
    }
    const result = ActivityLogSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should fail if type does not match payload structure', () => {
    const invalid = {
      date: '2024-01-15',
      type: 'strength',
      payload: {
        drillName: 'Free Throws', // Skill payload but type is strength
        attempts: 20,
        made: 18,
      },
    }
    const result = ActivityLogSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should pass with optional id field', () => {
    const valid = {
      id: 'log-123',
      date: '2024-01-15',
      type: 'strength',
      payload: {
        exerciseId: 'exercise-1',
        exerciseName: 'Bench Press',
        sets: [{ weight: 135, reps: 10 }],
      },
    }
    const result = ActivityLogSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should pass with optional createdAt field', () => {
    const valid = {
      date: '2024-01-15',
      type: 'strength',
      payload: {
        exerciseId: 'exercise-1',
        exerciseName: 'Bench Press',
        sets: [{ weight: 135, reps: 10 }],
      },
      createdAt: new Date(),
    }
    const result = ActivityLogSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })
})
