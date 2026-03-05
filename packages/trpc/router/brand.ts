import { procedure, router } from "../trpc";
import { Effect } from "effect";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { BrandService } from "@mercado-facil/domain/features/brand/BrandService";
import { ZCreateBrandArgs } from "@mercado-facil/domain/features/brand/types";
import { DB } from "@mercado-facil/db/service";

export const brand = router({
  create: procedure.input(ZCreateBrandArgs).mutation(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const brandService = yield* BrandService;
        const brand = yield* brandService.create(input);
        return brand;
      }).pipe(Effect.provide(DB)),
    ),
  ),
});
