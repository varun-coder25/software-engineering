import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/server-auth";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
const STORAGE_BUCKET = "certificates";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const maybeMessage = "message" in error ? error.message : undefined;
    const maybeDetails = "details" in error ? error.details : undefined;
    const maybeHint = "hint" in error ? error.hint : undefined;
    const maybeCode = "code" in error ? error.code : undefined;

    const parts = [maybeMessage, maybeDetails, maybeHint, maybeCode].filter(
      (value): value is string => typeof value === "string" && value.trim().length > 0
    );

    if (parts.length > 0) {
      return parts.join(" | ");
    }
  }

  return fallback;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

async function ensureStorageBucket() {
  const adminSupabase = createSupabaseServiceClient();
  const { error } = await adminSupabase.storage.createBucket(STORAGE_BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim();
    const { supabase, user, role } = await getRequestContext(request);

    let builder = supabase
      .from("certificates")
      .select(
        "id,user_id,student_email,file_name,file_url,hash,status,tx_hash,block_number,timestamp,created_at,gpa,cgpa"
      )
      .order("created_at", { ascending: false });

    if (role === "student") {
      builder = builder.eq("user_id", user.id);
    }

    if (role === "employer") {
      builder = builder.eq("status", "VERIFIED");

      if (query) {
        builder = builder.or(
          `student_email.ilike.%${query}%,file_name.ilike.%${query}%,hash.ilike.%${query}%`
        );
      }
    }

    const { data, error } = await builder;

    if (error) {
      throw error;
    }

    return NextResponse.json({ certificates: data ?? [] });
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch certificates.");
    console.error("GET /api/certificates failed", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user, role } = await getRequestContext(request);

    if (role !== "student") {
      return NextResponse.json({ error: "Only students can create certificates." }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    let hash = "";
    let fileName: string | null = null;
    let gpa: number | null = null;
    let cgpa: number | null = null;
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      hash = typeof formData.get("hash") === "string" ? String(formData.get("hash")).trim() : "";
      fileName =
        typeof formData.get("fileName") === "string" ? String(formData.get("fileName")).trim() : null;
      gpa =
        typeof formData.get("gpa") === "string" && formData.get("gpa") !== ""
          ? Number(formData.get("gpa"))
          : null;
      cgpa =
        typeof formData.get("cgpa") === "string" && formData.get("cgpa") !== ""
          ? Number(formData.get("cgpa"))
          : null;

      const uploadedFile = formData.get("file");
      file = uploadedFile instanceof File ? uploadedFile : null;
    } else {
      const body = await request.json();
      hash = typeof body.hash === "string" ? body.hash.trim() : "";
      fileName = typeof body.fileName === "string" ? body.fileName.trim() : null;
      gpa = typeof body.gpa === "number" ? body.gpa : null;
      cgpa = typeof body.cgpa === "number" ? body.cgpa : null;
    }

    if (!hash) {
      return NextResponse.json({ error: "Certificate hash is required." }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "Certificate file is required." }, { status: 400 });
    }

    const adminSupabase = createSupabaseServiceClient();
    await ensureStorageBucket();

    const safeFileName = sanitizeFileName(fileName ?? file.name ?? "certificate");
    const storagePath = `${user.id}/${Date.now()}-${safeFileName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminSupabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        cacheControl: "3600",
        contentType: file.type || undefined,
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl }
    } = adminSupabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    const payload = {
      user_id: user.id,
      student_email: user.email ?? null,
      file_name: fileName ?? file.name ?? null,
      file_url: publicUrl,
      hash,
      status: "PENDING",
      tx_hash: null,
      block_number: null,
      timestamp: null,
      gpa,
      cgpa
    };

    const { data, error } = await adminSupabase
      .from("certificates")
      .insert(payload)
      .select(
        "id,user_id,student_email,file_name,file_url,hash,status,tx_hash,block_number,timestamp,created_at,gpa,cgpa"
      )
      .single();

    if (error) {
      await adminSupabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
      throw error;
    }

    return NextResponse.json({ certificate: data });
  } catch (error) {
    const message = getErrorMessage(error, "Failed to create certificate.");
    console.error("POST /api/certificates failed", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
