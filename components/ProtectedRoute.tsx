"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, router, session]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel px-6 py-5 text-sm text-slate-600">
          Restoring your secure session...
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
