import { cartTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { and, desc, eq, gte, isNull } from "drizzle-orm";
import { Effect } from "effect";
import type { FindByIdArgs } from "../store/types";
import type { CreateCartArgs, GetActiveByUserIdArgs, UpdateStoreArgs } from "./types";

export class CartRepository extends Effect.Service<CartRepository>()("CartRepository", {
  effect: Effect.gen(function* () {
    return {
      getActiveByUserId: (args: GetActiveByUserIdArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const [cart] = yield* db
            .select()
            .from(cartTable)
            .where(
              and(
                eq(cartTable.userId, args.user.id),
                // wanna filter only carts created in the last 3 hours
                gte(cartTable.createdAt, new Date(Date.now() - 3 * 60 * 60 * 1000)),
                isNull(cartTable.deletedAt),
                isNull(cartTable.completedAt),
              ),
            )
            .orderBy(desc(cartTable.createdAt))
            .limit(1);

          return cart || null;
        }),

      create: (args: CreateCartArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          return (yield* db.insert(cartTable).values({ userId: args.user.id }).returning())[0]!;
        }),

      updateStore: (args: UpdateStoreArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          return (yield* db
            .update(cartTable)
            .set({ storeId: args.store.id })
            .where(eq(cartTable.id, args.cart.id))
            .returning())[0]!;
        }),

      findById: (args: FindByIdArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const [cart] = yield* db
            .select()
            .from(cartTable)
            .where(and(eq(cartTable.id, args.id), isNull(cartTable.deletedAt)))
            .limit(1);
          if (!cart)
            return yield* Effect.fail(new ResourceNotFoundError("Carrinho não encontrado"));
          return cart;
        }),
    };
  }),
}) {}
