import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { wideEventsMiddleware } from "./middleware/wide-events";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";

const t = initTRPC.context<Context>().create();

export const procedure = t.procedure.use(async (opts) => {
  return await LiveRuntime.runPromise(wideEventsMiddleware(opts));
});
export const router = t.router;
