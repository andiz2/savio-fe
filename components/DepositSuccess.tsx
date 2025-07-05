import { useState } from 'react';

interface DepositSuccessProps {
  txHash: string;
  groupName: string;
  contributionAmount: number;
  maxMembers: number;
  biddingEnabled: boolean;
  onPreDeposit: () => void;
  onViewGroup: () => void;
  onClose: () => void;
}

export default function DepositSuccess({ 
  txHash, 
  groupName, 
  contributionAmount, 
  maxMembers, 
  biddingEnabled,
  onPreDeposit, 
  onViewGroup, 
  onClose 
}: DepositSuccessProps) {
  const [isPreDepositing, setIsPreDepositing] = useState(false);
  const [biddingInput, setBiddingInput] = useState((contributionAmount * 0.1).toString());
  
  const biddingAmount = parseFloat(biddingInput) || 0;
  
  const totalPool = contributionAmount * maxMembers;
  const blockExplorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`;

  const handlePreDeposit = async () => {
    setIsPreDepositing(true);
    try {
      // TODO: Implement gasless pre-deposit using Circle smart wallet
      console.log('Pre-depositing:', contributionAmount);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert('Pre-deposit successful! You can now contribute to the pool.');
      onPreDeposit();
      
    } catch (error) {
      console.error('Pre-deposit failed:', error);
      alert('Pre-deposit failed. Please try again.');
    } finally {
      setIsPreDepositing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-crypto-dark-800 to-crypto-dark-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-crypto-dark-700">
        <div className="p-6 md:p-8">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Deposit Successful!</h2>
          <p className="text-gray-400 text-sm md:text-base">Your collateral has been deposited and verified on-chain</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Transaction Verified</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Transaction Hash:</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono text-sm">
                  {txHash.slice(0, 8)}...{txHash.slice(-6)}
                </span>
                <a
                  href={blockExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Group:</span>
              <span className="text-white font-medium">{groupName}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Collateral Amount:</span>
              <span className="text-white font-medium">{totalPool.toFixed(2)} USDC</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Group Type:</span>
              <span className={`font-medium ${biddingEnabled ? 'text-purple-400' : 'text-blue-400'}`}>
                {biddingEnabled ? 'Bidding' : 'Random Selection'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status:</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <span className="text-emerald-400 font-medium">Confirmed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Next Steps</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white font-medium mb-1 text-sm md:text-base">Pre-deposit for Gasless Experience</h4>
                <p className="text-gray-400 text-xs md:text-sm">
                  Add funds to your smart wallet for seamless, gasless transactions using Circle's account abstraction.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white font-medium mb-1 text-sm md:text-base">Start Contributing</h4>
                <p className="text-gray-400 text-xs md:text-sm">
                  Begin making contributions to your group and earn 7% APY through Euler lending pools.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="text-white font-medium mb-1 text-sm md:text-base">Monitor & Earn</h4>
                <p className="text-gray-400 text-xs md:text-sm">
                  Track your contributions, earnings, and wait for your turn to receive the lump sum.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Important Warning</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                If you stop contributing to the group, your collateral may be slashed. 
                Ensure you can commit to the full contribution schedule before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Pre-deposit Section */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pre-deposit for Gasless Experience</h3>
              <p className="text-sm text-gray-400">Add funds to enable seamless transactions</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contribution Amount (USDC)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={contributionAmount}
                  readOnly
                  className="flex-1 px-4 py-3 bg-crypto-dark-600/50 border border-crypto-dark-500 rounded-l-xl text-gray-300 cursor-not-allowed"
                  placeholder={contributionAmount.toString()}
                />
                <div className="px-4 py-3 bg-crypto-dark-600/50 border border-l-0 border-crypto-dark-500 rounded-r-xl">
                  <span className="text-gray-400 font-medium">USDC</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Fixed contribution amount per cycle</p>
            </div>
            
            {biddingEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bidding Amount (USDC)</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={biddingInput}
                    onChange={(e) => setBiddingInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={(contributionAmount * 0.1).toFixed(2)}
                    min="0"
                    step="0.01"
                  />
                  <div className="px-4 py-3 bg-crypto-dark-700/50 border border-l-0 border-crypto-dark-600 rounded-r-xl">
                    <span className="text-gray-400 font-medium">USDC</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Default bid: 10% of contribution amount</p>
              </div>
            )}
            
            <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600">
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Contribution Amount:</span>
                  <span className="text-white font-medium">{contributionAmount.toFixed(2)} USDC</span>
                </div>
                {biddingEnabled && (
                  <div className="flex items-center justify-between">
                    <span>Bidding Amount:</span>
                    <span className="text-purple-400 font-medium">{biddingAmount.toFixed(2)} USDC</span>
                  </div>
                )}
                {biddingEnabled && (
                  <div className="flex items-center justify-between">
                    <span>Protocol Fee (20%):</span>
                    <span className="text-red-400 font-medium">{(biddingAmount * 0.2).toFixed(2)} USDC</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Network Fee:</span>
                  <span className="text-white font-medium">Free (Gasless)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Protocol Fee:</span>
                  <span className="text-white font-medium">{biddingEnabled ? '20%' : '0%'}</span>
                </div>
                <hr className="my-2 border-crypto-dark-600" />
                <div className="flex items-center justify-between font-medium">
                  <span>Total:</span>
                  <span className="text-emerald-400">
                    {biddingEnabled 
                      ? (contributionAmount + biddingAmount * 0.2).toFixed(2) 
                      : contributionAmount.toFixed(2)
                    } USDC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-crypto-dark-600 rounded-xl text-gray-300 hover:text-white hover:bg-crypto-dark-700 transition-all duration-300"
          >
            Close
          </button>
          
          <button
            onClick={handlePreDeposit}
            disabled={isPreDepositing || contributionAmount <= 0}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
              isPreDepositing || contributionAmount <= 0
                ? 'bg-crypto-dark-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-emerald-500/25'
            }`}
          >
            {isPreDepositing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Pre-depositing...
              </div>
            ) : (
              'Pre-deposit & Continue'
            )}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={onViewGroup}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            View Group Details →
          </button>
        </div>
        </div>
      </div>
    </div>
  );
} 