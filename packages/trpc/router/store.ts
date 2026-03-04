import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { procedure, router } from "../trpc";
import { Effect } from "effect";
import { RequestContext } from "@mercado-facil/domain/services/RequestContext";
import { StoreService } from "@mercado-facil/domain/features/store/StoreService";
import { ZFindNearArgs } from "@mercado-facil/domain/features/store/types";

export const store = router({
  findNear: procedure.input(ZFindNearArgs).query(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const storeService = yield* StoreService;
        const store = yield* storeService.findNear(input);
        return store;
      }),
    ),
  ),
});
