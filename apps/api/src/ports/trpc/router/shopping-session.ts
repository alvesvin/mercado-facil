import { protectedProcedure, router } from "../trpc";
import { startShoppingSession } from "@/domain/use-cases/shopping-session";
import { LiveRuntime } from "@/domain/runtime/live";
import { RequestState } from "@/domain/services/request-state";
import { Effect } from "effect";

export const shoppingSessionRouter = router({
  start: protectedProcedure.mutation(async ({ ctx }) =>
    LiveRuntime.runPromise(
      startShoppingSession.pipe(Effect.provideService(RequestState, ctx)),
    ),
  ),
});
