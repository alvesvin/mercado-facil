import { Effect } from "effect";
import { DB } from "../services/db";
import { cart } from "@/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { RequestState } from "../services/request-state";

export const startShoppingSession = Effect.gen(function* () {
  const db = yield* DB;
  const ctx = yield* RequestState;
  const auth = yield* ctx.auth;

  let [currentCart] = yield* db
    .select()
    .from(cart)
    .where(
      and(
        eq(cart.userId, auth.user.id),
        isNull(cart.deletedAt),
        isNull(cart.completedAt),
      ),
    )
    .orderBy(desc(cart.createdAt))
    .limit(1);

  if (!currentCart) {
    currentCart = (yield* db
      .insert(cart)
      .values({ userId: auth.user.id })
      .returning())[0]!;
  }

  return currentCart;
});

export const addProduct = () => Effect.gen(function* () {});
