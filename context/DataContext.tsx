import { createContext, useContext, useState, ReactNode } from 'react';

type DataContextType = {
  walletData: any;
  setWalletData: any;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [walletData, setWalletData] = useState<any>(null);

  return (
    <DataContext.Provider value={{ walletData, setWalletData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useAuth = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useAuth must be used within an DataProvider');
  }
  return context;
};
