import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '../server';


const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) => true
    }),
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});


async function main() {
  const result = await trpc.userCreate.mutate({name:'测试'})
}

main()
