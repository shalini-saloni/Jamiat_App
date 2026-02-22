import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // null = logged out
  const [donations, setDonations] = useState([]);
  const [totalImpact, setTotalImpact] = useState(0);

  const login = (userData) => {
    setUser(userData);
  };

  const signup = (userData) => {
    setUser({ ...userData, memberSince: new Date().getFullYear(), memberId: 'JU#-' + Math.floor(1000 + Math.random() * 9000) });
  };

  const logout = () => {
    setUser(null);
    setDonations([]);
    setTotalImpact(0);
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addDonation = (donation) => {
    const newDonation = {
      id: Date.now(),
      ...donation,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: Date.now(),
    };
    setDonations(prev => [newDonation, ...prev]);
    setTotalImpact(prev => prev + donation.amount);
  };

  return (
    <AppContext.Provider value={{ user, donations, totalImpact, login, signup, logout, updateProfile, addDonation }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
