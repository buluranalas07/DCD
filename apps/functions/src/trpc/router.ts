import { router } from './trpc'
import { userRouter } from './routers/user'
import { exerciseRouter } from './routers/exercise'
import { logRouter } from './routers/log'

export const appRouter = router({
  user: userRouter,
  exercise: exerciseRouter,
  log: logRouter,
})

export type AppRouter = typeof appRouter
