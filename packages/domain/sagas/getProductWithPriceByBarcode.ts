import { db } from "@mercado-facil/db";
import type { DrizzleQueryError } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { z } from "zod";
import { priceService, productService } from "../features/singletons";
import { unwrapAsync } from "../utils";

export const ZGetProductWithPriceByBarcodeSagaArgs = z.object({
  barcode: z.string(),
  storeId: z.uuidv7(),
});
export type GetProductWithPriceByBarcodeSagaArgs = z.infer<
  typeof ZGetProductWithPriceByBarcodeSagaArgs
>;

export function getProductWithPriceByBarcodeSaga(args: GetProductWithPriceByBarcodeSagaArgs) {
  return ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const productServiceTx = productService.withTransaction(tx);
      const priceServiceTx = priceService.withTransaction(tx);

      const product = await productServiceTx.findByBarcode(args.barcode).unwrapOr(null);
      if (!product) return null;

      const prices = await unwrapAsync(
        priceServiceTx.findConsensus({
          productId: product.id,
          storeId: args.storeId,
        }),
      );

      return {
        product,
        prices,
      };
    }),
    (error) => error as DrizzleQueryError,
  );
}
