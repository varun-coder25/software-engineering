export type BlockchainVerificationResult = {
  hash: string;
  verified: boolean;
  studentEmail?: string | null;
  transactionHash: string | null;
  blockNumber?: number | null;
  timestamp: string | null;
};
