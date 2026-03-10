import { ZCreatePriceArgs, ZFindConsensusArgs } from "@mercado-facil/domain/features/price/types";
import { priceService } from "@mercado-facil/domain/features/singletons";
import { procedure, router } from "../trpc";
import { unwrapAsync } from "../utils";

export const price = router({
  create: procedure
    .input(ZCreatePriceArgs)
    .mutation(({ input, ctx }) => unwrapAsync(priceService.create(input, ctx))),

  findConsensus: procedure
    .input(ZFindConsensusArgs)
    .query(({ input }) => unwrapAsync(priceService.findConsensus(input))),
});
