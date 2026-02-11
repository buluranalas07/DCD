import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { StrengthPayload, SkillPayload, FoodPayload } from '@repo/shared'
import { TRPCError } from '@trpc/server'
import admin from 'firebase-admin'

// Input schema for creating logs (without id and createdAt)
const CreateLogInput = z.discriminatedUnion('type', [
  z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    type: z.literal('strength'),
    payload: StrengthPayload,
  }),
  z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    type: z.literal('skill'),
    payload: SkillPayload,
  }),
  z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    type: z.literal('food'),
    payload: FoodPayload,
  }),
])

export const logRouter = router({
  // Create a new activity log
  create: protectedProcedure.input(CreateLogInput).mutation(async ({ ctx, input }) => {
    try {
      // Write to users/{uid}/logs/{autoId}
      const docRef = await ctx.db
        .collection('users')
        .doc(ctx.uid)
        .collection('logs')
        .add({
          ...input,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })

      return {
        id: docRef.id,
        ...input,
        createdAt: new Date(),
      }
    } catch (error) {
      console.error('Failed to create log:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create activity log',
      })
    }
  }),

  // Delete an activity log
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Log ID is required',
          })
        }

        // Delete from users/{uid}/logs/{id}
        await ctx.db.collection('users').doc(ctx.uid).collection('logs').doc(input.id).delete()

        return { success: true, id: input.id }
      } catch (error) {
        console.error('Failed to delete log:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete activity log',
        })
      }
    }),
})
