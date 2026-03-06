import { productMediaTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { Effect } from "effect";
import type { CreateProductMediaArgs } from "./types";

export class ProductMediaRepository extends Effect.Service<ProductMediaRepository>()(
  "ProductMediaRepository",
  {
    effect: Effect.gen(function* () {
      return {
        create: (args: CreateProductMediaArgs) =>
          Effect.gen(function* () {
            const db = yield* IDB;
            const [productMedia] = yield* db.insert(productMediaTable).values(args).returning();
            return productMedia!;
          }),
      };
    }),
  },
) {}
