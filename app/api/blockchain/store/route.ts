import { NextResponse } from "next/server";
import { storeCertificateOnChain } from "@/lib/blockchain";
import { getRequestContext } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { supabase, role } = await getRequestContext(request);
    const body = await request.json();
    const hash = typeof body.hash === "string" ? body.hash.trim() : "";
    const studentEmail =
      typeof body.studentEmail === "string" ? body.studentEmail.trim() : "";
    const certificateId =
      typeof body.certificateId === "string" ? body.certificateId.trim() : "";

    if (role !== "admin") {
      return NextResponse.json({ error: "Only admins can approve certificates." }, { status: 403 });
    }

    if (!hash || !studentEmail) {
      return NextResponse.json(
        { error: "Both hash and studentEmail are required." },
        { status: 400 }
      );
    }

    const result = await storeCertificateOnChain(hash, studentEmail);

    if (certificateId) {
      const { error } = await supabase
        .from("certificates")
        .update({
          status: "VERIFIED",
          tx_hash: result.txHash,
          block_number: result.blockNumber,
          timestamp: result.timestamp
        })
        .eq("id", certificateId);

      if (error) {
        throw error;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to store certificate on blockchain.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
