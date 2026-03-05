import { z } from "zod";

export const ZCreateBrandArgs = z.object({
  name: z.string(),
});
export type CreateBrandArgs = z.infer<typeof ZCreateBrandArgs>;
