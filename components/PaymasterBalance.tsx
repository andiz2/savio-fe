import { useState, useEffect } from "react";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { CirclePaymaster } from "./lib/paymaster";

export default function PaymasterBalance() {
  const { client: smartWalletClient } = useSmartWallets();
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymaster = new CirclePaymaster();

  const checkBalance = async () => {
    if (!smartWalletClient?.account?.address) return;

    setLoading(true);
    setError(null);
    
    try {
      const balance = await paymaster.getUsdcBalanceFormatted(
        smartWalletClient.account.address as `0x${string}`
      );
      setUsdcBalance(balance);
    } catch (err) {
      console.error("Error checking USDC balance:", err);
      setError("Failed to check USDC balance. This might be because the USDC contract is not available on this network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (smartWalletClient?.account?.address) {
      checkBalance();
    }
  }, [smartWalletClient?.account?.address]);

  const handleRefreshBalance = () => {
    checkBalance();
  };

  if (!smartWalletClient?.account?.address) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        USDC Balance & Paymaster
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">USDC Balance:</span>
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
            ) : (
              <span className="text-sm font-semibold text-gray-900">
                {usdcBalance !== null ? `${usdcBalance.toFixed(2)} USDC` : "N/A"}
              </span>
            )}
            <button
              onClick={handleRefreshBalance}
              className="text-xs text-violet-600 hover:text-violet-800"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Smart Wallet: {smartWalletClient.account.address}</p>
          <p>Paymaster: Circle Paymaster v0.8</p>
          <p>Network: Ethereum Sepolia</p>
        </div>

        <div className="bg-green-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-green-900 mb-2">
            ✅ Paymaster Status:
          </h4>
          <ul className="text-xs text-green-800 space-y-1">
            <li>• Circle Paymaster v0.8 is available on Ethereum Sepolia</li>
            <li>• USDC balance checking should work correctly</li>
            <li>• Gas fees can be paid in USDC via Circle Paymaster</li>
            <li>• Users pay gas fees in USDC instead of ETH</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 