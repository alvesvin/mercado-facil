import { z } from "zod";

export const ZGetProductWithPriceByBarcodeSagaArgs = z.object({
  barcode: z.string(),
  storeId: z.uuidv7(),
});
export type GetProductWithPriceByBarcodeSagaArgs = z.infer<
  typeof ZGetProductWithPriceByBarcodeSagaArgs
>;
