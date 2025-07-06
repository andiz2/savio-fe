import PROTOCOL_ABI from "../abi/PROTOCOL_ABI.json";
// @ts-ignore
import { createPublicClient, http, decodeEventLog, encodeFunctionData, formatUnits, parseGwei  } from "viem";
import { parseUnits } from 'ethers';
import { polygonAmoy } from "viem/chains";
import { toModularTransport } from '@circle-fin/modular-wallets-core'
import { createBundlerClient } from "viem/account-abstraction";

const USDC_DECIMALS = 6;
// @ts-ignore
const parseUSDC = (/** @type {any} */ amount) => {
    return BigInt(Math.floor(Number(amount) * Math.pow(10, USDC_DECIMALS)));
};

// Group ID: 9
const USDC_TOKEN_ADDRESS = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'; 
const CONTRACT_ADDRESS = "0x438FDB1b3C88A07304396fCeA5Ef640edC91E751"
// "0x424C2a144b87Fd95b483318848192944E43C2708";

// @ts-ignore
const GET_PLEDGE_AMOUNT = async (walletData, groupId) => {
  if (!walletData) {
    console.log('❌ No wallet connected. Please create or open a wallet first.');
    return;
  }
  try {
    // Read contract function using the public client
    const result = await walletData.client.readContract({
        address: CONTRACT_ADDRESS,
        abi: PROTOCOL_ABI,
        functionName: "getPledgeAmount"
    });
    const big = 100000000n;
const normal = Number(big);
console.log("========", normal); // 100000000
  console.log("Pledge amount:", result);
  return result
  } catch (error) {
    console.error("❌ Contract call failed:", error);
  } finally {
    console.log(false);
  }
};

 const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY;
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;


// @ts-ignore
const modularTransport = toModularTransport(clientUrl, clientKey)

// Create bundler client
const bundlerClient = createBundlerClient({
  chain: polygonAmoy,
  transport: modularTransport,
})

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http()
})

// @ts-ignore
const createGroup = async (smartAccount, handleDeposit) => {
  if (!smartAccount?.address) {
    console.log('❌ Invalid smart account provided.')
    return { success: false, error: 'Invalid smart account' }
  }

  const USDC_TOKEN_ADDRESS = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'
  const CONTRACT_ADDRESS = '0x438fdb1b3c88a07304396fcea5ef640edc91e751'

  try {
    const amount = parseUnits("4", 6)
    
    console.log('🔍 Starting group creation...')
    console.log(`Smart Account: ${smartAccount.address}`)

    // Check USDC balance
    const balance = await publicClient.readContract({
      address: USDC_TOKEN_ADDRESS,
      abi: [{
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }],
      functionName: 'balanceOf',
      args: [smartAccount.address]
    })
    
    console.log(`Balance: ${formatUnits(balance, 6)} USDC`)
    
    if (balance < amount) {
      return { success: false, error: 'Insufficient USDC balance' }
    }

    // Check allowance
    const allowance = await publicClient.readContract({
      address: USDC_TOKEN_ADDRESS,
      abi: [{
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }],
      functionName: 'allowance',
      args: [smartAccount.address, CONTRACT_ADDRESS]
    })
    
    console.log(`Allowance: ${formatUnits(allowance, 6)} USDC`)

    // Approve if needed
    if (allowance < amount) {
      console.log('📝 Approving USDC...')
      
      const approveData = encodeFunctionData({
        abi: [{
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          name: 'approve',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }],
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amount],
      })

      const approveHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls: [{
          to: USDC_TOKEN_ADDRESS,
          data: approveData,
        }],
        callGasLimit: 100000n,
        verificationGasLimit: 100000n,
        preVerificationGas: 50000n,
        maxFeePerGas: parseGwei('20'),
        maxPriorityFeePerGas: parseGwei('2'),
      })
  
      await bundlerClient.waitForUserOperationReceipt({ hash: approveHash })
      console.log('✅ Approval confirmed')
    }

    // Join group
    console.log('🎯 Joining group...')
    
    const joinData = encodeFunctionData({
      abi: PROTOCOL_ABI,
      functionName: 'join',
      args: [amount],
    })

    const userOpHash = await bundlerClient.sendUserOperation({
      account: smartAccount,
      calls: [{
        to: CONTRACT_ADDRESS,
        data: joinData,
      }],
      callGasLimit: 150000n,
      verificationGasLimit: 100000n,
      preVerificationGas: 50000n,
      maxFeePerGas: parseGwei('20'),
      maxPriorityFeePerGas: parseGwei('2'),
    })

    const { receipt } = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    })

    console.log(`✅ Transaction confirmed: ${receipt.blockNumber}`)
    console.log('🎉 Group created successfully!')

    return { success: true, userOpHash, receipt }

  } catch (error) {
       handleDeposit()
    console.error('❌ Group creation failed:', error)
    return { success: false, error: error }
  }
}


// @ts-ignore
export { GET_PLEDGE_AMOUNT, createGroup } 