import { DB } from "@mercado-facil/db/service";
import { CartService } from "@mercado-facil/domain/features/cart/CartService";
import { ZFindByIdArgs, ZUpdateStoreArgs } from "@mercado-facil/domain/features/cart/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import {
  registerNewProductSaga,
  ZRegisterNewProductSagaArgs,
} from "@mercado-facil/domain/sagas/registerNewProduct";
import { RequestContext } from "@mercado-facil/domain/services/RequestContext";
import { Effect } from "effect";
import { procedure, router } from "../trpc";

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

  start: procedure.query(({ ctx }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const cartService = yield* CartService;
        const cart = yield* cartService.startCart();
        return cart;
      }).pipe(
        Effect.provide(RequestContext.Default(ctx)),
        Effect.provide(DB),
        Effect.tapErrorCause(Effect.logError),
      ),
    ),
  ),

  updateStore: procedure.input(ZUpdateStoreArgs).mutation(({ input }) =>
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
