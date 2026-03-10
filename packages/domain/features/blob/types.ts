import { z } from "zod";

export const ZUploadFileArgs = z.object({
  bucket: z.string(),
  path: z.string(),
  file: z.object({
    base64: z.base64(),
    mimeType: z.string(),
  }),
  upsert: z.boolean().optional(),
});
export type UploadFileArgs = z.infer<typeof ZUploadFileArgs>;

export const ZGetSignedUploadUrlArgs = z.object({
  bucket: z.string(),
  path: z.string(),
});
export type GetSignedUploadUrlArgs = z.infer<typeof ZGetSignedUploadUrlArgs>;
