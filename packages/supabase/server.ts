import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const getSupabaseServerClient = () => {
  const supabase = createServerClient(supabaseUrl, supabaseSecretKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
  return supabase;
};
export type SupabaseServerClient = ReturnType<typeof getSupabaseServerClient>;
