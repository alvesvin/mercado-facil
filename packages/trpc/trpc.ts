import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { authMiddleware } from "./middleware/auth";
import { wideEventsMiddleware } from "./middleware/wide-events";

const t = initTRPC.context<Context>().create();

export const procedure = t.procedure.use(authMiddleware).use(wideEventsMiddleware);
export const router = t.router;
