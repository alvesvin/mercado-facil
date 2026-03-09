import { getSupabaseServerClient } from "@mercado-facil/supabase/server";
import { Effect } from "effect";
import type { GetSignedUploadUrlArgs, UploadFileArgs } from "./types";

export class BlobService extends Effect.Service<BlobService>()("BlobService", {
  effect: Effect.gen(function* () {
    return {
      getSignedUploadUrl: (args: GetSignedUploadUrlArgs) =>
        Effect.gen(function* () {
          yield* Effect.logInfo("Getting signed upload url", { args });

          const supabase = yield* getSupabaseServerClient;

          return yield* Effect.flatMap(
            Effect.promise(() =>
              supabase.storage.from(args.bucket).createSignedUploadUrl(args.path),
            ),
            (result) => {
              return result.error ? Effect.fail(result.error) : Effect.succeed(result.data);
            },
          ).pipe(Effect.tap((result) => Effect.logInfo("Signed upload url created", result)));
        }),

      uploadFile: (args: UploadFileArgs) =>
        Effect.gen(function* () {
          yield* Effect.logInfo("Uploading file", { bucket: args.bucket, path: args.path });

          const supabase = yield* getSupabaseServerClient;

          const object = yield* Effect.flatMap(
            Effect.promise(() =>
              supabase.storage
                .from(args.bucket)
                .upload(args.path, Buffer.from(args.file.base64, "base64"), {
                  contentType: args.file.mimeType || undefined,
                  upsert: args.upsert,
                }),
            ),
            (result) => (result.error ? Effect.fail(result.error) : Effect.succeed(result.data)),
          ).pipe(Effect.tap((result) => Effect.logInfo("File uploaded", result)));

          return object;
        }),
    };
  }),
}) {}
