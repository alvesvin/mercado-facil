import { createMiddleware } from "hono/factory";
import { auth as authClient } from "@/ports/trpc/auth";
import type { AuthType, State } from "@/types";
import { endTime, startTime } from "hono/timing";
import type { Context } from "hono";
import { Effect } from "effect";
import { UnauthorizedError } from "@/domain/errors";

export const auth = (auth: typeof authClient) => {
  // This caches auth() calls withing middleware chain
  let cache: AuthType | undefined | null;

  const requireAuth = (c: Context<State>) =>
    Effect.gen(function* () {
      if (cache === null) return yield* Effect.fail(new UnauthorizedError());
      if (cache) return cache;
      startTime(c, "auth.getSession");
      const session = yield* Effect.orElseSucceed(
        Effect.tryPromise(() =>
          auth.api.getSession({
            headers: c.req.raw.headers,
          }),
        ),
        () => null,
      );
      endTime(c, "auth.getSession");
      cache = session;
      if (session === null) return yield* Effect.fail(new UnauthorizedError());
      return session;
    });

  return createMiddleware<State>(async (c, next) => {
    c.set("auth", requireAuth(c));
    const response = await next();
    cache = undefined;
    return response;
  });
};
