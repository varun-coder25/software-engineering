"use client";

import {
  CheckCircle2,
  FileBadge2,
  LoaderCircle,
  Send,
  Trash2,
  UploadCloud
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent
} from "react";
import { toast } from "sonner";
import { authorizedFetch } from "@/lib/client-api";
import { type CertificateRecord, getStatusBadgeVariant } from "@/lib/certificates";
import { hashFile } from "@/lib/hash-file";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supportedTypes = ["application/pdf", "image/jpeg", "image/png"];

type StoredFile = {
  file: File;
  previewUrl: string | null;
};

type CertificateUploadProps = {
  studentEmail?: string;
  currentGpa: number;
  currentCgpa: number;
  onHashReady: (hash: string) => void;
  onCreated: (certificate: CertificateRecord) => void;
};

export default function CertificateUpload({
  studentEmail,
  currentGpa,
  currentCgpa,
  onHashReady,
  onCreated
}: CertificateUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [storedFile, setStoredFile] = useState<StoredFile | null>(null);
  const [fileHash, setFileHash] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<CertificateRecord["status"] | null>(null);

  useEffect(() => {
    return () => {
      if (storedFile?.previewUrl) {
        URL.revokeObjectURL(storedFile.previewUrl);
      }
    };
  }, [storedFile]);

  const clearFile = () => {
    if (storedFile?.previewUrl) {
      URL.revokeObjectURL(storedFile.previewUrl);
    }

    setStoredFile(null);
    setFileHash("");
    setMessage("");
    setError("");
    setPendingStatus(null);
    onHashReady("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const generateHash = async (file: File) => {
    setIsHashing(true);

    try {
      const nextHash = await hashFile(file);
      setFileHash(nextHash);
      onHashReady(nextHash);
      toast.success("Certificate hash generated successfully.");
    } catch (hashError) {
      const nextError =
        hashError instanceof Error ? hashError.message : "Unable to hash this file.";
      setError(nextError);
      toast.error(nextError);
    } finally {
      setIsHashing(false);
    }
  };

  const setFile = async (file: File) => {
    if (!supportedTypes.includes(file.type)) {
      const nextError = "Unsupported file type. Please upload a PDF, JPG, or PNG file.";
      setError(nextError);
      setMessage("");
      toast.error(nextError);
      return;
    }

    if (storedFile?.previewUrl) {
      URL.revokeObjectURL(storedFile.previewUrl);
    }

    const previewUrl = file.type === "application/pdf" ? null : URL.createObjectURL(file);
    setStoredFile({ file, previewUrl });
    setMessage("Certificate prepared locally. Hashing now for verification.");
    setError("");
    setPendingStatus(null);
    await generateHash(file);
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await setFile(file);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await setFile(file);
    }
  };

  const submitCertificate = async () => {
    if (!fileHash || !storedFile) {
      toast.error("Select a file and wait for the hash to finish generating.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await authorizedFetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: storedFile.file.name,
          hash: fileHash,
          gpa: Number.isFinite(currentGpa) ? currentGpa : null,
          cgpa: Number.isFinite(currentCgpa) ? currentCgpa : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create certificate record.");
      }

      setPendingStatus(data.certificate.status);
      setMessage("Certificate submitted successfully. Waiting for admin review.");
      toast.success("Certificate submitted for institutional verification.");
      onCreated(data.certificate);
    } catch (submitError) {
      const nextError =
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit certificate.";
      setError(nextError);
      toast.error(nextError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6" id="upload">
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <Badge variant="default">Upload Certificate</Badge>
            <CardTitle className="text-2xl sm:text-3xl">
              Upload now, route through admin verification
            </CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Student uploads create a pending record. Admin approval later
              stores the certificate hash on-chain and marks the submission as
              verified.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[360px]">
            <div className="surface-panel rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Student email
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                {studentEmail ?? "Unavailable"}
              </p>
            </div>
            <div className="surface-panel rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Submission status
              </p>
              <div className="mt-2">
                <Badge variant={getStatusBadgeVariant(pendingStatus ?? "PENDING")}>
                  {pendingStatus ?? "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            className={`rounded-[1.75rem] border-2 border-dashed p-6 transition-all ${
              isDragging
                ? "border-sky-400 bg-sky-50"
                : "border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/60"
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              id="certificate-upload"
              type="file"
              onChange={handleInputChange}
            />

            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                {isHashing ? (
                  <LoaderCircle className="h-7 w-7 animate-spin" />
                ) : (
                  <UploadCloud className="h-7 w-7" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-950 dark:text-white">
                  Drop your certificate or choose a file
                </p>
                <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                  PDF, JPG, and PNG are supported. The app hashes the file
                  locally before creating a pending verification record.
                </p>
              </div>
              <Button onClick={() => inputRef.current?.click()} type="button">
                Choose file
              </Button>
            </div>
          </div>

          {storedFile ? (
            <div className="grid gap-4 2xl:grid-cols-[0.95fr_1.05fr]">
              <div className="surface-panel rounded-[1.75rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Selected file
                    </p>
                    <p className="mt-2 break-all text-base font-semibold text-slate-900 dark:text-white">
                      {storedFile.file.name}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {(storedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <Button size="icon" variant="ghost" onClick={clearFile} type="button">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-4 text-slate-100 shadow-[0_20px_40px_-34px_rgba(2,6,23,0.9)] dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
                      SHA-256 hash
                    </p>
                    <p className="mt-3 break-all font-mono text-xs leading-6 sm:text-sm">
                      {fileHash || "Hashing file..."}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="surface-panel rounded-2xl px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        GPA Snapshot
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {currentGpa.toFixed(2)}
                      </p>
                    </div>
                    <div className="surface-panel rounded-2xl px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        CGPA Snapshot
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {currentCgpa.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <Button disabled={!fileHash || isSubmitting} onClick={submitCertificate}>
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit for verification
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="surface-panel min-w-0 rounded-[1.75rem] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preview</p>
                {storedFile.previewUrl ? (
                  <img
                    alt="Certificate preview"
                    className="mt-4 max-h-80 w-full rounded-2xl object-contain"
                    src={storedFile.previewUrl}
                  />
                ) : (
                  <div className="mt-4 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                    PDF selected. Preview remains lightweight until cloud storage
                    is connected.
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="surface-panel rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <FileBadge2 className="h-5 w-5 text-sky-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current hash</p>
                  <p className="mt-1 break-all text-sm text-slate-700 dark:text-slate-300">
                    {fileHash || "Generated after file selection"}
                  </p>
                </div>
              </div>
            </div>
            <div className="surface-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Review flow</p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                Student upload {"->"} Admin review {"->"} Blockchain store {"->"} Verified employer view
              </p>
            </div>
            <div className="surface-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Upload state</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                {message || "Awaiting file"}
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
