import {
  ZCreateCartItemArgs,
  ZIndexArgs,
  ZUpdateStoreArgs,
} from "@mercado-facil/domain/features/cart/types";
import { cartService } from "@mercado-facil/domain/features/singletons";
import {
  registerNewProductSaga,
  ZRegisterNewProductSagaArgs,
} from "@mercado-facil/domain/sagas/registerNewProduct";
import { z } from "zod";
import { procedure, router } from "../trpc";
import { unwrapAsync } from "../utils";

export const cart = router({
  index: procedure
    .input(ZIndexArgs)
    .query(({ input, ctx }) => unwrapAsync(cartService.index(input, ctx))),

  get: procedure.input(z.string()).query(({ input }) => unwrapAsync(cartService.get(input))),

  start: procedure.query(({ ctx }) => unwrapAsync(cartService.startCart(ctx))),

  updateStore: procedure
    .input(ZUpdateStoreArgs)
    .mutation(({ input }) => unwrapAsync(cartService.updateStore(input))),

  reigsterNewProductSaga: procedure
    .input(ZRegisterNewProductSagaArgs)
    .mutation(({ input, ctx }) => unwrapAsync(registerNewProductSaga(input, ctx))),

  addProduct: procedure
    .input(ZCreateCartItemArgs)
    .mutation(({ input, ctx }) => unwrapAsync(cartService.addProduct(input, ctx))),
});
