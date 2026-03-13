"use client";

import CGPACalculator from "@/components/CGPACalculator";
import CertificateUpload from "@/components/CertificateUpload";
import DashboardLayout from "@/components/DashboardLayout";
import GPACalculator from "@/components/GPACalculator";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const { session } = useAuth();

  return (
    <ProtectedRoute>
      <DashboardLayout email={session?.user.email}>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <CertificateUpload />
          <GPACalculator />
        </div>
        <CGPACalculator />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
