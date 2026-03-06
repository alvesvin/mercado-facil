import { DB } from "@mercado-facil/db/service";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { initTRPC } from "@trpc/server";
import { Effect } from "effect";
import type { Context } from "./context";
import { wideEventsMiddleware } from "./middleware/wide-events";

const t = initTRPC.context<Context>().create();

export const procedure = t.procedure.use(async (opts) => {
  return await LiveRuntime.runPromise(wideEventsMiddleware(opts).pipe(Effect.provide(DB)));
});
export const router = t.router;
