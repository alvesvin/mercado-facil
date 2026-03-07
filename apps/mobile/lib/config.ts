import { z } from "zod";

export const config = z
  .object({
    EXPO_PUBLIC_API_URL: z.url(),
    EXPO_PUBLIC_SUPABASE_URL: z.url(),
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
  })
  .parse(process.env);
