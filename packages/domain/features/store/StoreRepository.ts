import { storeTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { and, eq, getColumns, isNull, sql } from "drizzle-orm";
import { Effect } from "effect";
import type { FindByIdArgs, FindNearArgs, SearchStoreArgs } from "./types";

export class StoreRepository extends Effect.Service<StoreRepository>()("StoreRepository", {
  effect: Effect.gen(function* () {
    return {
      search: (_args: SearchStoreArgs) => {},

      findById: (args: FindByIdArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const [store] = yield* db
            .select()
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
              ...getColumns(storeTable),
              distance: sql`ST_Distance(${storeTable.location}::geography, ${sqlPoint})`,
            })
            .from(storeTable)
            .where(
              and(
                isNull(storeTable.deletedAt),
                sql`ST_DWithin(${storeTable.location}::geography, ${sqlPoint}, 100)`,
              ),
            )
            .orderBy(sql`${storeTable.location}::geography <-> ${sqlPoint}`)
            .limit(1);

          return store || null;
        }),
    };
  }),
}) {}
