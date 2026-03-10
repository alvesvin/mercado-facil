import { storeService } from "@mercado-facil/domain/features/singletons";
import {
  ZCreateStoreArgs,
  ZFindNearArgs,
  ZSearchStoreArgs,
} from "@mercado-facil/domain/features/store/types";
import { procedure, router } from "../trpc";
import { unwrapAsync } from "../utils";

export const store = router({
  search: procedure
    .input(ZSearchStoreArgs)
    .query(({ input, ctx }) => unwrapAsync(storeService.search(input, ctx))),

  findNear: procedure
    .input(ZFindNearArgs)
    .query(({ input, ctx }) => unwrapAsync(storeService.findNear(input, ctx))),

  create: procedure
    .input(ZCreateStoreArgs)
    .mutation(({ input, ctx }) => unwrapAsync(storeService.create(input, ctx))),
});
