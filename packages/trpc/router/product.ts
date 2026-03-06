import { DB } from "@mercado-facil/db/service";
import { ProductService } from "@mercado-facil/domain/features/product/ProductService";
import { ZFindByBarcodeArgs } from "@mercado-facil/domain/features/product/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import {
  getProductWithPriceByBarcodeSaga,
  ZGetProductWithPriceByBarcodeSagaArgs,
} from "@mercado-facil/domain/sagas/getProductWithPriceByBarcode";
import { Effect } from "effect";
import { procedure, router } from "../trpc";

export const product = router({
  findByBarcode: procedure.input(ZFindByBarcodeArgs).query(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const productService = yield* ProductService;
        const product = yield* productService.findByBarcode(input);
        return product;
      }).pipe(Effect.provide(DB)),
    ),
  ),

  findWithPriceByBarcodeSaga: procedure
    .input(ZGetProductWithPriceByBarcodeSagaArgs)
    .query(({ input }) =>
      LiveRuntime.runPromise(getProductWithPriceByBarcodeSaga(input).pipe(Effect.provide(DB))),
    ),
});
