# Paymaster Testing Guide

This guide shows you how to easily test the Circle Paymaster functionality on Sepolia.

## 🧪 Quick Testing Methods

### 1. **Dashboard Testing** (Easiest)
- Open the dashboard in your browser
- Click **"Test Paymaster"** button
- Check browser console for test results
- Toggle **"Use Paymaster (USDC gas)"** checkbox to test paymaster integration

### 2. **USDC Balance Testing**
- The `PaymasterBalance` component automatically checks USDC balance
- Click **"Refresh"** button to update balance
- Shows real-time USDC balance of your smart wallet

### 3. **Transaction Testing**
- Click **"Mint NFT"** with paymaster toggle enabled
- Check console for paymaster data generation
- Monitor transaction status

## 🔧 Testing Steps

### Step 1: Setup
```bash
# Start the development server
npm run dev

# Open browser to http://localhost:3000
```

### Step 2: Get USDC Test Tokens
1. Visit [Circle's Faucet](https://faucet.circle.com)
2. Connect your wallet (MetaMask, etc.)
3. Switch to **Sepolia** network
4. Request USDC test tokens
5. Send some USDC to your smart wallet address

### Step 3: Test Paymaster Components

#### A. USDC Balance Check
```typescript
// This happens automatically in PaymasterBalance component
const paymaster = new CirclePaymaster();
const balance = await paymaster.getUsdcBalanceFormatted(walletAddress);
console.log("USDC Balance:", balance);
```

#### B. Paymaster Data Generation
```typescript
// Test paymaster data creation
const paymasterData = await paymaster.getPaymasterData(account, 10000000n);
console.log("Paymaster Data:", paymasterData);
```

#### C. Permit Signature Testing
```typescript
// Test EIP-2612 permit signing
const permitSignature = await signPermit({
  tokenAddress: usdcAddress,
  account,
  client,
  spenderAddress: paymasterAddress,
  permitAmount: 10000000n,
});
```

## 🎯 What Each Test Checks

### ✅ **Test Paymaster Button**
1. **USDC Balance**: Checks if your smart wallet has USDC
2. **Paymaster Data**: Generates paymaster transaction data
3. **Contract Address**: Verifies paymaster contract address
4. **Network**: Confirms Sepolia network configuration

### ✅ **Paymaster Toggle**
- Enables/disables paymaster usage for transactions
- Shows loading state during paymaster processing
- Logs paymaster data for debugging

### ✅ **USDC Balance Component**
- Real-time USDC balance display
- Error handling for network issues
- Refresh functionality

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **"USDC Balance: 0"**
**Solution:**
- Get USDC from [Circle's Faucet](https://faucet.circle.com)
- Ensure you're on Sepolia network
- Send USDC to your smart wallet address

#### 2. **"Paymaster Data Generation Failed"**
**Solution:**
- Check if USDC contract supports EIP-2612 permits
- Verify network connection
- Ensure wallet has enough USDC for gas

#### 3. **"Transaction Failed"**
**Solution:**
- Check smart wallet has ETH for gas (if not using paymaster)
- Verify contract addresses are correct
- Check console for detailed error messages

#### 4. **"Network Error"**
**Solution:**
- Ensure you're connected to Sepolia
- Check RPC endpoint configuration
- Verify network settings in wallet

## 🔍 Debug Information

### Console Logs to Check
```javascript
// Smart Wallet Info
console.log("Smart Wallet Address:", smartWalletClient?.account?.address);
console.log("Chain ID:", smartWalletClient?.chain?.id);
console.log("Network:", smartWalletClient?.chain?.name);

// Paymaster Info
console.log("Paymaster Address:", "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966");
console.log("USDC Address:", "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");

// USDC Balance
console.log("USDC Balance:", balance);
```

### Useful Links
- **Smart Wallet on Sepolia**: `https://sepolia.etherscan.io/address/YOUR_WALLET_ADDRESS`
- **Paymaster Contract**: `https://sepolia.etherscan.io/address/0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966`
- **USDC Contract**: `https://sepolia.etherscan.io/address/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

## 🚀 Advanced Testing

### Manual Paymaster Testing
```typescript
// Create paymaster instance
const paymaster = new CirclePaymaster();

// Test with different USDC amounts
const amounts = [1000000n, 5000000n, 10000000n]; // 1, 5, 10 USDC

for (const amount of amounts) {
  try {
    const data = await paymaster.getPaymasterData(account, amount);
    console.log(`✅ ${amount} USDC:`, data);
  } catch (error) {
    console.error(`❌ ${amount} USDC:`, error);
  }
}
```

### Network Testing
```typescript
// Test different networks
const networks = ['sepolia', 'arbitrumSepolia', 'baseSepolia'];

for (const network of networks) {
  console.log(`Testing ${network}...`);
  // Test paymaster availability on each network
}
```

## 📊 Expected Results

### ✅ Successful Test Output
```
🧪 Testing Paymaster Functionality:
1. Testing USDC balance check...
✅ USDC Balance: 10.5
2. Testing paymaster data generation...
✅ Paymaster Data: { paymaster: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966", ... }
3. Testing paymaster contract...
✅ Paymaster Address: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
✅ Paymaster Network: Sepolia
🎉 All paymaster tests passed!
```

### ❌ Failed Test Output
```
🧪 Testing Paymaster Functionality:
1. Testing USDC balance check...
❌ Paymaster test failed: Error: Failed to check USDC balance
```

## 🎉 Success Criteria

Your paymaster integration is working correctly when:

1. ✅ **USDC Balance** shows a number > 0
2. ✅ **Paymaster Data** generates without errors
3. ✅ **Paymaster Address** matches Circle's official address
4. ✅ **Network** shows Sepolia
5. ✅ **Transactions** can be initiated (even if paymaster isn't fully integrated yet)

## 🔄 Next Steps

After successful testing:

1. **Get USDC tokens** from Circle's faucet
2. **Test small transactions** with paymaster toggle enabled
3. **Monitor transaction logs** for paymaster data
4. **Implement full paymaster integration** if needed
5. **Deploy to production** with proper error handling

## 📚 Resources

- [Circle Paymaster Documentation](https://developers.circle.com/stablecoins/paymaster-addresses)
- [Sepolia Testnet](https://sepolia.etherscan.io/)
- [Circle Faucet](https://faucet.circle.com)
- [EIP-2612 Permit Standard](https://eips.ethereum.org/EIPS/eip-2612)

---

**Happy Testing! 🚀** 