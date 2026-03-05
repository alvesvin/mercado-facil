import { procedure, router } from "../trpc";
import { ZFindByBarcodeArgs } from "@mercado-facil/domain/features/product/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { Effect } from "effect";
import { ProductService } from "@mercado-facil/domain/features/product/ProductService";
import { DB } from "@mercado-facil/db/service";

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
});
