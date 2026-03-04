import type { InferSelectModel } from "drizzle-orm";
import { cartTable } from "@mercado-facil/db/schema";

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
