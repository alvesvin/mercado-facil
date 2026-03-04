import type { Context as HonoContext } from "hono";
import { Effect } from "effect";
import type { Auth } from "@mercado-facil/domain/features/auth/types";
import { UnauthorizedError } from "@mercado-facil/errors";
import { auth } from "./auth";

export function createContext(_opts: any, c: HonoContext) {
  // This caches auth calls withing middleware chain
  let authCache: Auth | null | undefined = undefined;

  console.log("Running createContext");

  return {
    auth: Effect.gen(function* () {
      if (authCache === null)
        return yield* Effect.fail(new UnauthorizedError());
      if (authCache) return authCache;
      //   startTime(c, "auth.getSession");
      const session = yield* Effect.orElseSucceed(
        Effect.tryPromise(() =>
          auth.api.getSession({
            headers: c.req.raw.headers,
          }),
        ),
        () => null,
      );
      //   endTime(c, "auth.getSession");
      authCache = session;
      if (session === null) return yield* Effect.fail(new UnauthorizedError());
      return session;
    }),
  };
}

export type Context = ReturnType<typeof createContext>;
