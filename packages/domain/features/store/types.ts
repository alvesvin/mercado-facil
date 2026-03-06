import { z } from "zod";

export const ZSearchStoreArgs = z.object({
  latitude: z.number(),
  longitude: z.number(),
  query: z.string().trim().min(1),
  userId: z.uuid().nullish(),
});
export type SearchStoreArgs = z.infer<typeof ZSearchStoreArgs>;

export const ZFindNearArgs = z.object({
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().optional(),
  userId: z.uuid().nullish(),
});

export type FindNearArgs = z.infer<typeof ZFindNearArgs>;

export const ZFindByIdArgs = z.object({
  id: z.uuid(),
});
export type FindByIdArgs = z.infer<typeof ZFindByIdArgs>;

export const ZCreateStoreArgs = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip: z.string().nullish(),
  country: z.string().nullish(),
  userId: z.uuid().nullish(),
});
export type CreateStoreArgs = z.infer<typeof ZCreateStoreArgs>;
