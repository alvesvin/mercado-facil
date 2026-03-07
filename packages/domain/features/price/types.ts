import { z } from "zod";

export const ZCreatePriceArgs = z.object({
  storeId: z.uuidv7().nullish(),
  productId: z.uuidv7(),
  userId: z.uuidv7().nullish(),
  price: z.number().positive(),
  currency: z.string(),
  type: z.enum(["unit", "per_kg", "per_l"]),
});
export type CreatePriceArgs = z.infer<typeof ZCreatePriceArgs>;

export const ZSearchPriceArgs = z.object({
  filters: z.object({
    productId: z.uuidv7(),
    storeId: z.uuidv7().optional(),
    userId: z.uuidv7().optional(),
    // TODO: unify these types
    type: z.enum(["unit", "per_kg", "per_l"]),
  }),
  pagination: z.object({
    page: z.number().positive().default(1),
    limit: z.number().positive().default(10),
  }),
});
export type SearchPriceArgs = z.infer<typeof ZSearchPriceArgs>;

export const ZFindConsensusArgs = z.object({
  productId: z.uuidv7(),
  storeId: z.uuidv7(),
});
export type FindConsensusArgs = z.infer<typeof ZFindConsensusArgs>;
