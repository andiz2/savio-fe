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

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Savings Group</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name */}
        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
            Group Name *
          </label>
          <input
            type="text"
            id="groupName"
            value={formData.groupName}
            onChange={(e) => handleInputChange('groupName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter group name"
            required
          />
        </div>

        {/* Contribution Amount */}
        <div>
          <label htmlFor="contributionAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Contribution Amount (USDC) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="contributionAmount"
              value={formData.contributionAmount}
              onChange={(e) => handleInputChange('contributionAmount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="100"
              min="1"
              step="0.01"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USDC</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Fixed amount all members will contribute each cycle
          </p>
        </div>

        {/* Timeframe */}
        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-2">
            Contribution Cycle *
          </label>
          <select
            id="timeframe"
            value={formData.timeframe}
            onChange={(e) => handleInputChange('timeframe', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="72h">Every 72 hours</option>
            <option value="weekly">Every week</option>
            <option value="monthly">Every month</option>
          </select>
        </div>

        {/* Max Members */}
        <div>
          <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Members *
          </label>
          <input
            type="number"
            id="maxMembers"
            value={formData.maxMembers}
            onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="5"
            min="2"
            max="20"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Each member will receive the lump sum once during the cycle
          </p>
        </div>

        {/* Bidding Toggle */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="biddingEnabled" className="block text-sm font-medium text-gray-700">
                Enable Bidding
              </label>
              <p className="text-sm text-gray-500">
                Allow members to bid for the lump sum. If disabled, Chainlink VRF will randomly select winners.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('biddingEnabled', !formData.biddingEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                formData.biddingEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.biddingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Group Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe your group's purpose or any special rules..."
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Group Summary</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• {formData.maxMembers} members contributing {formData.contributionAmount} USDC each</p>
            <p>• Cycle: {formData.timeframe === '72h' ? 'Every 72 hours' : formData.timeframe === 'weekly' ? 'Every week' : 'Every month'}</p>
            <p>• Total pool per cycle: {(formData.contributionAmount * formData.maxMembers).toFixed(2)} USDC</p>
            <p>• Bidding: {formData.biddingEnabled ? 'Enabled' : 'Disabled (Random selection)'}</p>
            <p>• Yield: 7% APY on Euler lending pool</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !formData.groupName}
            className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
              isLoading || !formData.groupName
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? 'Creating Group...' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
} 