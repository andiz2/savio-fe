'use client';
import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { useState } from 'react';
import { 
  toCircleSmartAccount, 
  toModularTransport, 
  toPasskeyTransport, 
  toWebAuthnCredential, 
  WebAuthnMode 
} from '@circle-fin/modular-wallets-core';
import {
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction';
import { polygonAmoy } from 'viem/chains';
import { createPublicClient } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import Head from 'next/head';

export default function SmartAccount() {
  const { login, logout, authenticated, user } = usePrivy();
  const [isCreating, setIsCreating] = useState(false);
  const [logs, setLogs] = useState<string>('');
  const [walletData, setWalletData] = useState<any>(null);

  const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY as string;
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL as string;

  console.log("user", user);
  console.log("clientKey", clientKey);
  console.log("clientUrl", clientUrl);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => prev + message + '\n');
  };

  const createSmartWallet = async () => {
    if (!authenticated) {
      await login();
      return;
    }
    
    setIsCreating(true);
    setLogs('');
    
    try {
      const passkeyTransport = toPasskeyTransport(clientUrl, clientKey);
      
      // Create unique username for new wallet registration
      const baseUsername = user?.email?.address || user?.id || 'privy_user';
      const uniqueUsername = `${baseUsername}_${Date.now()}`;
      
      addLog(`Creating new wallet for: ${uniqueUsername}`);
      
      const credential = await toWebAuthnCredential({
        transport: passkeyTransport,
        mode: WebAuthnMode.Register, // Register new credential
        username: uniqueUsername
      });

      addLog('New WebAuthn credential created successfully!');
      addLog(`Credential ID: ${credential.id}`);

      // Create modular transport for Polygon Amoy
      const modularTransport = toModularTransport(
        clientUrl + '/polygonAmoy',
        clientKey,
      );

      addLog('Modular transport created');

      // Create public client for Polygon Amoy
      const client = createPublicClient({
        chain: polygonAmoy,
        transport: modularTransport,
      });

      addLog('Public client created');

      // Create Circle smart account
      const smartAccount = await toCircleSmartAccount({
        client,
        owner: toWebAuthnAccount({
          credential,
        }),
      });

      addLog(`Smart Account created: ${smartAccount.address}`);

      // Create bundler client
      const bundlerClient = createBundlerClient({
        chain: polygonAmoy,
        transport: modularTransport,
        account: smartAccount,
      });

      addLog('Bundler client created successfully!');

      setWalletData({
        smartAccount,
        bundlerClient,
        client,
        credential,
        type: 'new'
      });

      addLog('SUCCESS: New wallet created and ready!');

    } catch (error) {
      console.error('❌ Wallet creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ ERROR: ${errorMessage}`);
      
      if (errorMessage.includes('username is duplicated')) {
        addLog('💡 TIP: Username already exists. Try "Open Existing Wallet" instead.');
      }
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
    setLogs('');
    
    try {
      const passkeyTransport = toPasskeyTransport(clientUrl, clientKey);
      
      // Use base username for existing wallet login
      const baseUsername = user?.email?.address || user?.id || 'privy_user';
      
      addLog(`Opening existing wallet for: ${baseUsername}`);
      
      const credential = await toWebAuthnCredential({
        transport: passkeyTransport,
        mode: WebAuthnMode.Login, // Login with existing credential
        username: baseUsername
      });

      addLog('Existing WebAuthn credential retrieved!');
      addLog(`Credential ID: ${credential.id}`);

      // Create modular transport for Polygon Amoy
      const modularTransport = toModularTransport(
        clientUrl + '/polygonAmoy',
        clientKey,
      );

      addLog('Modular transport created');

      // Create public client for Polygon Amoy
      const client = createPublicClient({
        chain: polygonAmoy,
        transport: modularTransport,
      });

      addLog('Public client created');

      // Create Circle smart account
      const smartAccount = await toCircleSmartAccount({
        client,
        owner: toWebAuthnAccount({
          credential,
        }),
      });
      addLog(`Existing Smart Account opened: ${smartAccount.address}`);

      // Create bundler client
      const bundlerClient = createBundlerClient({
        chain: polygonAmoy,
        transport: modularTransport,
        account: smartAccount,
      });

      addLog('Bundler client created successfully!');

      setWalletData({
        smartAccount,
        bundlerClient,
        client,
        credential,
        type: 'existing'
      });

      addLog('SUCCESS: Existing wallet opened and ready!');

    } catch (error) {
      console.error('❌ Failed to open existing wallet:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ ERROR: ${errorMessage}`);
      
      if (errorMessage.includes('credential not found') || errorMessage.includes('user not found')) {
        addLog('💡 TIP: No existing wallet found. Try "Create Smart Wallet" instead.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setWalletData(null);
    setLogs('');
  };

  const resetWallet = () => {
    setWalletData(null);
    setLogs('');
  };

  return (
    <>
      <Head>
        <title>Savio - Rotating Savings Protocol</title>
        <meta name="description" content="Join Savio, the on-chain rotating savings protocol. Create or join savings groups, earn yields, and build wealth together." />
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex-1 p-6 justify-center items-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="max-w-2xl text-center relative z-10">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-white mb-4">
                Welcome to <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Savio</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                The revolutionary on-chain rotating savings protocol
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl mb-8">
                <h2 className="text-lg font-semibold text-white mb-6">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3 shadow-lg">1</div>
                    <p>Create or join a savings group</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mb-3 shadow-lg">2</div>
                    <p>Contribute USDC and earn 7% yield</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3 shadow-lg">3</div>
                    <p>Bid or get randomly selected for lump sum</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-4 px-8 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-500/20"
                onClick={login}
              >
                Get Started with Savio
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Connect your wallet or create a smart account to begin
            </p>
          </div>
        </div>
      </main>
    </>
  );
}