"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "@/components/AdminDashboard";
import { useAuth } from "@/components/AuthProvider";

export default function AdminDashboardPage() {
  const { session } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard email={session?.user.email} />
    </ProtectedRoute>
  );
}
