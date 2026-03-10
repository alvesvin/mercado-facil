import {
  ZGetSignedUploadUrlArgs,
  ZUploadFileArgs,
} from "@mercado-facil/domain/features/blob/types";
import { blobService } from "@mercado-facil/domain/features/singletons";
import { procedure, router } from "../trpc";
import { unwrapAsync } from "../utils";

export const blob = router({
  getSignedUploadUrl: procedure
    .input(ZGetSignedUploadUrlArgs)
    .mutation(({ input }) => unwrapAsync(blobService.getSignedUploadUrl(input))),

  uploadFile: procedure
    .input(ZUploadFileArgs)
    .mutation(({ input }) => unwrapAsync(blobService.uploadFile(input))),
});
