import { z } from "zod";

export const config = z
  .object({
    EXPO_PUBLIC_API_URL: z.url(),
    EXPO_PUBLIC_SUPABASE_URL: z.url(),
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
    EXPO_PUBLIC_POSTHOG_API_KEY: z.string(),
  })
  .parse({
    // Very important to use process.env.EXPO_URL_* otherwise Expo can't replace it at build time
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  });
