"use client";

import { BellRing, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type NavbarProps = {
  email?: string;
  eyebrow?: string;
  title?: string;
};

export default function Navbar({
  email,
  eyebrow = "Student Control Center",
  title = "VIT Academic Certificate Verification Portal"
}: NavbarProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.replace("/login");
  };

  return (
    <header className="surface-panel sticky top-4 z-20 flex flex-col gap-4 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
          <Sparkles className="h-4 w-4" />
          {eyebrow}
        </div>
        <h1 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/60 lg:flex">
          <BellRing className="h-4 w-4 text-sky-500" />
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Logged in</p>
            <p className="max-w-44 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {email ?? "Student"}
            </p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>

        <ThemeToggle />
        <Button
          size="sm"
          variant="outline"
          disabled={loggingOut}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
}
