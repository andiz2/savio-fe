import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type DataContextType = {
  walletData: any;
  setWalletData: any;
};

const DataContext = createContext<any>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [walletData, setWalletData] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState<any>(false);

  const onInviteModalOpen = useCallback(() => {
    setShowInviteModal(true);
  }, []);


  return (
    <DataContext.Provider value={{ walletData, setWalletData, showInviteModal, onInviteModalOpen }}>
      {children}
    </DataContext.Provider>
  );
};

export const useAuth = (): any => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useAuth must be used within an DataProvider');
  }
  return context;
};
