import { z } from "zod";

export const ZSearchStoreArgs = z.object({
  latitude: z.number(),
  longitude: z.number(),
  query: z.string().trim().min(1),
});
export type SearchStoreArgs = z.infer<typeof ZSearchStoreArgs>;

export const ZFindNearArgs = z.object({
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().optional(),
});

export type FindNearArgs = z.infer<typeof ZFindNearArgs>;

export const ZFindByIdArgs = z.object({
  id: z.uuid(),
});
export type FindByIdArgs = z.infer<typeof ZFindByIdArgs>;
