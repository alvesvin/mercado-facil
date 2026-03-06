import { z } from "zod";

export const ZCreatePriceArgs = z.object({
  storeId: z.uuid().nullish(),
  productId: z.uuid(),
  userId: z.uuid().nullish(),
  price: z.number().positive(),
  currency: z.string(),
  type: z.enum(["unit", "per_kg", "per_l"]),
});
export type CreatePriceArgs = z.infer<typeof ZCreatePriceArgs>;

export const ZSearchPriceArgs = z.object({
  filters: z.object({
    productId: z.uuid(),
    storeId: z.uuid().optional(),
    userId: z.uuid().optional(),
  }),
  pagination: z.object({
    page: z.number().positive().default(1),
    limit: z.number().positive().default(10),
  }),
});
export type SearchPriceArgs = z.infer<typeof ZSearchPriceArgs>;

export const ZFindConsensusArgs = z.object({
  productId: z.uuid(),
  storeId: z.uuid(),
});
export type FindConsensusArgs = z.infer<typeof ZFindConsensusArgs>;
