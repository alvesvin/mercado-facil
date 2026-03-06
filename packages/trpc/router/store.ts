import { DB } from "@mercado-facil/db/service";
import { StoreService } from "@mercado-facil/domain/features/store/StoreService";
import { ZFindNearArgs } from "@mercado-facil/domain/features/store/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { Effect } from "effect";
import { procedure, router } from "../trpc";

export const store = router({
  findNear: procedure.input(ZFindNearArgs).query(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const storeService = yield* StoreService;
        const store = yield* storeService.findNear(input);
        return store;
      }).pipe(Effect.provide(DB)),
    ),
  ),
});
