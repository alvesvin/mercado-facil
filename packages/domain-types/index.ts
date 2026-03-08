/**
 * Yes, this is a barrel file. Barrel files seems to cause performance issues but we really want a dev-only package to export types to mobile.
 */

import type {
  cartTable,
  priceTable,
  productTable,
  storeTable,
  userTable,
} from "@mercado-facil/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export * from "@mercado-facil/domain/features/auth/types";
export * from "@mercado-facil/domain/features/auth/types";
export * from "@mercado-facil/domain/features/cart/types";
export * from "@mercado-facil/domain/features/cart/types";
export * from "@mercado-facil/domain/features/product/types";
// export * from "@mercado-facil/domain/features/store/types";
export * from "@mercado-facil/domain/features/product/types";

export type CommonProps = "id" | "createdAt" | "updatedAt" | "deletedAt";

export type CartSelect = InferSelectModel<typeof cartTable>;
export type CartInput = InferInsertModel<typeof cartTable>;

export type UserSelect = InferSelectModel<typeof userTable>;
export type UserInput = InferInsertModel<typeof userTable>;

export type StoreSelect = InferSelectModel<typeof storeTable>;
export type StoreInput = InferInsertModel<typeof storeTable>;

export type ProductSelect = InferSelectModel<typeof productTable>;
export type ProductInput = InferInsertModel<typeof productTable>;

export type PriceSelect = InferSelectModel<typeof priceTable>;
export type PriceInput = InferInsertModel<typeof priceTable>;
