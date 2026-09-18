import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Creates an anonymous Supabase client for public, RLS-limited reads only.
 * Never runs with elevated privileges.
 */
export function createPublicClient() {
  const { url, anonKey } = supabaseEnv();
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}