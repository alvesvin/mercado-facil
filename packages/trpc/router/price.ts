import { PriceService } from "@mercado-facil/domain/features/price/PriceService";
import { procedure, router } from "../trpc";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { Effect } from "effect";
import { ZFindConsensusArgs } from "@mercado-facil/domain/features/price/types";
import { DB } from "@mercado-facil/db/service";

export const price = router({
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
