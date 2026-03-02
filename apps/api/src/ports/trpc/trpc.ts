import { initTRPC } from "@trpc/server";
import type { State } from "../../types";

const t = initTRPC.context<State["Variables"]>().create();

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;
export const router = t.router;
