import { router, protectedProcedure } from '../trpc'
import { ExerciseSchema } from '@repo/shared'
import { TRPCError } from '@trpc/server'

export const exerciseRouter = router({
  // Create a custom exercise
  create: protectedProcedure
    .input(ExerciseSchema.omit({ id: true, ownerId: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Add the exercise with the authenticated user's ID
        const docRef = await ctx.db.collection('exercises').add({
          ...input,
          ownerId: ctx.uid, // User's ID from context
        })

        return {
          id: docRef.id,
          ...input,
          ownerId: ctx.uid,
        }
      } catch (error) {
        console.error('Failed to create exercise:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create exercise',
        })
      }
    }),

  // List exercises (Hybrid: system + user)
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Query exercises where ownerId is 'system' OR the user's uid
      const snapshot = await ctx.db
        .collection('exercises')
        .where('ownerId', 'in', ['system', ctx.uid])
        .get()

      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      return exercises
    } catch (error) {
      console.error('Failed to list exercises:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch exercises',
      })
    }
  }),
})
