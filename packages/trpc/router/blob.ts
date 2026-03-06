import { DB } from "@mercado-facil/db/service";
import { BlobService } from "@mercado-facil/domain/features/blob/BlobService";
import {
  ZGetSignedUploadUrlArgs,
  ZUploadFileArgs,
} from "@mercado-facil/domain/features/blob/types";
import { LiveRuntime } from "@mercado-facil/domain/runtime/live";
import { Effect } from "effect";
import { procedure, router } from "../trpc";

export const blob = router({
  getSignedUploadUrl: procedure.input(ZGetSignedUploadUrlArgs).mutation(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const blobService = yield* BlobService;
        const data = yield* blobService.getSignedUploadUrl(input);
        return data;
      }).pipe(Effect.provide(DB)),
    ),
  ),
  uploadFile: procedure.input(ZUploadFileArgs).mutation(({ input }) =>
    LiveRuntime.runPromise(
      Effect.gen(function* () {
        const blobService = yield* BlobService;
        const data = yield* blobService.uploadFile(input);
        return data;
      }).pipe(Effect.provide(DB)),
    ),
  ),
});
