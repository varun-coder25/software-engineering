"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { AppRole } from "@/lib/roles";

export default function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: ReactNode;
  allowedRoles?: AppRole[];
}) {
  const router = useRouter();
  const { session, isLoading, role, dashboardRoute } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
      return;
    }

    if (!isLoading && session && allowedRoles && !allowedRoles.includes(role)) {
      router.replace(dashboardRoute);
    }
  }, [allowedRoles, dashboardRoute, isLoading, role, router, session]);

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

  if (allowedRoles && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
