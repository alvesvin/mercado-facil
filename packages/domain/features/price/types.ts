import { z } from "zod";

export const ZCreatePriceArgs = z.object({
  storeId: z.uuidv7().optional(),
  productId: z.uuidv7(),
  userId: z.uuidv7().optional(),
  price: z.number().int().positive(),
  currency: z.string(),
  type: z.enum(["unit", "per_kg", "per_l"]),
});
export type CreatePriceArgs = z.infer<typeof ZCreatePriceArgs>;

export const ZSearchPriceArgs = z.object({
  filters: z.object({
    productId: z.uuidv7(),
    storeId: z.uuidv7().optional(),
    userId: z.uuidv7().optional(),
  }),
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(10),
  }),
});
export type SearchPriceArgs = z.infer<typeof ZSearchPriceArgs>;

export const ZFindConsensusArgs = z.object({
  productId: z.uuidv7(),
  storeId: z.uuidv7(),
});
export type FindConsensusArgs = z.infer<typeof ZFindConsensusArgs>;
