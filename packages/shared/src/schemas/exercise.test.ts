import { describe, it, expect } from 'vitest'
import { ExerciseSchema } from './exercise'

describe('ExerciseSchema', () => {
  it('should require ownerId field', () => {
    const invalidExercise = {
      name: 'Bench Press',
      category: 'strength',
    }

    const result = ExerciseSchema.safeParse(invalidExercise)
    expect(result.success).toBe(false)
  })

  it('should accept system exercises', () => {
    const systemExercise = {
      ownerId: 'system',
      name: 'Bench Press',
      category: 'strength',
      muscleGroup: 'chest',
    }

    const result = ExerciseSchema.safeParse(systemExercise)
    expect(result.success).toBe(true)
  })

  it('should accept user exercises with uid', () => {
    const userExercise = {
      ownerId: 'user-123',
      name: 'Custom Exercise',
      category: 'strength',
      muscleGroup: 'legs',
    }

    const result = ExerciseSchema.safeParse(userExercise)
    expect(result.success).toBe(true)
  })

  it('should require name field', () => {
    const invalidExercise = {
      ownerId: 'system',
      category: 'strength',
    }

    const result = ExerciseSchema.safeParse(invalidExercise)
    expect(result.success).toBe(false)
  })

  it('should require category field', () => {
    const invalidExercise = {
      ownerId: 'system',
      name: 'Bench Press',
    }

    const result = ExerciseSchema.safeParse(invalidExercise)
    expect(result.success).toBe(false)
  })

  it('should make muscleGroup optional', () => {
    const exerciseWithoutMuscleGroup = {
      ownerId: 'system',
      name: 'Rest Day',
      category: 'skill',
    }

    const result = ExerciseSchema.safeParse(exerciseWithoutMuscleGroup)
    expect(result.success).toBe(true)
  })
})
