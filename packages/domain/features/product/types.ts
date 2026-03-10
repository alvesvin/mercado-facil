import { z } from "zod";

export const ZProductQuantityUnitEnum = z.enum([
  "unit",
  "kg",
  "g",
  "mg",
  "lb",
  "oz",
  "ml",
  "l",
  "gal",
]);
export type ProductQuantityUnitEnum = z.infer<typeof ZProductQuantityUnitEnum>;

export const ZCreateProductArgs = z.object({
  barcode: z.string(),
  name: z.string(),
  brand: z.string(),
  flavor: z.string().nullish(),
  quantity: z.number(),
  quantityUnit: ZProductQuantityUnitEnum,
  category: z.string().nullish(),
  subCategory: z.string().nullish(),
  userId: z.uuidv7().nullish(),
});
export type CreateProductArgs = z.infer<typeof ZCreateProductArgs>;

export const ZCreateProductMediaArgs = z.object({
  productId: z.uuidv7(),
  mediaType: z.enum(["image"]),
  objectId: z.uuidv7(),
  tags: z.array(z.enum(["user-generated", "promo"])).nullish(),
  theme: z.enum(["light", "dark"]).nullish(),
});
export type CreateProductMediaArgs = z.infer<typeof ZCreateProductMediaArgs>;
