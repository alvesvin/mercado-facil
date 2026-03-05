import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { procedure, router } from "../trpc";
import { Effect } from "effect";
import { CartService } from "@mercado-facil/domain/features/cart/CartService";
import { RequestContext } from "@mercado-facil/domain/services/RequestContext";
import {
  ZFindByIdArgs,
  ZUpdateStoreArgs,
} from "@mercado-facil/domain/features/cart/types";
import { registerNewProductSaga } from "@mercado-facil/domain/sagas/registerNewProduct";
import { ZRegisterNewProductSagaArgs } from "@mercado-facil/domain/sagas/registerNewProduct";
import { DB } from "@mercado-facil/db/service";

export const cart = router({
  findById: procedure.input(ZFindByIdArgs).query(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const cartService = yield* CartService;
        const cart = yield* cartService.findById(input);
        return cart;
      }).pipe(Effect.provide(DB)),
    ),
  ),

  start: procedure.mutation(({ ctx }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const cartService = yield* CartService;
        const cart = yield* cartService.startCart();
        return cart;
      }).pipe(Effect.provide(RequestContext.Default(ctx)), Effect.provide(DB)),
    ),
  ),

  updateStore: procedure.input(ZUpdateStoreArgs).mutation(({ ctx, input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const cartService = yield* CartService;
        const cart = yield* cartService.updateStore(input);
        return cart;
      }).pipe(Effect.provide(DB)),
    ),
  ),

  reigsterNewProductSaga: procedure
    .input(ZRegisterNewProductSagaArgs)
    .mutation(({ ctx, input }) =>
      LiveRuntime.runPromise(
        registerNewProductSaga(input).pipe(
          Effect.provide(RequestContext.Default(ctx)),
          Effect.provide(DB),
        ),
      ),
    ),
});
