"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type NavbarProps = {
  email?: string;
};

export default function Navbar({ email }: NavbarProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
            VIT Portal
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-xl text-slate-900">
            Academic Certificate & GPA Portal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-slate-700">{email ?? "Student"}</p>
          </div>
          <button className="button-secondary" disabled={loggingOut} onClick={handleLogout} type="button">
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
