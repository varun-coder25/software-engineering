"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck, ShieldX } from "lucide-react";
import type { CertificateRecord } from "@/lib/certificates";
import { getStatusBadgeVariant } from "@/lib/certificates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CertificatesTableProps = {
  title: string;
  description: string;
  certificates: CertificateRecord[];
  loading?: boolean;
  emptyText: string;
  role?: "student" | "admin" | "employer";
  onApprove?: (certificate: CertificateRecord) => void;
  onReject?: (certificate: CertificateRecord) => void;
  approvingId?: string | null;
  rejectingId?: string | null;
};

export default function CertificatesTable({
  title,
  description,
  certificates,
  loading,
  emptyText,
  role = "student",
  onApprove,
  onReject,
  approvingId,
  rejectingId
}: CertificatesTableProps) {
  const formatScore = (value: number | string | null) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "N/A";
  };

  return (
    <section id="certificates">
      <Card className="border-slate-800 bg-slate-950/88">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
          <p className="text-sm leading-7 text-slate-400">{description}</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="h-20 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                  key={index}
                />
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 px-5 py-8 text-center text-sm text-slate-400">
              {emptyText}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {role === "admin" || role === "employer" ? (
                      <th className="px-4">Student</th>
                    ) : null}
                    <th className="px-4">Certificate</th>
                    <th className="px-4">Hash</th>
                    <th className="px-4">Status</th>
                    <th className="px-4">Blockchain</th>
                    <th className="px-4">Uploaded</th>
                    {role === "employer" ? <th className="px-4">Grades</th> : null}
                    {role === "admin" ? <th className="px-4">Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => (
                    <tr
                      className="rounded-2xl bg-slate-900/70 shadow-sm"
                      key={certificate.id}
                    >
                      {role === "admin" || role === "employer" ? (
                        <td className="rounded-l-2xl px-4 py-4 text-sm text-slate-200">
                          <div className="font-medium">{certificate.student_email ?? "Unknown"}</div>
                          <div className="text-xs text-slate-400">{certificate.user_id}</div>
                        </td>
                      ) : null}
                      <td className="px-4 py-4 text-sm text-slate-200">
                        <div className="font-medium">{certificate.file_name ?? "Certificate record"}</div>
                        {certificate.file_url ? (
                          <Link
                            className="inline-flex items-center gap-2 text-xs text-sky-300 hover:text-sky-200"
                            href={certificate.file_url}
                            target="_blank"
                          >
                            Open uploaded file <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <div className="text-xs text-slate-400">No storage file URL saved</div>
                        )}
                      </td>
                      <td className="max-w-[220px] px-4 py-4 text-xs text-slate-300">
                        <div className="break-all font-mono">{certificate.hash}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={getStatusBadgeVariant(certificate.status)}>
                          {certificate.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {certificate.status === "VERIFIED" && certificate.tx_hash ? (
                          <div className="space-y-2">
                            <Badge variant="success">Verified on Blockchain</Badge>
                            <div className="flex flex-col gap-2">
                              <Link
                                className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"
                                href={`https://sepolia.etherscan.io/tx/${certificate.tx_hash}`}
                                target="_blank"
                              >
                                Transaction <ExternalLink className="h-3 w-3" />
                              </Link>
                              {certificate.block_number ? (
                                <Link
                                  className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"
                                  href={`https://sepolia.etherscan.io/block/${certificate.block_number}`}
                                  target="_blank"
                                >
                                  Block {certificate.block_number} <ExternalLink className="h-3 w-3" />
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        ) : certificate.status === "REJECTED" ? (
                          <div className="inline-flex items-center gap-2 text-rose-300">
                            <ShieldX className="h-4 w-4" />
                            Rejected
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-amber-300">
                            <ShieldCheck className="h-4 w-4" />
                            Awaiting admin action
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {new Date(certificate.created_at).toLocaleDateString()}
                      </td>
                      {role === "employer" ? (
                        <td className="px-4 py-4 text-sm text-slate-300">
                          <div>GPA: {formatScore(certificate.gpa)}</div>
                          <div>CGPA: {formatScore(certificate.cgpa)}</div>
                        </td>
                      ) : null}
                      {role === "admin" ? (
                        <td className="rounded-r-2xl px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              disabled={
                                certificate.status === "VERIFIED" ||
                                approvingId === certificate.id
                              }
                              size="sm"
                              onClick={() => onApprove?.(certificate)}
                            >
                              {approvingId === certificate.id ? "Approving..." : "Approve"}
                            </Button>
                            <Button
                              disabled={
                                certificate.status === "REJECTED" ||
                                rejectingId === certificate.id
                              }
                              size="sm"
                              variant="outline"
                              onClick={() => onReject?.(certificate)}
                            >
                              {rejectingId === certificate.id ? "Rejecting..." : "Reject"}
                            </Button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
