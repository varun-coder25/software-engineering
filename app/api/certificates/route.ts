import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/server-auth";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

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

    const body = await request.json();
    const hash = typeof body.hash === "string" ? body.hash.trim() : "";
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : null;
    const gpa = typeof body.gpa === "number" ? body.gpa : null;
    const cgpa = typeof body.cgpa === "number" ? body.cgpa : null;

    if (!hash) {
      return NextResponse.json({ error: "Certificate hash is required." }, { status: 400 });
    }

    const payload = {
      user_id: user.id,
      student_email: user.email ?? null,
      file_name: fileName,
      file_url: null,
      hash,
      status: "PENDING",
      tx_hash: null,
      block_number: null,
      timestamp: null,
      gpa,
      cgpa
    };

    const adminSupabase = createSupabaseServiceClient();

    const { data, error } = await adminSupabase
      .from("certificates")
      .insert(payload)
      .select(
        "id,user_id,student_email,file_name,file_url,hash,status,tx_hash,block_number,timestamp,created_at,gpa,cgpa"
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ certificate: data });
  } catch (error) {
    const message = getErrorMessage(error, "Failed to create certificate.");
    console.error("POST /api/certificates failed", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
