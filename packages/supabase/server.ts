import { createServerClient } from "@supabase/ssr";
import { Effect } from "effect";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const getSupabaseServerClient = Effect.gen(function* () {
  const supabase = createServerClient(supabaseUrl, supabaseSecretKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
  return supabase;
});
