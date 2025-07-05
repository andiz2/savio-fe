'use client';

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
      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-privy-light-blue flex-1 p-6 justify-center items-center">
          <div className="flex flex-col mt-6 justify-center text-center max-w-2xl w-full">
            <h1 className="text-2xl font-bold mb-6">Smart Account Management</h1>
            
            {!authenticated ? (
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={login}
              >
                Login with Privy
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-black mb-4">
                  Authenticated as: {user?.email?.address || user?.id}
                </p>
                
                {!walletData ? (
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 min-w-[180px]"
                      onClick={createSmartWallet}
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : '🆕 Create Smart Wallet'}
                    </button>
                    
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 min-w-[180px]"
                      onClick={openExistingWallet}
                      disabled={isCreating}
                    >
                      {isCreating ? 'Opening...' : '📂 Open Existing Wallet'}
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
                      {walletData.type === 'new' ? 'New Wallet Created!' : 'Existing Wallet Opened!'}
                    </h3>
                    <p className="text-green-700">
                      Address: <code className="bg-green-200 px-2 py-1 rounded">{walletData.smartAccount.address}</code>
                    </p>
                    <p className="text-green-600 text-sm mt-2">
                      Chain: Polygon Amoy Testnet
                    </p>
                  </div>
                )}
                
                {logs && (
                  <div className="bg-gray-100 p-4 rounded-lg mt-4 text-left">
                    <h3 className="font-bold mb-2">Activity Logs:</h3>
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{logs}</pre>
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
            )}
          </div>
        </div>
      </main>
    </>
  );
}