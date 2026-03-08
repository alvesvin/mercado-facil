import type { AppRouter } from "@mercado-facil/trpc-types";
import {
  createTRPCProxyClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  splitLink,
} from "@trpc/client";
import { auth } from "./auth";
import { config } from "./config";

const clientOptions = {
  url: `${config.EXPO_PUBLIC_API_URL}/api/trpc`,
  fetch: (url: URL | RequestInfo, options: RequestInit | undefined) => {
    const cookie = auth.getCookie();
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Cookie: cookie,
      },
    });
  },
};

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => isNonJsonSerializable(op.input),
      true: [httpLink(clientOptions)],
      false: [httpBatchLink(clientOptions)],
    }),
  ],
});
