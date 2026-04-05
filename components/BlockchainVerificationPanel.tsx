"use client";

import { LoaderCircle, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BlockchainVerificationResult } from "@/lib/blockchain-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type BlockchainVerificationPanelProps = {
  initialHash?: string;
  latestResult?: BlockchainVerificationResult | null;
};

export default function BlockchainVerificationPanel({
  initialHash = "",
  latestResult
}: BlockchainVerificationPanelProps) {
  const [hash, setHash] = useState(initialHash);
  const [result, setResult] = useState<BlockchainVerificationResult | null>(latestResult ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialHash) {
      setHash(initialHash);
    }
  }, [initialHash]);

  useEffect(() => {
    if (latestResult) {
      setResult(latestResult);
    }
  }, [latestResult]);

  const handleVerify = async () => {
    if (!hash.trim()) {
      toast.error("Enter a certificate hash to verify.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/blockchain/verify?hash=${encodeURIComponent(hash.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to verify certificate.");
      }

      const nextResult: BlockchainVerificationResult = {
        hash: hash.trim(),
        verified: Boolean(data.verified),
        transactionHash:
          data.transactionHash ??
          (latestResult?.hash === hash.trim() ? latestResult.transactionHash : null),
        timestamp:
          data.timestamp ??
          (latestResult?.hash === hash.trim() ? latestResult.timestamp : null)
      };

      setResult(nextResult);
      toast.success(nextResult.verified ? "Hash verified successfully." : "Hash checked successfully.");
    } catch (verifyError) {
      const message =
        verifyError instanceof Error ? verifyError.message : "Unable to verify certificate.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6" id="verification">
      <Card className="min-w-0">
        <CardHeader className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <Badge variant="warning">Blockchain Verification</Badge>
            <CardTitle className="text-2xl sm:text-3xl">Search any certificate hash on-chain</CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Verification is public. Storage remains server-only so the private
              key never reaches the browser.
            </p>
          </div>

          <div className="surface-panel rounded-2xl px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Network</p>
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Sepolia via server wallet
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              placeholder="Paste a certificate hash"
              value={hash}
              onChange={(event) => setHash(event.target.value)}
            />
            <Button className="md:min-w-48" disabled={loading} onClick={handleVerify}>
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <SearchCheck className="h-4 w-4" />
                  Verify on blockchain
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="surface-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
              <div className="mt-3">
                {!result ? (
                  <Badge variant="secondary">Awaiting check</Badge>
                ) : result.verified ? (
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="destructive">Not verified</Badge>
                )}
              </div>
            </div>

            <div className="surface-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Transaction hash</p>
              <p className="mt-3 break-all text-sm text-slate-700 dark:text-slate-300">
                {result?.transactionHash ?? "Returned after store confirmation when available"}
              </p>
            </div>

            <div className="surface-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Timestamp</p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                {result?.timestamp
                  ? new Date(result.timestamp).toLocaleString()
                  : "Displayed when the blockchain response includes it"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
