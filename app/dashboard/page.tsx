"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { dashboardRoute, isLoading, session } = useAuth();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(dashboardRoute);
    }
  }, [dashboardRoute, isLoading, router, session]);

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel px-6 py-5 text-sm text-slate-600">
          Redirecting to your workspace...
        </div>
      </main>
    </ProtectedRoute>
  );
}
