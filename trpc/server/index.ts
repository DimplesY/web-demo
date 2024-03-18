import { users } from './db'
import { publicProcedure, router } from './trpc'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'
import z from 'zod'

const appRouter = router({
  userList: publicProcedure.query(async () => {
    return users
  }),
  userCreate: publicProcedure
    .input(
      z.object({
        name: z.string().min(10, {message:'Name must be at least 10 characters long'}),
      })
    )
    .mutation(async (opts) => {
      return opts.input
    }),
})

export type AppRouter = typeof appRouter

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
})

server.listen(3000)
