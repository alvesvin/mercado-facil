import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@mercado-facil/trpc/router';
import { auth } from './auth';

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://192.168.1.33:3000/api/trpc',
      fetch: (url, options) => {
        const cookie = auth.getCookie();
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            Cookie: cookie,
          },
        });
      },
    }),
  ],
});
