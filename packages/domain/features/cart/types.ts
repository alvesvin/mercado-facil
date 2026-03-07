import type { cartTable } from "@mercado-facil/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export type Cart = InferSelectModel<typeof cartTable>;

export type GetActiveByUserIdArgs = {
  user: { id: string };
};

export type CreateCartArgs = {
  user: { id: string };
};

export type StartCartArgs = {
  user: { id: string };
};

export const ZUpdateStoreArgs = z.object({
  cart: z.object({ id: z.string() }),
  store: z.object({ id: z.string() }),
});

export type UpdateStoreArgs = z.infer<typeof ZUpdateStoreArgs>;

export const ZFindByIdArgs = z.object({
  id: z.uuidv7(),
});
export type FindByIdArgs = z.infer<typeof ZFindByIdArgs>;

export const ZCreateCartItemArgs = z.object({
  cartId: z.uuidv7(),
  productId: z.uuidv7(),
  priceId: z.uuidv7(),
  quantity: z.number().int().positive().default(1),
});
export type CreateCartItemArgs = z.infer<typeof ZCreateCartItemArgs>;

export const ZIndexArgs = z.object({
  filter: z.object({ userId: z.uuidv7().nullish() }),
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(10),
  }),
});
