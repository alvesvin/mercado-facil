import { z } from "zod";

export const ZSearchStoreArgs = z.object({
  latitude: z.number(),
  longitude: z.number(),
  query: z.string().trim().min(1),
  userId: z.uuidv7().nullish(),
});
export type SearchStoreArgs = z.infer<typeof ZSearchStoreArgs>;

export const ZFindNearArgs = z.object({
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().optional(),
  userId: z.uuidv7().nullish(),
});

export type FindNearArgs = z.infer<typeof ZFindNearArgs>;

export const ZFindByIdArgs = z.object({
  id: z.uuidv7(),
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
  userId: z.uuidv7().nullish(),
});
export type CreateStoreArgs = z.infer<typeof ZCreateStoreArgs>;

export const ZGetStoreArgs = z.object({
  id: z.uuidv7(),
  userId: z.uuidv7().nullish(),
});
export type GetStoreArgs = z.infer<typeof ZGetStoreArgs>;
