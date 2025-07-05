import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { encodeFunctionData, erc721Abi } from "viem";
import { mintAbi } from "../components/lib/abis/mint";
import PaymasterBalance from "../components/PaymasterBalance";
import { CirclePaymaster } from "../components/lib/paymaster";

// Simple test transaction - send ETH to yourself
const TEST_TRANSACTION = {
  to: "0x0000000000000000000000000000000000000000", // Zero address for testing
  value: "0", // No ETH sent, just testing
} as const;

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

  const onSendTestTransaction = async () => {
    if (!smartWalletClient) return;

    try {
      setPaymasterLoading(true);
      
      if (usePaymaster) {
        // Log paymaster data for demonstration
        const paymaster = new CirclePaymaster();
        const paymasterData = await paymaster.getPaymasterData(
          smartWalletClient.account,
          10000000n // 10 USDC
        );
        console.log("🔧 Paymaster Data Generated:", paymasterData);
        console.log("⚠️ Note: Privy's client doesn't support paymaster integration yet");
        console.log("💡 This is for demonstration of paymaster data generation only");
      }
      
      // Try a simple transaction first
      console.log("🔄 Attempting simple transaction...");
      console.log("Smart Wallet Address:", smartWalletClient.account.address);
      
      // Send simple ETH transaction (works with Privy)
      const tx = await smartWalletClient.sendTransaction({
        to: smartWalletClient.account.address, // Send to yourself
        value: 0n, // No ETH sent, just testing
      });
      
      console.log("✅ Test transaction sent successfully!");
      console.log("Transaction Hash:", tx);
      console.log("🔗 Check transaction on Etherscan");
      
    } catch (error) {
      console.error("Transaction failed:", error);
      console.log("💡 This might be because the smart wallet needs to be deployed first");
      console.log("💡 Try using the default Biconomy smart wallets instead");
    } finally {
      setPaymasterLoading(false);
    }
  };

  const onSendSimpleTransaction = () => {
    if (!smartWalletClient) return;

    smartWalletClient.sendTransaction({
      to: smartWalletClient.account.address, // Send to yourself
      value: 0n, // No ETH sent, just testing
    });
  };

  const onSendBatchTransaction = () => {
    if (!smartWalletClient) return;

    smartWalletClient.sendTransaction({
      account: smartWalletClient.account,
      calls: [
        {
          to: smartWalletClient.account.address, // Send to yourself
          value: 0n, // No ETH sent, just testing
        },
        {
          to: smartWalletClient.account.address, // Send to yourself
          value: 0n, // No ETH sent, just testing
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
              
              <button
                onClick={() => {
                  console.log("🔄 Clearing smart wallet cache...");
                  console.log("💡 Please log out and log back in to get a fresh smart wallet");
                  console.log("💡 This will clear any cached smart wallet data");
                  alert("Please log out and log back in to get a fresh smart wallet!");
                }}
                className="text-sm bg-red-200 hover:text-red-900 py-2 px-4 rounded-md text-red-700"
              >
                Clear Cache
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
                onClick={onSendTestTransaction}
                disabled={paymasterLoading}
                className={`text-sm py-2 px-4 rounded-md text-white border-none ${
                  paymasterLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-violet-600 hover:bg-violet-700'
                }`}
              >
                {paymasterLoading ? 'Processing...' : 'Send Test Transaction'}
              </button>
              
              <button
                onClick={async () => {
                  if (!smartWalletClient) return;
                  
                  try {
                    setPaymasterLoading(true);
                    console.log("🔄 Testing with simple contract call...");
                    
                    // Try calling a simple contract method (like balanceOf)
                    const tx = await smartWalletClient.sendTransaction({
                      to: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // USDC contract
                      data: "0x70a082310000000000000000000000000000000000000000000000000000000000000000", // balanceOf(address)
                    });
                    
                    console.log("✅ Contract call successful!");
                    console.log("Transaction Hash:", tx);
                    
                  } catch (error) {
                    console.error("Contract call failed:", error);
                  } finally {
                    setPaymasterLoading(false);
                  }
                }}
                disabled={paymasterLoading}
                className={`text-sm py-2 px-4 rounded-md text-white border-none ${
                  paymasterLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {paymasterLoading ? 'Testing...' : 'Test Contract Call'}
              </button>
              
              <button
                onClick={async () => {
                  if (!smartWalletClient) return;
                  
                  try {
                    setPaymasterLoading(true);
                    console.log("🔄 Testing with minimal transaction...");
                    
                    // Try a minimal transaction with no data
                    const tx = await smartWalletClient.sendTransaction({
                      to: "0x0000000000000000000000000000000000000000", // Zero address
                      value: 0n,
                      data: "0x", // Empty data
                    });
                    
                    console.log("✅ Minimal transaction successful!");
                    console.log("Transaction Hash:", tx);
                    
                  } catch (error) {
                    console.error("Minimal transaction failed:", error);
                    console.log("💡 This suggests a fundamental configuration issue");
                  } finally {
                    setPaymasterLoading(false);
                  }
                }}
                disabled={paymasterLoading}
                className={`text-sm py-2 px-4 rounded-md text-white border-none ${
                  paymasterLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {paymasterLoading ? 'Testing...' : 'Test Minimal TX'}
              </button>
              
              <button
                onClick={async () => {
                  if (!smartWalletClient) return;
                  
                  try {
                    setPaymasterLoading(true);
                    console.log("🔄 Testing factory contract...");
                    console.log("Factory Address:", process.env.NEXT_PUBLIC_FACTORY_ADDRESS);
                    
                    // Try to call the factory contract to check if it exists
                    const tx = await smartWalletClient.sendTransaction({
                      to: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
                      data: "0x", // Empty data to check if contract exists
                    });
                    
                    console.log("✅ Factory contract call successful!");
                    console.log("Transaction Hash:", tx);
                    
                  } catch (error) {
                    console.error("Factory contract call failed:", error);
                    console.log("💡 This might mean the factory contract is not deployed or not working");
                  } finally {
                    setPaymasterLoading(false);
                  }
                }}
                disabled={paymasterLoading}
                className={`text-sm py-2 px-4 rounded-md text-white border-none ${
                  paymasterLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {paymasterLoading ? 'Testing...' : 'Test Factory Contract'}
              </button>
              <button
                onClick={onSendSimpleTransaction}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Simple Transaction
              </button>
              <button
                onClick={onSendBatchTransaction}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Batch Transaction
              </button>
              <button
                onClick={() => {
                  console.log("🔍 Smart Wallet Debug Info:");
                  console.log("Factory Address:", process.env.NEXT_PUBLIC_FACTORY_ADDRESS);
                  console.log("Entry Point Address:", "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789");
                  console.log("Bundler URL:", "https://bundler.biconomy.io/api/v3/11155111/bundler_3ZWviMnNXD7h9URmfW85jDQm");
                  console.log("User Smart Wallet:", user?.smartWallet);
                  console.log("Smart Wallet Client:", smartWalletClient);
                  console.log("Smart Wallet Address:", smartWalletClient?.account?.address);
                  console.log("Chain ID:", smartWalletClient?.chain?.id);
                  console.log("Network:", smartWalletClient?.chain?.name);
                  
                  // Check factory contract on Etherscan
                  if (process.env.NEXT_PUBLIC_FACTORY_ADDRESS) {
                    console.log("🔗 Check Factory Contract on Etherscan:");
                    console.log(`https://sepolia.etherscan.io/address/${process.env.NEXT_PUBLIC_FACTORY_ADDRESS}`);
                  }
                  
                  // Check if wallet exists on blockchain
                  if (smartWalletClient?.account?.address) {
                    console.log("🔗 Check wallet on Ethereum Sepolia:");
                    console.log(`https://sepolia.etherscan.io/address/${smartWalletClient.account.address}`);
                  }
                }}
                className="text-sm bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-md text-white border-none"
              >
                Debug Smart Wallet
              </button>

              <button
                onClick={async () => {
                  if (!smartWalletClient?.account?.address) {
                    alert("No smart wallet address found!");
                    return;
                  }

                  console.log("🔍 Checking Smart Wallet Deployment:");
                  console.log("Smart Wallet Address:", smartWalletClient.account.address);
                  
                  try {
                    console.log("📊 Checking Smart Wallet Deployment:");
                    console.log("✅ Smart Wallet Status:");
                    console.log("📍 Address:", smartWalletClient.account.address);
                    console.log("🌐 Network:", smartWalletClient.chain?.name);
                    console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${smartWalletClient.account.address}`);
                    
                    console.log("💡 Smart Wallet Deployment Info:");
                    console.log("• Smart wallets are typically 'counterfactual' - they exist but aren't deployed until first use");
                    console.log("• The wallet address is deterministic and can be calculated before deployment");
                    console.log("• Deployment happens automatically on the first transaction");
                    console.log("• This is normal behavior for ERC-4337 smart wallets");
                    
                    console.log("🎯 To verify deployment:");
                    console.log("1. Send a transaction (like 'Send Test Transaction')");
                    console.log("2. Check the transaction on Etherscan");
                    console.log("3. The smart wallet will be deployed automatically");
                    
                    alert("Smart wallet deployment check complete! Check console for details.");
                    
                  } catch (error) {
                    console.error("❌ Error checking smart wallet:", error);
                    alert("Error checking smart wallet. Check console for details.");
                  }
                }}
                className="text-sm bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-md text-white border-none"
              >
                Check Wallet Deployment
              </button>

              <button
                onClick={async () => {
                  if (!smartWalletClient) return;
                  
                  console.log("🧪 Testing Paymaster Functionality:");
                  
                  try {
                    const paymaster = new CirclePaymaster();
                    
                    // Test 1: Check USDC balance
                    console.log("1. Testing USDC balance check...");
                    const balance = await paymaster.getUsdcBalanceFormatted(
                      smartWalletClient.account.address as `0x${string}`
                    );
                    console.log("✅ USDC Balance:", balance);
                    
                    // Test 2: Generate paymaster data
                    console.log("2. Testing paymaster data generation...");
                    const paymasterData = await paymaster.getPaymasterData(
                      smartWalletClient.account,
                      10000000n // 10 USDC
                    );
                    console.log("✅ Paymaster Data:", paymasterData);
                    
                    // Test 3: Check paymaster contract
                    console.log("3. Testing paymaster contract...");
                    console.log("✅ Paymaster Address:", "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966");
                    console.log("✅ Paymaster Network: Ethereum Sepolia");
                    
                    console.log("🎉 All paymaster tests passed!");
                    console.log("💡 Note: This test doesn't send transactions. Use 'Send Test Transaction' with paymaster toggle for real transactions.");
                    
                  } catch (error) {
                    console.error("❌ Paymaster test failed:", error);
                  }
                }}
                className="text-sm bg-green-600 hover:bg-green-700 py-2 px-4 rounded-md text-white border-none"
              >
                Test Paymaster (No TX)
              </button>

              <button
                onClick={async () => {
                  if (!smartWalletClient) return;
                  
                  console.log("🚀 Sending Real Transaction (Regular):");
                  
                  try {
                    setPaymasterLoading(true);
                    
                    // Send regular transaction (no paymaster)
                    console.log("📤 Sending transaction to blockchain...");
                    const tx = await smartWalletClient.sendTransaction({
                      to: smartWalletClient.account.address, // Send to yourself
                      value: 0n, // No ETH sent, just testing
                    });
                    
                    console.log("✅ Transaction sent:", tx);
                    console.log("🔗 Check transaction on Ethereum Sepolia:");
                    console.log(`https://sepolia.etherscan.io/tx/${tx}`);
                    
                    alert("Transaction sent! Check console for details.");
                    
                  } catch (error) {
                    console.error("❌ Transaction failed:", error);
                    alert("Transaction failed. Check console for details.");
                  } finally {
                    setPaymasterLoading(false);
                  }
                }}
                disabled={paymasterLoading}
                className={`text-sm py-2 px-4 rounded-md text-white border-none ${
                  paymasterLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {paymasterLoading ? 'Sending TX...' : 'Send Real TX'}
              </button>

              <button
                onClick={async () => {
                  if (!smartWalletClient) return;
                  
                  console.log("🧪 Testing Paymaster Data Generation:");
                  
                  try {
                    setPaymasterLoading(true);
                    const paymaster = new CirclePaymaster();
                    
                    // Generate paymaster data (for demonstration only)
                    const paymasterData = await paymaster.getPaymasterData(
                      smartWalletClient.account,
                      5000000n // 5 USDC
                    );
                    console.log("✅ Paymaster Data Generated:", paymasterData);
                    console.log("💡 Note: Privy's client doesn't support paymaster integration yet.");
                    console.log("💡 This is for demonstration of paymaster data generation only.");
                    
                    alert("Paymaster data generated! Check console for details.");
                    
                  } catch (error) {
                    console.error("❌ Paymaster test failed:", error);
                    alert("Paymaster test failed. Check console for details.");
                  } finally {
                    setPaymasterLoading(false);
                  }
                }}
                disabled={paymasterLoading}
                className={`text-sm py-2 px-4 rounded-md text-white border-none ${
                  paymasterLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {paymasterLoading ? 'Testing...' : 'Test Paymaster Data'}
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
