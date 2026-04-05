import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing Supabase service role environment variable.");
}

export function createSupabaseServerClient(accessToken?: string) {
  const url = supabaseUrl as string;
  const anonKey = supabaseAnonKey as string;

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      : undefined
  });
}

export function createSupabaseServiceClient() {
  return createClient(supabaseUrl as string, supabaseServiceRoleKey as string, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
