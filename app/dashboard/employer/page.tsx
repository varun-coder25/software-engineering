"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import EmployerDashboard from "@/components/EmployerDashboard";
import { useAuth } from "@/components/AuthProvider";

export default function EmployerDashboardPage() {
  const { session } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["employer"]}>
      <EmployerDashboard email={session?.user.email} />
    </ProtectedRoute>
  );
}
