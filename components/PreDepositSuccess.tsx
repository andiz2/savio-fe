import { useState } from 'react';

interface PreDepositSuccessProps {
  txHash: string;
  groupName: string;
  contributionAmount: number;
  biddingAmount: number;
  maxMembers: number;
  currentMembers: number;
  timeframe: '72h' | 'weekly' | 'monthly';
  biddingEnabled: boolean;
  onViewGroup: () => void;
  onClose: () => void;
}

export default function PreDepositSuccess({ 
  txHash, 
  groupName, 
  contributionAmount, 
  biddingAmount,
  maxMembers, 
  currentMembers,
  timeframe,
  biddingEnabled,
  onViewGroup, 
  onClose 
}: PreDepositSuccessProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPool = contributionAmount * maxMembers;
  const blockExplorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
  
  const formatTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case '72h': return 'Every 72 hours';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return timeframe;
    }
  };

  // Calculate next payout selection time (mock data - in real app this would come from smart contract)
  const getNextPayoutTime = () => {
    const now = new Date();
    let nextTime = new Date(now);
    
    switch (timeframe) {
      case '72h':
        nextTime.setHours(now.getHours() + 72);
        break;
      case 'weekly':
        nextTime.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextTime.setMonth(now.getMonth() + 1);
        break;
    }
    
    return nextTime;
  };

  const nextPayoutTime = getNextPayoutTime();
  const timeUntilPayout = nextPayoutTime.getTime() - new Date().getTime();
  const daysUntilPayout = Math.ceil(timeUntilPayout / (1000 * 60 * 60 * 24));
  const hoursUntilPayout = Math.ceil((timeUntilPayout % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const handleViewGroup = () => {
    setIsLoading(true);
    setTimeout(() => {
      onViewGroup();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-crypto-dark-800 to-crypto-dark-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-crypto-dark-700 my-4">
        <div className="p-6 md:p-8">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Pre-deposit Successful!</h2>
            <p className="text-gray-400 text-sm md:text-base">You're now ready to participate in the ROSCA group</p>
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
                <span className="text-gray-400">Pre-deposit Amount:</span>
                <span className="text-white font-medium">
                  {biddingEnabled 
                    ? (contributionAmount + biddingAmount).toFixed(2) 
                    : contributionAmount.toFixed(2)
                  } USDC
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

          {/* Active ROSCA Group */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Active ROSCA Group</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600">
                <h4 className="text-white font-medium mb-3">{groupName}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Members:</span>
                      <span className="text-white">{currentMembers}/{maxMembers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contribution:</span>
                      <span className="text-white">{contributionAmount} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cycle:</span>
                      <span className="text-white">{formatTimeframe(timeframe)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className={`font-medium ${biddingEnabled ? 'text-purple-400' : 'text-blue-400'}`}>
                        {biddingEnabled ? 'Bidding' : 'Random Selection'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Pool:</span>
                      <span className="text-white font-medium">{totalPool.toFixed(2)} USDC</span>
                    </div>
                    {biddingEnabled && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Your Bid:</span>
                        <span className="text-purple-400 font-medium">{biddingAmount.toFixed(2)} USDC</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">APY:</span>
                      <span className="text-emerald-400 font-medium">7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1"></div>
                        <span className="text-emerald-400 text-sm">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lump Sum Payout Selection */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Next Lump Sum Selection</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {daysUntilPayout > 0 ? `${daysUntilPayout}d ${hoursUntilPayout}h` : `${hoursUntilPayout}h`}
                  </div>
                  <p className="text-gray-400 text-sm">Until next payout selection</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Selection:</span>
                    <span className="text-white">
                      {nextPayoutTime.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Selection Method:</span>
                    <span className={`font-medium ${biddingEnabled ? 'text-purple-400' : 'text-blue-400'}`}>
                      {biddingEnabled ? 'Highest Bid Wins' : 'Random Selection'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payout Amount:</span>
                    <span className="text-emerald-400 font-medium">{totalPool.toFixed(2)} USDC</span>
                  </div>
                  
                  {biddingEnabled && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Bid Required:</span>
                      <span className="text-orange-400 font-medium">{(contributionAmount * 0.1).toFixed(2)} USDC</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600">
                <h4 className="text-white font-medium mb-3">What Happens Next?</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Continue making contributions each cycle to maintain your position</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Earn 7% APY on your locked funds through Euler lending</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{biddingEnabled ? 'Place bids to increase your chances of winning the lump sum' : 'Wait for random selection to potentially win the lump sum'}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Receive your lump sum payout when selected (minus any bids if applicable)</p>
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
              onClick={handleViewGroup}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                'View Group Dashboard'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 