import { baseSepolia } from "viem/chains";

// Smart Wallet Factory Configuration
export const SMART_WALLET_CONFIG = {
  // Your deployed factory contract address (REQUIRED)
  factoryAddress: "0x5b86fAcC8c1350D970f25DE9c481CDDA91d1C818" as `0x${string}`,
  
  // Chain configuration
  chain: baseSepolia,
  
  // Entry Point Address (REQUIRED for ERC-4337)
  entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as `0x${string}`,
  
  // Bundler configuration for Base Sepolia
  bundlerUrl: "https://bundler.biconomy.io/api/v3/84532/bundler_3ZWviMnNXD7h9URmfW85jDQm",
  
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
  // Use Privy's default smart wallets (Biconomy)
  return {
    embeddedWallets: {
      createOnLogin: "all-users" as const,
    },
  };
}; 