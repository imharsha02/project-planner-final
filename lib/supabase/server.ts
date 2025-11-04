import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Cached singleton instance for service role client
// This is safe because:
// 1. Service role key is stateless (bypasses RLS)
// 2. Supabase clients are stateless HTTP clients
// 3. Next.js module caching ensures single instance per process
let cachedClient: SupabaseClient | null = null;

/**
 * Creates or returns a cached Supabase client with the service role key.
 * This uses a singleton pattern to optimize performance while maintaining
 * stateless behavior required for serverless/server actions.
 *
 * Use this for authenticated server actions that already perform their own auth checks.
 * ⚠️ Warning: This bypasses RLS policies, so ensure proper authorization checks are in place.
 */
export function createServerSupabaseServiceClient(): SupabaseClient {
  // Return cached instance if available (Next.js module caching ensures this persists)
  if (cachedClient) {
    return cachedClient;
  }

  // Create new instance and cache it
  cachedClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  return cachedClient;
}
