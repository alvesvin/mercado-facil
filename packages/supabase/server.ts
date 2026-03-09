import { createServerClient } from "@supabase/ssr";
import { Config, Effect } from "effect";

export const getSupabaseServerClient = Effect.gen(function* () {
  const supabaseUrl = yield* Config.string("SUPABASE_URL");
  const supabaseSecretKey = yield* Config.string("SUPABASE_SECRET_KEY");

  const supabase = createServerClient(supabaseUrl, supabaseSecretKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
  return supabase;
});
