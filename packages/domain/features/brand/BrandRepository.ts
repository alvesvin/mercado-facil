import { brandTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { eq } from "drizzle-orm";
import { Effect } from "effect";
import type { CreateBrandArgs } from "./types";

export class BrandRepository extends Effect.Service<BrandRepository>()("BrandRepository", {
  effect: Effect.gen(function* () {
    return {
      create: (args: CreateBrandArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          let [brand] = yield* db
            .insert(brandTable)
            .values({
              id: args.name,
              name: args.name,
            })
            .onConflictDoNothing()
            .returning();
          if (!brand) {
            brand = (yield* db
              .select()
              .from(brandTable)
              .where(eq(brandTable.id, args.name))
              .limit(1))[0];
          }
          return brand!;
        }),
    };
  }),
}) {}
