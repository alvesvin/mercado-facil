import { Effect } from "effect";
import { IDB } from "@mercado-facil/db/service";
import { cartTable } from "@mercado-facil/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import type { CreateCartArgs, GetActiveByUserIdArgs } from "./types";

export class CartRepository extends Effect.Service<CartRepository>()(
  "CartRepository",
  {
    effect: Effect.gen(function* () {
      const db = yield* IDB;

      return {
        getActiveByUserId: (args: GetActiveByUserIdArgs) =>
          Effect.gen(function* () {
            const [cart] = yield* db
              .select()
              .from(cartTable)
              .where(
                and(
                  eq(cartTable.userId, args.user.id),
                  isNull(cartTable.deletedAt),
                  isNull(cartTable.completedAt),
                ),
              )
              .orderBy(desc(cartTable.createdAt))
              .limit(1);

            return cart;
          }),

        create: (args: CreateCartArgs) =>
          Effect.gen(function* () {
            return (yield* db
              .insert(cartTable)
              .values({ userId: args.user.id })
              .returning())[0]!;
          }),
      };
    }),
  },
) {}
