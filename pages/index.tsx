"use client";
import { useState } from "react";
import {
  toCircleSmartAccount,
  toModularTransport,
  toPasskeyTransport,
  toWebAuthnCredential,
  WebAuthnMode,
} from "@circle-fin/modular-wallets-core";
import {
  createBundlerClient,
  toWebAuthnAccount,
} from "viem/account-abstraction";
import { polygonAmoy } from "viem/chains";
import { createPublicClient } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import { useAuth } from "../context/DataContext";

export default function SmartAccount() {
  const { walletData, setWalletData} = useAuth();
  const router = useRouter();
  const { login, logout, authenticated, user } = usePrivy();
  const [isCreating, setIsCreating] = useState(false);
  const [logs, setLogs] = useState<string>("");
  const [open, setOpen] = useState(true);
  const [_credAccount, setCredAccount] = useState<any>();

  const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY as string;
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL as string;

  const createSmartWallet = async () => {
    if (!authenticated) {
      await login();
      return;
    }

    setIsCreating(true);
    setLogs("");

    try {
      const passkeyTransport = toPasskeyTransport(clientUrl, clientKey);

      // Create unique username for new wallet registration
      const baseUsername = user?.email?.address || user?.id || "privy_user";
      const uniqueUsername = `${baseUsername}_${Date.now()}`;

      const credential = await toWebAuthnCredential({
        transport: passkeyTransport,
        mode: WebAuthnMode.Register, // Register new credential
        username: uniqueUsername,
      });

      setCredAccount(credential)

      // Create modular transport for Polygon Amoy
      const modularTransport = toModularTransport(
        clientUrl + "/polygonAmoy",
        clientKey
      );

      // Create public client for Polygon Amoy
      const client = createPublicClient({
        chain: polygonAmoy,
        transport: modularTransport,
      });

      // Create Circle smart account
      const smartAccount = await toCircleSmartAccount({
        client,
        owner: toWebAuthnAccount({
          credential,
        }),
      });

      // Create bundler client
      const bundlerClient = createBundlerClient({
        chain: polygonAmoy,
        transport: modularTransport,
        account: smartAccount,
      });

      setWalletData({
        smartAccount,
        bundlerClient,
        client,
        credential,
        type: "new",
      });

      router.push("/dashboard")
    } catch (error) {
      console.error("❌ Wallet creation failed:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openExistingWallet = async () => {
    if (!authenticated) {
      await login();
      return;
    }

    setIsCreating(true);
    setLogs("");

    try {
      const passkeyTransport = toPasskeyTransport(clientUrl, clientKey);

      const baseUsername = user?.email?.address || user?.id || "privy_user";

      const credential = await toWebAuthnCredential({
        transport: passkeyTransport,
        mode: WebAuthnMode.Login, // Login with existing credential
        username: baseUsername,
      });

      setCredAccount(credential)

      // Create modular transport for Polygon Amoy
      const modularTransport = toModularTransport(
        clientUrl + "/polygonAmoy",
        clientKey
      );

      // Create public client for Polygon Amoy
      const client = createPublicClient({
        chain: polygonAmoy,
        transport: modularTransport,
      });

      // Create Circle smart account
      const smartAccount = await toCircleSmartAccount({
        client,
        owner: toWebAuthnAccount({
          credential,
        }),
      });

      // Create bundler client
      const bundlerClient = createBundlerClient({
        chain: polygonAmoy,
        transport: modularTransport,
        account: smartAccount,
      });
      
      setWalletData({
        smartAccount,
        bundlerClient,
        client,
        credential,
        type: "existing",
      });

      router.push("/dashboard")

    } catch (error) {
      console.error("❌ Failed to open existing wallet:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setWalletData(null);
    setLogs("");
  };

  const resetWallet = () => {
    setWalletData(null);
    setLogs("");
  };

  return (
    <>
      <>
        <Head>
          <title>Savio - Rotating Savings Protocol</title>
          <meta
            name="description"
            content="Join Savio, the on-chain rotating savings protocol. Create or join savings groups, earn yields, and build wealth together."
          />
        </Head>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
          >
            Open dialog
          </button>
          <Dialog open={open} onClose={setOpen} className="relative z-10">
            <div
              // transition
              className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex justify-center min-h-full items-end p-4 text-center sm:items-center sm:p-0">
                <div
                  // transition
                  className="overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                  <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 shadow-xl">
              
                     
                      <div className="mt-3 text-center">
                           <div className="space-y-4">
                      <p className="text-white text-xl mb-4">
                        Authenticated as: {user?.email?.address || user?.id}
                      </p>

                      {!walletData ? (
                        <div className="flex flex-col gap-4 items-center justify-center flex-wrap ">
                          <button
                            className="w-[400px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 px-2 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-500/20"
                            onClick={createSmartWallet}
                            disabled={isCreating}
                          >
                            {isCreating
                              ? "Creating..."
                              : "Create Smart Wallet"}
                          </button>

                          <button
                            className="w-[400px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 px-2 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-500/20"
                            onClick={openExistingWallet}
                            disabled={isCreating}
                          >
                            {isCreating
                              ? "Opening..."
                              : "Open Existing Wallet"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-4 justify-center flex-wrap">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            onClick={resetWallet}
                          >
                            Switch Wallet
                          </button>

                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </div>
                      )}

                      {walletData && (
                        <div className="bg-green-100 p-4 rounded-lg mt-4">
                          <h3 className="font-bold text-green-800 mb-2">
                            {walletData.type === "new"
                              ? "New Wallet Created!"
                              : "Existing Wallet Opened!"}
                          </h3>
                          <p className="text-green-700">
                            Address:{" "}
                            <code className="bg-green-200 px-2 py-1 rounded">
                              {walletData.smartAccount.address}
                            </code>
                          </p>
                          <p className="text-green-600 text-sm mt-2">
                            Chain: Polygon Amoy Testnet
                          </p>
                        </div>
                      )}

                      {logs && (
                        <div className="bg-gray-100 p-4 rounded-lg mt-4 text-left">
                          <h3 className="font-bold mb-2">Activity Logs:</h3>
                          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                            {logs}
                          </pre>
                        </div>
                      )}

                      {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left text-sm">
                  <h4 className="font-bold text-blue-800 mb-2">💡 How it works:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li><strong>Create Smart Wallet:</strong> Registers a new passkey and creates a fresh wallet</li>
                    <li><strong>Open Existing Wallet:</strong> Uses your existing passkey to access your wallet</li>
                    <li><strong>Passkeys:</strong> Secure biometric authentication stored locally on your device</li>
                  </ul>
                </div> */}
                    </div>
                      </div>
             
                  </div>
                  
                </div>
              </div>
            </div>
          </Dialog>
        </div>

        <main className="flex min-h-screen min-w-full">
          <div className="flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex-1 p-6 justify-center items-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

            <div className="max-w-2xl text-center relative z-10">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-white mb-4">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Savio
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  The revolutionary on-chain rotating savings protocol
                </p>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl mb-8">
                  <h2 className="text-lg font-semibold text-white mb-6">
                    How it works
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3 shadow-lg">
                        1
                      </div>
                      <p>Create or join a savings group</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mb-3 shadow-lg">
                        2
                      </div>
                      <p>Contribute USDC and earn 7% yield</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3 shadow-lg">
                        3
                      </div>
                      <p>Bid or get randomly selected for lump sum</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                {!walletData ? <div className="flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-4 px-8 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-500/20"
                    onClick={login}
                  >
                     Login with Privy
                  </button>
                </div> : <div>Connected</div>}
              </div>
              <p className="text-sm text-gray-400 mt-6">
                Connect your wallet or create a smart account to begin
              </p>
            </div>
          </div>
        </main>
      </>
    </>
  );
}
