import type { inferProcedureInput } from '@trpc/server';
import { z } from "zod";
import { db, type User } from "./db";
import { createCallerFactory, publicProcedure, router } from "./trpc";




export const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      const users = await db.user.findMany();
      return users;
    }),
  userById: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts;
      const user = await db.user.findById(input);
      return user;
    }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const name = opts.input.name
      return  await testCaller(opts.ctx, name)
    })
});

export type AppRouter = typeof appRouter;


export type UserCreateType = inferProcedureInput<AppRouter["userCreate"]>;

export type UserCreateReturnType = Awaited<ReturnType<AppRouter['userCreate']>>

export const createCaller = createCallerFactory(appRouter);


async function testCaller(ctx: any, name: string): Promise<User | undefined> {
  const caller = createCaller(ctx)
  console.log('服务端调用')
  const user = await db.user.create({name})
  return await caller.userById(user.id)
}
