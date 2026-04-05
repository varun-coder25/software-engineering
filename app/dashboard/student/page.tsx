"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StudentDashboard from "@/components/StudentDashboard";
import { useAuth } from "@/components/AuthProvider";

export default function StudentDashboardPage() {
  const { session } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard email={session?.user.email} />
    </ProtectedRoute>
  );
}
