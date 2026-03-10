import type { Db } from "@mercado-facil/db";
import { priceTable } from "@mercado-facil/db/schema";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { wrap } from "../../utils";
import type { CreatePriceArgs, SearchPriceArgs } from "./types";

export class PriceRepository {
  constructor(private readonly db: Db) {}

  static withTransaction(db: Db) {
    return new PriceRepository(db);
  }

  create(args: Omit<CreatePriceArgs, "userId">) {
    return wrap(this.db.insert(priceTable).values(args).returning());
  }

  buildSearchWhere(args: SearchPriceArgs) {
    return and(
      isNull(priceTable.deletedAt),
      eq(priceTable.productId, args.filters.productId),
      args.filters.type ? eq(priceTable.type, args.filters.type) : undefined,
      args.filters.storeId ? eq(priceTable.storeId, args.filters.storeId) : undefined,
      args.filters.userId ? eq(priceTable.userId, args.filters.userId) : undefined,
    );
  }

  search(args: SearchPriceArgs) {
    const query = this.db.select().from(priceTable).where(this.buildSearchWhere(args)).$dynamic();

    if (args.pagination) {
      query
        .limit(args.pagination.limit)
        .offset((args.pagination.page - 1) * args.pagination.limit)
        .orderBy(desc(priceTable.createdAt));
    }

    return wrap(query);
  }

  buildFindCreatedByUserIdTodayWhere(userId: string) {
    return and(
      eq(priceTable.userId, userId),
      sql`${priceTable.createdAt}::date = now()::date`,
      isNull(priceTable.deletedAt),
    );
  }

  findCreatedByUserIdToday(userId: string) {
    return wrap(
      this.db
        .select({
          id: priceTable.id,
          storeId: priceTable.storeId,
          productId: priceTable.productId,
          type: priceTable.type,
        })
        .from(priceTable)
        .where(this.buildFindCreatedByUserIdTodayWhere(userId)),
    );
  }
}
