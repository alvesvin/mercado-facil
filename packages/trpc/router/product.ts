import {
  getProductWithPriceByBarcodeSaga,
  productService,
} from "@mercado-facil/domain/features/singletons";
import { ZGetProductWithPriceByBarcodeSagaArgs } from "@mercado-facil/domain/sagas/GetProductWithPriceByBarcodeSaga";
import { z } from "zod";
import { procedure, router } from "../trpc";
import { unwrapAsync } from "../utils";

export const product = router({
  findByBarcode: procedure
    .input(z.string())
    .query(({ input }) => unwrapAsync(productService.findByBarcode(input))),

  findWithPriceByBarcodeSaga: procedure
    .input(ZGetProductWithPriceByBarcodeSagaArgs)
    .query(({ input }) => unwrapAsync(getProductWithPriceByBarcodeSaga.run(input))),
});
