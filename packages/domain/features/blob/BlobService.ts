import type { SupabaseServerClient } from "@mercado-facil/supabase/server";
import { err, ok, ResultAsync } from "neverthrow";
import type { GetSignedUploadUrlArgs, UploadFileArgs } from "./types";

export class BlobService {
  constructor(private readonly supabase: SupabaseServerClient) {}

  getSignedUploadUrl(args: GetSignedUploadUrlArgs) {
    return ResultAsync.fromSafePromise(
      this.supabase.storage.from(args.bucket).createSignedUploadUrl(args.path),
    ).andThen(({ data, error }) => (error ? err(error) : ok(data)));
  }

  uploadFile(args: UploadFileArgs) {
    return ResultAsync.fromSafePromise(
      this.supabase.storage
        .from(args.bucket)
        .upload(args.path, Buffer.from(args.file.base64, "base64"), {
          contentType: args.file.mimeType,
          upsert: args.upsert ?? false,
        }),
    ).andThen(({ data, error }) => (error ? err(error) : ok(data)));
  }
}
