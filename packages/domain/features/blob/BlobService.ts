import { getSupabaseServerClient } from "@mercado-facil/supabase/server";
import { Effect } from "effect";
import type { GetSignedUploadUrlArgs, UploadFileArgs } from "./types";

export class BlobService extends Effect.Service<BlobService>()("BlobService", {
  effect: Effect.gen(function* () {
    return {
      getSignedUploadUrl: (args: GetSignedUploadUrlArgs) =>
        Effect.gen(function* () {
          const supabase = yield* getSupabaseServerClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLIC_KEY!,
          );
          return yield* Effect.flatMap(
            Effect.promise(() =>
              supabase.storage.from(args.bucket).createSignedUploadUrl(args.path),
            ),
            (result) => {
              return result.error ? Effect.fail(result.error) : Effect.succeed(result.data);
            },
          );
        }),

      uploadFile: (args: UploadFileArgs) =>
        Effect.gen(function* () {
          const supabase = yield* getSupabaseServerClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLIC_KEY!,
          );

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
          );

          return object;
        }),
    };
  }),
}) {}
