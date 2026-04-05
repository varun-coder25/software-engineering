import { NextResponse } from "next/server";
import { verifyCertificateOnChain } from "@/lib/blockchain";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("hash")?.trim() ?? "";

    if (!hash) {
      return NextResponse.json({ error: "Hash is required." }, { status: 400 });
    }

    const result = await verifyCertificateOnChain(hash);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to verify certificate hash.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
