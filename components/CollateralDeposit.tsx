import { useState } from 'react';

interface CollateralDepositProps {
  groupId: string;
  groupName: string;
  contributionAmount: number;
  maxMembers: number;
  currentMembers: number;
  timeframe: '72h' | 'weekly' | 'monthly';
  biddingEnabled: boolean;
  onDepositComplete: (txHash: string) => void;
  onCancel: () => void;
}

export default function CollateralDeposit({ 
  groupId, 
  groupName, 
  contributionAmount, 
  maxMembers, 
  currentMembers,
  timeframe,
  biddingEnabled,
  onDepositComplete, 
  onCancel 
}: CollateralDepositProps) {
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositAmount, setDepositAmount] = useState(contributionAmount * maxMembers);
  const [userBalance] = useState(1000); // Mock USDC balance

  const totalLumpSum = contributionAmount * maxMembers;
  const eulerYield = 0.07; // 7% APY
  const estimatedEarnings = totalLumpSum * eulerYield;
  
  const formatTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case '72h': return 'Every 72 hours';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return timeframe;
    }
  };

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      // TODO: Implement actual smart contract interaction
      // 1. Approve USDC spending for Savio contract
      // 2. Call deposit function which redirects to Euler
      // 3. Handle Circle CCTP V2 if cross-chain
      
      console.log('Depositing collateral:', {
        groupId,
        amount: depositAmount,
        redirectToEuler: true
      });

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      onDepositComplete(mockTxHash);
      
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please try again.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDepositAmount(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 my-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Deposit Collateral</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isDepositing}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        {/* Group Info */}
        <div className="bg-crypto-dark-700/30 rounded-xl p-4 mb-6 border border-crypto-dark-600">
          <h3 className="font-medium text-white mb-2">{groupName}</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• {currentMembers}/{maxMembers} members ({maxMembers - currentMembers} spots left)</p>
            <p>• {contributionAmount} USDC per member</p>
            <p>• {formatTimeframe(timeframe)} cycles</p>
            <p>• {biddingEnabled ? 'Bidding enabled' : 'Random selection'}</p>
            <p>• Total lump sum: {totalLumpSum.toFixed(2)} USDC</p>
            <p>• Collateral required: {totalLumpSum.toFixed(2)} USDC</p>
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="mb-6">
          <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-300 mb-2">
            Deposit Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              id="depositAmount"
              value={depositAmount}
              onChange={handleAmountChange}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00"
              min={totalLumpSum}
              step="0.01"
              disabled={isDepositing}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 font-medium">USDC</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Available: {userBalance.toFixed(2)} USDC
          </p>
        </div>

        {/* Collateral Slashing Warning */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Important Warning</h3>
              <div className="mt-2 text-sm text-red-300">
                <p><strong>Collateral Slashing Risk:</strong> If you stop contributing to the group or fail to meet your obligations, your deposited collateral may be slashed.</p>
                <p className="mt-1">Ensure you can commit to the full contribution schedule before proceeding.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Euler Integration Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-400">Euler Lending Integration</h3>
              <div className="mt-2 text-sm text-blue-300">
                <p>Your USDC will be automatically deposited into Euler lending pool earning 7% APY.</p>
                <p className="mt-1 font-medium">Estimated annual earnings: ${estimatedEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-crypto-dark-700/30 rounded-xl p-4 mb-6 border border-crypto-dark-600">
          <h3 className="text-sm font-medium text-white mb-2">Transaction Details</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Deposit Amount:</span>
              <span>{depositAmount.toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Protocol Fee:</span>
              <span>0.5%</span>
            </div>
            <hr className="my-2 border-crypto-dark-600" />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>{(depositAmount * 1.005).toFixed(2)} USDC</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={isDepositing}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={isDepositing || depositAmount < totalLumpSum || depositAmount > userBalance}
            className={`flex-1 px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 ${
              isDepositing || depositAmount < totalLumpSum || depositAmount > userBalance
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {isDepositing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Depositing...
              </div>
            ) : (
              'Deposit & Join Group'
            )}
          </button>
        </div>

        {/* Warning */}
        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>By depositing, you agree to the group's terms and acknowledge that your USDC will be locked until the group cycle completes.</p>
        </div>
        </div>
      </div>
    </div>
  );
} 