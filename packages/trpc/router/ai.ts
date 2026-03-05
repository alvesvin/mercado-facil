import { Effect } from "effect";
import { procedure, router } from "../trpc";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { ZGenerateProductInfoArgs } from "@mercado-facil/domain/features/ai/types";
import { AiService } from "@mercado-facil/domain/features/ai/AiService";

export const ai = router({
  generateProductInfo: procedure
    .input(ZGenerateProductInfoArgs)
    .mutation(({ input }) =>
      LiveRuntime.runPromise(
        Effect.gen(function* () {
          const aiService = yield* AiService;
          const productInfo = yield* aiService.generateProductInfo(input);
          return productInfo;
        }),
      ),
    ),
});
