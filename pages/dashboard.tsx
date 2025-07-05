import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { encodeFunctionData, erc721Abi } from "viem";
import { mintAbi } from "../components/lib/abis/mint";
import PaymasterBalance from "../components/PaymasterBalance";
import { CirclePaymaster } from "../components/lib/paymaster";

const NFT_CONTRACT_ADDRESS =
  "0x828D1563dfFA00003877114a6940C669C57ec77d" as const;

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { client: smartWalletClient } = useSmartWallets();
  const [usePaymaster, setUsePaymaster] = useState(false);
  const [paymasterLoading, setPaymasterLoading] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const onMint = async () => {
    if (!smartWalletClient) return;

    try {
      if (usePaymaster) {
        setPaymasterLoading(true);
        const paymaster = new CirclePaymaster();
        const paymasterData = await paymaster.getPaymasterData(
          smartWalletClient.account,
          10000000n // 10 USDC
        );

        // For now, just log the paymaster data since Privy's API might not support it directly
        console.log("🔧 Paymaster Data:", paymasterData);
        console.log("⚠️ Paymaster integration requires custom implementation");
        
        // Fall back to regular transaction
        await smartWalletClient.sendTransaction({
          to: NFT_CONTRACT_ADDRESS,
          data: encodeFunctionData({
            abi: mintAbi,
            functionName: "mint",
            args: [smartWalletClient.account.address],
          }),
        });
      } else {
        await smartWalletClient.sendTransaction({
          to: NFT_CONTRACT_ADDRESS,
          data: encodeFunctionData({
            abi: mintAbi,
            functionName: "mint",
            args: [smartWalletClient.account.address],
          }),
        });
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setPaymasterLoading(false);
    }
  };

  const onSetApprovalForAll = () => {
    if (!smartWalletClient) return;

    smartWalletClient.sendTransaction({
      to: NFT_CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: erc721Abi,
        functionName: "setApprovalForAll",
        args: [smartWalletClient.account.address, true],
      }),
    });
  };

  const onBatchTransaction = () => {
    if (!smartWalletClient) return;

    smartWalletClient.sendTransaction({
      account: smartWalletClient.account,
      calls: [
        {
          to: NFT_CONTRACT_ADDRESS,
          data: encodeFunctionData({
            abi: mintAbi,
            functionName: "mint",
            args: [smartWalletClient.account.address],
          }),
        },
        {
          to: NFT_CONTRACT_ADDRESS,
          data: encodeFunctionData({
            abi: erc721Abi,
            functionName: "setApprovalForAll",
            args: [smartWalletClient.account.address, true],
          }),
        },
      ],
    });
  };

  return (
    <>
      <Head>
        <title>Privy Smart Wallets Demo</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {ready && authenticated && smartWalletClient ? (
          <>
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-semibold">
                Privy Smart Wallets Demo
              </h1>
              <button
                onClick={logout}
                className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
              >
                Logout
              </button>
            </div>
            <div className="mt-12 flex gap-4 flex-wrap items-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={usePaymaster}
                    onChange={(e) => setUsePaymaster(e.target.checked)}
                    className="mr-2"
                  />
                  Use Paymaster (USDC gas)
                </label>
              </div>
              
              <button
                onClick={onMint}
                disabled={paymasterLoading}
                className={`text-sm py-2 px-4 rounded-md text-white border-none ${
                  paymasterLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-violet-600 hover:bg-violet-700'
                }`}
              >
                {paymasterLoading ? 'Processing...' : 'Mint NFT'}
              </button>
              <button
                onClick={onSetApprovalForAll}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Approve
              </button>
              <button
                onClick={onBatchTransaction}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Batch Transaction
              </button>
              <button
                onClick={() => {
                  console.log("🔍 Smart Wallet Debug Info:");
                  console.log("Factory Address:", process.env.NEXT_PUBLIC_FACTORY_ADDRESS);
                  console.log("User Smart Wallet:", user?.smartWallet);
                  console.log("Smart Wallet Client:", smartWalletClient);
                  console.log("Smart Wallet Address:", smartWalletClient?.account?.address);
                  console.log("Chain ID:", smartWalletClient?.chain?.id);
                  console.log("Network:", smartWalletClient?.chain?.name);
                  
                  // Check if wallet exists on blockchain
                  if (smartWalletClient?.account?.address) {
                    console.log("🔗 Check wallet on Sepolia:");
                    console.log(`https://sepolia.etherscan.io/address/${smartWalletClient.account.address}`);
                  }
                }}
                className="text-sm bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-md text-white border-none"
              >
                Debug Smart Wallet
              </button>
            </div>

            <div className="mt-8">
              <PaymasterBalance />
            </div>

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
              {JSON.stringify(user, null, 2)}
            </pre>
          </>
        ) : null}
      </main>
    </>
  );
}
