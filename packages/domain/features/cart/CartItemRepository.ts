import type { Db } from "@mercado-facil/db";
import { cartItemTable } from "@mercado-facil/db/schema";
import { sql } from "drizzle-orm";
import { ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateCartItemArgs } from "./types";

export class CartItemRepository {
  constructor(private readonly db: Db) {}

  create(args: CreateCartItemArgs) {
    return wrap(
      this.db
        .insert(cartItemTable)
        .values(args)
        .onConflictDoUpdate({
          target: [cartItemTable.cartId, cartItemTable.productId],
          set: { quantity: sql`excluded.quantity + ${args.quantity}` },
        })
        .returning(),
    ).andThen(([cartItem]) => ok(cartItem!));
  }
}
