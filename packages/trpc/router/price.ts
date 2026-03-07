import { DB } from "@mercado-facil/db/service";
import { PriceService } from "@mercado-facil/domain/features/price/PriceService";
import { ZCreatePriceArgs, ZFindConsensusArgs } from "@mercado-facil/domain/features/price/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { RequestContext } from "@mercado-facil/domain/services/RequestContext";
import { Effect } from "effect";
import { procedure, router } from "../trpc";

export const price = router({
  create: procedure.input(ZCreatePriceArgs).mutation(({ input, ctx }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const priceService = yield* PriceService;
        const price = yield* priceService.create(input);
        return price;
      }).pipe(Effect.provide(DB), Effect.provide(RequestContext.Default(ctx))),
    ),
  ),
  findConsensus: procedure.input(ZFindConsensusArgs).query(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const priceService = yield* PriceService;
        const price = yield* priceService.findConsensus(input);
        return price;
      }).pipe(Effect.provide(DB)),
    ),
  ),
});
