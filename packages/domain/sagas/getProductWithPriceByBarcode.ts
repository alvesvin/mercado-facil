import { withTransaction } from "@mercado-facil/db/utils";
import { Effect } from "effect";
import { z } from "zod";
import { PriceService } from "../features/price/PriceService";
import { ProductService } from "../features/product/ProductService";

export const ZGetProductWithPriceByBarcodeSagaArgs = z.object({
  barcode: z.string(),
  storeId: z.uuidv7(),
});
export type GetProductWithPriceByBarcodeSagaArgs = z.infer<
  typeof ZGetProductWithPriceByBarcodeSagaArgs
>;

export const getProductWithPriceByBarcodeSaga = (args: GetProductWithPriceByBarcodeSagaArgs) =>
  withTransaction(
    Effect.gen(function* () {
      const productService = yield* ProductService;
      const priceService = yield* PriceService;
      const product = yield* productService.findByBarcode({ barcode: args.barcode });
      if (!product) return null;
      const prices = yield* priceService.findConsensus({
        productId: product.id,
        storeId: args.storeId,
      });
      return {
        product,
        prices,
      };
    }),
  );
