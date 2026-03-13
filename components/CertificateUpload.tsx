"use client";

import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";

const supportedTypes = ["application/pdf", "image/jpeg", "image/png"];

type StoredFile = {
  file: File;
  previewUrl: string | null;
};

export default function CertificateUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [storedFile, setStoredFile] = useState<StoredFile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const helperText = useMemo(
    () =>
      storedFile
        ? "File held in browser state. Replace this handler with Supabase Storage upload later."
        : "Drag and drop a PDF, JPG, or PNG certificate here.",
    [storedFile]
  );

  const clearFile = () => {
    if (storedFile?.previewUrl) {
      URL.revokeObjectURL(storedFile.previewUrl);
    }

    setStoredFile(null);
    setMessage("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const setFile = (file: File) => {
    if (!supportedTypes.includes(file.type)) {
      setError("Unsupported file type. Please upload a PDF, JPG, or PNG file.");
      setMessage("");
      return;
    }

    if (storedFile?.previewUrl) {
      URL.revokeObjectURL(storedFile.previewUrl);
    }

    const previewUrl = file.type === "application/pdf" ? null : URL.createObjectURL(file);
    setStoredFile({ file, previewUrl });
    setMessage("Certificate loaded successfully and ready for future storage integration.");
    setError("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <section className="glass-panel p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Module 1
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Certificate Upload
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Upload your academic certificate now and keep the upload logic
            structured for an easy transition to Supabase Storage later.
          </p>
        </div>
      </div>

      <div
        className={`mt-6 rounded-[1.75rem] border-2 border-dashed p-6 transition ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-slate-50/70"
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
          <div className="rounded-full bg-white p-4 shadow-sm">
            <svg
              aria-hidden="true"
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M12 16V4m0 0 4 4m-4-4L8 8M4 16.5v1A2.5 2.5 0 0 0 6.5 20h11A2.5 2.5 0 0 0 20 17.5v-1" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              Drop your certificate here
            </p>
            <p className="mt-2 text-sm text-slate-600">{helperText}</p>
          </div>
          <button className="button-primary" onClick={() => inputRef.current?.click()} type="button">
            Choose file
          </button>
        </div>
      </div>

      {storedFile ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selected file</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-800">
              {storedFile.file.name}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {(storedFile.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button className="button-secondary mt-4" onClick={clearFile} type="button">
              Remove file
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preview</p>
            {storedFile.previewUrl ? (
              <img
                alt="Certificate preview"
                className="mt-3 max-h-72 w-full rounded-2xl object-contain"
                src={storedFile.previewUrl}
              />
            ) : (
              <div className="mt-3 flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center text-sm text-slate-600">
                PDF selected. Preview is intentionally lightweight for now, and
                the upload state is ready to connect to Supabase Storage later.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {message ? (
        <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
