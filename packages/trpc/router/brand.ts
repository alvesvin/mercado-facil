import { ZCreateBrandArgs } from "@mercado-facil/domain/features/brand/types";
import { brandService } from "@mercado-facil/domain/features/singletons";
import { procedure, router } from "../trpc";
import { unwrapAsync } from "../utils";

export const brand = router({
  create: procedure
    .input(ZCreateBrandArgs)
    .mutation(({ input }) => unwrapAsync(brandService.create(input))),
});
