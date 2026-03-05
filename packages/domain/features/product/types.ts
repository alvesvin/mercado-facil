import { z } from "zod";

export const ZFindByBarcodeArgs = z.object({
  barcode: z.string(),
});
export type FindByBarcodeArgs = z.infer<typeof ZFindByBarcodeArgs>;

export const ZCreateProductArgs = z.object({
  barcode: z.string(),
  name: z.string(),
  brand: z.string(),
  flavor: z.string().optional(),
  quantity: z.number(),
  quantityUnit: z.string(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
});
export type CreateProductArgs = z.infer<typeof ZCreateProductArgs>;
