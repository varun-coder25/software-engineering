import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.argv[2];

if (!supabaseUrl || !serviceRoleKey || !userId) {
  console.error("Usage: node scripts/make-admin.mjs <USER_ID>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const { data, error } = await supabase.auth.admin.updateUserById(userId, {
  user_metadata: {
    role: "admin"
  },
  app_metadata: {
    role: "admin"
  }
});

if (error) {
  console.error("Failed to update user:", error.message);
  process.exit(1);
}

console.log("Admin role applied to user:", data.user?.id);
