import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the anonymous key.
 * Use this for operations that rely on RLS policies.
 */
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Creates a Supabase client with the service role key.
 * Use this for authenticated server actions that already perform their own auth checks.
 * ⚠️ Warning: This bypasses RLS policies, so ensure proper authorization checks are in place.
 */
export function createServerSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}
