import { z } from "zod";

export const ZFindByBarcodeArgs = z.object({
  barcode: z.string(),
});
export type FindByBarcodeArgs = z.infer<typeof ZFindByBarcodeArgs>;

export const ZCreateProductArgs = z.object({
  barcode: z.string(),
  name: z.string(),
  brand: z.string(),
  flavor: z.string().nullish(),
  quantity: z.number(),
  quantityUnit: z.string(),
  category: z.string().nullish(),
  subCategory: z.string().nullish(),
});
export type CreateProductArgs = z.infer<typeof ZCreateProductArgs>;

export const ZCreateProductMediaArgs = z.object({
  productId: z.uuid(),
  mediaType: z.enum(["image"]),
  objectId: z.uuid(),
  tags: z.array(z.enum(["user-generated", "promo"])).nullish(),
  theme: z.enum(["light", "dark"]).nullish(),
});
export type CreateProductMediaArgs = z.infer<typeof ZCreateProductMediaArgs>;
