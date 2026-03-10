import { UnauthorizedError } from "@mercado-facil/errors";
import type { MiddlewareFunction } from "@trpc/server/unstable-core-do-not-import";
import { auth } from "../auth";

// biome-ignore lint/suspicious/noExplicitAny: trpc middleware
type MiddlewareOptions = Parameters<MiddlewareFunction<any, any, any, any, any>>[0];

export async function authMiddleware({ next, ctx }: MiddlewareOptions) {
  const session = await auth.api.getSession({
    headers: ctx.c.req.raw.headers,
  });
  if (session === null) throw new UnauthorizedError();
  return next({ ctx: { auth: session } });
}
