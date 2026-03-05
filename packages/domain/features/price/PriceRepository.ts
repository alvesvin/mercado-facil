import { Effect } from "effect";
import type { CreatePriceArgs } from "./types";
import { IDB } from "@mercado-facil/db/service";
import { priceTable } from "@mercado-facil/db/schema";
import type { SearchPriceArgs } from "./types";
import { and, desc, eq, isNull } from "drizzle-orm";

export class PriceRepository extends Effect.Service<PriceRepository>()(
  "PriceRepository",
  {
    effect: Effect.gen(function* () {
      return {
        create: (args: CreatePriceArgs) =>
          Effect.gen(function* () {
            const db = yield* IDB;
            const price = (yield* db
              .insert(priceTable)
              .values(args)
              .returning())[0]!;

            return price;
          }),

        search: (args: SearchPriceArgs) =>
          Effect.gen(function* () {
            const db = yield* IDB;
            const query = db
              .select()
              .from(priceTable)
              .where(
                and(
                  isNull(priceTable.deletedAt),
                  eq(priceTable.productId, args.filters.productId),
                  ...(args.filters.storeId
                    ? [eq(priceTable.storeId, args.filters.storeId)]
                    : []),
                  ...(args.filters.userId
                    ? [eq(priceTable.userId, args.filters.userId)]
                    : []),
                ),
              )
              .$dynamic();

            if (args.pagination) {
              query
                .limit(args.pagination.limit)
                .offset((args.pagination.page - 1) * args.pagination.limit)
                .orderBy(desc(priceTable.createdAt));
            }

            const prices = yield* query;

            return prices;
          }),
      };
    }),
  },
) {}
