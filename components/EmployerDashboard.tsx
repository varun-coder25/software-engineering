"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CertificatesTable from "@/components/CertificatesTable";
import DashboardLayout from "@/components/DashboardLayout";
import LoadingGrid from "@/components/LoadingGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CertificateRecord } from "@/lib/certificates";
import { authorizedFetch } from "@/lib/client-api";

export default function EmployerDashboard({ email }: { email?: string }) {
  const [query, setQuery] = useState("");
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCertificates = async (value = "") => {
    setLoading(true);

    try {
      const suffix = value ? `?query=${encodeURIComponent(value)}` : "";
      const response = await authorizedFetch(`/api/certificates${suffix}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load verified certificates.");
      }

      setCertificates(data.certificates ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load employer certificate results.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  return (
    <DashboardLayout
      email={email}
      eyebrow="Employer Validation"
      title="Search students and verify institution-approved academic proof."
      description="Employers only see approved records, including institution verification status and clickable Sepolia blockchain proof."
      navItems={[
        { href: "#overview", label: "Dashboard" },
        { href: "#certificates", label: "Certificates" }
      ]}
      highlights={[
        {
          label: "Institution Trust",
          title: "Verified by institution",
          description:
            "Only approved academic records appear here, so employer validation starts with institutional confirmation instead of self-claimed uploads."
        },
        {
          label: "Blockchain Proof",
          title: "Sepolia evidence in one click",
          description:
            "Each verified certificate can expose transaction and block links, giving recruiters a direct blockchain proof path without special tooling."
        }
      ]}
    >
      {loading ? <LoadingGrid columns={2} /> : null}

      <div className="surface-panel rounded-3xl p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            placeholder="Search by student email, file name, or hash"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button className="md:min-w-44" onClick={() => loadCertificates(query)}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <CertificatesTable
        certificates={certificates}
        description="Only institution-verified records are visible here, with direct links to Sepolia transaction and block proof."
        emptyText="No verified certificates matched your search."
        loading={loading}
        role="employer"
        title="Verified Student Certificates"
      />
    </DashboardLayout>
  );
}
