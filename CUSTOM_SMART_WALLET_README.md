# Custom Smart Wallet Deployment with Privy

This project demonstrates how to deploy custom smart wallets using Privy's factory pattern instead of the default Biconomy embedded wallets.

## 🚀 Overview

Instead of using Biconomy's smart wallets, you can deploy your own smart wallet factory and implementation, giving you full control over the wallet logic and gas optimization.

## 📁 Project Structure

```
savio-fe/smart-wallets-starter/
├── components/
│   └── lib/
│       ├── smart-wallet-config.ts    # Smart wallet configuration (factory only)
│       └── abis/
│           └── mint.ts               # Example NFT minting ABI
├── pages/
│   ├── _app.tsx                     # Privy configuration with custom factory
│   ├── dashboard.tsx                # Demo transactions
│   └── index.tsx                    # Login page
└── CUSTOM_SMART_WALLET_README.md    # This file
```

## 🔧 Setup

### 1. Deploy Smart Wallet Factory

You need to deploy a smart wallet factory contract. Here's an example using OpenZeppelin's Account Factory:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./SmartWallet.sol";

contract SmartWalletFactory {
    address public immutable implementation;
    
    constructor(address _implementation) {
        implementation = _implementation;
    }
    
    function createWallet(address owner, uint256 salt) external returns (address) {
        bytes32 saltBytes = bytes32(salt);
        address wallet = Clones.cloneDeterministic(implementation, saltBytes);
        SmartWallet(wallet).initialize(owner);
        return wallet;
    }
    
    function getWalletAddress(address owner, uint256 salt) external view returns (address) {
        bytes32 saltBytes = bytes32(salt);
        return Clones.predictDeterministicAddress(implementation, saltBytes);
    }
}
```

### 2. Deploy Smart Wallet Implementation

Deploy your smart wallet implementation contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartWallet is Initializable, Ownable {
    event WalletInitialized(address indexed owner);
    
    function initialize(address _owner) external initializer {
        _transferOwnership(_owner);
        emit WalletInitialized(_owner);
    }
    
    function execute(address target, uint256 value, bytes calldata data) external onlyOwner {
        (bool success, ) = target.call{value: value}(data);
        require(success, "Transaction failed");
    }
    
    function executeBatch(Call[] calldata calls) external onlyOwner {
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, ) = calls[i].target.call{value: calls[i].value}(calls[i].data);
            require(success, "Batch transaction failed");
        }
    }
    
    receive() external payable {}
}

struct Call {
    address target;
    uint256 value;
    bytes data;
}
```

### 3. Environment Variables

Create a `.env.local` file with your factory address:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
```

## 🔄 Configuration

### Current Configuration (Biconomy)

```typescript
embeddedWallets: {
  createOnLogin: "all-users",
},
```

### Custom Factory Configuration

```typescript
embeddedWallets: {
  createOnLogin: "all-users",
  factoryAddress: "0xYourFactoryAddress",
},
```

## 🛠️ Implementation Details

### Smart Wallet Configuration (`components/lib/smart-wallet-config.ts`)

This file contains:
- Factory contract ABI
- Configuration helper function
- Gas settings

### Privy Integration (`pages/_app.tsx`)

The app uses the custom configuration:

```typescript
import { createSmartWalletConfig } from "../components/lib/smart-wallet-config";

<PrivyProvider
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
  config={{
    defaultChain: baseSepolia,
    supportedChains: [baseSepolia],
    ...createSmartWalletConfig(),
  }}
>
```

## 🚀 Deployment Steps

1. **Deploy Smart Wallet Implementation**
   ```bash
   # Deploy your smart wallet implementation
   npx hardhat deploy --contract SmartWallet
   ```

2. **Deploy Factory Contract**
   ```bash
   # Deploy factory with implementation address
   npx hardhat deploy --contract SmartWalletFactory --args [implementationAddress]
   ```

3. **Update Environment Variables**
   ```env
   NEXT_PUBLIC_FACTORY_ADDRESS=0xDeployedFactoryAddress
   ```

4. **Test the Integration**
   ```bash
   npm run dev
   ```

## 🔍 Key Differences from Biconomy

| Feature | Biconomy | Custom Factory |
|---------|----------|----------------|
| Gas Optimization | Automatic | Manual control |
| Wallet Logic | Fixed | Customizable |
| Deployment Cost | Shared | Your own |
| Control | Limited | Full |
| Customization | Minimal | Complete |

## 🎯 Benefits of Custom Factory

1. **Full Control**: Customize wallet logic and gas optimization
2. **Cost Optimization**: Implement your own gas strategies
3. **Custom Features**: Add specific functionality to your wallets
4. **Security**: Audit and control your own implementation
5. **Flexibility**: Adapt to your specific use case

## 🔧 Customization Options

### Gas Optimization
```typescript
export const SMART_WALLET_CONFIG = {
  gasConfig: {
    maxFeePerGas: "5000000000", // 5 gwei
    maxPriorityFeePerGas: "2000000000", // 2 gwei
  },
};
```

### Custom Wallet Logic
Add custom functions to your smart wallet implementation:
```solidity
function customFunction() external onlyOwner {
    // Your custom logic
}
```

### Multi-chain Support
```typescript
supportedChains: [baseSepolia, mainnet, polygon],
```

## 🐛 Troubleshooting

### Common Issues

1. **Contract Not Found**
   - Verify contract addresses in environment variables
   - Ensure contracts are deployed on the correct network

2. **Transaction Failures**
   - Check gas configuration
   - Verify smart wallet has sufficient funds

3. **Factory Deployment Issues**
   - Ensure implementation contract is deployed first
   - Verify constructor parameters

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Confirm contract addresses are correct
4. Test with small transactions first

## 📚 Resources

- [Privy Smart Wallet Documentation](https://docs.privy.io/guide/react/wallets/smart-wallets/)
- [ERC-4337 Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Viem Documentation](https://viem.sh/)

## 🎉 Next Steps

1. Deploy your smart wallet contracts
2. Update environment variables
3. Test the integration
4. Customize wallet logic as needed
5. Optimize gas strategies for your use case 