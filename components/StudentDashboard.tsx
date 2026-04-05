"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import BlockchainVerificationPanel from "@/components/BlockchainVerificationPanel";
import CertificatesTable from "@/components/CertificatesTable";
import CGPACalculator from "@/components/CGPACalculator";
import CertificateUpload from "@/components/CertificateUpload";
import DashboardLayout from "@/components/DashboardLayout";
import GPACalculator from "@/components/GPACalculator";
import LoadingGrid from "@/components/LoadingGrid";
import type { CertificateRecord } from "@/lib/certificates";
import { authorizedFetch } from "@/lib/client-api";

export default function StudentDashboard({ email }: { email?: string }) {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestHash, setLatestHash] = useState("");
  const [gpa, setGpa] = useState(0);
  const [cgpa, setCgpa] = useState(0);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response = await authorizedFetch("/api/certificates");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load certificates.");
        }

        setCertificates(data.certificates ?? []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load certificates.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const stats = useMemo(() => {
    const pending = certificates.filter((certificate) => certificate.status === "PENDING").length;
    const verified = certificates.filter((certificate) => certificate.status === "VERIFIED").length;
    const rejected = certificates.filter((certificate) => certificate.status === "REJECTED").length;

    return { pending, verified, rejected };
  }, [certificates]);

  return (
    <DashboardLayout
      email={email}
      eyebrow="Student Workspace"
      title="Submit academic records and track verification progress."
      description="Uploads now create pending verification requests. GPA and CGPA stay available while the institution controls approval and blockchain anchoring."
      navItems={[
        { href: "#overview", label: "Dashboard" },
        { href: "#upload", label: "Upload Certificate" },
        { href: "#certificates", label: "Certificates" },
        { href: "#gpa", label: "GPA Calculator" },
        { href: "#cgpa", label: "CGPA Calculator" },
        { href: "#verification", label: "Blockchain Verification" }
      ]}
    >
      {loading ? <LoadingGrid /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-panel rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Pending</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">{stats.pending}</p>
          <p className="mt-2 text-sm text-slate-500">Awaiting institutional review.</p>
        </div>
        <div className="surface-panel rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Verified</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">{stats.verified}</p>
          <p className="mt-2 text-sm text-slate-500">Approved and ready to prove.</p>
        </div>
        <div className="surface-panel rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">Rejected</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">{stats.rejected}</p>
          <p className="mt-2 text-sm text-slate-500">Needs correction before approval.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <CertificateUpload
          currentCgpa={cgpa}
          currentGpa={gpa}
          studentEmail={email}
          onHashReady={setLatestHash}
          onCreated={(certificate) => setCertificates((current) => [certificate, ...current])}
        />
        <GPACalculator onValueChange={setGpa} />
      </div>
      <CGPACalculator onValueChange={setCgpa} />
      <CertificatesTable
        certificates={certificates}
        description="Every submission keeps its verification status and blockchain state in one place."
        emptyText="No certificates submitted yet."
        loading={loading}
        title="My Certificates"
      />
      <BlockchainVerificationPanel initialHash={latestHash} />
    </DashboardLayout>
  );
}
