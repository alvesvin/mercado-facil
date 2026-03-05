import { IDB } from "@mercado-facil/db/service";
import { Effect } from "effect";
import type { SearchStoreArgs, FindNearArgs, FindByIdArgs } from "./types";
import { sql, getColumns, eq, and, isNull } from "drizzle-orm";
import { storeTable } from "@mercado-facil/db/schema";
import { ResourceNotFoundError } from "@mercado-facil/errors";

export class StoreRepository extends Effect.Service<StoreRepository>()(
  "StoreRepository",
  {
    effect: Effect.gen(function* () {
      return {
        search: (args: SearchStoreArgs) => {},

        findById: (args: FindByIdArgs) =>
          Effect.gen(function* () {
            const db = yield* IDB;
            const [store] = yield* db
              .select()
              .from(storeTable)
              .where(
                and(eq(storeTable.id, args.id), isNull(storeTable.deletedAt)),
              )
              .limit(1);
            if (!store)
              return yield* Effect.fail(
                new ResourceNotFoundError("Loja não encontrada"),
              );
            return store;
          }),

        findNear: (args: FindNearArgs) =>
          Effect.gen(function* () {
            const db = yield* IDB;
            const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${args.longitude}, ${args.latitude}), 4326)`;

            const [store] = yield* db
              .select({
                ...getColumns(storeTable),
                distance: sql`ST_Distance(${storeTable.location}, ${sqlPoint})`,
              })
              .from(storeTable)
              .where(
                sql`ST_DWithin(${storeTable.location}, ${sqlPoint}, ${args.radius ?? 10000})`,
              )
              .orderBy(sql`${storeTable.location} <-> ${sqlPoint}`)
              .limit(1);

            return store || null;
          }),
      };
    }),
  },
) {}
