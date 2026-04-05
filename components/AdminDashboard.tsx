"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CertificatesTable from "@/components/CertificatesTable";
import DashboardLayout from "@/components/DashboardLayout";
import LoadingGrid from "@/components/LoadingGrid";
import type { CertificateRecord } from "@/lib/certificates";
import { authorizedFetch } from "@/lib/client-api";

export default function AdminDashboard({ email }: { email?: string }) {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

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

  const metrics = useMemo(() => {
    const pending = certificates.filter((certificate) => certificate.status === "PENDING").length;
    const verified = certificates.filter((certificate) => certificate.status === "VERIFIED").length;
    const rejected = certificates.filter((certificate) => certificate.status === "REJECTED").length;

    return { pending, verified, rejected };
  }, [certificates]);

  const approveCertificate = async (certificate: CertificateRecord) => {
    setApprovingId(certificate.id);

    try {
      const response = await authorizedFetch("/api/blockchain/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          certificateId: certificate.id,
          hash: certificate.hash,
          studentEmail: certificate.student_email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to approve certificate.");
      }

      setCertificates((current) =>
        current.map((item) =>
          item.id === certificate.id
            ? {
                ...item,
                status: "VERIFIED",
                tx_hash: data.transactionHash,
                block_number: data.blockNumber,
                timestamp: data.timestamp
              }
            : item
        )
      );
      toast.success("Certificate approved and stored on blockchain.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to approve certificate.";
      toast.error(message);
    } finally {
      setApprovingId(null);
    }
  };

  const rejectCertificate = async (certificate: CertificateRecord) => {
    setRejectingId(certificate.id);

    try {
      const response = await authorizedFetch(`/api/certificates/${certificate.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "REJECTED"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to reject certificate.");
      }

      setCertificates((current) =>
        current.map((item) => (item.id === certificate.id ? data.certificate : item))
      );
      toast.success("Certificate rejected.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reject certificate.";
      toast.error(message);
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <DashboardLayout
      email={email}
      eyebrow="Admin Control Room"
      title="Review student submissions and approve institution-backed records."
      description="Approvals are the only trigger that writes certificate hashes on-chain. Rejections keep the academic workflow explicit and auditable."
      navbarEyebrow="Admin Control Room"
      navbarTitle="Institution Review and Blockchain Approval Portal"
      sidebarEyebrow="Admin Workspace"
      sidebarTitle="Review, approve, and finalize verified records."
      sidebarDescription="Institution staff control the approval queue, rejection flow, and blockchain write boundary from one administrative console."
      navItems={[
        { href: "#overview", label: "Dashboard" },
        { href: "#certificates", label: "Certificates" }
      ]}
      highlights={[
        {
          label: "Approval Queue",
          title: "Institution review first",
          description:
            "Every student upload lands here as pending so the college authority controls the trust boundary before any blockchain write occurs."
        },
        {
          label: "Blockchain Finalization",
          title: "Approve -> store -> verify",
          description:
            "Approvals trigger a server-side wallet transaction, persist Sepolia metadata, and convert the certificate into an employer-visible verified record."
        }
      ]}
    >
      {loading ? <LoadingGrid /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-panel rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Pending approvals</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">{metrics.pending}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Queued for institutional review.</p>
        </div>
        <div className="surface-panel rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Verified records</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">{metrics.verified}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Anchored and visible to employers.</p>
        </div>
        <div className="surface-panel rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">Rejected records</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">{metrics.rejected}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Returned for correction or follow-up.</p>
        </div>
      </div>

      <CertificatesTable
        approvingId={approvingId}
        certificates={certificates}
        description="Approve to store the hash on Sepolia and mark the record as institution-verified."
        emptyText="No certificates available for review."
        loading={loading}
        onApprove={approveCertificate}
        onReject={rejectCertificate}
        rejectingId={rejectingId}
        role="admin"
        title="All Student Certificates"
      />
    </DashboardLayout>
  );
}
