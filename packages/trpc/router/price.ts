import { DB } from "@mercado-facil/db/service";
import { PriceService } from "@mercado-facil/domain/features/price/PriceService";
import { ZFindConsensusArgs } from "@mercado-facil/domain/features/price/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { Effect } from "effect";
import { procedure, router } from "../trpc";

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
