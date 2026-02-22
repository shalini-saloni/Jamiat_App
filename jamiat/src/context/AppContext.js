import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [totalImpact, setTotalImpact] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@jamiat_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          setUser(u);

          const donationsKey = `@jamiat_donations_${u.email}`;
          const totalKey = `@jamiat_total_${u.email}`;
          const [d, t] = await Promise.all([
            AsyncStorage.getItem(donationsKey),
            AsyncStorage.getItem(totalKey),
          ]);
          if (d) setDonations(JSON.parse(d));
          if (t) setTotalImpact(JSON.parse(t));
        }
      } catch (e) {
        console.log('Storage load error:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('@jamiat_user', JSON.stringify(userData));
      const donationsKey = `@jamiat_donations_${userData.email}`;
      const totalKey = `@jamiat_total_${userData.email}`;
      const [d, t] = await Promise.all([
        AsyncStorage.getItem(donationsKey),
        AsyncStorage.getItem(totalKey),
      ]);
      setUser(userData);
      setDonations(d ? JSON.parse(d) : []);
      setTotalImpact(t ? JSON.parse(t) : 0);
    } catch (e) {
      console.log('Login error:', e);
      setUser(userData);
      setDonations([]);
      setTotalImpact(0);
    }
  };

  const signup = async (userData) => {
    const newUser = {
      ...userData,
      memberSince: new Date().getFullYear(),
      memberId: 'JU#-' + Math.floor(1000 + Math.random() * 9000),
    };
    try {
      await AsyncStorage.setItem('@jamiat_user', JSON.stringify(newUser));
    } catch (e) {
      console.log('Signup error:', e);
    }
    setUser(newUser);
    setDonations([]);
    setTotalImpact(0);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@jamiat_user');
    } catch (e) {
      console.log('Logout error:', e);
    }
    setUser(null);
    setDonations([]);
    setTotalImpact(0);
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      await AsyncStorage.setItem('@jamiat_user', JSON.stringify(updated));
    } catch (e) {
      console.log('UpdateProfile error:', e);
    }
  };

  const addDonation = async (donation) => {
    const newDonation = {
      id: Date.now(),
      ...donation,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      timestamp: Date.now(),
    };
    const updatedDonations = [newDonation, ...donations];
    const updatedTotal = totalImpact + (donation.amount || 0);
    setDonations(updatedDonations);
    setTotalImpact(updatedTotal);

    if (user?.email) {
      try {
        await Promise.all([
          AsyncStorage.setItem(`@jamiat_donations_${user.email}`, JSON.stringify(updatedDonations)),
          AsyncStorage.setItem(`@jamiat_total_${user.email}`, JSON.stringify(updatedTotal)),
        ]);
      } catch (e) {
        console.log('Save donation error:', e);
      }
    }
  };

  if (isLoading) return null;

  return (
    <AppContext.Provider value={{ user, donations, totalImpact, login, signup, logout, updateProfile, addDonation }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
