import { cartItemTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { sql } from "drizzle-orm";
import { Effect } from "effect";
import type { CreateCartItemArgs } from "./types";

export class CartItemRepository extends Effect.Service<CartItemRepository>()("CartItemRepository", {
  effect: Effect.gen(function* () {
    return {
      create: (args: CreateCartItemArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const [cartItem] = yield* db
            .insert(cartItemTable)
            .values(args)
            .onConflictDoUpdate({
              target: [cartItemTable.cartId, cartItemTable.productId],
              set: { quantity: sql`excluded.quantity + ${args.quantity}` },
            })
            .returning()
            .pipe(Effect.tapErrorCause(Effect.logError));
          return cartItem!;
        }),
    };
  }),
}) {}
