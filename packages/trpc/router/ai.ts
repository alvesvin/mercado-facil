import { ZGenerateProductInfoArgs } from "@mercado-facil/domain/features/ai/types";
import { aiService } from "@mercado-facil/domain/features/singletons";
import { procedure, router } from "../trpc";
import { unwrapAsync } from "../utils";

export const ai = router({
  generateProductInfo: procedure
    .input(ZGenerateProductInfoArgs)
    .mutation(({ input }) => unwrapAsync(aiService.generateProductInfo(input))),
});
