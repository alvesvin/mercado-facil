import type { Db } from "@mercado-facil/db";
import { z } from "zod";
import { PriceService } from "../features/price/PriceService";
import { ProductService } from "../features/product/ProductService";
import { unwrapAsync, wrap } from "../utils";

export const ZGetProductWithPriceByBarcodeSagaArgs = z.object({
  barcode: z.string(),
  storeId: z.uuidv7(),
});
export type GetProductWithPriceByBarcodeSagaArgs = z.infer<
  typeof ZGetProductWithPriceByBarcodeSagaArgs
>;

export class GetProductWithPriceByBarcodeSaga {
  constructor(private readonly db: Db) {}

  run(args: GetProductWithPriceByBarcodeSagaArgs) {
    return wrap(
      this.db.transaction(async (tx) => {
        const productService = ProductService.withTransaction(tx);
        const priceService = PriceService.withTransaction(tx);

        const product = await productService.findByBarcode(args.barcode).unwrapOr(null);
        if (!product) return null;

        const prices = await unwrapAsync(
          priceService.findConsensus({
            productId: product.id,
            storeId: args.storeId,
          }),
        );

        return {
          product,
          prices,
        };
      }),
    );
  }
}
