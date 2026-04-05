import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { normalizeRole } from "@/lib/roles";

export async function getRequestContext(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing authorization token.");
  }

  const accessToken = authHeader.replace("Bearer ", "").trim();
  const supabase = createSupabaseServerClient(accessToken);
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new Error("Unable to validate the current user.");
  }

  return {
    accessToken,
    supabase,
    user,
    role: normalizeRole(user.user_metadata?.role)
  };
}
