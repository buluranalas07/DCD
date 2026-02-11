import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'

// Initialize tRPC with context
const t = initTRPC.context<Context>().create()

// Middleware: Ensure user is authenticated
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.uid) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    })
  }

  return next({
    ctx: {
      ...ctx,
      uid: ctx.uid, // Now TypeScript knows uid is NOT null
    },
  })
})

// Export router and procedures
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
export const createCallerFactory = t.createCallerFactory
