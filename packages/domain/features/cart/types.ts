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

export const ZCreateCartItemArgs = z.object({
  cartId: z.uuidv7(),
  productId: z.uuidv7(),
  priceId: z.uuidv7(),
  quantity: z.number().int().positive().default(1),
});
export type CreateCartItemArgs = z.infer<typeof ZCreateCartItemArgs>;

export const ZIndexPagination = z
  .object({
    cursor: z.uuidv7().nullish(),
    limit: z.number().int().positive().optional().default(25),
    sort: z.enum(["id", "completedAt"]).optional().default("id"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .default({
    cursor: undefined,
    limit: 25,
    sort: "id",
    order: "desc",
  });

export const ZIndexRepositoryArgs = z.object({
  filter: z.object({ userId: z.uuidv7().nullish() }),
  pagination: ZIndexPagination,
});
export type IndexRepositoryArgs = z.infer<typeof ZIndexRepositoryArgs>;

export const ZIndexArgs = z.object({
  pagination: ZIndexPagination,
});
export type IndexArgs = z.infer<typeof ZIndexArgs>;

export const ZFindByIdArgs = z.object({ id: z.uuidv7() });
export type FindByIdArgs = z.infer<typeof ZFindByIdArgs>;
