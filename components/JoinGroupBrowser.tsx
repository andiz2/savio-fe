import { useState } from 'react';

interface Group {
  id: string;
  name: string;
  description: string;
  contributionAmount: number;
  timeframe: '72h' | 'weekly' | 'monthly';
  currentMembers: number;
  maxMembers: number;
  biddingEnabled: boolean;
  creator: string;
  totalPool: number;
  status: 'open' | 'full' | 'in-progress';
  nextRound: string;
}

interface JoinGroupBrowserProps {
  onJoinGroup: (groupId: string) => void;
  isLoading?: boolean;
}

// Mock data for demonstration
const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Weekly Savers Club',
    description: 'A group for consistent weekly savings with competitive bidding.',
    contributionAmount: 100,
    timeframe: 'weekly',
    currentMembers: 4,
    maxMembers: 5,
    biddingEnabled: true,
    creator: '0x1234...5678',
    totalPool: 400,
    status: 'open',
    nextRound: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Monthly Builders',
    description: 'Monthly contributions for long-term wealth building.',
    contributionAmount: 250,
    timeframe: 'monthly',
    currentMembers: 5,
    maxMembers: 6,
    biddingEnabled: false,
    creator: '0x8765...4321',
    totalPool: 1250,
    status: 'open',
    nextRound: '2024-02-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Quick 72h Group',
    description: 'Fast-paced savings with 72-hour cycles.',
    contributionAmount: 50,
    timeframe: '72h',
    currentMembers: 5,
    maxMembers: 5,
    biddingEnabled: true,
    creator: '0xabcd...efgh',
    totalPool: 250,
    status: 'full',
    nextRound: '2024-01-12T10:00:00Z'
  },
  {
    id: '4',
    name: 'Family Savings Circle',
    description: 'A trusted group for family members to save together.',
    contributionAmount: 75,
    timeframe: 'weekly',
    currentMembers: 3,
    maxMembers: 4,
    biddingEnabled: true,
    creator: '0xfam1...ly23',
    totalPool: 225,
    status: 'open',
    nextRound: '2024-01-20T10:00:00Z'
  },
  {
    id: '5',
    name: 'High Rollers Club',
    description: 'Premium savings group with higher contribution amounts.',
    contributionAmount: 500,
    timeframe: 'monthly',
    currentMembers: 2,
    maxMembers: 3,
    biddingEnabled: false,
    creator: '0xhigh...roll',
    totalPool: 1000,
    status: 'open',
    nextRound: '2024-02-15T10:00:00Z'
  },
  {
    id: '6',
    name: 'Student Savings Network',
    description: 'Affordable weekly savings for students and young professionals.',
    contributionAmount: 25,
    timeframe: 'weekly',
    currentMembers: 6,
    maxMembers: 8,
    biddingEnabled: true,
    creator: '0xstud...ent1',
    totalPool: 150,
    status: 'open',
    nextRound: '2024-01-18T10:00:00Z'
  },
  {
    id: '7',
    name: 'Crypto Enthusiasts',
    description: 'Monthly group for crypto community members.',
    contributionAmount: 150,
    timeframe: 'monthly',
    currentMembers: 4,
    maxMembers: 5,
    biddingEnabled: true,
    creator: '0xcryp...to1',
    totalPool: 600,
    status: 'open',
    nextRound: '2024-02-10T10:00:00Z'
  },
  {
    id: '8',
    name: 'Rapid Fire 72h',
    description: 'Quick 72-hour cycles for active traders.',
    contributionAmount: 75,
    timeframe: '72h',
    currentMembers: 4,
    maxMembers: 4,
    biddingEnabled: true,
    creator: '0xrapi...d1',
    totalPool: 300,
    status: 'full',
    nextRound: '2024-01-14T10:00:00Z'
  },
  {
    id: '9',
    name: 'Small Business Owners',
    description: 'Weekly group for small business owners to save together.',
    contributionAmount: 200,
    timeframe: 'weekly',
    currentMembers: 3,
    maxMembers: 4,
    biddingEnabled: false,
    creator: '0xbus1...ness',
    totalPool: 600,
    status: 'open',
    nextRound: '2024-01-22T10:00:00Z'
  },
  {
    id: '10',
    name: 'Retirement Savers',
    description: 'Monthly group focused on long-term retirement planning.',
    contributionAmount: 300,
    timeframe: 'monthly',
    currentMembers: 5,
    maxMembers: 6,
    biddingEnabled: false,
    creator: '0xret1...rement',
    totalPool: 1500,
    status: 'open',
    nextRound: '2024-02-05T10:00:00Z'
  }
];

export default function JoinGroupBrowser({ onJoinGroup, isLoading = false }: JoinGroupBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'full'>('all');
  const [filterTimeframe, setFilterTimeframe] = useState<'all' | '72h' | 'weekly' | 'monthly'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minTVL: 0,
    maxTVL: 10000,
    minContribution: 0,
    maxContribution: 1000,
    minBid: 0,
    maxBid: 500,
    minMembers: 0,
    maxMembers: 10,
    cycleType: 'all'
  });

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || group.status === filterStatus;
    const matchesTimeframe = filterTimeframe === 'all' || group.timeframe === filterTimeframe;
    
    // Advanced filters
    const matchesTVL = group.totalPool >= advancedFilters.minTVL && group.totalPool <= advancedFilters.maxTVL;
    const matchesContribution = group.contributionAmount >= advancedFilters.minContribution && group.contributionAmount <= advancedFilters.maxContribution;
    const matchesMembers = group.currentMembers >= advancedFilters.minMembers && group.currentMembers <= advancedFilters.maxMembers;
    
    return matchesSearch && matchesStatus && matchesTimeframe && matchesTVL && matchesContribution && matchesMembers;
  });

  // Sort groups: groups needing 1 more user first, then by member count (ascending)
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    const aNeedsOne = a.currentMembers === a.maxMembers - 1;
    const bNeedsOne = b.currentMembers === b.maxMembers - 1;
    
    if (aNeedsOne && !bNeedsOne) return -1;
    if (!aNeedsOne && bNeedsOne) return 1;
    
    return a.currentMembers - b.currentMembers;
  });

  const formatTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case '72h': return 'Every 72h';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return timeframe;
    }
  };

  const formatNextRound = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
            <span className="text-emerald-400 font-medium text-sm">Open</span>
          </div>
        );
      case 'full':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-gray-400 font-medium text-sm">Full</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-blue-400 font-medium text-sm">In Progress</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case '72h':
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'weekly':
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'monthly':
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Discover Savings Groups</h2>
        <p className="text-gray-400">Join existing groups and start earning with DeFi yields</p>
      </div>

                {/* Search and Filters */}
          <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Advanced Filters</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Search groups by name or description..."
                />
              </div>

              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open Groups</option>
                    <option value="full">Full Groups</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterTimeframe}
                    onChange={(e) => setFilterTimeframe(e.target.value as any)}
                    className="w-full px-4 py-3 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Timeframes</option>
                    <option value="72h">Every 72h</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600">
                  <h4 className="text-white font-medium mb-4">Advanced Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">TVL Range (USDC)</label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={advancedFilters.minTVL}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, minTVL: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-lg text-white text-sm"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          value={advancedFilters.maxTVL}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, maxTVL: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-lg text-white text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Contribution (USDC)</label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={advancedFilters.minContribution}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, minContribution: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-lg text-white text-sm"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          value={advancedFilters.maxContribution}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, maxContribution: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-lg text-white text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Members</label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={advancedFilters.minMembers}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, minMembers: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-lg text-white text-sm"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          value={advancedFilters.maxMembers}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, maxMembers: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-lg text-white text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Cycle Type</label>
                      <select
                        value={advancedFilters.cycleType}
                        onChange={(e) => setAdvancedFilters(prev => ({ ...prev, cycleType: e.target.value }))}
                        className="w-full px-3 py-2 bg-crypto-dark-700/50 border border-crypto-dark-600 rounded-lg text-white text-sm"
                      >
                        <option value="all">All Cycles</option>
                        <option value="72h">72h</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedGroups.length === 0 ? (
          <div className="col-span-full bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-12 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Groups Found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or create a new group</p>
          </div>
        ) : (
          sortedGroups.map((group) => (
            <div key={group.id} className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getTimeframeIcon(group.timeframe)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                    <p className="text-sm text-gray-400">{formatTimeframe(group.timeframe)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(group.status)}
                  {group.currentMembers === group.maxMembers - 1 && (
                    <div className="flex items-center bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                      <span className="text-orange-400 font-medium text-xs">1 Spot Left!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-6 line-clamp-2">{group.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-3">
                  <p className="text-xs text-blue-400 font-medium">Contribution</p>
                  <p className="text-lg font-bold text-blue-300">{group.contributionAmount} USDC</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-3">
                  <p className="text-xs text-emerald-400 font-medium">Total Pool</p>
                  <p className="text-lg font-bold text-emerald-300">{(group.contributionAmount * group.maxMembers).toFixed(0)} USDC</p>
                </div>
              </div>

              {/* Members Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Members</span>
                  <span className="text-sm text-white font-medium">{group.currentMembers}/{group.maxMembers}</span>
                </div>
                <div className="w-full bg-crypto-dark-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(group.currentMembers / group.maxMembers) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-crypto-dark-700/30 rounded-xl p-4 mb-6 border border-crypto-dark-600">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Next Round:</span>
                    <span className="text-white font-medium">{formatNextRound(group.nextRound)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Bidding:</span>
                    <span className={`font-medium ${group.biddingEnabled ? 'text-purple-400' : 'text-blue-400'}`}>
                      {group.biddingEnabled ? 'Enabled' : 'Random'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Creator:</span>
                    <span className="text-white font-mono text-xs">{group.creator}</span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => onJoinGroup(group.id)}
                disabled={isLoading || group.status === 'full'}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${
                  isLoading || group.status === 'full'
                    ? 'bg-crypto-dark-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                {group.status === 'full' ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Group Full
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Join Group
                  </div>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{sortedGroups.length}</p>
            <p className="text-sm text-gray-400">Available Groups</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-300">
              {sortedGroups.filter(g => g.status === 'open').length}
            </p>
            <p className="text-sm text-gray-400">Open for Joining</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-300">
              {sortedGroups.reduce((sum, g) => sum + g.currentMembers, 0)}
            </p>
            <p className="text-sm text-gray-400">Total Members</p>
          </div>
        </div>
      </div>
    </div>
  );
} 