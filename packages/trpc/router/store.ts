import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { procedure, router } from "../trpc";
import { Effect } from "effect";
import { StoreService } from "@mercado-facil/domain/features/store/StoreService";
import { ZFindNearArgs } from "@mercado-facil/domain/features/store/types";
import { DB } from "@mercado-facil/db/service";

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
