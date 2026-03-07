import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

export const supabase = createClient(
  config.EXPO_PUBLIC_SUPABASE_URL,
  config.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
