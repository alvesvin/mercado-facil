import type { Db } from "@mercado-facil/db";
import { cartItemTable, cartTable, priceTable, storeTable } from "@mercado-facil/db/schema";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { and, asc, desc, eq, gt, isNotNull, isNull, sql } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { wrap } from "../../utils";
import type {
  CreateCartArgs,
  GetActiveByUserIdArgs,
  IndexRepositoryArgs,
  UpdateStoreArgs,
} from "./types";

export class CartRepository {
  constructor(private readonly db: Db) {}

  static withTransaction(db: Db) {
    return new CartRepository(db);
  }

  index(args: IndexRepositoryArgs) {
    const orderBy =
      args.pagination.order === "asc" ? asc(cartTable.createdAt) : desc(cartTable.createdAt);

    return wrap(
      this.db
        .select({
          id: cartTable.id,
          createdAt: cartTable.createdAt,
          completedAt: cartTable.completedAt,
          itemsCount: sql<number>`count(${cartItemTable.id})`,
          total: sql<number>`sum(${priceTable.price} * ${cartItemTable.quantity})`,
          store: {
            id: storeTable.id,
            name: storeTable.name,
          },
        })
        .from(cartTable)
        .leftJoin(storeTable, eq(cartTable.storeId, storeTable.id))
        .leftJoin(cartItemTable, eq(cartTable.id, cartItemTable.cartId))
        .leftJoin(priceTable, eq(cartItemTable.priceId, priceTable.id))
        .where(
          and(
            isNull(cartTable.deletedAt),
            isNotNull(cartTable.storeId),
            args.filter.userId ? eq(cartTable.userId, args.filter.userId) : undefined,
            args.pagination.cursor ? gt(cartTable.id, args.pagination.cursor) : undefined,
          ),
        )
        .orderBy(orderBy)
        .groupBy(cartTable.id, storeTable.id)
        .limit(args.pagination.limit),
    );
  }

  getActiveByUserId(args: GetActiveByUserIdArgs) {
    return wrap(
      this.db
        .select({
          id: cartTable.id,
          store: { id: storeTable.id, name: storeTable.name },
        })
        .from(cartTable)
        .leftJoin(storeTable, eq(cartTable.storeId, storeTable.id))
        .where(
          and(
            eq(cartTable.userId, args.user.id),
            isNull(cartTable.deletedAt),
            isNull(cartTable.completedAt),
          ),
        )
        .orderBy(desc(cartTable.createdAt))
        .limit(1),
    ).andThen(([cart]) => ok(cart ?? null));
  }

  create(args: CreateCartArgs) {
    return wrap(
      this.db.insert(cartTable).values({ userId: args.user.id }).returning({
        id: cartTable.id,
      }),
    ).andThen(() => this.getActiveByUserId({ user: args.user }));
  }

  updateStore(args: UpdateStoreArgs) {
    return wrap(
      this.db
        .update(cartTable)
        .set({ storeId: args.store.id })
        .where(eq(cartTable.id, args.cart.id))
        .returning(),
    ).andThen(([cart]) => ok(cart!));
  }

  get(id: string) {
    return wrap(
      this.db
        .select()
        .from(cartTable)
        .where(and(eq(cartTable.id, id), isNull(cartTable.deletedAt)))
        .limit(1),
    ).andThen(([cart]) => {
      if (!cart) return err(new ResourceNotFoundError("Carrinho não encontrado"));
      return ok(cart);
    });
  }
}
