import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../server/router'
import superjson from 'superjson'

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      transformer: superjson
    })
  ]
})


const user = await trpc.userCreate.mutate({name: 'Test user'})
console.log(user)
