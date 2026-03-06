import { productTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { eq } from "drizzle-orm";
import { Effect } from "effect";
import type { CreateProductArgs, FindByBarcodeArgs } from "./types";

export class ProductRepository extends Effect.Service<ProductRepository>()("ProductRepository", {
  effect: Effect.gen(function* () {
    return {
      create: (args: CreateProductArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const [product] = yield* db.insert(productTable).values(args).returning();
          return product!;
        }),

      findByBarcode: (args: FindByBarcodeArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          const [product] = yield* db
            .select()
            .from(productTable)
            .where(eq(productTable.barcode, args.barcode))
            .limit(1);
          return product || null;
        }),
    };
  }),
}) {}
