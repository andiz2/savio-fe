// @ts-nocheck
import { createPublicClient, http, decodeEventLog, encodeFunctionData  } from "viem";
import FACTORY_ABI from "../abi/FACTORY_ABI.json";
import { doc, setDoc, getDoc, addDoc, getFirestore, collection, serverTimestamp  } from 'firebase/firestore';
import { db } from './firebase';
import { polygonAmoy } from 'viem/chains'; // Adjust chain as needed

// Contract details
const CONTRACT_ADDRESS = "0x082c905eB05d69B3e0C00aD963e16D7BB94EE7ab";

// Create public client for reading blockchain data
const publicClient = createPublicClient({
  chain: polygonAmoy, // Adjust to your chain
  transport: http() // Add your RPC URL if needed
});


// Function to store group data in Firebase
async function storeGroupInFirebase(groupData) {
  try {
    const docRef = await addDoc(collection(db, 'groups'), {
      groupId: groupData.groupId.toString(),
      transactionHash: groupData.transactionHash,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
      address: groupData.roscaAddress
    });
    
    console.log('✅ Group stored in Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error storing group in Firebase:', error);
    throw error;
  }
}

// Function to parse SavioCreated event from transaction receipt
function parseSavioCreatedEvent(receipt) {
  try {
    // Find the SavioCreated event in the logs
    const savioCreatedLog = receipt.logs.find((log) => {
      try {
        const decodedLog = decodeEventLog({
          abi: FACTORY_ABI,
          data: log.data,
          topics: log.topics
        });
        return decodedLog.eventName === 'SavioCreated';
      } catch {
        return false;
      }
    });

    if (!savioCreatedLog) {
      throw new Error('SavioCreated event not found in transaction receipt');
    }

    // Decode the event
    const decodedEvent = decodeEventLog({
      abi: FACTORY_ABI,
      data: savioCreatedLog.data,
      topics: savioCreatedLog.topics
    });

    return {
      groupId: decodedEvent.args.groupId,
      creator: decodedEvent.args.creator,
      roscaAddress: decodedEvent.args.roscaAddress,
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    console.error('❌ Error parsing SavioCreated event:', error);
    throw error;
  }
}

// @ts-ignore
const CREATE_GROUP = async ({walletData, period, totalMembers, pledgeAmount, onInviteModalOpen}) => {
  if (!walletData) {
    console.error("❌ No wallet connected. Please create or open a wallet first.");
    return;
  }
  
  const USDC_TOKEN_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
  
  try {
    const usdcToken = USDC_TOKEN_ADDRESS;
    const pledgeAmountInWei = BigInt(pledgeAmount * 1000000); // Convert to USDC units

    console.log(`📝 Creating group with parameters:`);
    console.log(`- Period: ${period}`);
    console.log(`- Total Members: ${totalMembers}`);
    console.log(`- Pledge Amount: ${pledgeAmount} USDC`);

    // Create the transaction data
    const txData = encodeFunctionData({
      abi: FACTORY_ABI,
      functionName: "createGroup",
      args: [period, totalMembers, pledgeAmountInWei, usdcToken],
    });

    console.log("📤 Sending transaction with paymaster...");

    // Send transaction using bundler client with paymaster
    const userOpHash = await walletData.bundlerClient.sendUserOperation({
      calls: [
        {
          to: CONTRACT_ADDRESS,
          data: txData,
        },
      ],
      paymaster: true,
    });

    console.log(`✅ Transaction submitted: ${userOpHash}`);

    // Wait for transaction receipt
    const { receipt } = await walletData.bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log("Receipt:", receipt);

    // Parse the SavioCreated event and store in Firebase
    try {
      const eventData = parseSavioCreatedEvent(receipt);
      console.log("📊 Parsed event data:", eventData);

      // Store in Firebase
      const firebaseDocId = await storeGroupInFirebase(eventData);
      
      console.log("🎉 Group created successfully!");
      console.log(`📋 Group ID: ${eventData.groupId}`);
      console.log(`🏠 ROSCA Address: ${eventData.roscaAddress}`);
      console.log(`🔗 Transaction Hash: ${eventData.transactionHash}`);
      console.log(`📄 Firebase Document ID: ${firebaseDocId}`);

      // Open invite modal
      onInviteModalOpen(true);

      // Return the group data for further use
      return {
        groupId: eventData.groupId,
        roscaAddress: eventData.roscaAddress,
        transactionHash: eventData.transactionHash,
        firebaseDocId: firebaseDocId,
        ...eventData
      };

    } catch (parseError) {
      console.error("❌ Error parsing event or storing in Firebase:", parseError);
      // Still open the modal even if parsing fails
      onInviteModalOpen(true);
      throw parseError;
    }

  } catch (error) {
    console.error("❌ Group creation failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Group creation ERROR: ${errorMessage}`);
    throw error;
  }
};

// Optional: Function to listen for real-time events (if you want to listen continuously)
function setupEventListener() {
  // This would set up a real-time listener for new SavioCreated events
  // Note: This requires a WebSocket connection or polling mechanism
  
  const unwatch = publicClient.watchEvent({
    address: CONTRACT_ADDRESS,
    event: {
        name: 'SavioCreated',
        inputs: [
            { name: 'groupId', type: 'uint256', indexed: true },
            { name: 'creator', type: 'address', indexed: true },
            { name: 'roscaAddress', type: 'address', indexed: true },
            { name: 'period', type: 'uint256', indexed: false },
            { name: 'totalMembers', type: 'uint256', indexed: false },
            { name: 'pledgeAmount', type: 'uint256', indexed: false }
        ],
        type: 'event'
    },
    onLogs: async (logs) => {
      console.log('📢 New SavioCreated event detected:', logs);
      
      for (const log of logs) {
        try {
          const eventData = {
            groupId: log.args.groupId,
            transactionHash: log.transactionHash
          };
          
          await storeGroupInFirebase(eventData);
          console.log(`✅ Stored group ${eventData.groupId} in Firebase`);
        } catch (error) {
          console.error('❌ Error processing event:', error);
        }
      }
    }
  });
  
  // Return unwatch function to stop listening
  return unwatch;
}

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

export {
  CREATE_GROUP,
  GET_PROTOCOL_ADDRESS,
  storeGroupInFirebase,
  parseSavioCreatedEvent,
  setupEventListener
};
