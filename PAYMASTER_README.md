# Circle Paymaster Integration

This project now includes Circle's paymaster integration, allowing users to pay gas fees in USDC instead of native tokens (ETH).

## 🚀 Overview

The paymaster integration enables:
- **USDC gas payments** instead of ETH
- **Automatic permit signing** for USDC allowances
- **Seamless transaction experience** for users
- **No need to hold native tokens** for gas fees

## 📁 Implementation Files

```
savio-fe/smart-wallets-starter/
├── components/
│   ├── lib/
│   │   ├── paymaster.ts           # Circle paymaster implementation
│   │   └── smart-wallet-config.ts # Smart wallet configuration
│   └── PaymasterBalance.tsx       # USDC balance display component
├── pages/
│   └── dashboard.tsx              # Updated with paymaster UI
└── PAYMASTER_README.md            # This file
```

## 🔧 Configuration

### Paymaster Settings (`components/lib/paymaster.ts`)

```typescript
export const PAYMASTER_CONFIG = {
  // Circle Paymaster v0.7 address for Arbitrum Sepolia
  paymasterAddress: "0x31BE08D380A21fc740883c0BC434FcFc88740b58",
  
  // USDC address on Arbitrum Sepolia
  usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  
  // Chain configuration - Circle Paymaster is available on Arbitrum Sepolia
  chain: arbitrumSepolia,
  
  // Gas limits for paymaster
  paymasterVerificationGasLimit: 200000n,
  paymasterPostOpGasLimit: 15000n,
};
```

## 🛠️ Key Components

### 1. CirclePaymaster Class

The main paymaster implementation that handles:
- **EIP-2612 permit signing** for USDC allowances
- **Paymaster data generation** for transactions
- **USDC balance checking** for smart wallets

```typescript
const paymaster = new CirclePaymaster();

// Get paymaster data for a transaction
const paymasterData = await paymaster.getPaymasterData(account);

// Check USDC balance
const balance = await paymaster.getUsdcBalanceFormatted(walletAddress);
```

### 2. PaymasterBalance Component

A React component that displays:
- **USDC balance** of the smart wallet
- **Paymaster information** and configuration
- **Real-time balance updates**

## 🔄 How It Works

### 1. EIP-2612 Permit Signing

The paymaster uses EIP-2612 permits to authorize USDC spending:

```typescript
// Sign permit for USDC allowance
const permitSignature = await signPermit({
  tokenAddress: usdcAddress,
  account,
  client,
  spenderAddress: paymasterAddress,
  permitAmount: 10000000n, // 10 USDC
});
```

### 2. Paymaster Data Generation

Creates the necessary data for the paymaster to pay gas fees:

```typescript
const paymasterData = encodePacked(
  ["uint8", "address", "uint256", "bytes"],
  [0, usdcAddress, permitAmount, permitSignature],
);
```

### 3. Transaction Flow

1. **User initiates transaction** (e.g., Mint NFT)
2. **Permit is signed** for USDC allowance
3. **Paymaster data is generated** with permit signature
4. **Transaction is submitted** with paymaster covering gas fees
5. **USDC is deducted** from user's wallet for gas payment

## 🎯 Benefits

### For Users:
- **No ETH required** for gas fees
- **Pay in USDC** - more stable and accessible
- **Seamless experience** - automatic permit signing
- **Cost predictability** - gas fees in stable currency

### For Developers:
- **Reduced friction** - users don't need native tokens
- **Better UX** - simplified onboarding
- **Cost optimization** - potentially lower gas costs
- **Flexible payment** - support multiple stablecoins

## 🔧 Usage

### 1. Check USDC Balance

The dashboard now shows your smart wallet's USDC balance:

```typescript
// Component automatically checks balance
<PaymasterBalance />
```

### 2. Make Transactions with Paymaster

All transactions automatically use the paymaster when USDC is available:

```typescript
// Regular transaction - paymaster handles gas
smartWalletClient.sendTransaction({
  to: contractAddress,
  data: transactionData,
});
```

### 3. Monitor Paymaster Status

The dashboard displays:
- Current USDC balance
- Paymaster configuration
- Network information
- Transaction status

## 🚀 Setup Requirements

### 1. USDC on Arbitrum Sepolia

Users need USDC on Arbitrum Sepolia testnet:
- **Faucet**: https://faucet.circle.com
- **Contract**: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`

**Note**: Circle Paymaster is available on Arbitrum Sepolia.

### 2. Environment Variables

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
```

### 3. Network Configuration

The paymaster is configured for **Arbitrum Sepolia**:
- Chain ID: 421614
- Network: Arbitrum Sepolia
- Paymaster: Circle Paymaster v0.7 (available)

**For other networks, consider:**
- Deploying your own paymaster
- Using other paymaster services (Pimlico, Stackup, etc.)
- Checking Circle's documentation for supported networks

## 🔍 Testing the Paymaster

### 1. Get USDC Test Tokens

Visit [Circle's faucet](https://faucet.circle.com) to get USDC on Arbitrum Sepolia.

### 2. Check Balance

The dashboard will automatically show your USDC balance.

### 3. Make Transactions

Try the demo transactions (Mint NFT, etc.) - they'll use USDC for gas fees.

### 4. Monitor Transactions

Check the transaction details to see USDC deductions for gas fees.

## 🐛 Troubleshooting

### Common Issues:

1. **"Insufficient USDC Balance"**
   - Get USDC from Circle's faucet
   - Ensure wallet has enough USDC for gas

2. **"Permit Signature Failed"**
   - Check USDC contract compatibility
   - Verify network configuration

3. **"Paymaster Not Available"**
   - Confirm you're on Sepolia network
   - Check paymaster contract deployment

### Debug Steps:

1. **Check console logs** for paymaster errors
2. **Verify USDC balance** in the dashboard
3. **Test with small transactions** first
4. **Check network configuration** matches Sepolia

## 📚 Resources

- [Circle Paymaster Documentation](https://developers.circle.com/stablecoins/quickstart-circle-paymaster)
- [EIP-2612 Permit Standard](https://eips.ethereum.org/EIPS/eip-2612)
- [ERC-4337 Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)
- [Sepolia Testnet](https://sepolia.etherscan.io/)

## 🎉 Next Steps

1. **Test the paymaster** with USDC transactions
2. **Customize gas limits** for your use case
3. **Add more stablecoins** (USDT, DAI, etc.)
4. **Implement gas estimation** for better UX
5. **Add transaction history** with paymaster details

The paymaster integration is now ready to use! Users can pay gas fees in USDC instead of ETH, making transactions more accessible and cost-predictable. 🚀 