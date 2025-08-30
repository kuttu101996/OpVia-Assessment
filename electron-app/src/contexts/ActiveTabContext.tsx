import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ActiveTabContextType } from '../types';

const ActiveTabContext = createContext<ActiveTabContextType | undefined>(undefined);

interface ActiveTabProviderProps {
  children: ReactNode;
}

export const ActiveTabProvider: React.FC<ActiveTabProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const location = useLocation();

  useEffect(() => {
    // Auto-set active tab based on current route
    const path = location.pathname;
    
    if (path.includes('/dashboard/students')) 
      setActiveTab('students');
     else if (path.includes('/dashboard/add-student')) 
      setActiveTab('add-student');
     else if (path.includes('/dashboard/analytics')) 
      setActiveTab('analytics');
    
  }, [location.pathname]);

  const value: ActiveTabContextType = {
    activeTab,
    setActiveTab
  };

  return (
    <ActiveTabContext.Provider value={value}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = (): ActiveTabContextType => {
  const context = useContext(ActiveTabContext);
  if (context === undefined) {
    throw new Error('useActiveTab must be used within an ActiveTabProvider');
  }
  return context;
};
