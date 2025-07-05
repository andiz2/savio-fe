import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateGroupForm, { GroupFormData } from "../components/CreateGroupForm";
import JoinGroupBrowser from "../components/JoinGroupBrowser";
import CollateralDeposit from "../components/CollateralDeposit";


export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, logout } = usePrivy();
  const { client: smartWalletClient } = useSmartWallets();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const [showCollateralDeposit, setShowCollateralDeposit] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
    contributionAmount: number;
    maxMembers: number;
  } | null>(null);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'my-groups', name: 'My Groups', icon: '👥' },
    { id: 'portfolio', name: 'Portfolio', icon: '💼' },
  ];

  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [createdGroupLink, setCreatedGroupLink] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    minTVL: 0,
    maxTVL: 10000,
    minContribution: 0,
    maxContribution: 1000,
    minBid: 0,
    maxBid: 500,
    minMembers: 0,
    maxMembers: 20,
    cycleType: 'all'
  });

  const handleCreateGroup = async (formData: GroupFormData) => {
    setIsCreatingGroup(true);
    try {
      // TODO: Implement smart contract interaction
      console.log('Creating group with data:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate unique group link (in real app, this would come from the smart contract)
      const groupId = Math.random().toString(36).substr(2, 9);
      const groupLink = `https://savio.xyz/join/${groupId}`;
      setCreatedGroupLink(groupLink);
      setShowInviteModal(true);
      
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    // Find the group details from mock data (in real app, this would come from API)
    const mockGroup = {
      id: groupId,
      name: 'Weekly Savers Club', // This would come from the actual group data
      contributionAmount: 100,
      maxMembers: 5
    };
    
    setSelectedGroup(mockGroup);
    setShowCollateralDeposit(true);
  };

  const handleDepositComplete = (txHash: string) => {
    setShowCollateralDeposit(false);
    setSelectedGroup(null);
    alert(`Deposit successful! Transaction: ${txHash.slice(0, 10)}...`);
    // TODO: Update user's groups list
  };

  const handleDepositCancel = () => {
    setShowCollateralDeposit(false);
    setSelectedGroup(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Tap into <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Community Finance</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Join the revolution of decentralized rotating savings. Create groups, earn yields, and build wealth together with DeFi-powered protocols.
              </p>
            </div>

            {/* Stats Cards - Keeping the totals you like */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-400 font-medium">Total Groups</p>
                    <p className="text-3xl font-bold text-blue-300">0</p>
                  </div>
                </div>
                <p className="text-sm text-blue-400/70">Active savings groups</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-400 font-medium">Total Deposits</p>
                    <p className="text-3xl font-bold text-emerald-300">$0</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-400/70">Locked in protocols</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-400 font-medium">Total Earnings</p>
                    <p className="text-3xl font-bold text-purple-300">$0</p>
                  </div>
                </div>
                <p className="text-sm text-purple-400/70">From DeFi yields</p>
              </div>
            </div>

            {/* WHY & SAVE Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Why Savio?</h3>
                    <p className="text-gray-400">Learn about our mission</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Discover how Savio revolutionizes traditional rotating savings with DeFi yields, smart contracts, and community-driven wealth building.
                </p>
                <button
                  onClick={() => setShowWhyModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Learn More
                </button>
              </div>

              <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Start Saving</h3>
                    <p className="text-gray-400">Create or join groups</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Ready to start your savings journey? Create a new group or browse existing communities to begin earning with DeFi yields.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('create-group')}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    Create New Group
                  </button>
                  <button
                    onClick={() => setActiveTab('join-group')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                  >
                    Browse Groups
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-gradient-to-br from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Choose Savio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">DeFi Yields</h4>
                  <p className="text-gray-400">Earn 7% APY through Euler lending pool integration</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Secure & Transparent</h4>
                  <p className="text-gray-400">Smart contracts ensure trustless and verifiable operations</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Community Driven</h4>
                  <p className="text-gray-400">Build wealth together with like-minded savers</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'create-group':
        return (
          <CreateGroupForm onSubmit={handleCreateGroup} isLoading={isCreatingGroup} />
        );
      case 'join-group':
        return (
          <JoinGroupBrowser onJoinGroup={handleJoinGroup} isLoading={false} />
        );
      case 'my-groups':
        return (
          <div className="bg-crypto-dark-800/50 backdrop-blur-sm border border-crypto-dark-700 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">My Groups</h2>
            <p className="text-gray-300 mb-6">Manage your active savings groups.</p>
            <div className="text-center py-8">
              <p className="text-gray-400">No groups yet. Create or join a group to get started.</p>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="bg-crypto-dark-800/50 backdrop-blur-sm border border-crypto-dark-700 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Portfolio</h2>
            <p className="text-gray-300 mb-6">Track your savings, earnings, and $SAV tokens.</p>
            <div className="text-center py-8">
              <p className="text-gray-400">Portfolio view coming in next step...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Savio Dashboard</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-crypto-dark-950 via-purple-950 to-purple-900">
        {ready && authenticated && smartWalletClient ? (
          <>
            {/* Header */}
            <header className="bg-gradient-to-r from-crypto-dark-800/90 to-crypto-dark-900/90 backdrop-blur-sm border-b border-crypto-dark-700 shadow-xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Savio</h1>
                      <p className="text-xs text-gray-400">Community Finance Protocol</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-crypto-dark-700 to-crypto-dark-800 px-4 py-2 rounded-xl border border-crypto-dark-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-sm text-gray-300 font-mono">
                          {smartWalletClient.account?.address?.slice(0, 6)}...{smartWalletClient.account?.address?.slice(-4)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-gradient-to-r from-crypto-dark-700 to-crypto-dark-800 hover:from-crypto-dark-600 hover:to-crypto-dark-700 py-2 px-4 rounded-xl text-gray-300 transition-all duration-300 border border-crypto-dark-600 hover:border-crypto-dark-500 transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Navigation Tabs */}
              <div className="mb-8">
                <nav className="bg-gradient-to-r from-crypto-dark-800/80 to-crypto-dark-900/80 backdrop-blur-sm border border-crypto-dark-700 rounded-2xl p-2 shadow-xl">
                  <div className="flex space-x-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-3 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-crypto-dark-700/50'
                        }`}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>

            {/* Collateral Deposit Modal */}
            {showCollateralDeposit && selectedGroup && (
              <CollateralDeposit
                groupId={selectedGroup.id}
                groupName={selectedGroup.name}
                contributionAmount={selectedGroup.contributionAmount}
                maxMembers={selectedGroup.maxMembers}
                onDepositComplete={handleDepositComplete}
                onCancel={handleDepositCancel}
              />
            )}

            {/* WHY Modal */}
            {showWhyModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-crypto-dark-800 to-crypto-dark-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-crypto-dark-700">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-white">Why We Created Savio</h2>
                    </div>
                    <button
                      onClick={() => setShowWhyModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6 text-gray-300">
                    <div className="bg-crypto-dark-700/30 rounded-xl p-6 border border-crypto-dark-600">
                      <h3 className="text-lg font-semibold text-white mb-3">The Problem</h3>
                      <p className="leading-relaxed">
                        Traditional rotating savings groups (ROSCAs) have been around for centuries, but they're plagued by trust issues, 
                        manual management, and lack of transparency. People lose money to dishonest administrators, and there's no way 
                        to earn yields on locked funds.
                      </p>
                    </div>
                    
                    <div className="bg-crypto-dark-700/30 rounded-xl p-6 border border-crypto-dark-600">
                      <h3 className="text-lg font-semibold text-white mb-3">Our Solution</h3>
                      <p className="leading-relaxed">
                        Savio brings rotating savings to the blockchain with smart contracts that ensure trustless, transparent, 
                        and automated operations. Your funds earn 7% APY through Euler lending pools while waiting for your turn 
                        to receive the lump sum.
                      </p>
                    </div>
                    
                    <div className="bg-crypto-dark-700/30 rounded-xl p-6 border border-crypto-dark-600">
                      <h3 className="text-lg font-semibold text-white mb-3">The Vision</h3>
                      <p className="leading-relaxed">
                        We envision a world where communities can build wealth together without intermediaries. 
                        Whether it's families, friends, or strangers with shared goals, Savio provides the infrastructure 
                        for collaborative financial growth powered by DeFi.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setShowWhyModal(false)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-crypto-dark-800 to-crypto-dark-900 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-crypto-dark-700">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Group Created Successfully!</h2>
                    <p className="text-gray-400">Share this link with friends and family to invite them to your group</p>
                  </div>
                  
                  <div className="bg-crypto-dark-700/30 rounded-xl p-4 border border-crypto-dark-600 mb-6">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={createdGroupLink}
                        readOnly
                        className="flex-1 bg-transparent text-white font-mono text-sm mr-3"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(createdGroupLink)}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300"
                    >
                      Continue to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setShowInviteModal(false);
                        setActiveTab('my-groups');
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300"
                    >
                      View My Groups
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading...</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
