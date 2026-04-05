import "server-only";
import { Contract, JsonRpcProvider, Wallet } from "ethers";

export const CONTRACT_ADDRESS = "0x8C5FC6a43Ab594883571CE6C61d73D5FeB87D70a";

export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "hash",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "string",
        name: "studentAddress",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "CertificateStored",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "_studentAddress",
        type: "string"
      }
    ],
    name: "storeCertificateHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32"
      }
    ],
    name: "getCertificate",
    outputs: [
      {
        internalType: "string",
        name: "studentAddress",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32"
      }
    ],
    name: "verifyCertificate",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

function getRequiredEnv(name: "PRIVATE_KEY" | "RPC_URL") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getBlockchainClients() {
  const provider = new JsonRpcProvider(getRequiredEnv("RPC_URL"));
  const wallet = new Wallet(getRequiredEnv("PRIVATE_KEY"), provider);
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  return { provider, wallet, contract };
}

function normalizeHash(hash: string) {
  const trimmedHash = hash.trim().toLowerCase();
  const normalized = trimmedHash.startsWith("0x") ? trimmedHash : `0x${trimmedHash}`;

  if (!/^0x[a-f0-9]{64}$/.test(normalized)) {
    throw new Error("Certificate hash must be a valid SHA-256 hex string.");
  }

  return normalized;
}

export async function storeCertificateOnChain(hash: string, studentEmail: string) {
  const { provider, contract } = getBlockchainClients();
  const normalizedHash = normalizeHash(hash);
  const tx = await contract.storeCertificateHash(normalizedHash, studentEmail);
  const receipt = await tx.wait();

  if (!receipt) {
    throw new Error("Transaction receipt was not returned.");
  }

  const block = await provider.getBlock(receipt.blockNumber);

  return {
    success: true,
    hash: normalizedHash,
    blockNumber: receipt.blockNumber,
    txHash: receipt.hash,
    transactionHash: receipt.hash,
    timestamp: block?.timestamp ? new Date(block.timestamp * 1000).toISOString() : null
  };
}

export async function verifyCertificateOnChain(hash: string) {
  const { contract } = getBlockchainClients();
  const normalizedHash = normalizeHash(hash);
  const verified = await contract.verifyCertificate(normalizedHash);
  const certificate = await contract.getCertificate(normalizedHash);

  return {
    hash: normalizedHash,
    verified: Boolean(verified),
    studentEmail: certificate.studentAddress || null,
    transactionHash: null as string | null,
    blockNumber: null as number | null,
    timestamp: certificate.exists
      ? new Date(Number(certificate.timestamp) * 1000).toISOString()
      : null
  };
}
