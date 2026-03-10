import type { Db } from "@mercado-facil/db";
import { priceTable } from "@mercado-facil/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreatePriceArgs, SearchPriceArgs } from "./types";

export class PriceRepository {
  constructor(private readonly db: Db) {}

  create(args: CreatePriceArgs) {
    return wrap(this.db.insert(priceTable).values(args).returning()).andThen(([price]) =>
      ok(price!),
    );
  }

  search(args: SearchPriceArgs) {
    const query = this.db
      .select()
      .from(priceTable)
      .where(
        and(
          isNull(priceTable.deletedAt),
          eq(priceTable.productId, args.filters.productId),
          ...(args.filters.storeId ? [eq(priceTable.storeId, args.filters.storeId)] : []),
          ...(args.filters.userId ? [eq(priceTable.userId, args.filters.userId)] : []),
        ),
      )
      .$dynamic();

    if (args.pagination) {
      query
        .limit(args.pagination.limit)
        .offset((args.pagination.page - 1) * args.pagination.limit)
        .orderBy(desc(priceTable.createdAt));
    }

    return wrap(query);
  }
}
