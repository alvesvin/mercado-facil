import { DB } from "@mercado-facil/db/service";
import { StoreService } from "@mercado-facil/domain/features/store/StoreService";
import {
  ZCreateStoreArgs,
  ZFindNearArgs,
  ZSearchStoreArgs,
} from "@mercado-facil/domain/features/store/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { RequestContext } from "@mercado-facil/domain/services/RequestContext";
import { Effect } from "effect";
import { procedure, router } from "../trpc";

export const store = router({
  search: procedure.input(ZSearchStoreArgs).query(({ input, ctx }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const storeService = yield* StoreService;
        const stores = yield* storeService.search(input);
        return stores;
      }).pipe(Effect.provide(DB), Effect.provide(RequestContext.Default(ctx))),
    ),
  ),

  findNear: procedure.input(ZFindNearArgs).query(({ input, ctx }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const storeService = yield* StoreService;
        const store = yield* storeService.findNear(input);
        return store;
      }).pipe(Effect.provide(DB), Effect.provide(RequestContext.Default(ctx))),
    ),
  ),

  create: procedure.input(ZCreateStoreArgs).mutation(({ input, ctx }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const storeService = yield* StoreService;
        const store = yield* storeService.create(input);
        return store;
      }).pipe(Effect.provide(DB), Effect.provide(RequestContext.Default(ctx))),
    ),
  ),
});
