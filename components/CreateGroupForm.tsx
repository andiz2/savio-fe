import { useState } from 'react';

interface CreateGroupFormProps {
  onSubmit: (formData: GroupFormData) => void;
  isLoading?: boolean;
}

export interface GroupFormData {
  groupName: string;
  contributionAmount: number;
  timeframe: '72h' | 'weekly' | 'monthly';
  maxMembers: number;
  biddingEnabled: boolean;
  description: string;
}

export default function CreateGroupForm({ onSubmit, isLoading = false }: CreateGroupFormProps) {
  const [formData, setFormData] = useState<GroupFormData>({
    groupName: '',
    contributionAmount: 100,
    timeframe: 'weekly',
    maxMembers: 5,
    biddingEnabled: true,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof GroupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalPool = formData.contributionAmount * formData.maxMembers;
  const estimatedYield = totalPool * 0.07; // 7% APY

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Create New Savings Group</h2>
        <p className="text-gray-400">Set up your rotating savings protocol with DeFi yields</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Group Details Card */}
          <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Group Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Group Name</label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => handleInputChange('groupName', e.target.value)}
                  className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter group name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contribution Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.contributionAmount}
                    onChange={(e) => handleInputChange('contributionAmount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="100"
                    min="1"
                    step="0.01"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <span className="text-gray-400 font-medium">USDC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pool Configuration Card */}
          <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Pool Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Members</label>
                <input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="5"
                  min="2"
                  max="20"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contribution Cycle</label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="72h">Every 72 hours</option>
                  <option value="weekly">Every week</option>
                  <option value="monthly">Every month</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bidding Configuration */}
        <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bidding System</h3>
                <p className="text-sm text-gray-400">Choose how members get selected for lump sums</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('biddingEnabled', !formData.biddingEnabled)}
              className={`relative inline-flex h-12 w-20 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-crypto-dark-800 ${
                formData.biddingEnabled ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-crypto-dark-600'
              }`}
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                  formData.biddingEnabled ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600">
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${formData.biddingEnabled ? 'bg-purple-400' : 'bg-gray-500'}`}></div>
              <div>
                <p className="text-white font-medium">
                  {formData.biddingEnabled ? 'Bidding Enabled' : 'Random Selection'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {formData.biddingEnabled 
                    ? 'Members can bid for the lump sum. Highest bidder wins and pays the bid amount to the pool.'
                    : 'Chainlink VRF randomly selects winners. No bidding required.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Group Description</h3>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            placeholder="Describe your group's purpose, rules, or any special requirements..."
          />
        </div>

        {/* Pool Summary */}
        <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Pool Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-blue-400 font-medium">Total Pool</p>
              <p className="text-2xl font-bold text-blue-300">${totalPool.toFixed(2)}</p>
              <p className="text-xs text-blue-400/70">per cycle</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-sm text-emerald-400 font-medium">Annual Yield</p>
              <p className="text-2xl font-bold text-emerald-300">${estimatedYield.toFixed(2)}</p>
              <p className="text-xs text-emerald-400/70">7% APY on Euler</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
              <p className="text-sm text-purple-400 font-medium">Cycle Duration</p>
              <p className="text-2xl font-bold text-purple-300">
                {formData.timeframe === '72h' ? '72h' : formData.timeframe === 'weekly' ? '7d' : '30d'}
              </p>
              <p className="text-xs text-purple-400/70">per contribution</p>
            </div>
          </div>
          
          <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600">
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                <span>{formData.maxMembers} members × {formData.contributionAmount} USDC each</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Cycle: {formData.timeframe === '72h' ? 'Every 72 hours' : formData.timeframe === 'weekly' ? 'Every week' : 'Every month'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>Selection: {formData.biddingEnabled ? 'Bidding system' : 'Random (Chainlink VRF)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !formData.groupName}
            className={`px-8 py-4 rounded-2xl font-semibold text-lg text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${
              isLoading || !formData.groupName
                ? 'bg-crypto-dark-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-2xl hover:shadow-purple-500/25'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Group...
              </div>
                         ) : (
               'Launch Savings Group'
             )}
          </button>
        </div>
      </form>
    </div>
  );
} 