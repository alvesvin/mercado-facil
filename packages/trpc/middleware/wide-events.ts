import type { MiddlewareFunction } from "@trpc/server/unstable-core-do-not-import";
import { randomUUIDv7 } from "bun";

// biome-ignore lint/suspicious/noExplicitAny: workaround
type MiddlewareOptions = Parameters<MiddlewareFunction<any, any, any, any, any>>[0];

export async function wideEventsMiddleware(opts: MiddlewareOptions) {
  const eventId = randomUUIDv7();
  const ts = Date.now();
  const sampling = 1.0;

  const event = {
    id: eventId,
    ts,
    trpc: {
      batchIndex: opts.batchIndex,
      path: opts.path,
      input: opts.input,
      meta: opts.meta,
    },
    sampling,
  };

  const response = await opts.next({ ctx: { event } });

  return response;
}
