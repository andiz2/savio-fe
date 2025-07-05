import { maxUint256, erc20Abi, parseErc6492Signature, getContract, encodePacked } from "viem";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

// Circle Paymaster Configuration for Sepolia
export const PAYMASTER_CONFIG = {
  // Circle Paymaster v0.8 address for Ethereum Sepolia
  paymasterAddress: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966" as `0x${string}`,
  
  // USDC address on Sepolia
  usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as `0x${string}`,
  
  // Chain configuration - Circle Paymaster v0.8 is available on Sepolia
  chain: sepolia,
  
  // Gas limits for paymaster
  paymasterVerificationGasLimit: 200000n,
  paymasterPostOpGasLimit: 15000n,
};

// Circle Paymaster v0.8 is available on Sepolia
// Circle Paymaster v0.8 addresses from https://developers.circle.com/stablecoins/paymaster-addresses:
// - Ethereum Sepolia: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
// - Arbitrum Sepolia: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
// - Base Sepolia: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
// - Optimism Sepolia: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
// - Polygon Amoy: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
// - Avalanche Fuji: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
// - Unichain Sepolia: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966

// EIP-2612 Permit ABI (extends ERC20 ABI)
export const eip2612Abi = [
  ...erc20Abi,
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

// EIP-2612 Permit data structure
export async function eip2612Permit({
  token,
  chain,
  ownerAddress,
  spenderAddress,
  value,
}: {
  token: any;
  chain: any;
  ownerAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  value: bigint;
}) {
  return {
    types: {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Permit",
    domain: {
      name: await token.read.name(),
      version: await token.read.version(),
      chainId: chain.id,
      verifyingContract: token.address,
    },
    message: {
      owner: ownerAddress,
      spender: spenderAddress,
      value,
      nonce: await token.read.nonces([ownerAddress]),
      // The paymaster cannot access block.timestamp due to 4337 opcode
      // restrictions, so the deadline must be MAX_UINT256.
      deadline: maxUint256,
    },
  };
}

// Sign permit for USDC allowance
export async function signPermit({
  tokenAddress,
  client,
  account,
  spenderAddress,
  permitAmount,
}: {
  tokenAddress: `0x${string}`;
  client: any;
  account: any;
  spenderAddress: `0x${string}`;
  permitAmount: bigint;
}) {
  const token = getContract({
    client,
    address: tokenAddress,
    abi: eip2612Abi,
  });
  
  const permitData = await eip2612Permit({
    token,
    chain: client.chain,
    ownerAddress: account.address,
    spenderAddress,
    value: permitAmount,
  });

  const wrappedPermitSignature = await account.signTypedData(permitData);

  const isValid = await client.verifyTypedData({
    ...permitData,
    address: account.address,
    signature: wrappedPermitSignature,
  });

  if (!isValid) {
    throw new Error(
      `Invalid permit signature for ${account.address}: ${wrappedPermitSignature}`,
    );
  }

  const { signature } = parseErc6492Signature(wrappedPermitSignature);
  return signature;
}

// Circle Paymaster implementation
export class CirclePaymaster {
  private client: any;
  private usdcAddress: `0x${string}`;
  private paymasterAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({ 
      chain: PAYMASTER_CONFIG.chain, 
      transport: http() 
    });
    this.usdcAddress = PAYMASTER_CONFIG.usdcAddress;
    this.paymasterAddress = PAYMASTER_CONFIG.paymasterAddress;
  }

  async getPaymasterData(account: any, permitAmount: bigint = 10000000n) {
    try {
      const permitSignature = await signPermit({
        tokenAddress: this.usdcAddress,
        account,
        client: this.client,
        spenderAddress: this.paymasterAddress,
        permitAmount: permitAmount,
      });

      const paymasterData = encodePacked(
        ["uint8", "address", "uint256", "bytes"],
        [0, this.usdcAddress, permitAmount, permitSignature],
      );

      return {
        paymaster: this.paymasterAddress,
        paymasterData,
        paymasterVerificationGasLimit: PAYMASTER_CONFIG.paymasterVerificationGasLimit,
        paymasterPostOpGasLimit: PAYMASTER_CONFIG.paymasterPostOpGasLimit,
        isFinal: true,
      };
    } catch (error) {
      console.error("Error creating paymaster data:", error);
      throw error;
    }
  }

  // Check USDC balance of smart wallet
  async checkUsdcBalance(walletAddress: `0x${string}`) {
    const balance = await this.client.readContract({
      address: this.usdcAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [walletAddress],
    });
    return balance;
  }

  // Get USDC balance in human readable format
  async getUsdcBalanceFormatted(walletAddress: `0x${string}`) {
    const balance = await this.checkUsdcBalance(walletAddress);
    // USDC has 6 decimals
    return Number(balance) / 1000000;
  }
} 