"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    router.replace(session ? "/dashboard" : "/login");
  }, [isLoading, router, session]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="glass-panel px-6 py-5 text-sm text-slate-600">
        Preparing your academic portal...
      </div>
    </main>
  );
}
