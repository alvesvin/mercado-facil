import { createServerClient } from "@supabase/ssr";
import { Effect } from "effect";

export const getSupabaseServerClient = (supabaseUrl: string, supabasePublicKey: string) =>
  Effect.gen(function* () {
    const supabase = createServerClient(supabaseUrl, supabasePublicKey, {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    });
    return supabase;
  });
