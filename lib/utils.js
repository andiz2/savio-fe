// @ts-nocheck
import { createPublicClient, encodeFunctionData } from "viem";
import FACTORY_ABI from "../abi/FACTORY_ABI.json";
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const CONTRACT_ADDRESS = "0x5b86fAcC8c1350D970f25DE9c481CDDA91d1C818";

// @ts-ignore
const CREATE_GROUP = async ({walletData, period, totalMembers, pledgeAmount, onInviteModalOpen}) => {
  if (!walletData) {
    // addLog("❌ No wallet connected. Please create or open a wallet first.");
    return;
  }
  const USDC_TOKEN_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
  try {
    // const period = 4;
    // const totalMembers = 4;
    // const pledgeAmount = 10; // 10 USDC (will be converted to wei units)
    const usdcToken = USDC_TOKEN_ADDRESS;

    // Convert pledge amount to proper decimals (USDC has 6 decimals)
    const pledgeAmountInWei = BigInt(pledgeAmount * 1000000); // 10 USDC = 10,000,000 units

    //   addLog(`📝 Creating group with parameters:`);
    //   addLog(`- Period: ${period}`);
    //   addLog(`- Total Members: ${totalMembers}`);
    //   addLog(`- Pledge Amount: ${pledgeAmount} USDC`);
    //   addLog(`- USDC Token: ${usdcToken}`);

    // Create the transaction data
    const txData = encodeFunctionData({
      abi: FACTORY_ABI,
      functionName: "createGroup",
      args: [period, totalMembers, pledgeAmountInWei, usdcToken],
    });

    // addLog("📤 Sending transaction with paymaster...");

    // Send transaction using bundler client with paymaster
    const userOpHash = await walletData.bundlerClient.sendUserOperation({
      calls: [
        {
          to: CONTRACT_ADDRESS,
          data: txData,
        },
      ],
      paymaster: true, // Enable paymaster for gasless transaction
    });

    // addLog(`✅ Transaction submitted: ${userOpHash}`);

    // Wait for transaction receipt
    const { receipt } =
      await walletData.bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

      onInviteModalOpen(true);
      console.log("userOpHash", userOpHash)
      console.log("receipt", receipt)

    // addLog(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);

    // Parse the logs to extract groupId and roscaAddress
    try {
      // You might need to decode the logs here to get the return values
      // For now, we'll show a success message
      //   addLog("🎉 Group created successfully!");
      //   addLog("Note: Check transaction logs for groupId and roscaAddress");
      // If your contract emits events, you can parse them here
      // const logs = receipt.logs;
      // ... parse logs to extract groupId and roscaAddress
    } catch (parseError) {
      //   addLog("⚠️ Transaction successful but could not parse return values");
    }
  } catch (error) {
    console.error("❌ Group creation failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    // addLog(`❌ Group creation ERROR: ${errorMessage}`);
  } finally {
  }
};

const GET_PROTOCOL_ADDRESS = async (walletData) => {
  if (!walletData) {
    //   addLog('❌ No wallet connected. Please create or open a wallet first.');
    return;
  }

  console.log(true);

  try {
    //   addLog('📞 Calling getSavioProtocolAddress function...');
    const groupId = 1;
    // Read contract function using the public client
    const result = await walletData.client.readContract({
      address: CONTRACT_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getSavioProtocolAddress",
      args: [groupId], // Add arguments if the function requires any
    });

    //   addLog(`✅ Contract call successful!`);
    //   addLog(`Savio Protocol Address: ${result}`);
    console.log(result);
  } catch (error) {
    console.error("❌ Contract call failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    //   addLog(`❌ Contract call ERROR: ${errorMessage}`);
  } finally {
    console.log(false);
  }
};

export { CREATE_GROUP, GET_PROTOCOL_ADDRESS };
