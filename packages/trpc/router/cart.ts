import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { procedure, router } from "../trpc";
import { Effect } from "effect";
import { CartService } from "@mercado-facil/domain/features/cart/CartService";
import { RequestContext } from "@mercado-facil/domain/services/RequestContext";

export const cart = router({
  start: procedure.mutation(({ ctx }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const cartService = yield* CartService;
        const cart = yield* cartService.startCart();
        return cart;
      }).pipe(Effect.provide(RequestContext.Default(ctx))),
    ),
  ),
});
