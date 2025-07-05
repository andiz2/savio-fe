import { sepolia } from "viem/chains";

// Smart Wallet Factory Configuration
export const SMART_WALLET_CONFIG = {
  // Your deployed factory contract address (REQUIRED)
  factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
  
  // Chain configuration
  chain: sepolia,
  
  // Gas configuration
  gasConfig: {
    maxFeePerGas: "5000000000", // 5 gwei
    maxPriorityFeePerGas: "2000000000", // 2 gwei
  },
};

// Factory contract ABI for creating smart wallets
export const FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "createAccount",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "getAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Smart wallet implementation ABI
export const SMART_WALLET_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Helper function to create smart wallet configuration for Privy
export const createSmartWalletConfig = () => {
  // Check if factory address is provided
  if (!SMART_WALLET_CONFIG.factoryAddress) {
    console.warn("⚠️ NEXT_PUBLIC_FACTORY_ADDRESS not set. Using default Biconomy smart wallets.");
    return {
      embeddedWallets: {
        createOnLogin: "all-users" as const,
      },
    };
  }

  console.log("✅ Using custom factory address:", SMART_WALLET_CONFIG.factoryAddress);
  return {
    embeddedWallets: {
      createOnLogin: "all-users" as const,
      factoryAddress: SMART_WALLET_CONFIG.factoryAddress,
    },
  };
}; 