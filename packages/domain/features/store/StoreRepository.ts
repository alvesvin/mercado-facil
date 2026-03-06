import { storeTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { and, desc, eq, getColumns, isNull, sql } from "drizzle-orm";
import { Effect } from "effect";
import type { FindByIdArgs, FindNearArgs, SearchStoreArgs } from "./types";

const STORE_SEARCH_RADIUS_METERS = 10_000;

export class StoreRepository extends Effect.Service<StoreRepository>()("StoreRepository", {
  effect: Effect.gen(function* () {
    const { searchText: _searchText, ...storeColumns } = getColumns(storeTable);

    return {
      search: (args: SearchStoreArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${args.longitude}, ${args.latitude}), 4326)::geography`;
          const normalizedQuery = args.query.trim().toLowerCase();
          const distance = sql<number>`ST_Distance(${storeTable.location}::geography, ${sqlPoint})`;
          const similarity = sql<number>`word_similarity(${normalizedQuery}, ${storeTable.searchText})`;

          const stores = yield* db
            .select({
              id: storeTable.id,
              name: storeTable.name,
              address: storeTable.address,
              city: storeTable.city,
              state: storeTable.state,
              zip: storeTable.zip,
              country: storeTable.country,
              distance,
              similarity,
            })
            .from(storeTable)
            .where(
              and(
                isNull(storeTable.deletedAt),
                sql`${normalizedQuery} <% ${storeTable.searchText}`,
                sql`ST_DWithin(${storeTable.location}::geography, ${sqlPoint}, ${STORE_SEARCH_RADIUS_METERS})`,
              ),
            )
            .orderBy(desc(similarity), distance)
            .limit(5);

          return stores;
        }),

      findById: (args: FindByIdArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const [store] = yield* db
            .select(storeColumns)
            .from(storeTable)
            .where(and(eq(storeTable.id, args.id), isNull(storeTable.deletedAt)))
            .limit(1);
          if (!store) return yield* Effect.fail(new ResourceNotFoundError("Loja não encontrada"));
          return store;
        }),

      findNear: (args: FindNearArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${args.longitude}, ${args.latitude}), 4326)::geography`;

          const [store] = yield* db
            .select({
              ...storeColumns,
              distance: sql`ST_Distance(${storeTable.location}::geography, ${sqlPoint})`,
            })
            .from(storeTable)
            .where(
              and(
                isNull(storeTable.deletedAt),
                sql`ST_DWithin(${storeTable.location}::geography, ${sqlPoint}, ${args.radius ?? 100})`,
              ),
            )
            .orderBy(sql`${storeTable.location}::geography <-> ${sqlPoint}`)
            .limit(1);

          return store || null;
        }),
    };
  }),
}) {}
