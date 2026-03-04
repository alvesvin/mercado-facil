import { IDB } from "@mercado-facil/db/service";
import { Effect } from "effect";
import type { SearchStoreArgs, FindNearArgs } from "./types";
import { sql, getColumns } from "drizzle-orm";
import { storeTable } from "@mercado-facil/db/schema";

export class StoreRepository extends Effect.Service<StoreRepository>()(
  "StoreRepository",
  {
    effect: Effect.gen(function* () {
      const db = yield* IDB;

      return {
        search: (args: SearchStoreArgs) => {},

        findNear: (args: FindNearArgs) =>
          Effect.gen(function* () {
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

            return store;
          }),
      };
    }),
  },
) {}
