import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client that bypasses Row Level Security with the service role key.
// NEVER import this from a client component or expose this key to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
