export const CERTIFICATE_STATUSES = ["PENDING", "VERIFIED", "REJECTED"] as const;

export type CertificateStatus = (typeof CERTIFICATE_STATUSES)[number];

export type CertificateRecord = {
  id: string;
  user_id: string;
  student_email: string | null;
  file_name: string | null;
  file_url: string | null;
  hash: string;
  status: CertificateStatus;
  tx_hash: string | null;
  block_number: number | null;
  timestamp: string | null;
  created_at: string;
  gpa: number | string | null;
  cgpa: number | string | null;
};

export function getStatusBadgeVariant(status: CertificateStatus) {
  switch (status) {
    case "VERIFIED":
      return "success";
    case "REJECTED":
      return "destructive";
    case "PENDING":
    default:
      return "warning";
  }
}
