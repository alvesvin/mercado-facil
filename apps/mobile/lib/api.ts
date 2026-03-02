import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@mercado-facil/api/trpc'

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
})


