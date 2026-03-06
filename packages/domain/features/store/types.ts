import { z } from "zod";

export type SearchStoreArgs = {
  query: string;
};

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
