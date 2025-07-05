import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateGroupForm, { GroupFormData } from "../components/CreateGroupForm";
import JoinGroupBrowser from "../components/JoinGroupBrowser";
import CollateralDeposit from "../components/CollateralDeposit";
import { encodeFunctionData, erc721Abi } from "viem";
import { mintAbi } from "../components/lib/abis/mint";
import PaymasterBalance from "../components/PaymasterBalance";
import { CirclePaymaster } from "../components/lib/paymaster";

const NFT_CONTRACT_ADDRESS =
  "0x828D1563dfFA00003877114a6940C669C57ec77d" as const;

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { client: smartWalletClient } = useSmartWallets();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
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
    { id: 'create-group', name: 'Create Group', icon: '➕' },
    { id: 'join-group', name: 'Join Group', icon: '🤝' },
    { id: 'my-groups', name: 'My Groups', icon: '👥' },
    { id: 'portfolio', name: 'Portfolio', icon: '💼' },
  ];

  const handleCreateGroup = async (formData: GroupFormData) => {
    setIsCreatingGroup(true);
    try {
      // TODO: Implement smart contract interaction
      console.log('Creating group with data:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Group created successfully! (Demo mode)');
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Savio</h2>
              <p className="text-gray-600 mb-4">
                Start your journey with rotating savings. Create a new group or join an existing one to begin earning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Total Groups</h3>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Total Deposits</h3>
                  <p className="text-2xl font-bold text-green-600">$0</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Total Earnings</h3>
                  <p className="text-2xl font-bold text-purple-600">$0</p>
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
          <JoinGroupBrowser onJoinGroup={handleJoinGroup} isLoading={isJoiningGroup} />
        );
      case 'my-groups':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Groups</h2>
            <p className="text-gray-600 mb-6">Manage your active savings groups.</p>
            <div className="text-center py-8">
              <p className="text-gray-500">No groups yet. Create or join a group to get started.</p>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h2>
            <p className="text-gray-600 mb-6">Track your savings, earnings, and $SAV tokens.</p>
            <div className="text-center py-8">
              <p className="text-gray-500">Portfolio view coming in next step...</p>
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

      <main className="min-h-screen bg-gray-50">
        {ready && authenticated && smartWalletClient ? (
          <>
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Savio</h1>
                    <span className="ml-2 text-sm text-gray-500">Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {smartWalletClient.account?.address?.slice(0, 6)}...{smartWalletClient.account?.address?.slice(-4)}
                    </span>
                    <button
                      onClick={logout}
                      className="text-sm bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md text-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Navigation Tabs */}
              <div className="mb-8">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
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
          </>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
