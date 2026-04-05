import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase, role } = await getRequestContext(request);

    if (role !== "admin") {
      return NextResponse.json({ error: "Only admins can update certificate status." }, { status: 403 });
    }

    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim().toUpperCase() : "";

    if (!["PENDING", "VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid certificate status." }, { status: 400 });
    }

    const updatePayload =
      status === "REJECTED"
        ? {
            status,
            tx_hash: null,
            block_number: null,
            timestamp: null
          }
        : { status };

    const { data, error } = await supabase
      .from("certificates")
      .update(updatePayload)
      .eq("id", id)
      .select(
        "id,user_id,student_email,file_name,file_url,hash,status,tx_hash,block_number,timestamp,created_at,gpa,cgpa"
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ certificate: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update certificate status.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
